<p align="center">
  <img src="assets/logo.svg" width="200" alt="aicgen logo" />
</p>

<h1 align="center">aicgen</h1>
<p align="center">AI Config Generator</p>
<p align="center">
  <em>Enterprise-grade configuration generator for AI coding assistants</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-cyan" alt="Version" />
  <img src="https://img.shields.io/badge/license-MIT-purple" alt="License" />
  <img src="https://img.shields.io/badge/bun-%3E%3D1.0.0-cyan" alt="Bun" />
</p>

---

Automatically generate intelligent, context-aware configurations for AI coding assistants with smart project analysis, beautiful interactive wizards, and comprehensive guideline management.

## ✨ Features

- **🎯 Multi-Assistant Support** - Claude Code, GitHub Copilot, Gemini, Antigravity, Codex
- **📚 57+ Guidelines** - Organized into 12 categories (Language, Architecture, Testing, Security, etc.)
- **🎨 Enterprise CLI Experience** - Beautiful ASCII logo, clear navigation, professional UI
- **🔧 Multi-File Organization** - Category-based files with references, not monolithic configs
- **⚡ Hooks & Sub-Agents** - Auto-generates Claude Code hooks and verification agents
- **📊 Real-Time Metrics** - See guideline count, hooks, agents, and size before generating
- **🌳 Smart Selection** - Tree-based guideline picker with category-level control
- **🏗️ Architecture Support** - Layered, Modular Monolith, Microservices, Event-Driven, Hexagonal
- **📦 Embedded Data** - All guidelines bundled in binary, no external file dependencies
- **🎭 Universal Support** - Generates AGENTS.md following the universal standard

## 🚀 Quick Start

```bash
# Navigate to your project
cd my-project

# Run interactive wizard
aicgen init

# Or fully automated
aicgen init --assistant claude-code --level standard --architecture modular-monolith
```

## 📦 Installation

### From Binary (Recommended)

