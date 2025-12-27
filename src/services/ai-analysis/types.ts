/**
 * Type definitions for AI-assisted codebase analysis
 *
 * This module defines all TypeScript types used across the AI analysis system,
 * including inputs, outputs, and internal data structures for all analysis tiers.
 */

import type { Language, ProjectType, ArchitectureType, PackageManager } from '../../models/project.js';

// ============================================================================
// ANALYSIS RESULTS
// ============================================================================

/**
 * Complete analysis result combining static and AI analysis
 */
export interface AnalysisResult {
  /** Primary programming language detected */
  language: Language;

  /** Type of project (web, api, cli, library, etc.) */
  projectType: ProjectType;

  /** Detected architecture pattern with confidence score */
  architecture: {
    pattern: ArchitectureType;
    confidence: number;  // 0.0 - 1.0
  };

  /** List of detected frameworks */
  frameworks: string[];

  /** Testing framework if detected */
  testingFramework?: string;

  /** Package manager detected */
  packageManager: PackageManager;

  /** List of suggested guideline IDs */
  suggestedGuidelines: string[];

  /** Overall confidence score */
  confidence: number;  // 0.0 - 1.0

  /** Human-readable explanation of the analysis */
  reasoning: string;

  /** Testing maturity level */
  testingMaturity: 'none' | 'basic' | 'medium' | 'high';

  /** Backend architecture style (if applicable) */
  backendStyle?: 'modular-monolith' | 'microservices' | 'serverless' | 'layered';

  /** Frontend architecture style (if applicable) */
  frontendStyle?: 'spa' | 'mpa' | 'ssr' | 'ssg' | 'app-router' | 'pages-router';

  /** Source of the analysis result */
  source: 'cache' | 'static-only' | 'ai-assisted';

  /** Timestamp of analysis */
  timestamp: number;

  /** Version of analysis schema (for cache invalidation) */
  schemaVersion: string;
}

/**
 * Context provided to AI for analysis
 */
export interface AnalysisContext {
  /** Results from static analysis */
  staticAnalysis: StaticAnalysisResult;

  /** Sampled files with content */
  sampledFiles: SampledFile[];

  /** Absolute path to project root */
  projectPath: string;

  /** Optional user hints or preferences */
  hints?: {
    preferredArchitecture?: ArchitectureType;
    knownFrameworks?: string[];
  };
}

/**
 * Options for customizing analysis behavior
 */
export interface AnalysisOptions {
  /** Skip cache and force fresh analysis */
  noCache?: boolean;

  /** Preferred AI provider (auto-select if not specified) */
  provider?: 'claude' | 'openai' | 'gemini';

  /** Sampling strategy to use */
  samplingStrategy?: 'minimal' | 'balanced' | 'comprehensive';

  /** Maximum number of files to sample */
  maxSampledFiles?: number;

  /** Maximum tokens to send to AI */
  maxTokens?: number;

  /** Include test files in sampling */
  includeTests?: boolean;

  /** Dry run - prepare but don't send to AI */
  dryRun?: boolean;

  /** Enable verbose logging */
  verbose?: boolean;
}

// ============================================================================
// TIER 0: FINGERPRINTING
// ============================================================================

/**
 * Repository fingerprint for caching
 */
export interface FingerprintResult {
  /** Combined hash of all components */
  hash: string;

  /** Individual component hashes */
  components: {
    /** Git HEAD commit hash (if git repo) */
    git?: string;

    /** Hash of directory structure */
    structure: string;

    /** Hash of dependency lockfiles */
    dependencies: string;

    /** Hash of configuration files */
    configs: string;
  };

  /** When fingerprint was generated */
  timestamp: number;

  /** Whether fingerprint is valid */
  valid: boolean;

  /** Reason if invalid */
  invalidReason?: string;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  /** Total number of cached entries */
  totalEntries: number;

  /** Total size in bytes */
  totalSizeBytes: number;

  /** Number of cache hits */
  hits: number;

  /** Number of cache misses */
  misses: number;

  /** Oldest entry timestamp */
  oldestEntry?: number;

