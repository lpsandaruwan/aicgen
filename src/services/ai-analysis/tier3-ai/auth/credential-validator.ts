/**
 * Credential validation
 *
 * Validates API keys by making minimal API calls
 */

import type { AIProvider } from '../../types.js';

/**
 * Validate API key for provider
 *
 * @param provider - AI provider instance
 * @param apiKey - API key to validate
 * @returns True if valid, false otherwise
 */
export async function validateAPIKey(provider: AIProvider, apiKey: string): Promise<boolean> {
  // TODO: Implement in Phase 6
  // - Make minimal API call
  // - Handle different error types:
  //   - 401/403: Invalid key
  //   - 429: Rate limit (but key is valid)
  //   - 5xx: Service error (assume key is valid)
  //   - Network error: Can't determine
  // - Return true if key is valid
  throw new Error('Not implemented yet');
}

/**
 * Validate all configured providers
 *
 * @returns Map of provider name to validation result
 */
export async function validateAllProviders(): Promise<Map<string, boolean>> {
  // TODO: Implement in Phase 6
  throw new Error('Not implemented yet');
}
