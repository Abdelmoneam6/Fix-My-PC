export enum AppMode {
  HOME = 'HOME',
  TROUBLESHOOT = 'TROUBLESHOOT',
  INSPECT = 'INSPECT',
  RESOURCES = 'RESOURCES'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface AnalysisResult {
  componentName: string;
  condition: string;
  advice: string;
  confidence: string;
}

export interface SearchResult {
  title: string;
  url: string;
  description?: string;
}
