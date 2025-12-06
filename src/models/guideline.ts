import { ProjectType } from './project.js';

export interface Guideline {
  id: string;
  category: string;
  content: string;
  applicableTo: ProjectType[];
}

export interface UserPreference {
  id: string;
  rule: string;
  source: 'manual' | 'extracted';
  sourceProject?: string;
  dateAdded: string;
}
