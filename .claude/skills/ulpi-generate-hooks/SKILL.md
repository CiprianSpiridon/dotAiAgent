---
name: ulpi-generate-hooks
description: Use when the user asks to generate ULPI Hooks configuration for a project. Detects language, framework, package manager, and tooling to create optimized rules.yml with preconditions, permissions, postconditions, and pipelines. Invoke via /ulpi-generate-hooks or when user says "generate hooks", "create rules.yml", "setup ulpi-hooks", "configure hooks".
---

<EXTREMELY-IMPORTANT>
Before generating ANY rules.yml configuration, you **ABSOLUTELY MUST**:

1. Verify the target directory exists
2. Check for existing `.ulpi/hooks/rules.yml` (ask before overwriting)
3. Detect at least one technology signal (language, framework, or package manager)
4. Show detected stack to user for confirmation

**Generating without verification = wrong rules, overwritten configs, broken hooks**

This is not optional. Every generation requires disciplined verification.
</EXTREMELY-IMPORTANT>

# Generate ULPI Hooks Configuration

## MANDATORY FIRST RESPONSE PROTOCOL

Before generating ANY configuration, you **MUST** complete this checklist:

1. ☐ Verify target directory exists
2. ☐ Check for existing rules.yml
3. ☐ Detect language (tsconfig.json, pyproject.toml, go.mod, etc.)
4. ☐ Detect framework (next.config.*, artisan, manage.py, etc.)
5. ☐ Detect package manager (pnpm-lock.yaml, yarn.lock, etc.)
6. ☐ Show detected stack to user
7. ☐ Get user confirmation before generating
8. ☐ Announce: "Generating ULPI Hooks for [language]/[framework]/[package_manager]"

**Generating WITHOUT completing this checklist = wrong or harmful rules.**

## Purpose

This skill generates configuration for **Hooks By ULPI**, a tool that:
- Auto-approves safe operations (reads, package manager commands)
- Blocks dangerous commands (force push, database wipes, env file edits)
- Enforces best practices (read-before-write)
- Runs postconditions (lint, test, generate) after file changes

**Output:** `.ulpi/hooks/rules.yml` configuration file

**Does NOT:** Install ULPI Hooks, run the generated rules, or modify existing configurations without confirmation.

## Overview

Analyze a project directory, detect the technology stack, and generate a complete `rules.yml` configuration for Hooks By ULPI. Creates rules that auto-approve safe operations, block dangerous commands, and enforce best practices.

## When to Use

- User says "generate hooks", "create rules.yml", "/ulpi-generate-hooks"
- User says "setup ulpi-hooks", "configure hooks for this project"
- $ARGUMENTS contains a path (e.g., `/ulpi-generate-hooks /path/to/project`)

**Never generate unprompted.** Only when explicitly requested.

## Step 1: Determine Target Directory

**Gate: Valid directory confirmed before proceeding to Step 2.**

If $ARGUMENTS has a path, use it. Otherwise use current working directory.

Verify the directory exists before proceeding. If not found, stop and inform the user.

Check for existing `.ulpi/hooks/rules.yml`:
- If found, ask user: merge, overwrite, or abort?
- Never overwrite without explicit confirmation

## Step 2: Detect Technology Stack

**Gate: Stack detected before proceeding to Step 3.**

Scan for indicator files in priority order:

### Language Detection

| Signal | Language |
|--------|----------|
| `tsconfig.json` | TypeScript |
| `package.json` (no tsconfig) | JavaScript |
| `pyproject.toml`, `requirements.txt` | Python |
| `go.mod` | Go |
| `Cargo.toml` | Rust |
| `composer.json` | PHP |
| `Gemfile` | Ruby |
| `pom.xml`, `build.gradle` | Java |
| `*.csproj`, `*.sln` | C# |
| `mix.exs` | Elixir |

### Framework Detection

| Signal | Framework |
|--------|-----------|
| `next.config.*` | Next.js |
| `nuxt.config.*` | Nuxt |
| `angular.json` | Angular |
| `svelte.config.*` | SvelteKit |
| `nest-cli.json` | NestJS |
| `artisan` | Laravel |
| `manage.py` + django | Django |
| `fastapi` in deps | FastAPI |
| `actix-web` in Cargo.toml | Actix |
| `gin` in go.mod | Gin |

### Package Manager Detection

| Signal | Package Manager |
|--------|-----------------|
| `pnpm-lock.yaml` | pnpm |
| `yarn.lock` | yarn |
| `package-lock.json` | npm |
| `bun.lockb` | bun |
| `poetry.lock` | poetry |
| `uv.lock` | uv |
| `Cargo.lock` | cargo |
| `composer.lock` | composer |
| `Gemfile.lock` | bundler |

### Tooling Detection

| Signal | Tool | Type |
|--------|------|------|
| `vitest.config.*` | Vitest | test |
| `jest.config.*` | Jest | test |
| `pytest.ini` | pytest | test |
| `.eslintrc*` | ESLint | lint |
| `.prettierrc*` | Prettier | format |
| `biome.json` | Biome | lint+format |
| `prisma/schema.prisma` | Prisma | ORM |
| `drizzle.config.*` | Drizzle | ORM |

