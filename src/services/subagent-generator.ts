import { readFile } from 'fs/promises';
import { join } from 'path';

export interface SubAgentTemplate {
  name: string;
  content: string;
}

export class SubAgentGenerator {
  private templatesDir: string;

  constructor() {
    this.templatesDir = join(__dirname, '../../data/templates/agents');
  }

  async generateSubAgents(guidelineIds: string[]): Promise<SubAgentTemplate[]> {
    const agents: SubAgentTemplate[] = [];

    agents.push({
      name: 'guideline-checker',
      content: await this.loadTemplate('guideline-checker.md')
    });

    const hasArchitecture = guidelineIds.some(id => id.includes('architecture'));
    if (hasArchitecture) {
      agents.push({
        name: 'architecture-reviewer',
        content: await this.loadTemplate('architecture-reviewer.md')
      });
    }

    const hasSecurity = guidelineIds.some(id => id.includes('security'));
    if (hasSecurity) {
      agents.push({
        name: 'security-auditor',
        content: await this.loadTemplate('security-auditor.md')
      });
    }

    return agents;
  }

  private async loadTemplate(filename: string): Promise<string> {
    const path = join(this.templatesDir, filename);
    return await readFile(path, 'utf-8');
  }
}
