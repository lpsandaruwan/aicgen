# aicgen - AI Config Generator

Automatically generate and manage AI coding assistant configurations for your projects with intelligent profile-based setups and learning capabilities.

## Features

- **Profile-based initialization** - Choose from basic/balanced/expert profiles
- **Codebase scanning** - Analyzes project structure to generate contextually appropriate configs
- **Learning system** - Remembers user preferences across projects (coming soon)
- **Context preservation** - Creates instructions.md to prevent AI context loss
- **Hybrid mode** - Uses AI when available, falls back to templates

## Installation

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
# Clone and build
git clone https://github.com/yourusername/aicgen.git
cd aicgen
bun install
bun run build:binary

# Or run directly with Bun
bun run start init
```

## Quick Start

```bash
# Navigate to your project
cd my-project

# Initialize with interactive prompts
aicgen init

# Or specify a profile directly
aicgen init --profile balanced
```

## Profiles

### Basic
Minimal guidelines for quick setup. Includes:
- TypeScript basics
- Code style conventions

### Balanced (Recommended)
Comprehensive best practices. Includes:
- TypeScript guidelines
- Testing patterns
- Architecture principles
- Error handling
- ADR tracking

### Expert
Complete setup with all features. Includes:
- All of Balanced +
- Performance considerations
- Security guidelines
- Pre-task hooks
- Enhanced ADR tracking

## Commands

### init
Initialize AI configuration in current project.

```bash
aicgen init [options]

Options:
  -p, --profile <name>  Profile to use (basic|balanced|expert)
  -f, --force           Overwrite existing configuration
  --no-ai               Generate without AI (use templates only)
```

### learn (Coming Soon)
Manage learned preferences.

```bash
aicgen learn add "<rule>"
aicgen learn list
aicgen learn remove <id>
```

### pin (Coming Soon)
Add critical constraint to instructions.

```bash
aicgen pin "Use PostgreSQL only"
```

### decision (Coming Soon)
Log architecture decision.

```bash
aicgen decision "Switched to Vitest" --why "Faster than Jest"
```

## Project Structure

When you run `aicgen init`, it creates:

```
.aicgen/
├── claude.md           # Claude Code configuration
├── instructions.md     # Master context document
└── decisions.md        # Architecture Decision Records (balanced/expert)
```

## API Key Configuration

aicgen supports multiple ways to provide your Anthropic API key:

1. **Environment variable**: `export ANTHROPIC_API_KEY=your_key_here`
2. **Claude Code integration**: Automatically detected if running in Claude Code
3. **No AI mode**: Use `--no-ai` flag to generate from templates only

## Development

### Prerequisites

- [Bun](https://bun.sh) >= 1.0.0

### Setup

```bash
# Install dependencies
bun install

# Development mode (auto-reload)
bun run dev

# Run directly
bun run start init

# Type checking
bun run typecheck
```

### Building

```bash
# Build for distribution
bun run build

# Compile to standalone binary
bun run build:binary              # Current platform
bun run build:binary:windows      # Windows executable
bun run build:binary:linux        # Linux executable
bun run build:binary:macos        # macOS executable (ARM64)
bun run build:all                 # All platforms

# Run tests
bun test
```

## Project Tech Stack Detection

aicgen automatically detects:
- **Languages**: TypeScript, JavaScript
- **Frameworks**: React, Next.js, Express, NestJS, Vue, Angular, Svelte
- **Project Structure**: src directory, test directory, config files
- **Dependencies**: From package.json

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT © 2024

## Roadmap

- [x] Basic CLI structure
- [x] Profile system
- [x] Project scanning
- [x] AI integration (Anthropic)
- [ ] Template generation
- [ ] Learning system
- [ ] Context management commands (pin, decision, protect)
- [ ] Hook generation
- [ ] Custom profiles
- [ ] npm publishing

## Credits

Built with:
- [Bun](https://bun.sh) - Fast JavaScript runtime and bundler
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) - AI integration
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Ora](https://github.com/sindresorhus/ora) - Loading spinners
