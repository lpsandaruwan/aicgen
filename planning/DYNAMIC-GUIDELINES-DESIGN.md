# Dynamic Guidelines System Design

## Problem

Current system embeds all guidelines at build time. Users can't:
- Add new guidelines without rebuilding
- Update existing guidelines
- Contribute custom guidelines
- Download community guidelines

## Proposed Solution: Hybrid System

### Architecture

```
Priority (highest to lowest):
1. ~/.aicgen/guidelines/     (user custom)
2. ~/.aicgen/cache/latest/   (downloaded updates)
3. Embedded data             (bundled fallback)
```

### Directory Structure

```
~/.aicgen/
├── config.yml                    # User config
├── guidelines/                   # User custom guidelines
│   ├── custom-mappings.yml      # User-added mappings
│   └── custom/
│       ├── my-react-guide.md
│       └── my-nextjs-guide.md
│
└── cache/
    └── latest/                   # Downloaded official updates
        ├── guideline-mappings.yml
        └── guidelines/*.md
```

### Implementation Plan

#### 1. Data Source Layer (`src/services/data-source.ts`)

```typescript
interface DataSource {
  getMappings(): Promise<Record<string, GuidelineMapping>>;
  getGuideline(path: string): Promise<string>;
}

class EmbeddedDataSource implements DataSource {
  // Uses EMBEDDED_DATA (current implementation)
}

class FileSystemDataSource implements DataSource {
  constructor(private basePath: string) {}
  // Reads from filesystem
}

class HybridDataSource implements DataSource {
  constructor(
    private userPath: string,      // ~/.aicgen/guidelines
    private cachePath: string,     // ~/.aicgen/cache/latest
    private embedded: DataSource   // Fallback
  ) {}

  async getMappings() {
    // Merge: user > cache > embedded
  }

  async getGuideline(path: string) {
    // Try: user > cache > embedded
  }
}
```

#### 2. Updated GuidelineLoader

```typescript
export class GuidelineLoader {
  private dataSource: DataSource;

  constructor(dataSource?: DataSource) {
    this.dataSource = dataSource || this.createDefaultDataSource();
  }

  private createDefaultDataSource(): DataSource {
    const userDir = join(homedir(), '.aicgen', 'guidelines');
    const cacheDir = join(homedir(), '.aicgen', 'cache', 'latest');

    return new HybridDataSource(
      userDir,
      cacheDir,
      new EmbeddedDataSource()
    );
  }

  // Rest of implementation uses dataSource
}
```

#### 3. New Commands

```bash
# Update official guidelines from GitHub
aicgen update

# Add custom guideline
aicgen add-guideline <path> --category <cat> --language <lang>

# List all available guidelines
aicgen list-guidelines [--source user|cache|embedded|all]

# Remove guideline
aicgen remove-guideline <id>

# Reset to embedded (clear cache and user)
aicgen reset-guidelines
```

### Update Command Flow

```typescript
// src/commands/update.ts
export async function updateCommand() {
  const spinner = ora('Checking for updates...').start();

  // 1. Fetch latest from GitHub
  const latest = await fetchLatestGuidelines();

  // 2. Compare versions
  const currentVersion = getEmbeddedVersion();
  if (latest.version <= currentVersion) {
    spinner.succeed('Already up to date');
    return;
  }

  // 3. Download and extract
  const cachePath = join(homedir(), '.aicgen', 'cache', 'latest');
  await downloadAndExtract(latest.url, cachePath);

  spinner.succeed(`Updated to v${latest.version}`);
  console.log(chalk.cyan(`\n📦 New guidelines available:`));
  latest.changes.forEach(change => {
    console.log(`   ${chalk.gray('•')} ${change}`);
  });
}
```

### Custom Guideline Format

```yaml
# ~/.aicgen/guidelines/custom-mappings.yml
my-react-hooks:
  path: custom/react-hooks-guide.md
  category: Best Practices
  languages: [typescript, javascript]
  levels: [standard, expert, full]
  architectures: [layered, modular-monolith]
  tags: [react, hooks, frontend]

my-nextjs-patterns:
  path: custom/nextjs-patterns.md
  category: Architecture
  languages: [typescript]
  levels: [expert, full]
  tags: [nextjs, react, ssr]
```

## Benefits

### For Users
- ✅ Add custom guidelines without rebuild
- ✅ Update official guidelines via `aicgen update`
- ✅ Works offline (embedded fallback)
- ✅ Customize for their tech stack

### For Maintainers
- ✅ Push guideline updates without new releases
- ✅ Faster iteration on guidelines
- ✅ Community contributions easier

### For Teams
- ✅ Share team-specific guidelines
- ✅ Enforce company standards
- ✅ Version control custom guidelines

## Migration Path

### Phase 1: Keep Current System
- No breaking changes
- Embedded data still works

### Phase 2: Add Hybrid Support
- Implement data source layer
- Add filesystem loading
- Merge logic for multiple sources

### Phase 3: Add Update Command
- GitHub integration
- Version checking
- Download and cache

### Phase 4: Add Custom Guidelines
- CLI commands for adding/removing
- Validation and linting
- Documentation

## Implementation Checklist

- [ ] Create `DataSource` interface
- [ ] Implement `EmbeddedDataSource`
- [ ] Implement `FileSystemDataSource`
- [ ] Implement `HybridDataSource`
- [ ] Update `GuidelineLoader` to use data sources
- [ ] Create `~/.aicgen/` directory structure
- [ ] Implement `update` command
- [ ] Implement `add-guideline` command
- [ ] Implement `list-guidelines` command
- [ ] Add version tracking
- [ ] GitHub integration for updates
- [ ] Validation for custom guidelines
- [ ] Documentation and examples

## Alternative: Remote-First Approach

If internet is always available:

```typescript
// Fetch from CDN/GitHub on every run (with cache)
const guidelines = await fetch('https://cdn.aicgen.dev/guidelines/latest.json');
```

**Pros**: Always latest
**Cons**: Requires internet, slower startup

**Verdict**: Hybrid approach is better - works offline, updates when available.

---

## Questions for Implementation

1. **Should we implement this now or later?**
   - Now: Full flexibility from day 1
   - Later: Ship faster, add when needed

2. **Update frequency?**
   - Manual: `aicgen update` when user wants
   - Auto-check: Check on init, download in background
   - Both: Auto-check + manual command

3. **Custom guideline validation?**
   - Strict: Must match schema, linting required
   - Loose: Any markdown file works
   - Medium: Basic validation, warnings for issues

4. **Storage location?**
   - `~/.aicgen/` (Unix-style)
   - Platform-specific config dirs
   - Both with fallback

5. **Versioning?**
   - Semantic versioning (1.0.0)
   - Date-based (2025-12-08)
   - Git commit hash

My recommendation: **Implement Phase 1-2 now** (hybrid system), **Phase 3-4 later** (update commands).
