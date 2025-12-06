export interface Profile {
  name: string;
  description: string;
  guidelines: string[];
  includeADR: boolean;
  includeHooks: boolean;
  verbosity: 'concise' | 'detailed' | 'comprehensive';
}
