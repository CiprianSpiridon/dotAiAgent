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

## Step 2.5: Analyze Monorepo Structure (If Detected)

**Gate: Monorepo analysis complete before proceeding to Step 3.**

If `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, or `"workspaces"` in package.json exists, perform deep monorepo analysis:

### Action 0: Detect Package Manager and Workspace Config

**Detect package manager:**
- Check for `pnpm-lock.yaml` → pnpm
- Check for `yarn.lock` → yarn
- Check for `package-lock.json` → npm
- Check for `bun.lockb` → bun

**Read workspace configuration:**
- pnpm: Read `pnpm-workspace.yaml`, extract `"packages"` array
- yarn/npm: Read root `package.json`, extract `"workspaces"` array
- Lerna: Read `lerna.json`, extract `"packages"` array

**Example workspace patterns:**
- `["packages/*", "apps/*"]` → search `packages/` and `apps/` directories
- `["libs/**"]` → search all subdirectories under `libs/`

**Determine filter flag based on package manager:**
- pnpm → `--filter`
- yarn (v2+) → `workspace`
- yarn (v1) → `--scope`
- npm → `--workspace=`
- Lerna → `--scope`

### Action 1: Map Workspace Packages

Use Glob to find all package.json files in workspace directories:

```bash
Glob: packages/*/package.json apps/*/package.json
```

For each package.json found:
1. **Read the file** to extract the package `name`
2. **Note its directory path** relative to project root
3. **Identify package type:**
   - In `apps/` → application package
   - In `packages/` → library package
   - Has `private: true` → internal/shared package

### Action 2: Build Dependency Graph

For each workspace package, analyze dependencies:

1. **Read** its `dependencies` and `devDependencies` sections
2. **Filter** to only OTHER workspace packages (exclude external npm packages)
3. **Record the relationship**: "Package A depends on Package B"

**How to identify workspace packages:**
- Package names starting with workspace scope (e.g., `@company/*`, `@project/*`)
- Package names matching other discovered workspace package names

**Example (will vary by project):**
```
{package-b} ({package-b-path}) depends on:
  - {package-a} ({package-a-path}) ← workspace dependency

Result: {package-b-short-name} must be built AFTER {package-a-short-name}
```

**Actual detection example:**
If analyzing a project with `@mycompany/api` depending on `@mycompany/shared`:
```
@mycompany/api (packages/api) depends on:
  - @mycompany/shared (packages/shared) ← workspace dependency

Result: api must be built AFTER shared
```

### Action 3: Determine Build Order (Topological Sort)

Using the dependency graph, determine the order packages must be built:

1. **Layer 0 (Leaf nodes):** Packages with NO workspace dependencies
   - These can be built first

2. **Layer 1:** Packages depending ONLY on Layer 0
   - These can be built second

3. **Layer 2:** Packages depending on Layer 0 and/or Layer 1
   - These can be built third

4. Continue until all packages are ordered

**Example Build Order (will vary by project):**
```
Layer 0: {packages-with-no-deps} (no workspace dependencies)
Layer 1: {packages-depending-on-layer-0} (depend only on Layer 0)
Layer 2: {packages-depending-on-previous-layers} (depend on earlier layers)
```

**Actual project example:**
If analyzing a project with `@mycompany/shared`, `@mycompany/api` (depends on shared), `@mycompany/web` (depends on api):
```
Layer 0: @mycompany/shared (no workspace deps)
Layer 1: @mycompany/api (depends on shared)
Layer 2: @mycompany/web (depends on api)
```

### Action 4: Document Analysis Results

Create a structured summary for use in rule generation:

**Template:**
```
Monorepo Structure Analysis:
  Workspace Type: {package-manager} workspaces
  Total Packages: {count}
    - Libraries: {library-count}
    - Apps: {app-count}

  Build Order:
    1. {layer-0-packages}
    2. {layer-1-packages} (depends on layer 0)
    3. {layer-2-packages} (depends on previous layers)

  Critical Dependencies:
    - {dependency-descriptions}
```

**Example for a detected project:**
If analyzing a project with yarn workspaces:
```
Monorepo Structure Analysis:
  Workspace Type: yarn workspaces
  Total Packages: 4
    - Libraries: 2 (shared, utils)
    - Apps: 2 (api, web)

  Build Order:
    1. @acme/shared, @acme/utils
    2. @acme/api (depends on shared, utils)
    3. @acme/web (depends on api)

  Critical Dependencies:
    - API requires shared/dist output
    - Web imports types from API and shared
```

**This analysis will be used in Step 5 to generate build ordering precondition rules.**

## Step 2.6: Analyze Package Scripts

**Gate: Script analysis complete before proceeding to Step 3.**

Parse the root `package.json` to extract actual commands and tools used in the project.

### Action 1: Read and Parse Scripts Section

```bash
Read: package.json
```

From the `scripts` section, identify these standard commands:

| Script Name Pattern | Purpose | Common Names |
|---------------------|---------|--------------|
| test* | Run tests | test, test:run, test:ci, test:watch |
| build* | Build/compile | build, build:all, compile, bundle |
| lint* | Linting | lint, lint:check, lint:fix, typecheck |
| format* | Formatting | format, fmt, prettier, format:check |
| dev*, start* | Development | dev, start, watch, serve |

**Example for a detected project:**
```json
{
  "scripts": {
    "test": "jest --coverage",
    "build": "yarn workspaces run build",
    "build:api": "yarn workspace @mycompany/api build",
    "lint": "eslint .",
    "format": "prettier --write .",
    "dev": "yarn workspaces foreach -p run dev"
  }
}
```

**Extracted:**
- test_command: `jest --coverage`
- build_command: `yarn workspaces run build`
- lint_command: `eslint .`
- format_command: `prettier --write .`
- dev_command: `yarn workspaces foreach -p run dev`

### Action 2: Extract Tools from Commands

From each command string, identify the primary tool being invoked:

| Command | Primary Tool | Tool Type |
|---------|-------------|-----------|
| `vitest` | vitest | test runner |
| `jest --coverage` | jest | test runner |
| `pnpm -r build` | pnpm | package manager |
| `tsc --noEmit` | tsc | TypeScript compiler |
| `prettier --write` | prettier | formatter |
| `eslint .` | eslint | linter |
| `tsup src/index.ts` | tsup | bundler |
| `vite build` | vite | bundler |

**Tool extraction pattern:**
- First word of command (before space or flag)
- For `pnpm`/`npm`/`yarn` followed by script name, note it's a package manager
- For chained commands (`&&`), extract all tools

### Action 3: Detect Workspace/Monorepo Commands

Check if commands use workspace-specific flags that indicate monorepo operations:

| Pattern | Indicates | Example |
|---------|-----------|---------|
| `pnpm -r` or `pnpm --recursive` | All packages | `pnpm -r build` |
| `pnpm --filter @scope/pkg` | Specific package | `pnpm --filter @myapp/shared build` |
| `yarn workspaces foreach` | Yarn workspaces | `yarn workspaces foreach run test` |
| `lerna run` | Lerna monorepo | `lerna run build` |
| `nx run` | Nx monorepo | `nx run myapp:build` |

**Mark these commands for special handling** - they need auto-approval rules that work across workspace boundaries.

### Action 4: Document Detected Tools

```
Package Scripts Analysis:
  Commands Detected:
    - test: vitest
    - build: pnpm (workspace command: pnpm -r)
    - lint: tsc (TypeScript type checking)
    - dev: pnpm (workspace command: pnpm -r --parallel)

  Tools Requiring Auto-Approval:
    - vitest (test runner)
    - pnpm (package manager + workspace orchestrator)
    - tsc (TypeScript compiler)
    - tsup (if found in package-specific builds)
    - vite (if found in web-ui builds)

  Workspace-Aware Commands:
    - build (pnpm -r) - runs across all packages
    - dev (pnpm -r --parallel) - parallel development mode
```

**These tools will be auto-approved in Step 5.**

### Action 5: Detect Project-Specific Testing Patterns

**Purpose:** Identify project-specific tools used for testing, API calls, and development workflows.

#### Pattern 1: CLI Execution (Node.js Projects)

Check if project has a CLI package that can be executed directly:

```bash
# Check for CLI package with bin entry
Read: apps/cli/package.json apps/*/package.json

