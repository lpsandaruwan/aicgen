export type ProjectType = 'typescript' | 'javascript' | 'react' | 'nextjs' | 'express' | 'nest' | 'unknown';

export interface ProjectInfo {
  path: string;
  name: string;
  type: ProjectType;
  language: 'typescript' | 'javascript';
  frameworks: string[];
  dependencies: Record<string, string>;
  srcDir: string | null;
  testDir: string | null;
  hasExistingConfig: boolean;
}
