/**
 * Dynamic prompt construction utilities
 */

import type { AnalysisContext, SampledFile, StaticAnalysisResult } from '../../types.js';

/**
 * Format static analysis for prompt
 */
export function formatStaticAnalysis(analysis: StaticAnalysisResult): string {
  // TODO: Implement in Phase 5
  // - Convert to clean JSON
  // - Omit verbose/unnecessary fields
  // - Keep it concise
  throw new Error('Not implemented yet');
}

/**
 * Format sampled files for prompt
 */
export function formatSampledFiles(files: SampledFile[]): string {
  // TODO: Implement in Phase 5
  // - Format as: --- path/to/file.ts ---\n{content}\n\n
  // - Truncate very long files
  // - Include file metadata (reason, importance)
  throw new Error('Not implemented yet');
}

/**
 * Estimate prompt token count
 */
export function estimatePromptTokens(prompt: string, provider: 'claude' | 'openai' | 'gemini'): number {
  // TODO: Implement in Phase 5
  // - Rough estimation: ~4 chars per token
  // - More accurate for specific providers if needed
  throw new Error('Not implemented yet');
}
