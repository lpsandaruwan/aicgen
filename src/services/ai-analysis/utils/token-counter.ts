/**
 * Token counting utilities
 *
 * Estimates tokens for different AI providers
 */

/**
 * Estimate tokens for text
 *
 * @param text - Text to estimate
 * @param provider - AI provider (different tokenization)
 * @returns Estimated token count
 */
export function estimateTokens(text: string, provider: 'claude' | 'openai' | 'gemini'): number {
  // TODO: Implement in Phase 4/5
  // - Rough estimation: ~4 characters per token
  // - More accurate: use tiktoken for OpenAI
  // - Claude/Gemini: similar estimation
  const charsPerToken = 4;
  return Math.ceil(text.length / charsPerToken);
}

/**
 * Estimate tokens for file
 */
export function estimateFileTokens(content: string, provider: 'claude' | 'openai' | 'gemini'): number {
  return estimateTokens(content, provider);
}

/**
 * Check if token count is within provider limits
 */
export function isWithinLimit(
  tokens: number,
  provider: 'claude' | 'openai' | 'gemini'
): boolean {
  const limits = {
    claude: 200_000,
    openai: 128_000,
    gemini: 1_000_000,
  };
  return tokens <= limits[provider];
}
