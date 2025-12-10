# aicgen Brand Assets

## Logo Concept

The aicgen logo represents the flow of AI intelligence transforming into generated configuration files:

- **Left side**: Neural network nodes (circles) representing AI
- **Center**: Flow arrows (▶▶) representing the generation process
- **Right side**: Document with code lines representing generated config files
- **Checkmark**: Successful automation

## Color Palette

### Primary Colors
- **Cyan**: `#06b6d4` - Technology, terminals, code
- **Purple/Magenta**: `#a855f7` - AI, intelligence, creativity
- **Gradient**: Cyan → Purple - Represents transformation

### Accent Colors
- **White**: `#ffffff` - Text, emphasis
- **Gray**: `#6b7280` - Secondary text, code lines
- **Green**: `#10b981` - Success states, checkmarks

## Files

### `logo.svg`
Full color SVG logo with gradient and animations:
- 400x400px viewBox
- Animated sparkle particles
- Glow effects
- Use in: README, documentation, web

### `logo-ascii.txt`
ASCII art versions for terminal display:
- **Large**: Main banner
- **Medium**: Banner with text
- **Small**: Inline status
- **Minimal**: Loading states

## Usage Guidelines

### Terminal Display

```typescript
import { showBanner } from './utils/banner.js';

// Show full banner with logo
showBanner();
```

### README / Documentation

```markdown
<p align="center">
  <img src="assets/logo.svg" width="200" alt="aicgen logo" />
</p>
```

### Loading States

Use the minimal version with animation:
```
⠋ ◉ ▶ ▢  Generating...
⠙ ◉ ▶▶ ▢  Generating...
⠹ ◉ ▶▶▶ ▣  Generating...
⠸ ◉ ▶▶ ✓  Generated!
```

## Design Philosophy

**Modern & Technical**: Reflects CLI tool nature
**Abstract & Clean**: Professional, not playful
**Gradient Flow**: Represents transformation and automation
**Recognizable**: Works at any size, mono or color

## Export Sizes

When exporting from SVG:
- **Favicon**: 32x32, 64x64
- **Social**: 1200x630 (Twitter/OG)
- **Icon**: 256x256, 512x512
- **Banner**: 1280x640

---

*Logo designed for aicgen - AI Config Generator*
*Color scheme optimized for terminal and web display*
