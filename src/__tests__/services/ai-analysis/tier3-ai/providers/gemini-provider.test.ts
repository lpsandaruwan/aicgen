/**
 * Tests for Gemini provider
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { GeminiProvider } from '../../../../../services/ai-analysis/tier3-ai/providers/gemini-provider.js';

describe('GeminiProvider', () => {
  let provider: GeminiProvider;

  beforeEach(() => {
    provider = new GeminiProvider({
      apiKey: 'test-key',
    });
  });

  describe('constructor', () => {
    it('should create provider with default model', () => {
      expect(provider.name).toBe('gemini');
      expect(provider.model).toBe('gemini-1.5-pro');
    });
  });

  describe('getCapabilities', () => {
    it('should return Gemini capabilities with large context window', () => {
      const caps = provider.getCapabilities();
      expect(caps.maxContextTokens).toBe(1_000_000);
      expect(caps.supportsJsonMode).toBe(true);
      expect(caps.costPerMillionInputTokens).toBe(1.25);  // Cheapest
    });
  });

  it.todo('should handle large monorepos with 1M token context', async () => {
    // TODO: Implement after Phase 5
  });
});