# Look for "bin" field in package.json
```

**If found:**
- Extract bin path from "bin" field (e.g., `./dist/index.js`, `./build/cli.js`)
- Extract package directory path (e.g., `apps/cli`, `packages/console`, `tools/cli`)
- Combine to form execution pattern: `node {package-path}/{dist-dir}/{entry-file}`
- **Generate auto-approval** for: `node {cli-path}`

**Detection steps:**
1. Find packages with names containing "cli", "command", "cmd", "console", "hooks"
2. Read their package.json files
3. Extract "bin" field (object or string) or "main" field
4. Extract output directory from "files" array or build config
5. Form pattern: `node {package-dir}/{output-dir}`

**Example for detected project:**
If found a CLI package at `packages/console/package.json`:
```json
{
  "name": "@company/console",
  "bin": {
    "console": "./dist/cli.js"
  }
}
```

Generate:
```
Detected CLI Execution Pattern:
  - Package: @company/console
  - Path: packages/console/dist/cli.js
  - Pattern: node packages/console/dist
  - Purpose: Testing CLI commands, running console operations
```

#### Pattern 2: API Testing (HTTP Server Projects)

Check for server/API files that suggest HTTP endpoints:

```bash
# Check for server files
Glob: **/server.ts **/api-server.ts **/ui-server.ts apps/*/src/*server.ts

# Check for API route files
Glob: **/routes/**/*.ts **/api/**/*.ts
```

**If found:**
- **Generate auto-approval** for: `curl`
- **Rationale:** API testing requires HTTP client

**Example:**
```
Detected API Server Pattern:
  - File: apps/cli/src/ui-server.ts
  - Tool needed: curl (for endpoint testing)
