import { join, normalize } from 'path';
import { homedir } from 'os';

export const AICGEN_HOME = join(homedir(), '.aicgen');
export const AICGEN_PROJECT_DIR = '.aicgen';

export function getAicgenHome(...parts: string[]): string {
  return join(AICGEN_HOME, ...parts);
}

export function getProjectConfigDir(projectPath: string): string {
  return join(projectPath, AICGEN_PROJECT_DIR);
}

export function toUnixPath(path: string): string {
  return normalize(path).replace(/\\/g, '/');
}