  /** Newest entry timestamp */
  newestEntry?: number;
}

// ============================================================================
// TIER 1: STATIC ANALYSIS
// ============================================================================

/**
 * Complete static analysis result
 */
export interface StaticAnalysisResult {
  /** Language detection results */
  languages: LanguageDetectionResult;

  /** Dependency analysis */
  dependencies: DependencyAnalysisResult;

  /** Directory structure analysis */
  structure: StructureAnalysisResult;

  /** Detected frameworks */
  frameworks: FrameworkDetectionResult;

  /** Build tools detected */
  buildTools: BuildToolResult;

  /** Monorepo detection */
  monorepo: MonorepoResult;

  /** Configuration files detected */
  configs: ConfigAnalysisResult;

  /** Overall confidence in static analysis */
  confidence: number;  // 0.0 - 1.0

  /** Analysis execution time in milliseconds */
  executionTime: number;
}

/**
 * Language detection result
 */
export interface LanguageDetectionResult {
  /** Primary language */
  primary: Language;

  /** All detected languages ranked by prevalence */
  all: Array<{
    language: Language;
    fileCount: number;
    lineCount: number;
    percentage: number;  // Percentage of total codebase
  }>;

  /** Confidence in primary language detection */
  confidence: number;  // 0.0 - 1.0
}

/**
 * Dependency analysis result
 */
export interface DependencyAnalysisResult {
  /** Production dependencies */
  dependencies: Record<string, string>;

  /** Development dependencies */
  devDependencies: Record<string, string>;

  /** Detected package manager */
  packageManager: PackageManager;

  /** Whether lockfile is present */
  lockfilePresent: boolean;

  /** Lockfile path if present */
  lockfilePath?: string;

  /** Manifest file path (package.json, pyproject.toml, etc.) */
  manifestPath?: string;
}

/**
 * Directory structure analysis result
 */
export interface StructureAnalysisResult {
  /** List of all directories */
  directories: string[];

  /** File count by extension */
  fileCount: Record<string, number>;

  /** Total number of files */
  totalFiles: number;

  /** Estimated total lines of code */
  totalLines: number;

  /** Maximum directory depth */
  depth: number;

  /** Common patterns detected */
  patterns: {
    hasSrcDir: boolean;
    hasTestDir: boolean;
    hasDocsDir: boolean;
    hasScriptsDir: boolean;
    hasCmdDir: boolean;      // Go convention
    hasInternalDir: boolean;  // Go convention
    hasPkgDir: boolean;       // Go convention
    hasAppsDir: boolean;      // Monorepo pattern
    hasPackagesDir: boolean;  // Monorepo pattern
    hasLibsDir: boolean;      // Monorepo pattern
  };
}

/**
 * Framework detection result
 */
export interface FrameworkDetectionResult {
  /** Frontend frameworks */
  frontend?: string[];

  /** Backend frameworks */
  backend?: string[];

  /** Testing frameworks */
  testing?: string[];

  /** ORM/Database libraries */
  orm?: string[];

  /** State management libraries */
  stateManagement?: string[];

  /** UI component libraries */
  uiLibraries?: string[];

  /** Build/bundler tools */
  bundlers?: string[];
}

/**
 * Build tool detection result
 */
export interface BuildToolResult {
  /** Bundler tool */
  bundler?: string;

  /** Monorepo tool */
  monorepoTool?: string;

  /** Task runner */
  taskRunner?: string;

  /** Containerization tools */
  containerization?: string[];

  /** CI/CD platforms detected */
  ci?: string[];
}

/**
 * Monorepo detection result
 */
export interface MonorepoResult {
  /** Whether this is a monorepo */
  isMonorepo: boolean;

  /** Monorepo tool detected */
  tool?: 'nx' | 'turbo' | 'lerna' | 'rush' | 'yarn-workspaces' | 'pnpm-workspaces' | 'npm-workspaces';

  /** List of package/app directories */
  packages?: string[];

  /** Monorepo structure type */
  structure?: 'apps-packages' | 'packages-only' | 'libs-only' | 'custom';