```

#### Pattern 3: Hook Testing (Claude Code Hooks Projects)

Check for hooks/ directory suggesting hook handler testing:

```bash
# Check for hooks directory
Glob: **/hooks/*.ts apps/*/src/hooks/*.ts

# Check for hook handler files
```

**If found:**
- **Generate auto-approval** for: `echo`
- **Rationale:** Hook testing requires piping JSON to handlers

**Example:**
```
Detected Hook Handlers Pattern:
  - Directory: apps/cli/src/hooks/
  - Handlers: pre-tool.ts, post-tool.ts, permission.ts
  - Tool needed: echo (for piping test JSON)
```

#### Action 6: Document Project-Specific Tools

**Template:**
```
Project-Specific Testing Patterns Detected:

CLI Execution:
  - node {cli-package-path}/{dist-dir} (for testing CLI commands)

API Testing:
  - curl (HTTP client for API endpoint testing)

Hook Testing:
  - echo (for piping JSON to hook handlers)
```

**Example for detected project:**
If found CLI at `packages/console`, API server, and hooks directory:
```
Project-Specific Testing Patterns Detected:

CLI Execution:
  - node packages/console/build (for testing CLI commands)

API Testing:
  - curl (HTTP client for endpoint testing at /api/*)

Hook Testing:
  - echo (for piping JSON to hook handlers in src/hooks/)
```

**These project-specific tools will be auto-approved in Step 5.3.**

## Step 2.7: Identify Critical Files

**Gate: Critical files identified before proceeding to Step 3.**

Scan for files that should trigger warnings when edited due to their high impact on the project.

### High-Impact File Patterns

Use Glob to search for these critical file categories:

#### Schema Files (Database/API Schemas)
```bash
Glob: **/schema.prisma **/schema.ts **/drizzle.config.ts **/graphql/schema.graphql **/*.graphql
```

**Why critical:** Schema changes cascade to all consumers, affect validation, can break APIs.

#### Core Type Definitions
```bash
Glob: **/types/*.ts **/types.ts **/*.d.ts
```

**Why critical:** Type changes can break imports across packages, require export updates.

**For monorepos:** Type changes in shared packages affect all consuming packages.

#### Build Configuration
```bash
Glob: tsconfig*.json vite.config.* webpack.config.* rollup.config.* turbo.json
```

**Why critical:** Build config changes affect compilation, can break builds, impact all packages.

#### Database Migrations
```bash
Glob: **/migrations/**/*.sql **/migrations/**/*.ts **/migrations/**/*.js
```

**Why critical:** Migrations are irreversible in production, require careful review.

#### API Contracts
```bash
Glob: **/api/**/*.ts **/routes/**/*.ts **/openapi.yaml **/swagger.json
```

**Why critical:** API changes can break clients, need versioning consideration.

### Action: Document Critical Files by Category

For each critical file found, determine:
1. **Path** - Exact file path
2. **Category** - schema, types, config, migrations, api
3. **Impact scope** - Which packages/apps are affected
4. **Warning message** - What to tell the user

**Example Documentation (will vary by project):**

For a project with Prisma ORM, shared types package, and build configs:
```
Critical Files Detected:

Schema Files:
  - prisma/schema.prisma
    Impact: All database queries (shared → api → web)
    Warning: "Changing database schema affects all API layers. Run prisma generate after changes and update migrations."

Type Definitions:
  - packages/shared/src/types/index.ts
    Impact: API and web packages import these types
    Warning: "Type changes may break dependent packages. Update exports in index.ts and rebuild api, web."

  - packages/shared/src/contracts/api.ts
    Impact: API contract between frontend and backend
    Warning: "API contract changes affect clients. Consider versioning and deprecation strategy."

Build Configuration:
  - tsconfig.base.json
    Impact: All packages (monorepo shared config)
    Warning: "Base tsconfig changes affect all packages. Test builds across shared, api, and web."

  - turbo.json
    Impact: Build pipeline and caching
    Warning: "Turbo config changes affect build order and caching. Verify pipeline execution."

Migration Files:
  - prisma/migrations/**/*.sql
    Impact: Production database schema
    Warning: "Migrations are irreversible in production. Review carefully before applying."
```

**These critical files will get warning preconditions in Step 5.**

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

## Reference: High-Quality Rules Example

**Before generating rules, understand what project-specific, high-quality configuration looks like.**

The existing `.ulpi/hooks/rules.yml` in this project (334 lines) demonstrates deep customization:

### Monorepo-Specific Rules
- `build-core-before-cli` (precondition) - Enforces build order based on dependency graph
- `build-before-ui-server` (precondition) - Ensures CLI is built before running UI server
- `auto-approve-pnpm` (permission) - Auto-approves workspace package manager

### Critical File Warnings
- `schema-change-warning` (precondition) - Warns when editing `schema.ts` (Zod schemas)
- `type-change-warning` (precondition) - Warns when editing `types/` (requires export updates)
- `template-validation` (precondition) - Validates YAML when editing bundled templates

### Project-Specific Auto-Approvals
- `auto-approve-{build-tool}` - Detected build tools (tsup, vite, webpack, etc.)
- `auto-approve-{test-tool}` - Detected test runners (vitest, jest, pytest, etc.)
- `auto-approve-node-cli` - Auto-approve `node {cli-dist-path}` for testing detected CLI
- `auto-approve-curl` - For testing API endpoints (if server files detected)
- `auto-approve-echo` - For piping JSON to hook handlers (if hooks/ directory detected)

### Testing Pipelines
- `full-rebuild` pipeline: {layer-0-packages} → {layer-1-packages} → {layer-2-packages} (with per-step timeouts)
- `test-hook-handlers` pipeline: rebuild detected CLI + pipe mock JSON to test handler (if hooks/ detected)

### Key Characteristics
- **Architecture-aware:** Understands package dependencies and build order
- **Domain-specific:** Knows about schema files, types, templates (project-specific concerns)
- **Workflow-optimized:** Auto-approves tools actually used, blocks what's dangerous
- **Guidance-integrated:** Uses `skill` field to inject code-review checklist for complex changes

**Your goal:** Generate rules with THIS level of specificity and project awareness.

## Step 5: Generate Project-Specific Rules

**Gate: Complete, rich rules generated before proceeding to Step 6.**

Using ALL analysis from Steps 2, 2.5, 2.6, and 2.7, generate comprehensive, project-specific rules.yml.

**Assembly Strategy:** Build rules in layers, from universal safety to project-specific optimizations.

### 5.1: Universal Rules (Always Include)

Start with foundational safety rules that apply to ANY project:

#### Header Section

```yaml
# Hooks By ULPI — Generated Configuration
# Stack: {language} / {framework} / {package_manager}
# Generated: {timestamp}
# Analysis: {monorepo yes/no}, {package_count} packages, {critical_files_count} critical files

