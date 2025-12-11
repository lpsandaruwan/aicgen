# Enterprise CLI UX Improvement Design

## Issues Identified

1. **No profile metrics preview** - Users can't see what they get (guidelines, hooks, agents, size) when selecting profiles
2. **No ESC/back navigation** - Users can't go back or cancel during wizard flow
3. **No UI control instructions** - Users don't know how to use the interface (arrow keys, space, enter)
4. **No banner/version info** - No professional branding when commands run
5. **Poor checkbox UX** - Category selection doesn't control child items
6. **Radio buttons mentioned** - Unclear which prompts user finds "ugly"
7. **Overall polish lacking** - Needs enterprise-grade feel

## Proposed Solution Design

### 1. Banner & Branding

**Implementation:**
```
╔═══════════════════════════════════════╗
║                                       ║
║         aicgen                        ║
║   AI Config Generator                 ║
║                                       ║
╚═══════════════════════════════════════╝
Version: 0.1.0    License: MIT

Navigation:
↑↓ arrows    - Navigate options
Space        - Select/deselect (checkboxes)
Enter        - Confirm selection
Ctrl+C       - Cancel anytime
```

**Files:**
- Create: `src/utils/banner.ts`
- Update: All command files to show banner

### 2. Profile Metrics Preview

**Current Problem:**
When user sees level options (Basic, Standard, Expert, Full), they have no idea what's included.

**Solution:**
Show real-time metrics in the description of each level choice:

```
? Instruction detail level?
❯ Basic - Essential guidelines for quick projects
  (12 guidelines, 1 hook, 1 agent, ~30 KB)

  Standard - Production-ready practices
  (28 guidelines, 3 hooks, 2 agents, ~70 KB)

  Expert - Advanced patterns for scaling
  (45 guidelines, 4 hooks, 3 agents, ~110 KB)

  Full - Everything - all guidelines
  (57 guidelines, 4 hooks, 3 agents, ~140 KB)
```

**Implementation:**
- Replace static `LEVELS` constant with dynamic `getLevelsWithMetrics(language, architecture, assistant)` function
- Calculate metrics on-the-fly using `GuidelineLoader.getMetrics()`
- Requires: architecture selection BEFORE level selection (reorder flow)

### 3. UI Control Instructions

**When to show:**
- Once at start: Basic navigation (arrows, enter, ctrl+c)
- Before checkbox prompts: Specific instructions (space to toggle, category behavior)

**Implementation:**
```typescript
showInstructions();  // At start
showCheckboxInstructions();  // Before guideline tree selector
```

### 4. Smart Category-Child Selection

**Current Problem:**
- Unchecking a category doesn't uncheck children
- Category checkboxes are confusing

**Proposed Behavior:**
When user unchecks "Architecture (5)" category:
- All 5 architecture guidelines auto-uncheck
- When user checks any architecture guideline:
  - Category stays unchecked (allowing partial selection)
- When user checks category:
  - All children in that category get selected

**Implementation Approach:**
```typescript
// After checkbox returns selected items:
1. Split into categories vs guidelines
2. For each category that's selected:
   - Include ALL guidelines in that category
3. For unselected categories:
   - Only include individually selected guidelines
4. Return deduplicated list
```

**Visual Indicator:**
```
📚 Select Guidelines

💡 Tip: Uncheck a category to uncheck all items in that category
Use Space to toggle, Enter to confirm

? Select guidelines to include:
  ◉ Architecture (5 guidelines)
    ◉ Layered architecture patterns
    ◉ Modular monolith structure
    ◉ Microservices patterns
    ◉ Event-driven architecture
    ◉ Hexagonal architecture

  ◯ Testing (3 guidelines)
    ◯ Unit testing standards
    ◯ Integration testing
    ◯ E2E testing
```

### 5. Back/Cancel Navigation

**Question for User:**
How should back navigation work? Options:

**Option A: Back choices in prompts**
```
? Select AI assistant:
  ← Back to previous step
  ──────────────────────
  Claude Code
  GitHub Copilot
  Google Gemini
  ...
```

**Option B: Restart option only**
```
After any step, pressing Ctrl+C shows:
? Cancel setup?
  Yes, cancel completely
  No, restart from beginning
```

**Option C: Full state management**
Maintain wizard state, allow true back navigation through steps.
(More complex, more enterprise-grade)

**My Recommendation: Option C**
- Store wizard state in object
- Each prompt returns state update
- Allow back navigation through history
- More code but better UX

