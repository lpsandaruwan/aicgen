# AI-Assisted Codebase Analysis - Implementation Plan

## Executive Summary

Implement a performance-first, multi-tier AI-assisted code analysis system that detects codebase structure, architecture patterns, frameworks, and provides intelligent configuration suggestions.

**Supported AI Providers**: Claude (Anthropic), OpenAI, Google Gemini
**Authentication**: API Key (OAuth deferred to v2)
**Target Performance**: < 10 seconds total analysis time
**Architecture**: Hybrid static + AI analysis with intelligent caching

---

## Design Principles

1. **Information Density First**: Maximize signal, minimize tokens
2. **Performance-First**: Fast static analysis, targeted AI usage
3. **Provider Agnostic**: Clean abstractions, no vendor lock-in
4. **Graceful Degradation**: Works without AI (static-only mode)
5. **Production Ready**: Comprehensive error handling, testing, logging

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  Analysis Orchestrator               │
│           (services/ai-analysis/analyzer.ts)         │
└─────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Tier 0     │  │   Tier 1     │  │   Tier 2     │
│ Fingerprint  │→ │   Static     │→ │   Smart      │
│   Caching    │  │  Analysis    │  │  Sampling    │
└──────────────┘  └──────────────┘  └──────────────┘
                          ↓
                  ┌──────────────┐
                  │   Tier 3     │
                  │ AI Analysis  │
                  └──────────────┘
                          ↓
              ┌───────────┴───────────┐
              ↓           ↓           ↓
        ┌─────────┐ ┌─────────┐ ┌─────────┐
        │ Claude  │ │ OpenAI  │ │ Gemini  │
        │Provider │ │Provider │ │Provider │
        └─────────┘ └─────────┘ └─────────┘
```

---

## File Structure

```
src/
├── services/
│   └── ai-analysis/
│       ├── index.ts                          # Public API exports
│       ├── analyzer.ts                       # Main orchestrator (Tier 0-3 coordinator)
│       ├── types.ts                          # Shared TypeScript types
│       │
│       ├── tier0-fingerprint/
│       │   ├── fingerprint-generator.ts      # Repo fingerprinting
│       │   └── fingerprint-cache.ts          # Cache management
│       │
│       ├── tier1-static/
│       │   ├── static-analyzer.ts            # Main static analysis orchestrator
│       │   ├── language-detector.ts          # Language detection from files/deps
│       │   ├── dependency-analyzer.ts        # Parse package.json, requirements.txt, etc.
│       │   ├── structure-analyzer.ts         # Directory structure analysis
│       │   ├── framework-detector.ts         # Framework identification
│       │   ├── build-tool-detector.ts        # Build tools (Nx, Turbo, Vite, etc.)
│       │   ├── monorepo-detector.ts          # Monorepo pattern detection
│       │   └── config-analyzer.ts            # Detect ESLint, Prettier, Docker, CI
│       │
│       ├── tier2-sampling/
│       │   ├── file-sampler.ts               # Main sampling orchestrator
│       │   ├── entry-point-detector.ts       # Find main.go, index.ts, app.py
│       │   ├── import-graph-analyzer.ts      # Build dependency graph, find hub files
│       │   ├── complexity-analyzer.ts        # AST-based cyclomatic complexity
│       │   ├── config-file-ranker.ts         # Rank config files by importance
│       │   └── sampling-strategies.ts        # Pluggable sampling strategies
│       │
│       ├── tier3-ai/
│       │   ├── providers/
│       │   │   ├── base-provider.ts          # Abstract base class
│       │   │   ├── claude-provider.ts        # Anthropic API integration
│       │   │   ├── openai-provider.ts        # OpenAI API integration
│       │   │   ├── gemini-provider.ts        # Google Gemini API integration
│       │   │   └── provider-factory.ts       # Factory pattern for providers
│       │   ├── prompts/
│       │   │   ├── analysis-prompt.ts        # System prompts for analysis
│       │   │   └── prompt-builder.ts         # Dynamic prompt construction
│       │   ├── auth/
│       │   │   ├── api-key-manager.ts        # Secure API key storage/retrieval
│       │   │   ├── credential-validator.ts   # Validate API keys
│       │   │   └── keychain-adapter.ts       # OS keychain integration (future)
│       │   └── response-parser.ts            # Parse & validate AI responses
│       │
│       └── utils/
│           ├── ast-parser.ts                 # Multi-language AST parsing
│           ├── file-hash.ts                  # Fast file hashing
│           ├── token-counter.ts              # Token estimation per provider
│           ├── parallel-executor.ts          # Parallel task execution
│           └── confidence-scorer.ts          # Confidence calculation logic
│
└── __tests__/
    └── services/
        └── ai-analysis/
            ├── analyzer.test.ts
            ├── tier0-fingerprint.test.ts
            ├── tier1-static.test.ts
            ├── tier2-sampling.test.ts
            ├── tier3-ai.test.ts
            ├── providers/
            │   ├── claude-provider.test.ts
            │   ├── openai-provider.test.ts
            │   └── gemini-provider.test.ts
            └── integration/
                └── full-analysis.test.ts