project:
  name: "{project_name}"
  runtime: "{runtime}"
  package_manager: "{package_manager}"
```

#### Universal Preconditions

```yaml
preconditions:
  read-before-write:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    requires_read: true
    message: "Read {file_path} before editing it."
    locked: true
    priority: 10
```

#### Universal Permissions (Safety Blocks)

```yaml
permissions:
  # Auto-approve safe operations
  auto-approve-reads:
    enabled: true
    trigger: PermissionRequest
    matcher: "Read|Glob|Grep"
    decision: allow
    priority: 100

  # Block dangerous git operations
  no-force-push:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "git push --force"
    decision: deny
    message: "Force push blocked. Use --force-with-lease if absolutely necessary."
    locked: true
    priority: 1

  # Block direct push to main/master
  no-push-main:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "git push origin main|git push origin master"
    decision: deny
    message: "Direct push to main blocked. Create a feature branch and PR."
    locked: false
    priority: 10

  # Block dangerous rm -rf patterns
  no-rm-rf-root:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "rm -rf /|rm -rf ~|rm -rf ."
    decision: deny
    message: "Dangerous rm -rf blocked."
    locked: true
    priority: 1

  # Protect secrets
  block-env-files:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: ".env*"
    decision: deny
    message: "Cannot edit .env files directly. Use .env.example as template."
    priority: 50

  # Protect build artifacts
  block-node-modules:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "node_modules/**"
    decision: deny
    message: "Do not edit node_modules. Modify source package instead."
    locked: true
    priority: 1

  block-dist:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "**/dist/**"
    decision: deny
    message: "Do not edit dist/ files. Edit source and rebuild."
    locked: true
    priority: 1
```

### 5.2: Monorepo Build Ordering Rules (If Applicable)

**Condition:** Only generate if Step 2.5 detected a monorepo AND built a dependency graph.

For each package that has workspace dependencies, generate a **precondition rule**:

#### Rule Template

```yaml
preconditions:
  build-{dependency-name}-before-{package-name}:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "{package_manager} --filter {package-name} build"
    message: "Build {dependency-name} first: `{package_manager} --filter {dependency-name} build` — {package-name} depends on {dependency-name}'s dist output."
    priority: 50
```

#### Variable Substitution

- `{dependency-name}` → The package being depended upon (e.g., `@myapp/shared`)
- `{package-name}` → The package with the dependency (e.g., `@myapp/api`)
- `{package_manager}` → Detected package manager (pnpm, yarn, npm)

#### Examples for Different Package Managers

**For pnpm workspaces:**
```yaml
preconditions:
  build-shared-before-api:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "pnpm --filter @myapp/api build"
    message: "Build @myapp/shared first: `pnpm --filter @myapp/shared build` — API depends on shared's dist output."
    priority: 50
```

**For yarn workspaces:**
```yaml
preconditions:
  build-utils-before-web:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "yarn workspace @company/web build"
    message: "Build @company/utils first: `yarn workspace @company/utils build` — Web depends on utils."
    priority: 50
```

**For npm workspaces:**
```yaml
preconditions:
  build-core-before-app:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "npm run build --workspace=app"
    message: "Build core first: `npm run build --workspace=core` — App depends on core."
    priority: 50
```

**For Lerna:**
```yaml
preconditions:
  build-common-before-services:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "lerna run build --scope @org/service-*"
    message: "Build @org/common first: `lerna run build --scope @org/common` — Services depend on common."
    priority: 50
```

**Generate one rule per dependency relationship found in Step 2.5.**

### 5.3: Script-Based Auto-Approvals (Project Tools)

**Source:** Tools detected in Step 2.6 script analysis.

For each tool extracted from package.json scripts, generate a **permission rule** that auto-approves it:

#### Rule Template

```yaml
permissions:
  auto-approve-{tool}:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "{tool}"
    decision: allow
    message: "Auto-approved {tool} command."
    priority: 100
