---
name: update-claude-md-after-install
description: Use when user has just installed framework agents and CLAUDE.md contains generic examples - systematically discovers actual project patterns (custom commands, architecture decisions, team conventions) and updates CLAUDE.md and imported files with real project-specific information
---

<EXTREMELY-IMPORTANT>
If you are about to update CLAUDE.md, you **ABSOLUTELY MUST** complete Phase 1 discovery first.

**SKIPPING DISCOVERY = INCOMPLETE DOCUMENTATION = AI AGENT FAILURE**

This is not optional. You cannot rationalize "good enough" without running verification checks.
</EXTREMELY-IMPORTANT>

# Update CLAUDE.md After Installation

## MANDATORY FIRST RESPONSE PROTOCOL

Before writing ANY documentation:

1. ☐ Complete Phase 1 discovery checklist (ALL 6 steps)
2. ☐ Create export inventory with counts
3. ☐ Verify >90% coverage is achievable
4. ☐ Announce: "Starting documentation update targeting 10/10"

**Writing docs without discovery = guaranteed gaps. Phase 1 is NON-NEGOTIABLE.**

## Overview

After installing framework agents, CLAUDE.md and its imported files contain generic placeholder examples. This skill guides you to systematically discover the actual project patterns and update these files with real, project-specific information.

**Core principle:** Discover exhaustively, then document. Analyze ALL exports before writing.

**Quality target:** 10/10 AI agent effectiveness - documentation should enable an AI to implement features correctly on the first attempt.

## Context Budget Limits

Your documentation MUST fit within these constraints:

| Component | Max Lines | Rationale |
|-----------|-----------|-----------|
| Main CLAUDE.md | 1,000 | Always loaded, keep lean |
| Each @import file | 500 | Lazy-loaded, can be detailed |
| All imports combined | 1,500 | ~3k tokens = 1.5% of context |
| **Total** | 2,500 | Leaves 98%+ for actual work |

### Why This Matters

- `@imports` are **lazy-loaded** - only loaded when relevant to current task
- Even worst-case (all imports loaded) uses <2% of context
- Exceeding limits = bloated context = degraded AI performance

### If Over Budget

1. Move code examples >30 lines to "reference by path" format
2. Convert prose to tables (3x more token-efficient)
3. Consolidate overlapping sections
4. Remove redundant information between files

## What Makes 10/10 Documentation

AI agents are most effective when documentation provides:

### 1. Step-by-Step Implementation Guides

Instead of just describing what exists, show HOW to add new things:

❌ Poor (4/10): "We use Express.js with controllers"
✅ Excellent (10/10):

````markdown
## Adding a New API Endpoint

### Step 1: Choose the Router

| Router         | Auth              | Use For        |
| -------------- | ----------------- | -------------- |
| publicRouter   | conditionalAuth() | Read-only GETs |
| internalRouter | requireAuth()     | All mutations  |

### Step 2: Create Handler

```typescript
export async function handleYourRoute(
  context: ServerContext,
  req: Request
): Promise<Response> {
  try {
    const body = await req.json();
    const result = await processData(body);
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
```
````

### 2. Exact Response Formats with TypeScript

❌ Poor: "API returns JSON with success flag"
✅ Excellent:

```markdown
### Success Response
```typescript
{ success: true, data: T, timestamp: string }
```

### Error Response
```typescript
{ success: false, error: string, code?: string }
// With status code 4xx or 5xx
```
```

### 3. State Machines with Visual Diagrams

❌ Poor: "Sessions have different statuses"
✅ Excellent:

```markdown
## Session State Machine

```
pending → active → decided → removed
            ↓
         orphaned
```

| Current | Action | New State |
|---------|--------|-----------|
| pending | User views | active |
| active | User decides | decided |
| active | Hook disconnects | orphaned |
| decided | After 5 min | removed |
```

### 4. Complete API Route Tables

❌ Poor: "Routes are in routes/ folder"
✅ Excellent:

```markdown
| Route | Method | Handler | Description |
|-------|--------|---------|-------------|
| `/api/plan` | GET | handleGetPlan | Get current plan |
| `/api/decision` | POST | handlePostDecision | Submit decision |
| `/api/hub/register` | POST | inline | Register session |
```

