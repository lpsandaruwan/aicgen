/**
 * AI-assisted codebase analysis module
 *
 * Public API exports
 */

// Main analyzer
export { CodebaseAnalyzer } from './analyzer.js';

// Types
export type {
  AnalysisResult,
  AnalysisOptions,
  AnalysisContext,
  AnalysisProgress,
  AnalysisEvent,
  AnalysisEventListener,
  StaticAnalysisResult,
  AIAnalysisResult,
  SampledFile,
  FingerprintResult,
  CacheStats,
  AIProvider,
  ProviderConfig,
  ProviderCapabilities,
} from './types.js';

// Provider factory
export { createProvider, autoSelectProvider } from './tier3-ai/providers/provider-factory.js';

// API key management
export { APIKeyManager } from './tier3-ai/auth/api-key-manager.js';
export { validateAPIKey } from './tier3-ai/auth/credential-validator.js';

// Errors
export { AIProviderError } from './types.js';
export type { AIProviderErrorCode } from './types.js';