```

#### Common Tools to Auto-Approve

Based on script analysis, these tools are typically found:

| Tool | When to Include | Command Pattern |
|------|-----------------|-----------------|
| `vitest` | If test command uses vitest | `vitest` |
| `jest` | If test command uses jest | `jest` |
| `pnpm` | If package manager is pnpm | `pnpm` |
| `yarn` | If package manager is yarn | `yarn` |
| `npm` | If package manager is npm | `npm` |
| `tsc` | If lint/build uses tsc | `tsc` |
| `tsup` | If build uses tsup | `tsup` |
| `vite` | If build/dev uses vite | `vite` |
| `prettier` | If format uses prettier | `prettier` |
| `eslint` | If lint uses eslint | `eslint` |

#### Example for Different Tool Stacks

**For a Jest + Webpack + Yarn project:**
```yaml
permissions:
  auto-approve-yarn:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "yarn"
    decision: allow
    message: "Auto-approved yarn command."
    priority: 100

  auto-approve-jest:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "jest"
    decision: allow
    message: "Auto-approved test execution."
    priority: 100

  auto-approve-webpack:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "webpack"
    decision: allow
    message: "Auto-approved webpack build."
    priority: 100

  auto-approve-eslint:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "eslint"
    decision: allow
    message: "Auto-approved linting."
    priority: 100
```

**For a Python project with pytest + ruff:**
```yaml
permissions:
  auto-approve-poetry:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "poetry"
    decision: allow
    message: "Auto-approved poetry command."
    priority: 100

  auto-approve-pytest:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "pytest"
    decision: allow
    message: "Auto-approved test execution."
    priority: 100

  auto-approve-ruff:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "ruff"
    decision: allow
    message: "Auto-approved ruff linting."
    priority: 100
```

**Include rules for ALL tools found in Step 2.6 analysis.**

#### Project-Specific Tool Auto-Approvals

**Source:** Project-specific patterns detected in Step 2.6, Action 5.

##### CLI Execution Pattern

If CLI package detected with bin entry:

```yaml
permissions:
  auto-approve-node-cli:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "node {cli-dist-path}"
    decision: allow
    message: "Auto-approved CLI execution for testing."
    priority: 100
```

**Example for detected project:**
If CLI detected at `packages/console/dist/cli.js`:
```yaml
permissions:
  auto-approve-node-cli:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "node packages/console/dist"
    decision: allow
    message: "Auto-approved CLI execution for testing."
    priority: 100
```

If CLI detected at `tools/command/build/index.js`:
```yaml
permissions:
  auto-approve-node-cli:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "node tools/command/build"
    decision: allow
    message: "Auto-approved CLI execution for testing."
    priority: 100
```

##### API Testing Pattern

If server files detected:

```yaml
permissions:
  auto-approve-curl:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "curl"
    decision: allow
    message: "Auto-approved curl for API testing."
    priority: 100
```

##### Hook Testing Pattern

If hooks/ directory detected:

```yaml
permissions:
  auto-approve-echo-pipe:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "echo"
    decision: allow
    message: "Auto-approved echo (for piping test JSON to hooks)."
    priority: 100
```

### 5.4: Critical File Warnings (Architecture Protection)

**Source:** Critical files identified in Step 2.7.

For each critical file detected, generate a **precondition rule** that warns before edits:

#### Rule Template

```yaml
preconditions:
  warn-{file-category}-{safe-name}:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "{file-path}"
    message: "{warning-message}"
    priority: 60
```

#### Warning Messages by Category

| Category | Warning Template |
|----------|------------------|
| Schema | "Changing {file} affects validation/database across {scope}. Ensure backwards compatibility." |
| Types | "Type changes in {file} may break imports. Update exports in index.ts if adding new types." |
| Config | "Build config changes affect {scope}. Test builds across {packages}." |
| Migrations | "Database migration detected. Review carefully - migrations are irreversible in production." |
| API | "API changes in {file} may break clients. Consider versioning and deprecation." |

#### Examples for Different Project Types

**For a Prisma + TypeScript monorepo:**
```yaml
preconditions:
  warn-schema-changes:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "prisma/schema.prisma"
    message: "Changing database schema affects all API layers. Run prisma generate and update migrations after changes."
    skill: "code-review-checklist"
    priority: 60

  warn-type-changes:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "packages/shared/src/types/*.ts"
    message: "Type changes may break api and web packages. Update exports in index.ts and rebuild dependents."
    priority: 60

  warn-api-contract-changes:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "packages/shared/src/contracts/*.ts"
    message: "API contract changes affect frontend and backend. Consider versioning strategy."
    priority: 70

  warn-tsconfig-changes:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "tsconfig.base.json"
    message: "Base tsconfig changes affect all packages. Test builds across shared, api, and web."
    priority: 60
```

**For a Django project:**
```yaml
preconditions:
  warn-model-changes:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "**/models.py"
    message: "Model changes require migrations. Run python manage.py makemigrations after editing."
    skill: "code-review-checklist"
    priority: 60

  warn-settings-changes:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "settings.py"
    message: "Settings changes affect entire application. Review security implications."
    priority: 70

  warn-migration-edits:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: "**/migrations/*.py"
    message: "Editing existing migrations is dangerous. Create a new migration instead."
    priority: 80
