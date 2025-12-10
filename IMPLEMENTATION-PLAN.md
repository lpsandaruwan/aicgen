# Dynamic Guidelines Implementation Plan

See DYNAMIC-GUIDELINES-DESIGN.md for full details.

## Quick Summary

**Storage:**
- Official: GitHub repo `aicgen/guidelines`
- Cache: `~/.aicgen/cache/official/`
- User custom: `~/.aicgen/data/`
- Embedded: Binary fallback

**Commands:**
- `aicgen update` - Download latest from GitHub
- `aicgen add-guideline` - Interactive guideline creator
- Auto-check on `aicgen init`

**Priority:** User data > Official cache > Embedded

Ready to implement!
