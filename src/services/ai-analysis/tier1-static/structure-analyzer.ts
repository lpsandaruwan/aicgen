/**
 * Directory structure analysis
 *
 * Analyzes project directory structure to detect patterns
 */

import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';
import type { StructureAnalysisResult } from '../types.js';

/**
 * Analyze project directory structure
 *
 * @param projectPath - Absolute path to project root
 * @returns Structure analysis result
 */
export async function analyzeStructure(projectPath: string): Promise<StructureAnalysisResult> {
  if (!existsSync(projectPath)) {
    return createEmptyResult();
  }

  const directories: string[] = [];
  const fileCount: Record<string, number> = {};
  let totalFiles = 0;
  let totalLines = 0;
  let maxDepth = 0;

  // Recursively scan directory
  await scanDirectory(projectPath, projectPath, directories, fileCount, 0, (depth) => {
    maxDepth = Math.max(maxDepth, depth);
    totalFiles++;
  });

  // Estimate total LOC (rough estimate: 50KB = ~1000 lines)
  totalLines = totalFiles * 100; // Very rough estimate

  // Detect common patterns
  const patterns = detectPatterns(directories);

  return {
    directories,
    fileCount,
    totalFiles,
    totalLines,
    depth: maxDepth,
    patterns,
  };
}

/**
 * Recursively scan directory and collect information
 */
async function scanDirectory(
  dirPath: string,
  basePath: string,
  directories: string[],
  fileCount: Record<string, number>,
  depth: number,
  onFile: (depth: number) => void
): Promise<void> {
  if (depth > 10) return; // Max depth

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      // Skip ignored directories/files
      if (shouldIgnore(entry.name)) {
        continue;
      }

      const fullPath = join(dirPath, entry.name);

      if (entry.isDirectory()) {
        const relativePath = fullPath.replace(basePath, '').replace(/^\//, '');
        directories.push(relativePath);

        // Recurse into subdirectory
        await scanDirectory(fullPath, basePath, directories, fileCount, depth + 1, onFile);
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        if (ext) {
          fileCount[ext] = (fileCount[ext] || 0) + 1;
        } else {
          fileCount['[no extension]'] = (fileCount['[no extension]'] || 0) + 1;
        }

        onFile(depth);
      }
    }
  } catch {
    // Permission denied or other error, skip
  }
}

/**
 * Detect common directory patterns
 */
function detectPatterns(directories: string[]): StructureAnalysisResult['patterns'] {
  const patterns: StructureAnalysisResult['patterns'] = {
    hasSrcDir: false,
    hasTestDir: false,
    hasDocsDir: false,
    hasScriptsDir: false,
    hasCmdDir: false,
    hasInternalDir: false,
    hasPkgDir: false,
    hasAppsDir: false,
    hasPackagesDir: false,
    hasLibsDir: false,
  };

  for (const dir of directories) {
    const normalized = dir.toLowerCase();

    // Check for common patterns
    if (normalized === 'src' || normalized.startsWith('src/')) {
      patterns.hasSrcDir = true;
    }
    if (
      normalized === 'test' ||
      normalized === 'tests' ||
      normalized.startsWith('test/') ||
      normalized.startsWith('tests/') ||
      normalized.includes('/__tests__/')
    ) {
      patterns.hasTestDir = true;
    }
    if (normalized === 'docs' || normalized.startsWith('docs/')) {
      patterns.hasDocsDir = true;
    }
    if (normalized === 'scripts' || normalized.startsWith('scripts/')) {
      patterns.hasScriptsDir = true;
    }

    // Go conventions
    if (normalized === 'cmd' || normalized.startsWith('cmd/')) {
      patterns.hasCmdDir = true;
    }
    if (normalized === 'internal' || normalized.startsWith('internal/')) {
      patterns.hasInternalDir = true;
    }
    if (normalized === 'pkg' || normalized.startsWith('pkg/')) {
      patterns.hasPkgDir = true;
    }

    // Monorepo patterns
    if (normalized === 'apps' || normalized.startsWith('apps/')) {
      patterns.hasAppsDir = true;
    }
    if (normalized === 'packages' || normalized.startsWith('packages/')) {
      patterns.hasPackagesDir = true;
    }
    if (normalized === 'libs' || normalized.startsWith('libs/')) {
      patterns.hasLibsDir = true;
    }
  }

  return patterns;
}

/**
 * Check if file/directory should be ignored
 */
function shouldIgnore(name: string): boolean {
  const ignorePatterns = [
    'node_modules',
    '.git',
    '.svn',
    '.hg',
    'dist',
    'build',
    'out',
    'coverage',
    '.next',
    '.cache',
    '.nuxt',
    '.output',
    'tmp',
    'temp',
    'vendor',
    'target',
    'bin',
    'obj',
    '.DS_Store',
    'Thumbs.db',
    '.idea',
    '.vscode',
    '*.log',
  ];

  return ignorePatterns.includes(name) || name.startsWith('.');
}

/**
 * Create empty result for invalid project path
 */
function createEmptyResult(): StructureAnalysisResult {
  return {
    directories: [],
    fileCount: {},
    totalFiles: 0,
    totalLines: 0,
    depth: 0,
    patterns: {
      hasSrcDir: false,
      hasTestDir: false,
      hasDocsDir: false,
      hasScriptsDir: false,
      hasCmdDir: false,
      hasInternalDir: false,
      hasPkgDir: false,
      hasAppsDir: false,
      hasPackagesDir: false,
      hasLibsDir: false,
    },
  };
}