### Monorepo Detection

| Signal | Structure |
|--------|-----------|
| `turbo.json` | Turborepo |
| `lerna.json` | Lerna |
| `pnpm-workspace.yaml` | pnpm workspaces |
| `"workspaces"` in package.json | Yarn/npm workspaces |

For monorepos: Generate root-level rules that apply to all packages.

## Step 3: Confirm with User

**Gate: User approved before proceeding to Step 4.**

Display the detected stack to the user:

```
Detected Stack:
  Language:        [language]
  Framework:       [framework]
  Package Manager: [package_manager]
  Test Runner:     [test_runner]
  Linter:          [linter]
  ORM:             [orm]
  Monorepo:        [yes/no]

Proceed with generation? [Y/n]
```

Wait for user confirmation before generating rules.

## Step 4: Extract Commands from Config

**Gate: Commands extracted before proceeding to Step 5.**

For Node.js projects, read package.json scripts to identify:
- `test_command` (from "test" script)
- `build_command` (from "build" script)
- `lint_command` (from "lint" script)
- `format_command` (from "format" script)

For Python projects, check pyproject.toml for tool configurations.

For Rust projects, use standard cargo commands.

## Step 5: Generate rules.yml

**Gate: Complete rules generated before proceeding to Step 6.**

Create `.ulpi/hooks/rules.yml` with these sections:

### Header

```yaml
# Hooks By ULPI — Generated Configuration
# Stack: {language} / {framework} / {package_manager}
# Generated: {timestamp}

project:
  name: "{project_name}"
  runtime: "{runtime}"
  package_manager: "{package_manager}"
```

### Universal Preconditions (Always Include)

```yaml
preconditions:
  read-before-write:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit|MultiEdit"
    requires_read: true
    message: "Read {file_path} before editing it."
    locked: true
    priority: 10
```

### Universal Permissions (Always Include)

```yaml
permissions:
  auto-approve-reads:
    enabled: true
    trigger: PermissionRequest
    matcher: "Read|LS|Glob|Grep"
    decision: allow
    priority: 100

  no-force-push:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "git push --force"
    decision: deny
    message: "Force push blocked. Use --force-with-lease."
    locked: true
    priority: 1

  block-env-files:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: ".env*"
    decision: deny
    message: "Cannot edit .env files directly."
    priority: 50

  block-node-modules:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "node_modules/**"
    decision: deny
    locked: true
    priority: 1

  block-dist:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "**/dist/**"
    decision: deny
    locked: true
    priority: 1
```

### Language-Specific Rules

Add based on detected language. See `references/language-rules.md`.

### Framework-Specific Rules

Add based on detected framework. See `references/framework-rules.md`.

## Step 6: Write Configuration

**Gate: File written before proceeding to Step 7.**

Create the `.ulpi/hooks/` directory if it doesn't exist.

Write the generated YAML to `rules.yml`.

Verify the file was written successfully.

## Step 7: Report Results

**Gate: Results reported before marking complete.**

Report to the user:
- Stack detected
- Rules created (counts)
- File location
- Suggested next steps

## Pre-Generation Checklist

Before generating, verify:
- [ ] Target directory exists and is accessible
- [ ] User confirmed target if not current directory
- [ ] No existing rules.yml OR user approved overwrite
- [ ] At least one technology detected
- [ ] Detection results shown to user for confirmation

## Error Handling

| Situation | Action |
|-----------|--------|
| Directory not found | Stop and inform user |
| No tech stack detected | Generate minimal universal rules only |
| Multiple frameworks | Ask user which is primary |
| Existing rules.yml | Ask: merge, overwrite, or abort |
| Conflicting signals | Prefer more specific (framework > language) |

## About Postconditions

Postconditions are **disabled by default** because they run automatically after file changes and may:
- Slow down workflows
- Produce unexpected side effects
- Conflict with user's preferred workflow

**To enable:** User should manually set `enabled: true` for desired postconditions after reviewing them.

## Safety Rules

| Rule | Reason |
|------|--------|
| Always include read-before-write | Prevents editing files without reading first |
| Always block force push | Prevents history destruction |
| Always block .env edits | Protects secrets |
| Always block node_modules/dist | Build artifacts should not be edited |
| Auto-approve reads | Safe operations should not prompt |
| Auto-approve detected package manager | Reduces friction |
| Never overwrite without asking | Preserves existing configuration |
| Always verify directory exists | Prevents errors |

## Quick Reference: Command Detection

```
package.json scripts:
  "test"   → test_command
  "build"  → build_command
  "lint"   → lint_command
  "format" → format_command
  "dev"    → auto-approve permission

pyproject.toml:
  [tool.pytest]     → pytest
  [tool.ruff]       → ruff
  [tool.black]      → black

Cargo.toml:
  cargo test        → test_command
  cargo build       → build_command
  cargo clippy      → lint_command
```

