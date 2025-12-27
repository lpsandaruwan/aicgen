/**
 * Entry point detection
 *
 * Finds main entry points based on language and project type
 */

import type { Language } from '../../../models/project.js';

/**
 * Detect entry points for the project
 *
 * @param projectPath - Absolute path to project root
 * @param language - Primary language
 * @returns Array of entry point file paths
 */
export async function detectEntryPoints(projectPath: string, language: Language): Promise<string[]> {
  // TODO: Implement in Phase 4
  // - TypeScript/JavaScript: src/index.ts, src/main.ts, index.js, app.ts, server.ts
  // - Next.js: pages/_app.tsx, app/layout.tsx, next.config.js
  // - Python: main.py, app.py, __main__.py, manage.py, setup.py
  // - Go: cmd/*/main.go, main.go
  // - Rust: src/main.rs, src/lib.rs
  // - Java: src/main/java/**/Main.java, src/main/java/**/Application.java
  // - Check package.json "main" and "exports" fields
  throw new Error('Not implemented yet');
}