```

**Optional enhancement:** Add `skill` field pointing to relevant guidance (e.g., `"code-review-checklist"`).

### 5.5: Stack-Specific Rules (Language/Framework)

Include rules for detected stack (from Step 2):

#### For TypeScript Projects
```yaml
permissions:
  auto-approve-tsc:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "tsc"
    decision: allow
    message: "Auto-approved TypeScript compiler."
    priority: 100

postconditions:
  typecheck-on-save:
    enabled: false
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "**/*.ts"
    run: "tsc --noEmit"
    timeout: 30000
    message: "Running TypeScript checks..."
    priority: 90
```

#### For Next.js Projects
```yaml
permissions:
  auto-approve-next:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "next"
    decision: allow
    priority: 100

  block-next-cache:
    enabled: true
    trigger: PreToolUse
    matcher: "Write|Edit"
    file_pattern: ".next/**"
    decision: deny
    message: "Do not edit .next/ cache. Run next build to regenerate."
    locked: true
    priority: 1
```

#### For Python Projects
```yaml
permissions:
  auto-approve-python-tools:
    enabled: true
    trigger: PermissionRequest
    matcher: Bash
    command_pattern: "python|pip|poetry|uv|pytest|ruff|black"
    decision: allow
    priority: 100
```

**Use detected framework/language from Step 2 to select appropriate rules.**

### 5.6: Assembly Order & Output

Generate the final rules.yml in this precise order:

1. **Header** (project metadata + analysis summary)
2. **Preconditions section:**
   - Universal (read-before-write)
   - Monorepo build ordering (if applicable)
   - Critical file warnings
   - Stack-specific preconditions
3. **Permissions section:**
   - Universal safety blocks (no-force-push, block-env, block-node_modules, block-dist)
   - Universal auto-approvals (reads)
   - Package manager auto-approval
   - Script-based tool auto-approvals
   - Stack-specific auto-approvals
4. **Postconditions section** (disabled by default):
   - Test/lint/build runners
5. **Pipelines section** (if monorepo):
   - Multi-step workflows (rebuild, test, deploy)

#### Expected Output Quality

For a monorepo TypeScript project with detected tools:
- **Simple project:** 60-100 lines (universal + stack rules)
- **Monorepo project:** 150-250 lines (+ build ordering + critical files)
- **Complex monorepo:** 250-350 lines (+ pipelines + detailed warnings)

**Target:** Match or exceed the quality of the reference example (334 lines for ulpi-hooks).

### 5.7: Generate Pipelines (Monorepo Workflows)

**Condition:** Only generate if monorepo detected in Step 2.5.

Pipelines orchestrate multi-step workflows common in monorepos. Generate these standard pipelines:

#### Pipeline 1: Full Rebuild (Build Order Enforcement)

**Purpose:** Enforce correct build order across all packages when running `pnpm -r build`.

**Template:**
```yaml
pipelines:
  full-rebuild:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "{package_manager} -r build"
    steps:
      - name: "Build {layer-0-package}"
        run: "{package_manager} --filter {layer-0-package} build"
        timeout: 30000
      - name: "Build {layer-1-package}"
        run: "{package_manager} --filter {layer-1-package} build"
        timeout: 30000
      - name: "Build {layer-2-package}"
        run: "{package_manager} --filter {layer-2-package} build"
        timeout: 60000
    on_failure: block
```

**Variable Substitution:**
- Use build order from Step 2.5
- Create one step per package in dependency order
- Adjust timeout based on package type (apps get 60s, libs get 30s)

**Examples for Different Package Managers:**

**For pnpm workspaces:**
```yaml
pipelines:
  full-rebuild:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "pnpm -r build"
    steps:
      - name: "Build shared"
        run: "pnpm --filter @myapp/shared build"
        timeout: 30000
      - name: "Build api"
        run: "pnpm --filter @myapp/api build"
        timeout: 30000
      - name: "Build web"
        run: "pnpm --filter @myapp/web build"
        timeout: 60000
    on_failure: block
```

**For yarn workspaces:**
```yaml
pipelines:
  full-rebuild:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "yarn workspaces run build"
    steps:
      - name: "Build utils"
        run: "yarn workspace @company/utils build"
        timeout: 30000
      - name: "Build api"
        run: "yarn workspace @company/api build"
        timeout: 30000
      - name: "Build frontend"
        run: "yarn workspace @company/frontend build"
        timeout: 60000
    on_failure: block
```

**For npm workspaces:**
```yaml
pipelines:
  full-rebuild:
    enabled: true
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "npm run build --workspaces"
    steps:
      - name: "Build core"
        run: "npm run build --workspace=packages/core"
        timeout: 30000
      - name: "Build app"
        run: "npm run build --workspace=apps/app"
        timeout: 60000
    on_failure: block
```

#### Pipeline 2: Pre-Commit Quality Checks

**Purpose:** Run quality gates before commits (disabled by default to avoid friction).

**Template:**
```yaml
pipelines:
  pre-commit-checks:
    enabled: false
    trigger: PreToolUse
    matcher: Bash
    command_pattern: "git commit"
    steps:
      - name: "Type check"
        run: "{lint_command}"
        timeout: 30000
      - name: "Run tests"
        run: "{test_command}"
        timeout: 60000
    on_failure: warn
