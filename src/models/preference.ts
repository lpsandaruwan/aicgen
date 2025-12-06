export interface UserPreference {
  id: string;
  rule: string;
  source: 'manual' | 'extracted';
  sourceProject?: string;
  dateAdded: string;
  usageCount?: number;
}
