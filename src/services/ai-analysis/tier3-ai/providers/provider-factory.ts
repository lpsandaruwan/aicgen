/**
 * AI provider factory
 *
 * Creates and manages AI provider instances
 */

import type { AIProvider, ProviderConfig, AnalysisContext } from '../../types.js';
import { ClaudeProvider } from './claude-provider.js';
import { OpenAIProvider } from './openai-provider.js';
import { GeminiProvider } from './gemini-provider.js';

/**
 * Create AI provider instance
 *
 * @param name - Provider name
 * @param config - Provider configuration
 * @returns AI provider instance
 */
export function createProvider(
  name: 'claude' | 'openai' | 'gemini',
  config: ProviderConfig
): AIProvider {
  switch (name) {
    case 'claude':
      return new ClaudeProvider(config);
    case 'openai':
      return new OpenAIProvider(config);
    case 'gemini':
      return new GeminiProvider(config);
  }
}

/**
 * Auto-select best provider based on context and available credentials
 *
 * @param context - Analysis context
 * @param availableProviders - Map of provider name to config
 * @returns Selected provider instance
 */
export async function autoSelectProvider(
  context: AnalysisContext,
  availableProviders: Map<'claude' | 'openai' | 'gemini', ProviderConfig>
): Promise<AIProvider | null> {
  // TODO: Implement in Phase 5
  // - Estimate tokens needed
  // - Check which providers are configured
  // - Select based on:
  //   - Token count (use Gemini for very large, Claude for medium, OpenAI for small)
  //   - Cost (Gemini cheapest, Claude middle, OpenAI most expensive)
  //   - Context window limits
  // - Return best provider or null if none configured
  throw new Error('Not implemented yet');
}