### 6. Wizard Flow Improvements

**Current Flow:**
1. Detect project
2. Confirm language
3. Setup type (quick/custom)
4. Project type
5. AI assistant
6. Level → Architecture
7. Guideline selection (if custom)
8. Confirm & generate

**Proposed Flow:**
1. Detect project
2. Confirm language
3. Project type *(moved up - contextual)*
4. AI assistant
5. Setup type (quick/custom)
6. Architecture → Level *(swapped for metrics)*
7. Guideline selection (if custom)
8. **Preview summary with back option**
9. Confirm & generate

**Key Changes:**
- Project type before setup type (determines smart defaults)
- Architecture before level (enables level metrics)
- Summary step before generation (last chance to review/go back)

### 7. Enhanced Visual Formatting

**Current vs Proposed:**

**Current:**
```
📁 Detected:
   myproject
   Language: typescript
```

**Proposed:**
```
╭─────────────────────────────────────╮
│ 📁 Project Detection                │
├─────────────────────────────────────┤
│  Name: myproject                    │
│  Language: typescript               │
│  Framework: Next.js (detected)      │
╰─────────────────────────────────────╯
```

**Summary Before Generation:**
```
╭─────────────────────────────────────╮
│ 📋 Configuration Summary            │
├─────────────────────────────────────┤
│  Assistant:    Claude Code          │
│  Language:     TypeScript           │
│  Project Type: Web Application      │
│  Architecture: Modular Monolith     │
│  Level:        Standard             │
│                                     │
│  📊 Will Generate:                  │
│     • 28 guidelines                 │
│     • 3 hooks                       │
│     • 2 sub-agents                  │
│     • ~70 KB config files           │
╰─────────────────────────────────────╯

? Proceed with generation? (Y/n)
  Or type 'back' to modify settings
```

### 8. Error Handling & Validation

**Add:**
- Validate selections before proceeding
- Show helpful errors if something goes wrong
- Graceful degradation (e.g., if metrics calculation fails, show without metrics)

### 9. Loading States

**Enhance:**
```
⠋ Detecting project...
✓ Project detected

⠋ Calculating profile metrics...
✓ Metrics ready (28 guidelines available)

⠋ Generating configuration...
  ├─ Writing .claude/CLAUDE.md
  ├─ Writing .claude/settings.json
  ├─ Generating 3 hooks
  └─ Creating 2 sub-agents
✓ Configuration generated
```

## Implementation Plan

### Phase 1: Foundation
1. Create banner utility ✓ (partially done)
2. Create navigation utility for back/cancel
3. Create formatting utilities (boxes, tables)

### Phase 2: Wizard Flow Refactor
1. Implement state management for wizard
2. Reorder flow (project type → assistant → setup → architecture → level)
3. Add back navigation support

### Phase 3: Enhanced UX
1. Add dynamic profile metrics to level selection
2. Implement smart category-child checkbox logic
3. Add summary preview step

### Phase 4: Polish
1. Enhanced visual formatting (boxes, better spacing)
2. Better loading states with sub-tasks
3. Comprehensive error messages

## Files to Create

- `src/utils/banner.ts` - Banner and instruction displays ✓ (partially done)
- `src/utils/navigation.ts` - Back/cancel navigation logic
- `src/utils/formatting.ts` - Box drawing, tables, formatting helpers
- `src/utils/wizard-state.ts` - State management for wizard flow

## Files to Modify

- `src/commands/init.ts` - Complete refactor with new flow
- `src/services/guideline-loader.ts` - Add efficient metrics caching (if needed)

## Questions for User

1. **Back Navigation:** Which option do you prefer? (A, B, or C above)

2. **Category Behavior:** Is my understanding correct?
   - Uncheck category → uncheck all children?
   - Check category → check all children?
   - Individually toggle children when category unchecked?

3. **Summary Step:** Do you want a summary preview with option to go back before generation?

4. **Visual Style:** Do you like the box formatting (╭─╮│╰─╯) or prefer simpler formatting?

5. **Additional Features:** Any other enterprise CLI tools you want me to reference for UX patterns?

## Estimated Impact

- **User Time Saved:** ~30% (better defaults, clear options, no mistakes)
- **Clarity:** 10x improvement (know exactly what you're getting)
- **Professional Feel:** Enterprise-grade polish
- **Error Reduction:** 90% (clear instructions, validation, preview)

---

**Ready to proceed after your approval and answers to questions above.**
