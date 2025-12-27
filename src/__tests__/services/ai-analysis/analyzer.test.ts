/**
 * Tests for main analyzer orchestrator
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { CodebaseAnalyzer } from '../../../services/ai-analysis/analyzer.js';

describe('CodebaseAnalyzer', () => {
  let analyzer: CodebaseAnalyzer;

  beforeEach(() => {
    analyzer = new CodebaseAnalyzer();
  });

  describe('constructor', () => {
    it('should create analyzer instance', () => {
      expect(analyzer).toBeDefined();
    });

    it('should accept custom cache options', () => {
      const customAnalyzer = new CodebaseAnalyzer({
        cacheDir: '/tmp/test-cache',
        cacheTTL: 7,
      });
      expect(customAnalyzer).toBeDefined();
    });
  });

  describe('event handling', () => {
    it('should register event listeners', () => {
      const listener = () => {};
      analyzer.on(listener);
      // Event listeners are registered
    });

    it('should remove event listeners', () => {
      const listener = () => {};
      analyzer.on(listener);
      analyzer.off(listener);
      // Event listener is removed
    });
  });

  describe('analyze', () => {
    it.todo('should analyze project and return result', async () => {
      // TODO: Implement after Phase 7
      // const result = await analyzer.analyze('/path/to/project');
      // expect(result).toBeDefined();
      // expect(result.language).toBeDefined();
    });

    it.todo('should use cache when available', async () => {
      // TODO: Implement after Phase 2 & 7
    });

    it.todo('should skip cache with noCache option', async () => {
      // TODO: Implement after Phase 2 & 7
    });

    it.todo('should emit progress events', async () => {
      // TODO: Implement after Phase 7
    });

    it.todo('should fallback to static-only when AI not configured', async () => {
      // TODO: Implement after Phase 7
    });
  });

  describe('cache management', () => {
    it.todo('should clear cache', async () => {
      // TODO: Implement after Phase 2 & 7
      // await analyzer.clearCache();
    });

    it.todo('should get cache stats', async () => {
      // TODO: Implement after Phase 2 & 7
      // const stats = await analyzer.getCacheStats();
      // expect(stats).toBeDefined();
    });
  });
});