```

---

## Phase Breakdown

### Phase 1: Foundation & Types (Week 1)

**Goal**: Establish type system, interfaces, and project scaffolding

#### Tasks:
1. **Create type definitions** (`types.ts`)
   - `AnalysisInput`, `AnalysisResult`, `AnalysisContext`
   - `StaticAnalysisResult`, `SampledFile`, `FingerprintResult`
   - `AIProvider` interface, `ProviderConfig`
   - `Language`, `ProjectType`, `ArchitectureType` enums

2. **Create directory structure**
   - All directories listed in file structure above
   - Placeholder files with TODO comments

3. **Update user config schema**
   - Extend `~/.aicgen/config.yml` with AI provider settings
   - Add types to `src/models/`

4. **Set up testing infrastructure**
   - Test utilities for AI analysis
   - Mock providers for testing
   - Snapshot testing setup

**Deliverables**:
- Complete TypeScript type system
- Project scaffolding
- Test infrastructure

**Estimated Time**: 2-3 days

---

### Phase 2: Tier 0 - Fingerprinting & Caching (Week 1)

**Goal**: Implement repo fingerprinting for instant cache hits

#### Tasks:

1. **Fingerprint Generator** (`fingerprint-generator.ts`)
   ```typescript
   interface FingerprintResult {
     hash: string;              // Combined fingerprint
     components: {
       git?: string;            // Git HEAD hash
       structure: string;       // Directory tree hash
       dependencies: string;    // Lockfile hash
       configs: string;         // Config file hash
     };
     timestamp: number;
     valid: boolean;
   }

   async function generateFingerprint(projectPath: string): Promise<FingerprintResult>
   ```

   **Implementation**:
   - Check if git repo: `git rev-parse HEAD`
   - Hash directory structure (directories only, not file contents)
   - Hash dependency lockfiles (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `Pipfile.lock`, `go.sum`, `Cargo.lock`)
   - Hash key config files (`tsconfig.json`, `next.config.js`, `vite.config.ts`, etc.)
   - Combine with versioned schema (invalidate old caches on schema changes)

2. **Fingerprint Cache** (`fingerprint-cache.ts`)
   ```typescript
   class FingerprintCache {
     async get(fingerprint: string): Promise<AnalysisResult | null>
     async set(fingerprint: string, result: AnalysisResult): Promise<void>
     async clear(): Promise<void>
     async getStats(): Promise<CacheStats>
   }
   ```

   **Storage Location**: `~/.aicgen/cache/analysis/`
   **Format**: JSON files named by fingerprint hash
   **TTL**: 30 days (configurable)

3. **Cache invalidation logic**
   - Invalidate on major version changes
   - Provide `--no-cache` flag
   - Provide `--clear-cache` command

**Deliverables**:
- Fast fingerprint generation (< 500ms)
- Persistent cache with TTL
- Cache statistics

**Estimated Time**: 2 days

---

### Phase 3: Tier 1 - Static Analysis (Week 1-2)

**Goal**: Comprehensive static analysis without AI

#### Tasks:

1. **Language Detector** (`language-detector.ts`)
   ```typescript
   async function detectLanguages(projectPath: string): Promise<LanguageDetectionResult>
   ```

   **Detection Strategy**:
   - Count file extensions (`.ts`, `.py`, `.go`, `.rs`, `.java`, `.cs`, `.rb`)
   - Parse dependency files (`package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`, `pom.xml`, `*.csproj`, `Gemfile`)
   - Check build configs (`tsconfig.json`, `setup.py`, `go.mod`)
   - Weight by LOC and file count
   - Return ranked list with confidence scores

2. **Dependency Analyzer** (`dependency-analyzer.ts`)
   ```typescript
   interface DependencyAnalysisResult {
     dependencies: Record<string, string>;
     devDependencies: Record<string, string>;
     packageManager: PackageManager;
     lockfilePresent: boolean;
   }
   ```

   **Support**:
   - **Node.js**: `package.json`, detect npm/yarn/pnpm/bun from lockfiles
   - **Python**: `requirements.txt`, `Pipfile`, `pyproject.toml`, `setup.py`
   - **Go**: `go.mod`, `go.sum`
   - **Rust**: `Cargo.toml`, `Cargo.lock`
   - **Java**: `pom.xml`, `build.gradle`
   - **.NET**: `*.csproj`, `packages.config`, `*.sln`
   - **Ruby**: `Gemfile`, `Gemfile.lock`

3. **Structure Analyzer** (`structure-analyzer.ts`)
   ```typescript
   interface StructureAnalysisResult {
     directories: string[];
     fileCount: Record<string, number>;  // Extension → count
     totalFiles: number;
     totalLines: number;
     depth: number;                      // Max directory depth
     patterns: {
       hasSrcDir: boolean;
       hasTestDir: boolean;
       hasDocsDir: boolean;
       hasScriptsDir: boolean;
     };
   }
   ```

   **Analysis**:
   - Recursive directory traversal (respect `.gitignore`)
   - Count files by extension
   - Estimate total LOC (fast: file size / avg chars per line)
   - Detect common patterns (`src/`, `tests/`, `docs/`, `scripts/`, `cmd/`, `internal/`, `pkg/`)

4. **Framework Detector** (`framework-detector.ts`)
   ```typescript
   interface FrameworkDetectionResult {
     frontend?: string[];    // React, Vue, Angular, Svelte, Next.js
     backend?: string[];     // Express, Fastify, NestJS, FastAPI, Gin, Actix
     testing?: string[];     // Jest, Vitest, Pytest, Go test, RSpec
     orm?: string[];         // Prisma, TypeORM, SQLAlchemy, GORM, Diesel
     stateManagement?: string[];  // Redux, Zustand, Pinia, MobX
   }
   ```

   **Detection Rules**:
   - Check `package.json` dependencies: `react`, `next`, `express`, `@nestjs/core`
   - Python: `fastapi`, `django`, `flask`, `sqlalchemy`, `pytest`
   - Go: `gin-gonic/gin`, `gorilla/mux`, `gorm.io/gorm`
   - Rust: `actix-web`, `rocket`, `diesel`
   - Check import statements in sampled files (Phase 4)

5. **Build Tool Detector** (`build-tool-detector.ts`)
   ```typescript
   interface BuildToolResult {
     bundler?: string;       // Vite, Webpack, esbuild, Rollup, Parcel
     monorepoTool?: string;  // Nx, Turbo, Lerna, Rush
     taskRunner?: string;    // npm scripts, Make, Task, Just
     containerization?: string[];  // Docker, Podman, docker-compose
   }
   ```

   **Detection**:
   - Check config files: `vite.config.ts`, `webpack.config.js`, `nx.json`, `turbo.json`, `lerna.json`
   - Check `Dockerfile`, `docker-compose.yml`, `.dockerignore`
   - Parse `package.json` scripts for build commands

6. **Monorepo Detector** (`monorepo-detector.ts`)
   ```typescript
   interface MonorepoResult {
     isMonorepo: boolean;
     tool?: 'nx' | 'turbo' | 'lerna' | 'yarn-workspaces' | 'pnpm-workspaces';
     packages?: string[];     // List of package directories
     structure?: 'apps-packages' | 'packages-only' | 'custom';
   }
   ```

   **Detection**:
   - Check `nx.json`, `turbo.json`, `lerna.json`
   - Check `package.json` workspaces field
   - Check for `apps/`, `packages/`, `libs/` directories
   - Parse workspace configurations

7. **Config Analyzer** (`config-analyzer.ts`)
   ```typescript
   interface ConfigAnalysisResult {
     typescript?: boolean;
     eslint?: boolean;
     prettier?: boolean;
     docker?: boolean;
     ci?: string[];          // github-actions, gitlab-ci, circle-ci, jenkins
     testing?: boolean;
     linting?: boolean;
   }
   ```

   **Detection**:
   - Check for config files: `tsconfig.json`, `.eslintrc.*`, `.prettierrc.*`, `Dockerfile`, `.github/workflows/`
   - Parse CI config files
   - Check for test directories and test file patterns

8. **Static Analyzer Orchestrator** (`static-analyzer.ts`)
   ```typescript
   async function runStaticAnalysis(projectPath: string): Promise<StaticAnalysisResult>
   ```

   **Orchestration**:
   - Run all analyzers in parallel
   - Aggregate results
   - Calculate overall confidence score
   - Return comprehensive static analysis

**Deliverables**:
- Complete static analysis system
- < 1 second execution time
- 90%+ accuracy on framework detection
- Comprehensive test coverage

**Estimated Time**: 4-5 days

---

### Phase 4: Tier 2 - Smart File Sampling (Week 2)

**Goal**: Intelligently select 8-12 high-signal files for AI analysis

#### Tasks:

1. **Entry Point Detector** (`entry-point-detector.ts`)
   ```typescript
   async function detectEntryPoints(projectPath: string, language: Language): Promise<string[]>
   ```

   **Detection Rules**:
   - **TypeScript/JavaScript**: `src/index.ts`, `src/main.ts`, `index.js`, `app.ts`, `server.ts`
   - **Next.js**: `pages/_app.tsx`, `app/layout.tsx`, `next.config.js`
   - **Python**: `main.py`, `app.py`, `__main__.py`, `manage.py`, `setup.py`
   - **Go**: `cmd/*/main.go`, `main.go`
   - **Rust**: `src/main.rs`, `src/lib.rs`
   - **Java**: `src/main/java/**/Main.java`, `src/main/java/**/Application.java`
   - Check `package.json` "main" and "exports" fields

2. **Import Graph Analyzer** (`import-graph-analyzer.ts`)
   ```typescript
   interface ImportGraph {
     nodes: Map<string, FileNode>;
     edges: Map<string, Set<string>>;  // file → imported files
   }

   interface FileNode {
     path: string;
     imports: string[];        // Files this imports
     importedBy: string[];     // Files that import this
     importCount: number;      // How many files import this (hub score)
   }

   async function buildImportGraph(files: string[], language: Language): Promise<ImportGraph>
   async function findHubFiles(graph: ImportGraph, limit: number): Promise<string[]>
   ```

   **Implementation**:
   - Parse import/require statements (regex for speed, not full AST)
   - **TypeScript/JavaScript**: `import ... from`, `require(...)`, `import(...)`
   - **Python**: `import ...`, `from ... import ...`
   - **Go**: `import (...)`, `import "..."`
   - **Rust**: `use ...`, `mod ...`
   - Build directed graph
   - Rank by in-degree (files imported by many others = hub files)

3. **Complexity Analyzer** (`complexity-analyzer.ts`)
   ```typescript
   interface ComplexityResult {
     file: string;
     cyclomaticComplexity: number;
     cognitiveComplexity: number;
     lines: number;
     functions: number;
   }

   async function analyzeComplexity(files: string[], language: Language): Promise<ComplexityResult[]>
   ```

   **Implementation**:
   - Use AST parsers:
     - **TypeScript**: `@typescript/vfs` or `@babel/parser`
     - **JavaScript**: `@babel/parser`
     - **Python**: `ast` module via Python subprocess (fast enough)
     - **Go**: `go/parser` via Go subprocess
     - **Rust**: `syn` via Rust subprocess (or skip for v1)
   - Calculate cyclomatic complexity (count decision points)
   - Rank files by complexity
   - Select top 2-3 complex files (likely contain core business logic)

4. **Config File Ranker** (`config-file-ranker.ts`)
   ```typescript
   function rankConfigFiles(configFiles: string[]): string[]
   ```

   **Ranking**:
   1. Framework configs: `next.config.js`, `vite.config.ts`, `webpack.config.js`
   2. TypeScript: `tsconfig.json`
   3. Build tools: `nx.json`, `turbo.json`
   4. Package manager: `package.json`, `pyproject.toml`, `Cargo.toml`
   5. Linting: `.eslintrc.js`, `prettier.config.js`

5. **Sampling Strategies** (`sampling-strategies.ts`)
   ```typescript
   interface SamplingStrategy {
     name: string;
     select(context: SamplingContext): Promise<SampledFile[]>;
   }

   class BalancedStrategy implements SamplingStrategy {
     // 1-2 entry points + 2-3 hub files + 1-2 complex files + 1 test + 2-3 configs
   }

   class MinimalStrategy implements SamplingStrategy {
     // 1 entry point + 1 hub file + 1 config (for small projects)
   }

   class ComprehensiveStrategy implements SamplingStrategy {
     // 2 entry points + 4 hub files + 3 complex files + 2 tests + 4 configs
   }
   ```

6. **File Sampler Orchestrator** (`file-sampler.ts`)
   ```typescript
   async function sampleFiles(
     projectPath: string,
     staticAnalysis: StaticAnalysisResult,
     options?: SamplingOptions
   ): Promise<SampledFile[]>
   ```

   **Orchestration**:
   - Run detectors in parallel:
     - Entry point detection
     - Import graph construction (on subset of files for speed)
     - Complexity analysis (on subset)
   - Apply sampling strategy (default: balanced)
   - Limit total token count (estimate: ~500 tokens per file)
   - Read file contents
   - Return sampled files with metadata

**Deliverables**:
- Intelligent file sampling (8-12 files)
- Import graph analysis
- Complexity-based ranking
- < 5 seconds execution time
- Test coverage for all samplers

**Estimated Time**: 5-6 days

---

### Phase 5: Tier 3 - AI Provider Integration (Week 3)

**Goal**: Implement AI provider abstraction and Claude integration

#### Tasks:

1. **Base Provider Interface** (`base-provider.ts`)
   ```typescript
   abstract class BaseAIProvider implements AIProvider {
     abstract name: 'claude' | 'openai' | 'gemini';
     abstract apiEndpoint: string;

     abstract analyze(context: AnalysisContext): Promise<AnalysisResult>;
     abstract validateCredentials(): Promise<boolean>;
     abstract estimateTokens(context: AnalysisContext): number;
     abstract estimateCost(tokens: number): number;

     protected abstract buildPrompt(context: AnalysisContext): string;
     protected abstract parseResponse(response: unknown): AnalysisResult;
   }
   ```

2. **Claude Provider** (`claude-provider.ts`)
   ```typescript
   class ClaudeProvider extends BaseAIProvider {
     name = 'claude';
     apiEndpoint = 'https://api.anthropic.com/v1/messages';

     async analyze(context: AnalysisContext): Promise<AnalysisResult> {
       // Build prompt with static analysis + sampled files
       const prompt = this.buildPrompt(context);

       // Call Anthropic API
       const response = await this.callAPI(prompt);

       // Parse structured JSON response
       return this.parseResponse(response);
     }
   }
   ```

   **Implementation**:
   - Use `claude-3-5-sonnet-20241022` model
   - System prompt for structured JSON output
   - Retry logic with exponential backoff (3 retries)
   - Rate limit handling (429 responses)
   - Token counting (estimate: ~3.5 chars per token)
   - Cost tracking

3. **OpenAI Provider** (`openai-provider.ts`)
   ```typescript
   class OpenAIProvider extends BaseAIProvider {
     name = 'openai';
     apiEndpoint = 'https://api.openai.com/v1/chat/completions';

     async analyze(context: AnalysisContext): Promise<AnalysisResult> {
       // Similar to Claude but with OpenAI API format
       // Use gpt-4-turbo-preview or gpt-4o
     }
   }
   ```

   **Implementation**:
   - Use `gpt-4-turbo-preview` or `gpt-4o` model
   - Chat completion API with JSON mode (`response_format: { type: "json_object" }`)
   - Token counting via `tiktoken` library
   - Cost tracking

4. **Gemini Provider** (`gemini-provider.ts`)
   ```typescript
   class GeminiProvider extends BaseAIProvider {
     name = 'gemini';
     apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

     async analyze(context: AnalysisContext): Promise<AnalysisResult> {
       // Use Gemini 1.5 Pro (1M token context!)
     }
   }
   ```

   **Implementation**:
   - Use `gemini-1.5-pro` model
   - Best for large monorepos (1M token context)
   - JSON response mode
   - Cost tracking (cheapest per token)

5. **Provider Factory** (`provider-factory.ts`)
   ```typescript
   class ProviderFactory {
     static create(name: 'claude' | 'openai' | 'gemini', config: ProviderConfig): AIProvider {
       switch (name) {
         case 'claude': return new ClaudeProvider(config);
         case 'openai': return new OpenAIProvider(config);
         case 'gemini': return new GeminiProvider(config);
       }
     }

     static async autoSelect(context: AnalysisContext): Promise<AIProvider> {
       // Auto-select based on token count and available credentials
     }
   }
   ```

6. **Analysis Prompt Builder** (`prompt-builder.ts`)
   ```typescript
   function buildAnalysisPrompt(context: AnalysisContext): string
   ```

   **Prompt Structure**:
   ```
   You are a codebase architecture analyzer.
   Analyze the provided static analysis and file samples.
   Return ONLY valid JSON matching the schema below.

   STATIC ANALYSIS:
   {json of static analysis}

   SAMPLED FILES ({count} files):
   --- {file1.path} ---
   {file1.content}

   --- {file2.path} ---
   {file2.content}

   REQUIRED OUTPUT SCHEMA:
   {
     "architecture": {
       "pattern": "hexagonal|layered|microservices|mvc|clean|modular-monolith|serverless|event-driven",
       "confidence": 0.0-1.0
     },
     "projectType": "web|api|cli|library|mobile|desktop",
     "frameworks": ["react", "express"],
     "testingMaturity": "none|basic|medium|high",
     "suggestedGuidelines": ["typescript-general", "react-best-practices"],
     "confidence": 0.0-1.0,
     "reasoning": "Brief explanation"
   }

   Respond with ONLY the JSON object, no markdown formatting.
   ```

7. **Response Parser** (`response-parser.ts`)
   ```typescript
   function parseAIResponse(response: string): AnalysisResult
   ```

   **Parsing**:
   - Extract JSON from response (handle markdown code blocks if present)
   - Validate against schema (Zod or manual validation)
   - Throw descriptive errors for invalid responses
   - Handle partial responses gracefully

**Deliverables**:
- Complete AI provider abstraction
- Claude, OpenAI, Gemini implementations
- Structured JSON responses
- Error handling and retries
- Cost estimation
- Test coverage with mocks

**Estimated Time**: 5-6 days

---

### Phase 6: Authentication & API Key Management (Week 3-4)

**Goal**: Secure API key storage and credential management

#### Tasks:

1. **API Key Manager** (`api-key-manager.ts`)
   ```typescript
   class APIKeyManager {
     async getAPIKey(provider: 'claude' | 'openai' | 'gemini'): Promise<string | null>
     async setAPIKey(provider: 'claude' | 'openai' | 'gemini', key: string): Promise<void>
     async removeAPIKey(provider: 'claude' | 'openai' | 'gemini'): Promise<void>
     async hasAPIKey(provider: 'claude' | 'openai' | 'gemini'): Promise<boolean>
   }
   ```

   **Storage Strategy (v1)**:
   - Store in `~/.aicgen/config.yml` (YAML file)
   - Use basic obfuscation (Base64 + simple XOR cipher with machine ID)
   - NOT secure against determined attackers, but prevents casual browsing
   - Add warning in docs: "API keys stored locally, protect your config file"

   **Storage Strategy (v2 - future)**:
   - Use OS keychain (macOS Keychain, Windows Credential Manager, Linux Secret Service)
   - Library: `keytar` or `node-keytar`
   - Fallback to encrypted file if keychain unavailable

2. **Credential Validator** (`credential-validator.ts`)
   ```typescript
   async function validateAPIKey(provider: AIProvider, apiKey: string): Promise<boolean>
   ```

   **Validation**:
   - Make minimal API call to verify key
   - **Claude**: `POST /v1/messages` with minimal prompt
   - **OpenAI**: `GET /v1/models` (lightweight)
   - **Gemini**: Lightweight generation request
   - Handle errors gracefully (invalid key, network issues, rate limits)

3. **Interactive API Key Setup**
   - Prompt user during first run: "Would you like to set up AI-assisted analysis?"
   - Ask which provider to use
   - Securely prompt for API key (hidden input)
   - Validate key immediately
   - Save if valid

4. **Environment Variable Support**
   - Check for `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`
   - Prefer environment variables over stored keys (for CI/CD)

**Deliverables**:
- Secure API key storage
- Interactive setup flow
- Validation logic
- Environment variable support

**Estimated Time**: 3 days

---

### Phase 7: Main Analyzer Orchestrator (Week 4)

**Goal**: Coordinate all tiers and provide unified API

#### Tasks:

1. **Analyzer Orchestrator** (`analyzer.ts`)
   ```typescript
   class CodebaseAnalyzer {
     async analyze(
       projectPath: string,
       options?: AnalysisOptions
     ): Promise<AnalysisResult> {
       // Tier 0: Check fingerprint cache
       const fingerprint = await this.generateFingerprint(projectPath);
       const cached = await this.cache.get(fingerprint.hash);
       if (cached && !options?.noCache) {
         return cached;
       }

       // Tier 1: Static analysis (parallel)
       const staticAnalysis = await this.runStaticAnalysis(projectPath);

       // If no AI provider configured, return static analysis only
       if (!this.hasAIProvider()) {
         return this.staticOnlyResult(staticAnalysis);
       }

       // Tier 2: Smart file sampling (parallel with Tier 1 if possible)
       const sampledFiles = await this.sampleFiles(projectPath, staticAnalysis);

       // Tier 3: AI analysis
       const aiAnalysis = await this.runAIAnalysis({
         staticAnalysis,
         sampledFiles,
         projectPath
       });

       // Merge results
       const result = this.mergeResults(staticAnalysis, aiAnalysis);

       // Cache result
       await this.cache.set(fingerprint.hash, result);

       return result;
     }

     private mergeResults(
       static: StaticAnalysisResult,
       ai: AIAnalysisResult
     ): AnalysisResult {
       // Combine static + AI insights
       // Calculate overall confidence
       // Resolve conflicts (prefer AI for architecture, static for concrete facts)
     }
   }
   ```

2. **Confidence Scoring** (`confidence-scorer.ts`)
   ```typescript
   function calculateConfidence(
     staticConfidence: number,
     aiConfidence: number,
     agreement: number  // How much static + AI agree
   ): number {
     // Weight: 30% static, 70% AI, bonus for agreement
     const weighted = (staticConfidence * 0.3) + (aiConfidence * 0.7);
     const agreementBonus = agreement * 0.1;
     return Math.min(weighted + agreementBonus, 1.0);
   }
   ```

3. **Progress Reporting**
   ```typescript
   interface AnalysisProgress {
     stage: 'fingerprint' | 'static' | 'sampling' | 'ai' | 'complete';
     message: string;
     percentage: number;
   }

   // Emit progress events
   analyzer.on('progress', (progress: AnalysisProgress) => {
     console.log(`[${progress.percentage}%] ${progress.message}`);
   });
   ```

4. **Error Handling & Fallbacks**
   - If AI fails → return static analysis only
   - If static analysis fails → throw (can't proceed)
   - If sampling fails → use minimal sampling (entry points only)
   - Log all errors with context

**Deliverables**:
- Complete orchestration logic
- Result merging algorithm
- Progress reporting
- Graceful degradation
- Comprehensive error handling

**Estimated Time**: 3-4 days

---

### Phase 8: CLI Integration (Week 4)

**Goal**: Integrate AI analysis into existing `aicgen init` wizard

#### Tasks:

1. **Update Init Command** (`commands/init.ts`)
   ```typescript
   // Add new step in wizard flow

   // After welcome banner, before language selection:
   const useAI = await confirm({
     message: 'Enable AI-powered codebase analysis?',
     default: true
   });

   if (useAI) {
     const hasProvider = await apiKeyManager.hasAnyProvider();

     if (!hasProvider) {
       // First-time setup
       await setupAIProvider();
     }

     // Run analysis with progress
     const spinner = ora('Analyzing codebase...').start();

     const analyzer = new CodebaseAnalyzer();
     analyzer.on('progress', (progress) => {
       spinner.text = progress.message;
     });

     const analysis = await analyzer.analyze(process.cwd());

     spinner.succeed('Analysis complete!');

     // Display results
     displayAnalysisResults(analysis);

     // Ask user to confirm or adjust
     const acceptSuggestions = await confirm({
       message: 'Accept these suggestions?',
       default: true
     });

     if (acceptSuggestions) {
       // Pre-populate wizard state with analysis results
       wizardState.language = analysis.language;
       wizardState.projectType = analysis.projectType;
       wizardState.architecture = analysis.architecture.pattern;
       // ... etc
     }
   }

   // Continue with normal wizard flow
   // (users can still override AI suggestions)
   ```

2. **Analysis Results Display**
   ```typescript
   function displayAnalysisResults(analysis: AnalysisResult) {
     console.log(chalk.bold('\n📊 Analysis Results:\n'));

     console.log(chalk.cyan('Language:     ') + analysis.language);
     console.log(chalk.cyan('Project Type: ') + analysis.projectType);
     console.log(chalk.cyan('Architecture: ') + analysis.architecture.pattern +
                 chalk.dim(` (${(analysis.architecture.confidence * 100).toFixed(0)}% confidence)`));

     if (analysis.frameworks.length > 0) {
       console.log(chalk.cyan('Frameworks:   ') + analysis.frameworks.join(', '));
     }

     console.log(chalk.cyan('Testing:      ') + analysis.testingMaturity);

     console.log(chalk.bold('\n✨ Suggested Guidelines:\n'));
     analysis.suggestedGuidelines.slice(0, 8).forEach(g => {
       console.log(chalk.green('  ✓ ') + g);
     });

     if (analysis.reasoning) {
       console.log(chalk.dim('\n' + analysis.reasoning));
     }
   }
   ```

3. **New Commands**
   ```bash
   # Setup AI providers
   aicgen setup-ai

   # Test AI analysis without full init
   aicgen analyze [--provider claude|openai|gemini] [--no-cache]

   # Manage API keys
   aicgen config set-api-key <provider>
   aicgen config remove-api-key <provider>
   aicgen config list-api-keys

   # Cache management
   aicgen cache clear
   aicgen cache stats
   ```

4. **Update Help Text & Documentation**

**Deliverables**:
- Seamless CLI integration
- Interactive AI setup
- Results display
- New commands
- Updated help text

**Estimated Time**: 3 days

---

### Phase 9: Testing & Quality Assurance (Week 5)

**Goal**: Comprehensive test coverage and reliability

#### Tasks:

1. **Unit Tests**
   - Tier 0: Fingerprinting (cache hits/misses, invalidation)
   - Tier 1: Each static analyzer component
   - Tier 2: Sampling strategies, import graphs, complexity
   - Tier 3: Each provider (with mocks), prompt building, response parsing
   - Auth: API key management, validation

2. **Integration Tests**
   - Full analysis pipeline (mock AI responses)
   - Cache persistence
   - Result merging logic
   - Error handling paths

3. **Provider Tests**
   - Mock API responses from each provider
   - Test error scenarios (rate limits, invalid keys, network errors)
   - Validate retry logic
   - Test cost estimation

4. **Real-World Tests** (optional, manual)
   - Test on real repositories:
     - Small React app
     - Large Next.js monorepo
     - Python FastAPI project
     - Go microservices
     - Rust CLI tool
   - Verify accuracy of suggestions
   - Measure performance

5. **Performance Benchmarks**
   ```typescript
   describe('Performance', () => {
     it('should complete static analysis in < 1s', async () => {
       const start = Date.now();
       await runStaticAnalysis('./test-repo');
       expect(Date.now() - start).toBeLessThan(1000);
     });

     it('should complete sampling in < 5s', async () => {
       const start = Date.now();
       await sampleFiles('./test-repo', staticAnalysis);
       expect(Date.now() - start).toBeLessThan(5000);
     });
   });
   ```

6. **Edge Cases**
   - Empty repository
   - Non-git repository
   - Very large monorepo (10K+ files)
   - Mixed language project
   - Invalid API keys
   - Network failures
   - Malformed AI responses

**Deliverables**:
- 90%+ test coverage
- All edge cases handled
- Performance benchmarks met
- CI/CD integration

**Estimated Time**: 4-5 days

---

### Phase 10: Documentation & Polish (Week 5)

**Goal**: Production-ready documentation and UX polish

#### Tasks:

1. **User Documentation**
   - README updates (AI analysis feature)
   - Setup guide (getting API keys)
   - Troubleshooting guide
   - FAQ (costs, privacy, accuracy)

2. **Developer Documentation**
   - Architecture overview (this document!)
   - API documentation (TSDoc comments)
   - Contributing guide (for AI providers)
   - Testing guide

3. **Examples**
   - Example analysis outputs
   - Example configurations
   - Video demo (optional)

4. **UX Polish**
   - Better error messages
   - Clearer progress indicators
   - Helpful hints ("Get API key at: https://...")
   - Cost warnings ("This will use ~10,000 tokens, estimated cost $0.03")

5. **Privacy & Security**
   - Document what data is sent to AI providers
   - Add privacy policy
   - Add option to review prompt before sending
   - Add `--dry-run` flag (show what would be sent without sending)

**Deliverables**:
- Complete documentation
- Polished UX
- Privacy documentation

**Estimated Time**: 3 days

---

## Implementation Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Foundation & Types | 2-3 days | - |
| Phase 2: Tier 0 - Fingerprinting | 2 days | Phase 1 |
| Phase 3: Tier 1 - Static Analysis | 4-5 days | Phase 1 |
| Phase 4: Tier 2 - Smart Sampling | 5-6 days | Phase 1, 3 |
| Phase 5: Tier 3 - AI Providers | 5-6 days | Phase 1 |
| Phase 6: Authentication | 3 days | Phase 1 |
| Phase 7: Orchestrator | 3-4 days | Phase 2, 3, 4, 5 |
| Phase 8: CLI Integration | 3 days | Phase 6, 7 |
| Phase 9: Testing & QA | 4-5 days | All phases |
| Phase 10: Documentation | 3 days | All phases |
| **Total** | **~5 weeks** | - |

**Note**: Phases 2-6 can be partially parallelized if multiple developers available.

---

## Dependencies to Add

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.27.0",
    "openai": "^4.20.0",
    "@google/generative-ai": "^0.1.0",
    "tiktoken": "^1.0.10",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@babel/parser": "^7.23.0",
    "@types/node": "^20.10.0"
  }
}
```

