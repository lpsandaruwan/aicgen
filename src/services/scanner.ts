import { ProjectInfo, ProjectType } from '../models/project.js';
import { exists, readJSON } from '../utils/file.js';
import { join } from 'path';

export async function scanProject(projectPath: string): Promise<ProjectInfo> {
  const packageJsonPath = join(projectPath, 'package.json');
  const pkg = await exists(packageJsonPath)
    ? await readJSON<any>(packageJsonPath)
    : { dependencies: {}, devDependencies: {} };

  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  const type = await detectProjectType(projectPath, allDeps);
  const language = await exists(join(projectPath, 'tsconfig.json')) ? 'typescript' : 'javascript';
  const frameworks = extractFrameworks(allDeps);
  const srcDir = await findDirectory(projectPath, ['src', 'source', 'lib', 'app']);
  const testDir = await findDirectory(projectPath, ['test', 'tests', '__tests__', 'spec']);
  const hasExistingConfig = await exists(join(projectPath, '.aicgen'));

  return {
    path: projectPath,
    name: pkg.name || 'unknown',
    type,
    language,
    frameworks,
    dependencies: pkg.dependencies || {},
    srcDir,
    testDir,
    hasExistingConfig
  };
}

async function detectProjectType(projectPath: string, deps: Record<string, string>): Promise<ProjectType> {
  if (deps['next']) return 'nextjs';
  if (deps['react']) return 'react';
  if (deps['@nestjs/core']) return 'nest';
  if (deps['express']) return 'express';
  if (await exists(join(projectPath, 'tsconfig.json'))) return 'typescript';
  if (await exists(join(projectPath, 'package.json'))) return 'javascript';
  return 'unknown';
}

async function findDirectory(projectPath: string, candidates: string[]): Promise<string | null> {
  for (const dir of candidates) {
    if (await exists(join(projectPath, dir))) {
      return dir;
    }
  }
  return null;
}

function extractFrameworks(deps: Record<string, string>): string[] {
  const frameworkKeys = ['react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'express', '@nestjs/core'];
  return frameworkKeys.filter(key => deps[key]);
}