### 5. Export Tables with Types

❌ Poor: "Core package has parsing utilities"
✅ Excellent:

```markdown
| Export | Type | Purpose |
|--------|------|---------|
| parseMarkdownToBlocks | function | Parse plan text → Block[] |
| extractSections | function | Extract sections from blocks |
| Plan | interface | Full plan with versions |
| PlanVersion | interface | Single version snapshot |
```

## When to Use

Use this skill when:

- **Initial install:** User just installed agents and CLAUDE.md has generic examples
- **Project start:** Beginning work on a project for the first time
- **Key milestones:** After major architecture changes
- **Periodic refresh:** User asks to "update docs" or "sync CLAUDE.md with project"
- **Discovery gaps:** CLAUDE.md outdated or missing new project patterns

**Symptoms:**

- CLAUDE.md has comments like "customize for your project"
- Generic examples that don't match actual code
- Missing exports, routes, or state machines
- New features added but not documented

---

## Common Rationalizations (All Wrong)

If you catch yourself thinking any of these, STOP - you're about to fail:

- "I already know this codebase" → STILL do Phase 1 discovery
- "The exports haven't changed much" → STILL verify counts
- "This is a small project" → STILL create all 3 required files
- "80% coverage is good enough" → NO, 90% minimum
- "I'll add the rest later" → NO, complete now
- "The user didn't ask for full docs" → The skill requires 10/10
- "Phase 1 takes too long" → Skipping it takes longer (rework)
- "I can eyeball the exports" → Use bash commands, not memory

**The skill requirements are not negotiable based on convenience.**

---

## Phase 1: Exhaustive Export Discovery (MANDATORY)

**Do NOT skip this phase.** Before writing ANY documentation, complete this discovery checklist.

### Step 1: Find All Package Entry Points

```bash
# List all packages
ls packages/*/package.json apps/*/package.json 2>/dev/null

# For each package, find main export file
cat packages/*/package.json | jq -r '.name, .main, .exports'
```

**Create inventory table:**

| Package | Entry Point | Export Count |
|---------|-------------|--------------|
| @scope/core | src/index.ts | ? |
| @scope/server | src/index.ts | ? |

### Step 2: Extract ALL Exports

For EACH package entry point, run:

```bash
# Count exports
grep -c "^export" packages/core/src/index.ts

# List all exports (types, functions, constants)
grep "^export" packages/core/src/index.ts
```

**Document in scratch file:**

```markdown
## @scope/core exports (src/index.ts)

### Types/Interfaces
- Plan
- PlanVersion
- Annotation
...

### Functions
- parseMarkdownToBlocks
- extractSections
...

### Constants
- DEFAULT_PORT
...
```

### Step 3: Find Subpath Exports

Many packages re-export from subpaths:

```bash
# Find all index.ts files that might have exports
find packages/*/src -name "index.ts" | head -20

# Check for subpath exports in package.json
grep -A20 '"exports"' packages/*/package.json
```

**Common patterns:**
- `@scope/server/hub` → `packages/server/src/hub/index.ts`
- `@scope/server/storage` → `packages/server/src/storage/index.ts`

**Add subpath exports to your inventory.**

### Step 4: Find All TypeScript Interfaces

```bash
# Count interface definitions
grep -r "^export interface" packages/*/src --include="*.ts" | wc -l

# Count type definitions
grep -r "^export type" packages/*/src --include="*.ts" | wc -l

# List them all
grep -rh "^export interface\|^export type" packages/*/src --include="*.ts" | sort | uniq
```

**Add ALL to your inventory.**

### Step 5: Find All Route Handlers

```bash
# Find route definitions
grep -r "url\.pathname\|router\.\|app\.\(get\|post\|put\|patch\|delete\)" --include="*.ts" | head -50

# Find handler functions
grep -r "handle\|Handler" --include="*.ts" packages/*/src | head -30
```

**Create routes table:**

| Route | Method | Handler | File |
|-------|--------|---------|------|

### Step 6: Create Export Inventory Checklist

