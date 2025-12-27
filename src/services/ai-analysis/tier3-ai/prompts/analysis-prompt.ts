/**
 * Analysis prompts for AI providers
 *
 * System prompts and prompt templates for code analysis
 */

import type { AnalysisContext } from '../../types.js';

/**
 * System prompt for code analysis
 */
export const ANALYSIS_SYSTEM_PROMPT = `You are a codebase architecture analyzer.
Analyze the provided static analysis results and file samples to determine:
- Architecture pattern
- Project type
- Frameworks used
- Testing maturity
- Recommended guidelines

Return ONLY valid JSON matching the exact schema provided.
Do not include markdown formatting, code blocks, or explanations.
Be concise and accurate in your reasoning.`;

/**
 * Build analysis prompt from context
 *
 * @param context - Analysis context
 * @returns Formatted prompt string
 */
export function buildAnalysisPrompt(context: AnalysisContext): string {
  // TODO: Implement in Phase 5
  // - Format static analysis as JSON
  // - Include sampled files with paths
  // - Add output schema
  // - Keep prompt concise but informative
  throw new Error('Not implemented yet');
}

/**
 * Output schema for AI response
 */
export const OUTPUT_SCHEMA = {
  architecture: {
    pattern: 'hexagonal|layered|microservices|mvc|clean|modular-monolith|serverless|event-driven',
    confidence: 'number between 0.0 and 1.0',
  },
  projectType: 'web|api|cli|library|mobile|desktop',
  frameworks: ['array', 'of', 'framework', 'names'],
  testingMaturity: 'none|basic|medium|high',
  suggestedGuidelines: ['array', 'of', 'guideline', 'ids'],
  confidence: 'number between 0.0 and 1.0',
  reasoning: 'brief explanation',
  backendStyle: 'modular-monolith|microservices|serverless|layered (optional)',
  frontendStyle: 'spa|mpa|ssr|ssg|app-router|pages-router (optional)',
};