**Optional (for v2)**:
- `keytar`: OS keychain integration
- `tree-sitter`: Advanced AST parsing
- `@typescript/vfs`: TypeScript AST analysis

---

## Configuration Schema Updates

```yaml
# ~/.aicgen/config.yml

initialized: true
dataVersion: "1.0.0"
lastUpdate: "2024-01-15T10:30:00Z"

# NEW: AI Provider Configuration
aiProviders:
  preferredProvider: claude  # claude | openai | gemini

  claude:
    apiKey: "base64_obfuscated_key"  # Obfuscated, not encrypted
    model: "claude-3-5-sonnet-20241022"
    enabled: true

  openai:
    apiKey: null
    model: "gpt-4-turbo-preview"
    enabled: false

  gemini:
    apiKey: null
    model: "gemini-1.5-pro"
    enabled: false

# NEW: Analysis Cache Settings
analysisCache:
  enabled: true
  ttlDays: 30
  maxSizeMB: 100

# NEW: Analysis Options
analysisOptions:
  samplingStrategy: balanced  # minimal | balanced | comprehensive
  includeTests: true
  maxSampledFiles: 12
  maxTokens: 50000
```

---

## Success Criteria

### Performance
- ✅ Static analysis: < 1 second
- ✅ File sampling: < 5 seconds
- ✅ Total with AI: < 10 seconds
- ✅ Cache hit: < 0.1 seconds