Before proceeding to Phase 2, you MUST have:

- [ ] List of ALL packages with export counts
- [ ] List of ALL exported types/interfaces (with file paths)
- [ ] List of ALL exported functions (with file paths)
- [ ] List of ALL subpath exports
- [ ] List of ALL route handlers (with HTTP methods)
- [ ] List of ALL state machines (entities with status/state fields)

**This inventory becomes your exports-reference.md source material.**

---

## Phase 2: Required Output Files

You MUST create these 3 files. No exceptions.

### File 1: `exports-reference.md` (REQUIRED)

**Purpose:** Complete API surface documentation
**Location:** `.claude/claude-md-refs/exports-reference.md`
**Target size:** 300-400 lines

**Template:**

```markdown
# Exports Reference

Complete API surface for all packages.

## @scope/package-name

### Models & Types

| Export | Type | Purpose |
|--------|------|---------|
| ModelName | interface | Description |
| TypeName | type | Description |

### Functions

| Export | Purpose | Returns |
|--------|---------|---------|
| functionName | What it does | `ReturnType` |

### Constants

| Export | Value | Purpose |
|--------|-------|---------|
| CONSTANT_NAME | value | What it's for |

## @scope/package-name/subpath

[Repeat structure for each subpath export]

---

## Import Patterns

```typescript
// Main exports
import { Type, functionName } from '@scope/package';

// Subpath exports
import { SubType } from '@scope/package/subpath';
```
```

**Completeness requirement:** >90% of discovered exports must appear in this file.

### File 2: `development-guide.md` (REQUIRED)

**Purpose:** Step-by-step implementation guides
**Location:** `.claude/claude-md-refs/development-guide.md`
**Target size:** 400-500 lines

**Must include these sections:**

1. **Adding a New [Primary Entity]** - Step-by-step with actual code templates
2. **Adding a New API Route** - With handler template from the actual codebase
3. **Adding a New Integration** - Export/webhook patterns if applicable
4. **Response Formats** - ALL response types with TypeScript interfaces
5. **Error Handling** - Error patterns with examples from actual code
6. **Testing Patterns** - How to test each component type (if tests exist)

### File 3: `architecture.md` (REQUIRED)

**Purpose:** System structure and flows
**Location:** `.claude/claude-md-refs/architecture.md`
**Target size:** 300-400 lines

**Must include these sections:**

1. **Package Dependency Graph** - ASCII diagram showing which packages depend on which
2. **Primary State Machine(s)** - ASCII diagram + transition table for each entity with states
3. **API Routes Table** - ALL routes with methods, handlers, descriptions
4. **Data Flow Diagram** - Request lifecycle from entry to response
5. **Storage Layout** - File/DB structure if applicable
6. **Key Subsystems** - 1 paragraph + key files for each major subsystem

### File 4: Update `CLAUDE.md`

Add imports for all created files:

```markdown
@.claude/claude-md-refs/development-guide.md
@.claude/claude-md-refs/architecture.md
@.claude/claude-md-refs/exports-reference.md
```

Add Quick Reference table:

```markdown
## Quick Documentation Reference

| Need Help With | See File |
|----------------|----------|
| Adding features | development-guide.md |
| Understanding system | architecture.md |
| Finding exports/APIs | exports-reference.md |
```

### File 5: Inject Behavioral Rules into `CLAUDE.md` (if missing)

Check if these sections already exist in `CLAUDE.md`. If they do NOT exist, append them:

```markdown
## Debugging Protocol
When debugging issues, ALWAYS read the relevant source code first before proposing solutions. Never guess at API flags, CLI options, or config formats — look them up. Systematically isolate root causes before attempting fixes. Do not try multiple workarounds in sequence without first understanding why the previous attempt failed.

## Task Completion
When a user gives multiple tasks in sequence, complete each one fully before moving to the next. Do not start tangential work. If a custom skill or command is referenced (e.g., /plan-enhanced, /update-agent-learnings), execute it as designed — do not reinterpret or skip its workflow.
```

**Detection:** Search CLAUDE.md for `## Debugging Protocol` and `## Task Completion`. Only inject sections that are missing. Do not duplicate if already present.