```

**Condition:** Only generate if both `lint_command` and `test_command` detected in Step 2.6.

#### Pipeline 3: Hook Handler Testing (CLI Projects)

**Purpose:** Rebuild CLI and test hook handlers after editing hook files.

**Condition:** Only generate if CLI package exists AND has hooks/ directory.

**Template:**
```yaml
pipelines:
  test-hook-handlers:
    enabled: true
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "{cli-package-path}/src/hooks/*.ts"
    steps:
      - name: "Rebuild CLI"
        run: "{package_manager} --filter {cli-package-name} build"
        timeout: 30000
      - name: "Test pre-tool handler"
        run: "echo '{\"session_id\":\"test\",\"cwd\":\"/tmp\",\"hook_event_name\":\"PreToolUse\",\"tool_name\":\"Read\"}' | node {cli-dist-path}/index.js pre-tool"
        timeout: 10000
    on_failure: warn
```

**Detection Logic:**
```bash
# Check for hooks/ directories in packages
Glob: **/hooks/*.ts **/src/hooks/*.ts apps/*/src/hooks/*.ts packages/*/src/hooks/*.ts

# If found, extract CLI package name and dist path from package.json
```

**Example for detected project:**

If found CLI at `packages/cli/src/hooks/` with pnpm:
```yaml
pipelines:
  test-hook-handlers:
    enabled: true
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "packages/cli/src/hooks/*.ts"
    steps:
      - name: "Rebuild CLI"
        run: "pnpm --filter @company/cli build"
        timeout: 30000
      - name: "Test pre-tool handler"
        run: "echo '{\"session_id\":\"test\",\"cwd\":\"/tmp\",\"hook_event_name\":\"PreToolUse\",\"tool_name\":\"Read\"}' | node packages/cli/dist/index.js pre-tool"
        timeout: 10000
    on_failure: warn
```

If found hooks at `tools/hooks/src/handlers/` with yarn:
```yaml
pipelines:
  test-hook-handlers:
    enabled: true
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "tools/hooks/src/handlers/*.ts"
    steps:
      - name: "Rebuild hooks"
        run: "yarn workspace hooks build"
        timeout: 30000
      - name: "Test pre-tool handler"
        run: "echo '{\"session_id\":\"test\",\"cwd\":\"/tmp\",\"hook_event_name\":\"PreToolUse\",\"tool_name\":\"Read\"}' | node tools/hooks/build/main.js pre-tool"
        timeout: 10000
    on_failure: warn
```

#### Pipeline 4: API Endpoint Testing (UI Server Projects)

**Purpose:** Rebuild and test API endpoints after editing UI server.

**Condition:** Only generate if ui-server.ts or api-server.ts file exists.

**Template:**
```yaml
pipelines:
  test-api-endpoints:
    enabled: false
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "{server-file-path}"
    steps:
      - name: "Rebuild {package}"
        run: "{package_manager} --filter {package-name} build"
        timeout: 30000
      - name: "Test rules endpoint"
        run: "curl -s http://localhost:{port}/api/rules | head -c 200"
        timeout: 5000
    on_failure: warn
```

**Detection Logic:**
```bash
# Check for server files
Glob: **/ui-server.ts **/api-server.ts **/server.ts apps/*/src/server.ts packages/*/src/server.ts
```

**Example for detected project:**

If found `apps/api/src/server.ts` with Express on port 3000:
```yaml
pipelines:
  test-api-endpoints:
    enabled: false
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "apps/api/src/server.ts"
    steps:
      - name: "Rebuild API"
        run: "yarn workspace @company/api build"
        timeout: 30000
      - name: "Test health endpoint"
        run: "curl -s http://localhost:3000/health | head -c 200"
        timeout: 5000
    on_failure: warn
```

If found `packages/backend/src/api-server.ts` with Fastify on port 8080:
```yaml
pipelines:
  test-api-endpoints:
    enabled: false
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "packages/backend/src/api-server.ts"
    steps:
      - name: "Rebuild backend"
        run: "pnpm --filter backend build"
        timeout: 30000
      - name: "Test status endpoint"
        run: "curl -s http://localhost:8080/api/status | head -c 200"
        timeout: 5000
    on_failure: warn
```

**Note:** Port detection is heuristic. Common defaults: 3000 (Express), 8080 (Spring Boot/Fastify), 5000 (Flask), 9800 (custom). User can adjust after generation.

### 5.8: Generate PostToolUse Reminders (Smart Rebuild Detection)

**Purpose:** Remind to rebuild packages after editing their source files.

For each package in monorepo, generate a PostToolUse reminder:

#### Template

```yaml
postconditions:
  rebuild-after-{package-name}-change:
    enabled: false
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "{package-src-path}/**/*.ts"
    run: "echo '{package-name} changed — run: {package_manager} --filter {package-name} build'"
    timeout: 5000
    block_on_failure: false
```

**Examples for Different Package Managers:**

**For pnpm workspaces:**
```yaml
postconditions:
  rebuild-after-shared-change:
    enabled: false
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "packages/shared/src/**/*.ts"
    run: "echo 'Shared changed — run: pnpm --filter @myapp/shared build'"
    timeout: 5000
    block_on_failure: false

  rebuild-after-api-change:
    enabled: false
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "packages/api/src/**/*.ts"
    run: "echo 'API changed — run: pnpm --filter @myapp/api build'"
    timeout: 5000
    block_on_failure: false
