<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Insight Radar Agent

This contains everything you need to run your app locally.

# LiveSignal

**LiveSignal** is a real-time research and verification agent that continuously monitors Google Search trends and web results to detect emerging events, validate claims, and explain what is happening—complete with sources and confidence scoring.

---

## Core Concept

Unlike static Q&A tools, LiveSignal actively observes, cross-checks, and updates its understanding as new information appears. It operates in a continuous loop:

1. **Observe** – Monitors Google Search trends, breaking news, and keyword spikes; detects anomalies and misinformation patterns.  
2. **Reason** – Clusters sources into narratives, identifies contradictions, and assigns confidence levels.  
3. **Act** – Alerts users to evolving stories, fact-checks viral claims, and updates prior answers with new evidence.  

---

## Example Use Cases

- **Real-Time Fact Checker**  
  Verify claims quickly with timeline, citations, and confidence scoring.

- **Breaking News Explainer**  
  Understand trending events, affected parties, and implications with live updates.

- **Misinformation Early-Warning**  
  Detect fast-spreading claims, flag inconsistencies, and visualize source credibility.

---

## Key Features

- Live citations from Google Search  
- Time-aware answers  
- Confidence scoring  
- Change tracking for updated answers  
- User-defined watch topics (e.g., politics, tech, finance, health)

---

## Why LiveSignal?

- Uses real-time Google Search data to deliver fresh, verified insights.  
- Demonstrates autonomy, reasoning, and persistence.  
- Helps users trust information in fast-moving situations.  
- Scales across domains: news, finance, technology, and public safety.


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