---

## Phase 3: Verification (MANDATORY)

Do NOT mark this skill complete until ALL checks pass.

### Check 1: Export Coverage (>90%)

```bash
# Count actual exports (adjust paths for project)
ACTUAL=$(grep -rh "^export" packages/*/src/index.ts 2>/dev/null | wc -l)

# Count documented exports (table rows in exports-reference.md)
DOCUMENTED=$(grep -c "^|" .claude/claude-md-refs/exports-reference.md 2>/dev/null || echo 0)

echo "Export coverage: $DOCUMENTED documented / $ACTUAL actual"
```

**FAIL if:** Coverage < 90%
**Action if fail:** Go back to Phase 1, find missing exports, add to exports-reference.md

### Check 2: Context Budget

```bash
# Count lines in each file
wc -l CLAUDE.md
wc -l .claude/claude-md-refs/*.md

# Calculate total
TOTAL=$(cat CLAUDE.md .claude/claude-md-refs/*.md 2>/dev/null | wc -l)
echo "Total lines: $TOTAL (max: 2500)"
```

**FAIL if:**
- CLAUDE.md > 1,000 lines
- Any single import file > 500 lines
- Total imports > 1,500 lines
- Grand total > 2,500 lines

**Action if fail:** Consolidate sections, convert prose to tables, use "reference by path" for long code examples

### Check 3: Required Sections

**In exports-reference.md:**
- [ ] Has table for EACH discovered package
- [ ] Has "Import Patterns" section with code examples
- [ ] Every table has Export, Type/Purpose columns

**In development-guide.md:**
- [ ] Has "Adding a New X" with numbered steps
- [ ] Has actual code templates (not just descriptions)
- [ ] Has response format TypeScript interfaces

**In architecture.md:**
- [ ] Has package dependency ASCII diagram
- [ ] Has at least one state machine diagram (if any stateful entities exist)
- [ ] Has API routes table with ALL routes
- [ ] Has data flow description

### Check 4: No Duplicates

Verify no information is duplicated between:
- CLAUDE.md and import files
- development-guide.md and architecture.md
- exports-reference.md and other files

**If duplicates found:** Remove from less-specific file, keep in most-specific file.

### Check 5: Behavioral Rules Injected

Verify that CLAUDE.md contains both behavioral rule sections:

```bash
grep -c "## Debugging Protocol" CLAUDE.md
grep -c "## Task Completion" CLAUDE.md
```

**FAIL if:** Either section is missing from CLAUDE.md
**Action if fail:** Append the missing section(s) to CLAUDE.md

### Check 6: AI Effectiveness Test

Ask yourself: "Can an AI agent now..."
- [ ] Find any exported function by searching exports-reference.md?
- [ ] Add a new feature by following development-guide.md step-by-step?
- [ ] Understand the system architecture by reading architecture.md?
- [ ] Know which file to read for any task from CLAUDE.md Quick Reference?

**If ANY answer is "no", the documentation is incomplete. Fix it.**

---

## Quality Checklist (Must Score 10/10)

Score yourself HONESTLY before completing:

### Export Coverage (0-2 points)
- [ ] **0 points:** <50% of exports documented
- [ ] **1 point:** 50-89% of exports documented
- [ ] **2 points:** >90% of exports documented in tables

### Implementation Guidance (0-2 points)
- [ ] **0 points:** Just describes what exists ("We have controllers")
- [ ] **1 point:** Shows file locations ("Controllers are in src/")
- [ ] **2 points:** Step-by-step guide with actual code templates

### State/Workflow Diagrams (0-2 points)
- [ ] **0 points:** No diagrams
- [ ] **1 point:** Lists states ("pending, active, completed")
- [ ] **2 points:** ASCII diagram + transition table + constraints

### API Surface (0-2 points)
- [ ] **0 points:** No route documentation
- [ ] **1 point:** Lists some routes
- [ ] **2 points:** Complete route table with methods, handlers, descriptions