### Accuracy
- ✅ Language detection: 95%+ accuracy
- ✅ Framework detection: 90%+ accuracy
- ✅ Architecture detection: 80%+ accuracy (AI-assisted)
- ✅ Overall useful suggestions: 85%+ user satisfaction

### Reliability
- ✅ Graceful degradation (AI fails → static only)
- ✅ Comprehensive error handling
- ✅ 90%+ test coverage
- ✅ Zero crashes on edge cases

### Usability
- ✅ One-command setup (`aicgen init`)
- ✅ Clear progress indicators
- ✅ Helpful error messages
- ✅ Optional AI (works without)

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AI providers change APIs | Abstract provider interface, comprehensive tests |
| Analysis too slow | Performance benchmarks, profiling, optimization |
| Inaccurate suggestions | Combine static + AI, allow user override, confidence scores |
| API costs too high | Token limits, cost warnings, caching, static-only mode |
| API key security | Obfuscation (v1), keychain (v2), env var support, clear docs |
| Large monorepos timeout | Intelligent sampling, provider auto-selection (Gemini), limits |
| Network failures | Retry logic, fallback to static, offline mode |

---

## Future Enhancements (v2+)

1. **OAuth Support**: More secure than API keys
2. **Local LLM Support**: Privacy-first option (Ollama, LLaMA)
3. **AST-Based Analysis**: Deeper code understanding (tree-sitter)
4. **Incremental Analysis**: Re-analyze only changed files
5. **Multi-Provider Consensus**: Combine multiple AI opinions
6. **Learning Mode**: Improve suggestions based on user feedback
7. **Custom Rules**: User-defined analysis rules
8. **VS Code Extension**: Inline analysis results
9. **CI/CD Integration**: GitHub Action for automated analysis
10. **Team Analytics**: Aggregate insights across repositories

---

## Questions for Review

Before implementation, please confirm:

1. **Scope**: Is this the right scope for v1? Any features to add/remove?
2. **Timeline**: Is 5 weeks acceptable? Need it faster?
3. **Providers**: Claude, OpenAI, Gemini sufficient? Add others (Cohere, etc.)?
4. **Storage**: Is obfuscated file storage OK for v1, or require keychain?
5. **Costs**: Acceptable that users pay for AI API usage?
6. **Testing**: What level of testing required? (current plan: 90%+ coverage)
7. **Documentation**: What documentation is most critical?

---

## Ready to Implement?

Once approved, we'll proceed phase by phase:
1. ✅ Create feature branch
2. ✅ Implement Phase 1 (Foundation)
3. ✅ Test & review
4. ✅ Iterate through all phases
5. ✅ Final integration & testing
6. ✅ Documentation
7. ✅ Merge to main

**Estimated delivery**: 5 weeks from approval

Let's build this! 🚀