```

**For yarn workspaces:**
```yaml
postconditions:
  rebuild-after-utils-change:
    enabled: false
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "libs/utils/src/**/*.ts"
    run: "echo 'Utils changed — run: yarn workspace @company/utils build'"
    timeout: 5000
    block_on_failure: false

  rebuild-after-web-change:
    enabled: false
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "apps/web/src/**/*.tsx"
    run: "echo 'Web changed — run: yarn workspace @company/web build'"
    timeout: 5000
    block_on_failure: false
```

**For npm workspaces:**
```yaml
postconditions:
  rebuild-after-core-change:
    enabled: false
    trigger: PostToolUse
    matcher: "Write|Edit"
    file_pattern: "packages/core/src/**/*.js"
    run: "echo 'Core changed — run: npm run build --workspace=packages/core'"
    timeout: 5000
    block_on_failure: false
```

**Generate one postcondition per package** from Step 2.5 analysis.

### 5.9: Assembly Order & Output (Updated)

Generate the final rules.yml in this precise order:

1. **Header** (project metadata + analysis summary)
2. **Preconditions section:**
   - Universal (read-before-write)
   - Monorepo build ordering (if applicable)
   - Critical file warnings
   - Stack-specific preconditions
3. **Permissions section:**
   - Universal safety blocks (no-force-push, **no-push-main**, **no-rm-rf**, block-env, block-node_modules, block-dist)
   - Universal auto-approvals (reads)
   - Package manager auto-approval
   - Script-based tool auto-approvals
   - **Project-specific tool approvals** (curl, echo, node)
   - Stack-specific auto-approvals
4. **Postconditions section** (disabled by default):
   - Rebuild reminders per package
   - Test/lint/build runners
5. **Pipelines section** (if monorepo):
   - full-rebuild (build order enforcement)
   - pre-commit-checks (quality gates)
   - test-hook-handlers (if CLI with hooks/ exists)
   - test-api-endpoints (if server file exists)

#### Expected Output Quality (Updated)

For a monorepo TypeScript project with detected tools:
- **Simple project:** 60-100 lines (universal + stack rules)
- **Monorepo project:** 180-280 lines (+ build ordering + critical files + pipelines)
- **Complex monorepo:** 280-350+ lines (+ all pipelines + postconditions + project-specific tools)

**Target:** Match or exceed the quality of the reference example (334 lines for ulpi-hooks).

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
- **0 points:** Only checked file existence (tsconfig.json → TypeScript)
- **1 point:** Parsed some configs but missed relationships (found packages but not dependencies)
- **2 points:** Full analysis — parsed configs + built dependency graphs + extracted scripts + identified critical files

### User Confirmation (0-2 points)
- **0 points:** Generated without showing detected stack
- **1 point:** Showed detection but didn't wait for confirmation
- **2 points:** Full detection shown, user confirmed before generation

### Rule Coverage (0-2 points)
- **0 points:** Only universal rules (generic, template-based)
- **1 point:** Universal + stack templates (no project-specific customization)
- **2 points:** Complete coverage: universal + stack + monorepo build ordering + script-based auto-approvals + critical file warnings

### Safety Rules (0-2 points)
- **0 points:** Missing critical blocks (force-push, env files)
- **1 point:** Some safety rules but incomplete
- **2 points:** All dangerous operations blocked

### Output Quality (0-2 points)
- **0 points:** Invalid YAML or missing required fields
- **1 point:** Valid but poorly organized
- **2 points:** Clean, well-commented, properly structured YAML

**Minimum passing score: 8/10**

### Generalization Check (Required)

Before completing, verify the generated rules are project-specific (not hardcoded):
- [ ] No hardcoded package names (used detected package names from Step 2.5)
- [ ] No hardcoded paths (used detected workspace directories)
- [ ] No hardcoded commands (used detected package manager and filter flags)
- [ ] Build ordering rules match actual dependency graph
- [ ] Auto-approval rules match tools found in package.json scripts
- [ ] Pipeline steps use detected package names and paths
- [ ] Critical file warnings use detected file paths from project scan

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

STEP 2.5: ANALYZE MONOREPO (if detected)
├── Map workspace packages
├── Build dependency graph
├── Determine build order
└── Gate: Monorepo analysis complete

STEP 2.6: ANALYZE SCRIPTS
├── Parse package.json scripts
├── Extract tools from commands
├── Identify workspace commands
└── Gate: Script analysis complete

STEP 2.7: IDENTIFY CRITICAL FILES
├── Find schema files
├── Find type definitions
├── Find build configs
├── Find migrations
└── Gate: Critical files identified

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
├── 5.1: Universal rules (safety foundation)
├── 5.2: Monorepo build ordering (if applicable)
├── 5.3: Script-based auto-approvals (detected tools)
├── 5.4: Critical file warnings (architecture protection)
├── 5.5: Stack-specific rules (language/framework)
├── 5.6: Assemble in correct order
└── Gate: Complete, project-specific rules generated (150-300+ lines)

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