---

## Quality Checklist (Must Score 8/10)

Score yourself honestly before marking generation complete:

### Detection Accuracy (0-2 points)
- **0 points:** Guessed technology without file verification
- **1 point:** Detected some signals but missed others
- **2 points:** Verified all signals, detection matches reality

### User Confirmation (0-2 points)
- **0 points:** Generated without showing detected stack
- **1 point:** Showed detection but didn't wait for confirmation
- **2 points:** Full detection shown, user confirmed before generation

### Rule Coverage (0-2 points)
- **0 points:** Missing universal rules (read-before-write, block-env)
- **1 point:** Universal rules present but missing language/framework rules
- **2 points:** Complete coverage: universal + language + framework + tooling

### Safety Rules (0-2 points)
- **0 points:** Missing critical blocks (force-push, env files)
- **1 point:** Some safety rules but incomplete
- **2 points:** All dangerous operations blocked

### Output Quality (0-2 points)
- **0 points:** Invalid YAML or missing required fields
- **1 point:** Valid but poorly organized
- **2 points:** Clean, well-commented, properly structured YAML

**Minimum passing score: 8/10**

---

## Common Rationalizations (All Wrong)

These are excuses. Don't fall for them:

- **"The directory is obvious"** → STILL verify it exists
- **"I know this is a Node.js project"** → STILL detect from config files
- **"There's no existing rules.yml"** → STILL check before generating
- **"The user wants it fast"** → STILL show detected stack first
- **"These are standard rules"** → STILL customize for detected stack
- **"Postconditions are disabled anyway"** → STILL generate them correctly

---

## Failure Modes

### Failure Mode 1: Wrong Technology Detection

**Symptom:** Generated Python rules for a TypeScript project
**Fix:** Always verify with config files, not assumptions

### Failure Mode 2: Overwritten Existing Config

**Symptom:** User's custom rules.yml was replaced without warning
**Fix:** Always check for existing file, ask before overwriting

### Failure Mode 3: Missing Critical Safety Rules

**Symptom:** Agent force-pushed after generation (rule wasn't blocked)
**Fix:** Always include universal safety rules regardless of stack

### Failure Mode 4: Invalid YAML Generated

**Symptom:** ULPI Hooks fails to parse rules.yml
**Fix:** Validate YAML structure before writing

---

## Quick Workflow Summary

```
STEP 1: DETERMINE TARGET
├── Parse $ARGUMENTS for path
├── Default to current directory
├── Verify directory exists
├── Check for existing rules.yml
└── Gate: Valid directory confirmed

STEP 2: DETECT TECHNOLOGY
├── Scan for language signals
├── Scan for framework signals
├── Scan for package manager signals
├── Scan for tooling (test, lint, ORM)
├── Check for monorepo structure
└── Gate: Stack detected

STEP 3: CONFIRM WITH USER
├── Display detected stack
├── Wait for user confirmation
└── Gate: User approved

STEP 4: EXTRACT COMMANDS
├── Read package.json scripts
├── Read pyproject.toml tools
├── Identify test/build/lint commands
└── Gate: Commands extracted

STEP 5: GENERATE RULES
├── Start with universal rules
├── Add language-specific rules
├── Add framework-specific rules
├── Add tooling rules
└── Gate: Complete rules generated

STEP 6: WRITE CONFIGURATION
├── Create .ulpi/hooks/ directory
├── Write rules.yml
├── Verify file written
└── Gate: File written

STEP 7: REPORT RESULTS
├── Show stack summary
├── Show rule counts
├── Show file location
├── Suggest next steps
└── Gate: Complete
```

---

## Completion Announcement

When generation is complete, announce:

```
ULPI Hooks configuration generated.

**Quality Score: X/10**
- Detection Accuracy: X/2
- User Confirmation: X/2
- Rule Coverage: X/2
- Safety Rules: X/2
- Output Quality: X/2

**Stack Detected:**
- Language: [language]
- Framework: [framework]
- Package Manager: [package_manager]
- Test Runner: [test_runner]
- Linter: [linter]

**Rules Generated:**
- Preconditions: [count]
- Permissions: [count]
- Postconditions: [count]

**Output:** .ulpi/hooks/rules.yml

**Next steps:**
Run `ulpi-hooks rules validate` to verify configuration.
```

---

## Integration with Other Skills

The `ulpi-generate-hooks` skill integrates with:

- **`start`** — Detects ULPI Hooks configuration needs during project setup
- **`commit`** — Generated rules can auto-approve git operations
- **`create-pr`** — Generated rules can auto-approve PR creation commands

**Workflow Chain:**

```
New project or directory
       │
       ▼
ulpi-generate-hooks skill (this skill)
       │
       ▼
rules.yml created
       │
       ▼
Hooks By ULPI uses rules during development
```

---

## Resources

See `references/language-rules.md` for language-specific rule templates.
See `references/framework-rules.md` for framework-specific rule templates.
