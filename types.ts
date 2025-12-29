
export interface GroundingSource {
  uri: string;
  title: string;
}

export interface VerificationResult {
  id: string;
  query: string;
  verdict: 'True' | 'Misleading' | 'False' | 'Unconfirmed' | 'Developing';
  confidence: number; // 0-100
  analysis: string;
  sources: GroundingSource[];
  timestamp: string;
  category: string;
}

export interface WatchTopic {
  id: string;
  topic: string;
  lastUpdated: string;
  status: 'monitoring' | 'idle';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  VERIFY = 'VERIFY',
  WATCHLIST = 'WATCHLIST',
  HISTORY = 'HISTORY'
}
