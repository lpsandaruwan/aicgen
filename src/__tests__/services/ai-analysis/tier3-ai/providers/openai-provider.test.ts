/**
 * Tests for OpenAI provider
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { OpenAIProvider } from '../../../../../services/ai-analysis/tier3-ai/providers/openai-provider.js';

describe('OpenAIProvider', () => {
  let provider: OpenAIProvider;

  beforeEach(() => {
    provider = new OpenAIProvider({
      apiKey: 'test-key',
    });
  });

  describe('constructor', () => {
    it('should create provider with default model', () => {
      expect(provider.name).toBe('openai');
      expect(provider.model).toBe('gpt-4-turbo-preview');
    });
  });

  describe('getCapabilities', () => {
    it('should return OpenAI capabilities', () => {
      const caps = provider.getCapabilities();
      expect(caps.maxContextTokens).toBe(128_000);
      expect(caps.supportsJsonMode).toBe(true);
    });
  });

  it.todo('should analyze with JSON mode', async () => {
    // TODO: Implement after Phase 5
  });

  it.todo('should use tiktoken for accurate token counting', () => {
    // TODO: Implement after Phase 5
  });
});