  /** Number of packages */
  packageCount?: number;
}

/**
 * Configuration analysis result
 */
export interface ConfigAnalysisResult {
  /** TypeScript configuration present */
  typescript?: boolean;

  /** ESLint configuration present */
  eslint?: boolean;

  /** Prettier configuration present */
  prettier?: boolean;

  /** Docker configuration present */
  docker?: boolean;

  /** CI/CD configurations */
  ci?: string[];

  /** Testing configuration present */
  testing?: boolean;

  /** Linting configuration present */
  linting?: boolean;

  /** Environment files detected */
  envFiles?: string[];

  /** Git hooks detected */
  gitHooks?: string[];
}

// ============================================================================
// TIER 2: SMART SAMPLING
// ============================================================================

/**
 * Sampled file with metadata
 */
export interface SampledFile {
  /** Relative path from project root */
  path: string;

  /** File content */
  content: string;

  /** File size in bytes */
  size: number;

  /** Estimated tokens */
  estimatedTokens: number;

  /** Why this file was sampled */
  reason: SamplingReason;

  /** Language/file type */
  language: string;

  /** Importance score (0-1) */
  importance: number;
}

/**
 * Reason a file was sampled
 */
export type SamplingReason =
  | 'entry-point'
  | 'hub-file'
  | 'high-complexity'
  | 'config-file'
  | 'test-file'
  | 'largest-file'
  | 'representative';

/**
 * Sampling context for strategies
 */
export interface SamplingContext {
  /** Project root path */
  projectPath: string;

  /** Static analysis results */
  staticAnalysis: StaticAnalysisResult;

  /** Maximum files to sample */
  maxFiles: number;

  /** Maximum total tokens */
  maxTokens: number;

  /** Whether to include test files */
  includeTests: boolean;

  /** Primary language */
  language: Language;
}

/**
 * Import graph for finding hub files
 */
export interface ImportGraph {
  /** Map of file path to node */
  nodes: Map<string, FileNode>;

  /** Map of file path to set of imported file paths */
  edges: Map<string, Set<string>>;
}

/**
 * Node in import graph
 */
export interface FileNode {
  /** File path */
  path: string;

  /** Files this file imports */
  imports: string[];

  /** Files that import this file */
  importedBy: string[];

  /** Hub score (how many files import this) */
  hubScore: number;
}

/**
 * Complexity analysis result for a file
 */
export interface ComplexityResult {
  /** File path */
  file: string;

  /** Cyclomatic complexity */
  cyclomaticComplexity: number;

  /** Cognitive complexity (if available) */
  cognitiveComplexity?: number;

  /** Number of lines */
  lines: number;

  /** Number of functions/methods */
  functions: number;

  /** Number of classes */
  classes?: number;
}

// ============================================================================
// TIER 3: AI PROVIDERS
// ============================================================================

/**
 * AI provider interface
 */
export interface AIProvider {
  /** Provider name */
  readonly name: 'claude' | 'openai' | 'gemini';

  /** API endpoint */
  readonly apiEndpoint: string;

  /** Model name */
  readonly model: string;

  /** Analyze codebase with AI */
  analyze(context: AnalysisContext): Promise<AIAnalysisResult>;

  /** Check if provider is configured with valid credentials */
  isConfigured(): Promise<boolean>;

  /** Validate API credentials */
  validateCredentials(): Promise<boolean>;

  /** Estimate tokens for context */
  estimateTokens(context: AnalysisContext): number;

  /** Estimate cost in USD for tokens */
  estimateCost(tokens: number): number;

  /** Get provider capabilities */
  getCapabilities(): ProviderCapabilities;
}

/**
 * AI analysis result (before merging with static)
 */
export interface AIAnalysisResult {
  /** Detected architecture pattern */
  architecture: {
    pattern: ArchitectureType;
    confidence: number;
  };

  /** Project type classification */
  projectType: ProjectType;

  /** Detected frameworks (may differ from static) */
  frameworks: string[];

