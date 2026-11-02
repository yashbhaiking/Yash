export interface FeatureItem {
  id: number;
  name: string;
  cmd: string;
  cat: string;
  action: string;
  prompt?: string;
  desc?: string;
  isCore?: boolean;
}

export interface CategoryDef {
  cat: string;
  count: number;
  prefix: string;
  examples: string[];
}

export interface TranscriptLog {
  id: string;
  sender: 'user' | 'jarvis' | 'factory' | 'system';
  text: string;
  timestamp: string;
  badge?: string;
  code?: string;
  actionType?: string;
}

export interface VaultKey {
  id: string;
  name: string;
  key: string;
  service: string;
  dateAdded: string;
}

export interface VaultNote {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export interface VaultMemory {
  id: string;
  key: string;
  value: string;
  timestamp: string;
}

export interface PluginExecutionStats {
  [category: string]: number;
}
