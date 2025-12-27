/**
 * Base AI provider abstract class
 *
 * All AI providers must extend this class
 */

import type {
  AIProvider,
  AnalysisContext,
  AIAnalysisResult,
  ProviderConfig,
  ProviderCapabilities,
} from '../../types.js';

/**
 * Abstract base class for AI providers
 */
export abstract class BaseAIProvider implements AIProvider {
  abstract readonly name: 'claude' | 'openai' | 'gemini';
  abstract readonly apiEndpoint: string;
  abstract readonly model: string;

  protected config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Analyze codebase with AI
   */
  abstract analyze(context: AnalysisContext): Promise<AIAnalysisResult>;

  /**
   * Check if provider is configured with valid credentials
   */
  abstract isConfigured(): Promise<boolean>;

  /**
   * Validate API credentials
   */
  abstract validateCredentials(): Promise<boolean>;

  /**
   * Estimate tokens for context
   */
  abstract estimateTokens(context: AnalysisContext): number;

  /**
   * Estimate cost in USD for tokens
   */
  abstract estimateCost(tokens: number): number;

  /**
   * Get provider capabilities
   */
  abstract getCapabilities(): ProviderCapabilities;

  /**
   * Build analysis prompt from context
   */
  protected abstract buildPrompt(context: AnalysisContext): string;

  /**
   * Parse AI response to structured result
   */
  protected abstract parseResponse(response: unknown): AIAnalysisResult;

  /**
   * Retry logic with exponential backoff
   */
  protected async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    // TODO: Implement in Phase 5
    throw new Error('Not implemented yet');
  }
}