  /** Testing maturity assessment */
  testingMaturity: 'none' | 'basic' | 'medium' | 'high';

  /** Suggested guidelines */
  suggestedGuidelines: string[];

  /** Overall confidence */
  confidence: number;

  /** AI's reasoning */
  reasoning: string;

  /** Backend style (if applicable) */
  backendStyle?: 'modular-monolith' | 'microservices' | 'serverless' | 'layered';

  /** Frontend style (if applicable) */
  frontendStyle?: 'spa' | 'mpa' | 'ssr' | 'ssg' | 'app-router' | 'pages-router';

  /** Tokens used */
  tokensUsed?: {
    input: number;
    output: number;
    total: number;
  };

  /** Cost in USD */
  cost?: number;

  /** Response time in milliseconds */
  responseTime?: number;
}

/**
 * Provider capabilities
 */
export interface ProviderCapabilities {
  /** Maximum context window in tokens */
  maxContextTokens: number;

  /** Maximum output tokens */
  maxOutputTokens: number;

  /** Supports JSON mode */
  supportsJsonMode: boolean;

  /** Supports streaming */
  supportsStreaming: boolean;

  /** Cost per 1M input tokens (USD) */
  costPerMillionInputTokens: number;

  /** Cost per 1M output tokens (USD) */
  costPerMillionOutputTokens: number;
}

/**
 * Provider configuration
 */
export interface ProviderConfig {
  /** API key */
  apiKey: string;

  /** Model to use (optional, uses default if not specified) */
  model?: string;

  /** Custom API endpoint (optional) */
  apiEndpoint?: string;

  /** Request timeout in milliseconds */
  timeout?: number;

  /** Max retries on failure */
  maxRetries?: number;
}

/**
 * AI provider error
 */
export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly code: AIProviderErrorCode,
    public readonly provider: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AIProviderError';
  }
}

/**
 * AI provider error codes
 */
export type AIProviderErrorCode =
  | 'INVALID_API_KEY'
  | 'RATE_LIMIT'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'INVALID_RESPONSE'
  | 'INSUFFICIENT_QUOTA'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN';

// ============================================================================
// PROGRESS & EVENTS
// ============================================================================

/**
 * Analysis progress event
 */
export interface AnalysisProgress {
  /** Current stage */
  stage: 'fingerprint' | 'static' | 'sampling' | 'ai' | 'merging' | 'complete';

  /** Human-readable message */
  message: string;

  /** Progress percentage (0-100) */
  percentage: number;

  /** Current step within stage */
  step?: string;

  /** Timestamp */
  timestamp: number;
}

/**
 * Analysis event types
 */
export type AnalysisEvent =
  | { type: 'progress'; data: AnalysisProgress }
  | { type: 'cache-hit'; data: { fingerprint: string } }
  | { type: 'cache-miss'; data: { fingerprint: string } }
  | { type: 'static-complete'; data: StaticAnalysisResult }
  | { type: 'sampling-complete'; data: { fileCount: number; totalTokens: number } }
  | { type: 'ai-request'; data: { provider: string; tokens: number; estimatedCost: number } }
  | { type: 'ai-response'; data: { provider: string; tokensUsed: number; cost: number; responseTime: number } }
  | { type: 'error'; data: { error: Error; stage: string } }
  | { type: 'complete'; data: AnalysisResult };

/**
 * Event listener for analysis events
 */
export type AnalysisEventListener = (event: AnalysisEvent) => void;

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Token estimation result
 */
export interface TokenEstimate {
  /** Estimated input tokens */
  inputTokens: number;

  /** Estimated output tokens */
  outputTokens: number;

  /** Total tokens */
  totalTokens: number;

  /** Provider used for estimation */
  provider: string;
}

/**
 * Confidence calculation inputs
 */
export interface ConfidenceInputs {
  /** Static analysis confidence */
  staticConfidence: number;

  /** AI analysis confidence (if available) */
  aiConfidence?: number;

  /** Agreement score between static and AI (0-1) */
  agreement?: number;

  /** Number of signals detected */
  signalCount?: number;
}