Download the latest binary for your platform from the [releases page](https://github.com/yourusername/aicgen/releases):

- **Windows**: `aicgen.exe`
- **Linux**: `aicgen-linux`
- **macOS**: `aicgen-macos`

```bash
# Linux/macOS: Make executable and move to PATH
chmod +x aicgen-linux
sudo mv aicgen-linux /usr/local/bin/aicgen

# Windows: Add to PATH or run directly
.\aicgen.exe init
```

### From Source

```bash
git clone https://github.com/yourusername/aicgen.git
cd aicgen
bun install
bun run build:binary

# Or run directly
bun run start init
```

## 📚 Guideline System

aicgen uses a **modular guideline architecture** with **57+ markdown guidelines** organized into **12 categories**:

```bash
# View guideline statistics
aicgen stats
```

**Categories:**
- **Language** - TypeScript, Python, Go, Rust, Java, C#, Ruby, JavaScript
- **Architecture** - Layered, Modular Monolith, Microservices, Event-Driven, Hexagonal
- **Testing** - Unit, Integration, E2E testing standards
- **Security** - Authentication, Authorization, Input validation, Secrets management
- **Performance** - Optimization, Caching, Database query optimization
- **Database** - Schema design, Migrations, ORM patterns
- **API Design** - REST, GraphQL, Versioning, Documentation
- **Code Style** - Naming conventions, File organization, Comments
- **Error Handling** - Exception patterns, Logging, Recovery strategies
- **DevOps** - CI/CD, Docker, Infrastructure as Code
- **Best Practices** - SOLID, DRY, Clean Code principles
- **Design Patterns** - Creational, Structural, Behavioral patterns

Each guideline is a focused markdown file covering a specific topic, filtered by:
- **Language** (typescript, python, go, etc.)
- **Level** (basic, standard, expert, full)
- **Architecture** (layered, modular-monolith, microservices, etc.)

## 🎮 Interactive Wizard

```
🤖 aicgen - AI Config Generator

✔ Project analyzed

📊 Project Detection:
  Name:          my-app
  Language:      typescript (90% confidence)
  Framework:     Next.js
  Database:      postgresql (drizzle)
  Team Size:     ~3 developers
  Files:         42 code files

💡 Recommended Configuration:
  Instruction Level: standard
  → Code style, testing, CI/CD, basic architecture
  → Best for: Startup MVPs, small production apps, 1-5 developers
  Architecture:      modular-monolith
  → Single deployment with clear module boundaries

❓ Which AI assistant are you configuring?
❯ Claude Code
  GitHub Copilot
  Google Antigravity

❓ Select instruction level:
❯ Standard - Production MVP / Small Teams (Recommended)
  Expert - Scale / Large Teams
  Full - Enterprise / All Guidelines

❓ Select architecture approach:
❯ Modular Monolith (Recommended)
  Microservices
  Refactor

✨ Generate configuration files? (Y/n)

✔ Configuration generated

📄 Generated files:
  ✓ .claude/instructions.md
  ✓ .claude/config.yml
  ✓ .claude/decisions.md
```

## 📚 Instruction Levels

| Level | Guidelines | Hooks | Agents | Size | Best For |
|-------|-----------|-------|--------|------|----------|
| **Basic** | ~12 | 1 | 1 | ~30 KB | Scripts, POCs, learning projects |
| **Standard** | ~28 | 3 | 2 | ~70 KB | MVPs, small teams (1-5 devs) |
| **Expert** | ~45 | 4 | 3 | ~110 KB | Scaling products, medium teams |
| **Full** | ~57 | 4 | 3 | ~140 KB | Enterprise, complex systems |

*Metrics vary based on language and architecture selection*

## 🏗️ Architecture Options

| Architecture | Complexity | Best For |
|-------------|------------|----------|
| **Modular Monolith** | Medium | Most projects (recommended) |
| **Microservices** | High | Large teams, clear boundaries |
| **Refactor** | Medium | Legacy code, gradual improvement |
| **Layered** | Low | Simple apps, traditional patterns |

## 🎛️ CLI Commands

### `aicgen init`

Initialize AI configuration in your project.

```bash
aicgen init [options]

Options:
  -a, --assistant <name>      AI assistant (claude-code|copilot|antigravity)
  -l, --level <level>         Instruction level (basic|standard|expert|full)
  --architecture <type>       Architecture (modular-monolith|microservices|refactor)
  -f, --force                 Overwrite existing configuration
  --dry-run                   Preview files without writing
  -h, --help                  Display help
```

**Auto-update Check:** The init command automatically checks for newer guideline versions from GitHub in the background.

### `aicgen update`

Download the latest guidelines from GitHub.

```bash
aicgen update [options]

Options:
  -f, --force                 Force update even if already up to date
  -h, --help                  Display help
```

Downloads official guidelines to `~/.aicgen/cache/official/` which are automatically used by all future init commands.

### `aicgen add-guideline`

Add a custom guideline interactively.

```bash
aicgen add-guideline
```

Interactive wizard to create custom guidelines:
- Select or create category
- Define applicability (languages, levels, architectures)
- Add content via editor, file import, or inline
- Stored in `~/.aicgen/data/` with highest priority

### `aicgen stats`

Show statistics about available guidelines.

```bash
aicgen stats
```

Displays:
- Total guideline count
- Guidelines by language
- Guidelines by instruction level
- Guidelines by architecture
- Top tags

### Examples

```bash
# Interactive wizard (recommended)
aicgen init

# Skip assistant selection
aicgen init --assistant claude-code

# Fully automated
aicgen init \
  --assistant claude-code \
  --level expert \
  --architecture microservices

# Preview changes
aicgen init --dry-run

# Force overwrite
aicgen init --force
```

## ⚙️ Configuration

### Default Behavior (No Configuration Needed!)

**aicgen works out of the box** with official guidelines from `github.com/aicgen/guidelines`. Most users don't need any configuration.

### Advanced Configuration (Optional)

For enterprise users, testers, or those maintaining forks, you can override the GitHub repository:

**Method 1: User Config File** (Recommended for persistent changes)

Create `~/.aicgen/config.yml`:

```yaml
github:
  owner: yourname
  repo: custom-guidelines
```

**Method 2: Environment Variables** (For temporary overrides)

```bash
export AICGEN_GITHUB_OWNER=yourname
export AICGEN_GITHUB_REPO=custom-guidelines
aicgen update
```

**Priority:** Environment Variables > User Config File > Built-in Defaults

See `.env.example` for all available options.

### Guideline Priority System

aicgen uses a hybrid data loading system with the following priority:

1. **User Custom** (`~/.aicgen/data/`) - Highest priority
   - Custom guidelines created via `aicgen add-guideline`
   - Manually added markdown files
   - Custom mappings in `custom-mappings.yml`

2. **Official Cache** (`~/.aicgen/cache/official/`) - Medium priority
   - Downloaded from GitHub via `aicgen update`
   - Versioned guideline updates
   - Automatically checked on `aicgen init`

3. **Embedded** (Built into binary) - Fallback
   - Bundled guidelines for offline use
   - Always available, no network required

### Directory Structure

```
~/.aicgen/
├── data/                          # User custom data (highest priority)
│   ├── custom-mappings.yml        # Custom guideline mappings
│   └── guidelines/                # Custom guideline files
│       └── category/
│           └── guideline.md
└── cache/
    └── official/                  # GitHub downloads (medium priority)
        ├── version.json           # Downloaded version info
        ├── guideline-mappings.yml # Official mappings
        └── guidelines/            # Official guideline files
```

## 📁 Generated Files

### For Claude Code

```
.claude/
├── CLAUDE.md                  # Main file with references to guidelines
├── settings.json              # Hooks and permissions configuration
├── guidelines/                # Category-based guideline files
│   ├── language.md           # Language-specific patterns
│   ├── architecture.md       # Architectural guidelines
│   ├── testing.md            # Testing standards
│   ├── security.md           # Security best practices
│   ├── code-style.md         # Style conventions
│   └── ...                   # Additional categories
└── agents/                    # Verification sub-agents
    ├── guideline-checker.md  # Checks code compliance
    ├── architecture-reviewer.md
    └── security-auditor.md
```

### For GitHub Copilot

```
.github/
├── copilot-instructions.md    # Main instructions with references
└── instructions/              # Category-based instruction files
    ├── language.instructions.md
    ├── architecture.instructions.md
    ├── testing.instructions.md
    └── ...
```

### For Gemini / Antigravity / Codex

```
.gemini/                       # or .agent/ or .codex/
└── instructions.md            # All guidelines in single file
```

### Universal (All Tools)

```
AGENTS.md                      # Universal AI agent instructions
                              # Follows the AGENTS.md standard
```

## 🔍 Project Detection

aicgen automatically detects:

**Languages:**
- TypeScript, JavaScript, Python, Go, Rust, Java, C#, Ruby

**Frameworks:**
- Next.js, NestJS, Express, Fastify, React, Vue, Angular, Svelte
- Django, FastAPI, Flask

**Databases:**
- PostgreSQL, MySQL, MongoDB, SQLite, Redis
- ORMs: Prisma, Drizzle, TypeORM, Mongoose

**Project Characteristics:**
- Team size (estimated from codebase)
- Code complexity (simple/moderate/complex)
- Existing tests, CI/CD, Docker
- Package manager (npm, yarn, pnpm, bun, pip, cargo, go)

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0

### Setup

```bash
# Install dependencies
bun install

# Run examples
bun run examples/phase1-demo.ts    # Project scanning & recommendations
bun run examples/phase2-demo.ts    # Template rendering & generation

# Development mode
bun run dev

# Run directly
bun run start init
```

### Building

```bash
# TypeScript type checking
bun run typecheck

# Build for distribution
bun run build

# Compile to standalone binary
bun run build:binary              # Current platform
bun run build:binary:windows      # Windows (.exe)
bun run build:binary:linux        # Linux (x64)
bun run build:binary:macos        # macOS (ARM64)
bun run build:all                 # All platforms

# Run tests
bun test
```

## 📖 Documentation

- [PHASE1-COMPLETE.md](PHASE1-COMPLETE.md) - Foundation & Schema
- [PHASE2-COMPLETE.md](PHASE2-COMPLETE.md) - Template System
- [PHASE3-COMPLETE.md](PHASE3-COMPLETE.md) - Interactive CLI Wizard
- [CLAUDE.md](CLAUDE.md) - Project instructions for AI assistants

## 🗺️ Roadmap

### ✅ Completed

- [x] Phase 1: Foundation & Schema
  - [x] Project fingerprinting
  - [x] Smart recommendations
  - [x] Profile system
- [x] Phase 2: Template System
  - [x] Handlebars template engine
  - [x] First complete profile (Claude Code + TypeScript)
  - [x] Atomic file writes
- [x] Phase 3: Interactive CLI Wizard
  - [x] Beautiful prompts with Inquirer.js
  - [x] Colored output with Chalk
  - [x] Spinner animations with Ora
  - [x] Non-interactive mode

### 🚧 Future Enhancements

- [ ] More profiles (Python, Go, React, Vue, Next.js specific)
- [ ] More templates (CI/CD, Docker, README)
- [ ] Learning system (remember preferences)
- [ ] Context management commands (pin, decision, protect)
- [ ] Hook generation
- [ ] Sub-agent generation (for Claude Code)
- [ ] AI-powered customization (Anthropic API)
- [ ] npm publishing

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT © 2024

## 🏆 Credits

Built with:
- [Bun](https://bun.sh) - Fast JavaScript runtime and bundler
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Handlebars](https://handlebarsjs.com/) - Template engine
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Ora](https://github.com/sindresorhus/ora) - Loading spinners
- [YAML](https://github.com/eemeli/yaml) - YAML parser

## 💬 Support

- 📝 [Issues](https://github.com/yourusername/aicgen/issues)
- 💬 [Discussions](https://github.com/yourusername/aicgen/discussions)
- 📧 Email: your@email.com

---

**Made with ❤️ for the AI coding community**
