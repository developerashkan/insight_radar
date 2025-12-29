
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingSource, VerificationResult } from "../types";

// Always use the process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function verifySignal(query: string, category: string = 'General'): Promise<VerificationResult> {
  const systemInstruction = `
    You are LiveSignal, an autonomous verification agent. 
    Your goal is to provide a real-time assessment of a claim or topic.
    
    Structure your response carefully:
    1. VERDICT: Start with one word (True, False, Misleading, Unconfirmed, or Developing).
    2. CONFIDENCE: Provide a numeric score from 0-100 based on source quality.
    3. SUMMARY: A 2-sentence executive summary.
    4. DETAILED ANALYSIS: Cluster narratives (Official, Witness, Expert), identify contradictions, and mention what is still unclear.
    5. TIMESTAMP: State the current effective data time.
    
    Use a clinical, objective tone. Focus on facts found in the provided search results.
  `;

  try {
    // Use gemini-3-flash-preview for general text tasks with grounding
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Current query to verify: "${query}"`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Lower temperature for more factual consistency
      },
    });

    const text = response.text || "Unable to generate analysis.";
    
    // Extract grounding chunks for source transparency as required by guidelines
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .map((chunk: any) => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Source'
      }))
      .filter(s => s.uri !== '');

    // Parse Verdict and Confidence from text (rudimentary parsing)
    const verdictMatch = text.match(/VERDICT:\s*(True|False|Misleading|Unconfirmed|Developing)/i);
    const confidenceMatch = text.match(/CONFIDENCE:\s*(\d+)/i);

    return {
      id: Math.random().toString(36).substr(2, 9),
      query,
      verdict: (verdictMatch ? verdictMatch[1] : 'Unconfirmed') as any,
      confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 50,
      analysis: text,
      sources,
      timestamp: new Date().toISOString(),
      category
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export async function getTrendingSignals(): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "List 5 current high-interest trending news topics or claims currently circulating in technology, global politics, or science as of today. Return ONLY a bulleted list of short phrases.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    return response.text
      .split('\n')
      .map(line => line.replace(/^[-*•]\s*/, '').trim())
      .filter(line => line.length > 5 && line.length < 100)
      .slice(0, 5);
  } catch (e) {
    return ["AI Regulation updates", "Semiconductor market shifts", "Space exploration milestones", "Global climate policy", "Cybersecurity breakthroughs"];
  }
}