### Context Efficiency (0-2 points)
- [ ] **0 points:** Over budget (>2,500 lines total)
- [ ] **1 point:** Within budget but has duplication
- [ ] **2 points:** Within budget, no duplication, tables over prose

**Total: 10/10 required to complete this skill**

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Skipping export discovery | Phase 1 is MANDATORY - do it first |
| Generic descriptions | Use actual code examples from the codebase |
| Missing exports-reference.md | This file is REQUIRED, not optional |
| State list without diagram | Add ASCII diagram + transition table |
| Over context budget | Convert prose to tables, reference by path |
| Duplicated information | Keep info in ONE file only |
| Self-assessing "good enough" | Use objective verification checks |

---

## Failure Modes

### Failure Mode 1: Skipping Discovery
**Symptom:** Writing docs immediately, missing 40%+ of exports
**Fix:** Phase 1 is MANDATORY. Complete inventory before writing ANY documentation.

### Failure Mode 2: Generic Templates
**Symptom:** Copy-pasting skill templates without actual project code
**Fix:** Every code example must come from the actual codebase. No placeholders.

### Failure Mode 3: Over Budget
**Symptom:** CLAUDE.md > 1000 lines, context bloat, AI performance degraded
**Fix:** Tables > prose, reference by path for code >30 lines, consolidate sections.

### Failure Mode 4: Self-Assessing "Good Enough"
**Symptom:** Marking complete at 70% coverage without running verification commands
**Fix:** Run ALL verification bash commands. Must pass ALL 6 checks objectively.

### Failure Mode 5: Missing Required Files
**Symptom:** Only updating development-guide.md, skipping other required files
**Fix:** ALL 3 files required: exports-reference.md, development-guide.md, architecture.md

### Failure Mode 6: No State Machines
**Symptom:** Listing states ("pending, active, decided") without visual diagram
**Fix:** Add ASCII diagram + transition table for every entity with states.

---

## Quick Workflow Summary

```
PHASE 1: DISCOVERY (Do not skip)
├── Find all package entry points
├── Extract ALL exports (types, functions, constants)
├── Find subpath exports
├── Find all TypeScript interfaces
├── Find all route handlers
└── Create export inventory document

PHASE 2: DOCUMENTATION (3 required files + behavioral rules)
├── CREATE exports-reference.md (>90% export coverage)
├── CREATE/UPDATE development-guide.md (step-by-step guides)
├── CREATE/UPDATE architecture.md (diagrams, routes, flows)
├── UPDATE CLAUDE.md (add @imports, keep <1000 lines)
└── INJECT behavioral rules into CLAUDE.md (if missing)
    ├── "## Debugging Protocol" section
    └── "## Task Completion" section

PHASE 3: VERIFICATION (All must pass)
├── Export coverage >90%
├── Context budget met (<2500 lines total)
├── All required sections present
├── No duplicates between files
├── Behavioral rules present in CLAUDE.md
└── AI effectiveness test passes

COMPLETE: Announce final quality score (must be 10/10)
```

---

## Completion Announcement

When done, announce:

```
Documentation update complete.

**Quality Score: X/10**
- Export Coverage: X/2 (Y% of Z exports documented)
- Implementation Guidance: X/2
- State/Workflow Diagrams: X/2
- API Surface: X/2
- Context Efficiency: X/2

**Files created/updated:**
- exports-reference.md: X lines
- development-guide.md: X lines
- architecture.md: X lines
- CLAUDE.md: X lines
- Total: X lines (within 2,500 budget)

**Verification passed:** All 5 checks complete.
```

---

## References (Optional)

For complex projects, create detailed reference docs in `.claude/skills/update-claude-md-after-install/references/`:

| Reference | Purpose |
|-----------|---------|
| `export-discovery-patterns.md` | Advanced grep/find patterns for different project types |
| `monorepo-strategies.md` | Handling 10+ packages efficiently |
| `legacy-codebase-tips.md` | Projects without TypeScript or modern tooling |
| `framework-specific-guides.md` | Laravel, Next.js, Express, etc. specifics |

**These are optional.** Only create if the project complexity warrants it.

---

_This skill ensures documentation enables AI agents to implement features correctly on the first attempt._
