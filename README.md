# dotAiAgent

Drop-in `.claude/` folder that gives [Claude Code](https://docs.anthropic.com/en/docs/claude-code) **26 specialized agents**, **23 workflow skills**, and **self-improving memory** across **13 tech stacks**.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg) ![Agents](https://img.shields.io/badge/agents-26-green) ![Skills](https://img.shields.io/badge/skills-23-green) ![Tech Stacks](https://img.shields.io/badge/tech_stacks-13-green)

<!-- placeholder for demo GIF -->

---

## The Problem

You've felt this:

**Domain amnesia** — Claude forgets your stack's conventions between sessions. You re-explain your ORM, your test runner, your deployment target — every single time.

**Workflow drift** — Without encoded processes, every commit message is a coin flip, every PR description is improvised, and security checks happen when you remember to ask.

**Knowledge decay** — You spend 20 minutes teaching Claude a critical pattern. Next session, it's gone. The lesson evaporated. You teach it again.

dotAiAgent solves all three with persistent, specialized, self-improving agents.

---

## What You Get

```
.claude/
├── agents/       # 13 builders + 13 reviewers (one pair per stack)
├── skills/       # 23 slash-command workflows
├── learnings/    # Auto-synced code patterns and behavioral rules
└── reviews/      # Persistent reviewer findings (bridge sessions)
src/
└── browse/       # Source for the browse skill (headless Chromium CLI)
```

| Category | Count | What It Does |
|----------|-------|--------------|
| **Builder Agents** | 13 | Write production code with deep stack-specific expertise |
| **Reviewer Agents** | 13 | Audit code against 10-category checklists per stack |
| **Workflow Skills** | 23 | Slash-command workflows for planning, building, reviewing, shipping |
| **Learnings System** | 3 skills | Self-improving knowledge that compounds across sessions |
| **Browse** | 40+ commands | Headless Chromium with ~100ms response times |

Every builder has a matching reviewer. Every workflow has quality gates. Every session makes the next one smarter.

---

## Supported Tech Stacks

Claude Code auto-selects the right agent based on your project's files.

| Stack | Key Technologies |
|-------|-----------------|
| **Python** | 3.12+, uv, ruff, pytest, Pydantic v2, structlog |
| **FastAPI** | Pydantic v2, SQLAlchemy 2.0, async DB, JWT auth |
| **Express.js** | TypeScript, middleware architecture, Bull queues, Pino |
| **Next.js** | 14/15, App Router, RSC, Server Actions, streaming |
| **React/Vite/Tailwind** | React 19, Vite, Tailwind CSS 3, TypeScript strict mode |
| **Laravel** | 12.x, Eloquent, multi-database, Horizon, queue systems |
| **Expo/React Native** | SDK 52+, file-based routing, New Architecture, EAS |
| **Node.js CLI** | Commander.js, inquirer, ora, Pino, cross-platform |
| **Go** | 1.22+, Chi, gRPC, sqlx, stdlib-first patterns |
| **Go CLI** | Cobra, Bubble Tea, Viper, lipgloss, GoReleaser |
| **AWS/DevOps** | CDK, CloudFormation, Terraform, serverless, CI/CD |
| **Docker** | Compose, multi-stage builds, orchestration, CI/CD |
| **iOS/macOS** | Swift 6.2, SwiftUI, SwiftData, Liquid Glass, SPM |

---

## How It Works

### Builder + Reviewer Pairs

Every tech stack has two agents: one builds, one reviews. The builder carries 680–1,800 lines of deep domain expertise — conventions, anti-patterns, framework idioms, production patterns. The reviewer runs a systematic 10-category audit and writes structured findings with severity, `file:line` references, and fix suggestions.

### Slash-Command Skills

Skills aren't just prompts — they're multi-step workflows with quality gates. `/commit` doesn't just write a message; it analyzes diffs, scans for secrets, checks types, and generates conventional commits. `/find-bugs` doesn't just look for bugs; it maps attack surfaces, runs a 9-category security checklist, and prioritizes findings by severity.

### Self-Improving Learnings

Three skills capture what worked and what failed after each session. Patterns propagate to all agents automatically. Session 50 is better than session 1 with zero manual configuration. Derived from 77k+ messages across 9k+ sessions.

### Persistent Review Handoff

Reviewers write findings to `.claude/reviews/` (e.g., `express-findings.md`). In the next session, the engineer agent reads those findings and implements fixes without repeating the review. Knowledge survives between sessions.

### Multi-Agent Parallelism

Multiple features can be built simultaneously — agents spawn in isolated git worktrees, each working independently. A merge expert consolidates the results.

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| **[Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)** | Requires Anthropic Pro, Team, or Enterprise plan |
| **Git** | For cloning the repo |
| **[Bun](https://bun.sh)** *(optional)* | Only needed if you want the browse skill. Install: `curl -fsSL https://bun.sh/install \| bash` |

**Platforms**: macOS, Linux. Windows via WSL.

---

## Installation

### Method 1: Symlink (recommended)

Shared across projects. Updates with `git pull`.

```bash
git clone https://github.com/CiprianSpiridon/dotAiAgent.git ~/.dotAiAgent

# Optional: build the browse skill (~10s, requires Bun)
cd ~/.dotAiAgent/src/browse && ./setup

# Link into your project
ln -s ~/.dotAiAgent/.claude /path/to/your/project/.claude
```

### Method 2: Copy

Project-specific, independent copy.

```bash
git clone https://github.com/CiprianSpiridon/dotAiAgent.git /tmp/dotAiAgent

# Optional: build the browse skill (~10s, requires Bun)
cd /tmp/dotAiAgent/src/browse && ./setup

# Copy into your project
cp -r /tmp/dotAiAgent/.claude/ /path/to/your/project/
```

### What `./setup` does

The setup script installs Bun dependencies, compiles the browse CLI binary to `.claude/skills/browse/browse` (~58MB, Bun `--compile`), and installs Playwright's Chromium. It's smart about rebuilds — only recompiles if source files or dependencies changed.

### Skipping browse

If you don't need web browsing capabilities, skip `./setup` entirely. All other agents and skills work without it.

### Verifying

Open Claude Code in your project directory and type `/start`. Claude should discover all skills and agents, identify your tech stack, and be ready to work.

### Updating

```bash
cd ~/.dotAiAgent && git pull

# If browse source changed:
cd src/browse && ./setup
```

---

## Getting Started — Your First 5 Minutes

### Step 1: Generate project-specific config

```
/update-claude-md-after-install
```

Scans your codebase and generates a `CLAUDE.md` tailored to your project's frameworks, structure, and conventions.

### Step 2: Discover your environment

```
/start
```

Discovers available skills and agents, identifies your tech stack, and sets the context for the session.

### Step 3: Make a change, then commit

```
/commit
```

Analyzes your diff, scans for accidentally committed secrets, validates types, and generates a conventional commit message.

### Step 4: Review your branch

```
/find-bugs
```

Maps your branch's attack surface, runs a 9-category security checklist, detects logic bugs, and delivers prioritized findings.

You now have the core loop. Explore the full reference below.

---

## Builder Agents (13)

Claude Code selects the right agent automatically based on task context. Each agent file contains 680–1,800 lines of deep domain expertise.

| Agent | Stack | Expertise |
|-------|-------|-----------|
| `python-senior-engineer` | Python 3.12+, uv, ruff, pytest | Pydantic v2, structlog, async patterns, modern tooling |
| `python-fastapi-senior-engineer` | FastAPI, Pydantic v2, SQLAlchemy 2.0 | Dependency injection, async DB, JWT auth, high-performance APIs |
| `express-senior-engineer` | Express.js, TypeScript, Node.js | Middleware architecture, RESTful APIs, Bull queues, Pino logging |
| `nextjs-senior-engineer` | Next.js 14/15, App Router, RSC | Server Components, Server Actions, streaming, caching strategies |
| `react-vite-tailwind-engineer` | React 19, Vite, Tailwind CSS 3 | Custom hooks, keyboard accessibility, TypeScript strict mode |
| `laravel-senior-engineer` | Laravel 12.x, PHP, Eloquent | Multi-database, queue systems, Horizon, caching strategies |
| `expo-react-native-engineer` | Expo SDK 52+, React Native | File-based routing, New Architecture, EAS Build/Update |
| `nodejs-cli-senior-engineer` | Commander.js, Pino, CLI patterns | TypeScript CLI, inquirer, ora, cross-platform tools |
| `go-senior-engineer` | Go 1.22+, Chi, gRPC, sqlx | HTTP servers, concurrency, microservices, stdlib-first patterns |
| `go-cli-senior-engineer` | Cobra, Bubble Tea, Viper, lipgloss | TUI apps, GoReleaser, cross-platform CLI tools |
| `devops-aws-senior-engineer` | AWS CDK, CloudFormation, Terraform | Cloud architecture, serverless, CI/CD, monitoring |
| `devops-docker-senior-engineer` | Docker, Compose, orchestration | Multi-stage builds, CI/CD pipelines, production containers |
| `ios-macos-senior-engineer` | Swift 6.2, SwiftUI, SwiftData | iOS 26+/macOS 26+, Swift Concurrency, Liquid Glass, SPM |

---

## Reviewer Agents (13)

Each reviewer audits code against **10 categories** tailored to its stack. Every finding includes severity (`CRITICAL`/`HIGH`/`MEDIUM`/`LOW`), `file:line` reference, and a fix suggestion. Findings persist to `.claude/reviews/`.

| Agent | Audit Categories |
|-------|-----------------|
| `python-senior-engineer-reviewer` | Type safety, packaging, Pydantic, testing, logging, async, security, structure, errors, performance |
| `python-fastapi-senior-engineer-reviewer` | DI, Pydantic models, DB patterns, auth/security, errors, middleware, testing, API design, performance, deployment |
| `express-senior-engineer-reviewer` | Middleware, errors, security, validation, DB, queues, logging, TypeScript, testing, performance |
| `nextjs-senior-engineer-reviewer` | RSC boundaries, data fetching, errors, security, performance, TypeScript, a11y, SEO, file conventions, caching |
| `react-vite-tailwind-engineer-reviewer` | Component architecture, hooks, errors, security, performance, TypeScript, a11y, Vite config, Tailwind, testing |
| `laravel-senior-engineer-reviewer` | Architecture, validation, security, Eloquent/DB, errors, queues/jobs, caching, testing, API design, config/deploy |
| `expo-react-native-engineer-reviewer` | Navigation, hooks/state, errors, security, performance, TypeScript, a11y, native APIs, EAS/deploy, testing |
| `nodejs-cli-senior-engineer-reviewer` | Command structure, errors, security, TypeScript, validation, logging, testing, config, cross-platform, packaging |
| `go-senior-engineer-reviewer` | Error handling, concurrency safety, HTTP patterns, DB patterns, security, testing, observability, API design, structure, performance |
| `go-cli-senior-engineer-reviewer` | Command structure, error handling, security, input validation, TUI patterns, config management, testing, logging, cross-platform, distribution |
| `devops-aws-senior-engineer-reviewer` | IAM, IaC, networking, encryption/secrets, monitoring, cost, HA, CI/CD, serverless, tagging/compliance |
| `devops-docker-senior-engineer-reviewer` | Dockerfile best practices, image security, multi-stage, Compose, networking, volumes, healthchecks, resources, CI/CD, production |
| `ios-macos-senior-engineer-reviewer` | Swift concurrency, SwiftUI patterns, SwiftData, architecture, error handling, security/privacy, accessibility, testing, performance, deployment |

---

## How Reviewer Findings Work

Every reviewer follows a 5-phase process:

1. **Discovery** — Map the project structure, read config files
2. **Deep Review** — Check all 10 categories (A through J)
3. **TodoWrite Output** — Each finding becomes a structured task with severity, `file:line`, and fix
4. **Summary** — Category-by-category breakdown with top 3 priorities
5. **Persist Findings** — Write to `.claude/reviews/<stack>-findings.md`

### Finding Format

```
[SEVERITY] Cat-X: Brief description

(a) Location: src/handler/user.go:42
(b) Issue: What's wrong and why it matters
(c) Fix: Concrete code change to resolve
(d) Related: Cross-references to other findings
```

| Severity | Meaning | Example |
|----------|---------|---------|
| **CRITICAL** | Security vulnerability or data loss risk | SQL injection, hardcoded secrets, command injection |
| **HIGH** | Bug or reliability issue in production | Goroutine leaks, unhandled errors, missing auth checks |
| **MEDIUM** | Code quality issue affecting maintainability | Missing validation, inconsistent error format |
| **LOW** | Improvement opportunity | Style inconsistency, missing type annotations |

### Cross-Session Handoff

```
Session 1: Review
  Reviewer agent runs 10-category audit
  → Findings written to .claude/reviews/<stack>-findings.md
  → Session ends

Session 2: Fix
  Engineer agent reads .claude/reviews/<stack>-findings.md
  → Implements fixes for each finding (CRITICAL first)
  → /commit + /create-pr
```

The `.claude/reviews/` directory is gitignored — findings are ephemeral per workspace, not committed to the repo.

---

## Skills (23)

Skills are multi-step workflows invoked via slash commands (`/skill-name`).

### Core Workflow

| Skill | Command | What It Does |
|-------|---------|-------------|
| **start** | `/start` | Session entry point — discovers project context, selects the right agent *(use at the beginning of every session)* |
| **commit** | `/commit` | Analyzes diffs, scans for secrets, runs type checks, generates conventional commit messages *(use after making changes)* |
| **create-pr** | `/create-pr` | Validates branch, generates PR body with summary and test plan, detects breaking changes *(use when ready to open a PR)* |

### Planning & Orchestration

| Skill | Command | What It Does |
|-------|---------|-------------|
| **plan-to-task-list-with-dag** | `/plan-to-task-list-with-dag` | Decomposes features into atomic tasks with dependency DAGs *(use before building complex features)* |
| **plan-founder-review** | `/plan-founder-review` | Technical review of a plan — verifies paths, audits risk, delivers APPROVE/REVISE/REJECT verdict *(use to validate a plan before execution)* |
| **run-parallel-agents-feature-build** | Auto | Orchestrates multiple builder agents in parallel across isolated worktrees *(triggered automatically when tasks are parallelizable)* |
| **run-parallel-agents-feature-debug** | Auto | Orchestrates multiple agents debugging independent issues simultaneously *(triggered automatically for multi-issue debugging)* |

### Git Operations

| Skill | Command | What It Does |
|-------|---------|-------------|
| **git-merge-expert** | `/git-merge-expert` | Safe branch merging with CI checks, backup tags, tiered conflict resolution, rollback strategies *(use when merging feature branches)* |
| **git-merge-expert-worktree** | `/git-merge-expert-worktree` | Worktree-native merging with full lifecycle management and abort-and-recreate for clean retries *(use for merging within worktree workflows)* |

### Code Quality & Security

| Skill | Command | What It Does |
|-------|---------|-------------|
| **find-bugs** | `/find-bugs` | Branch diff review — attack surface mapping, 9-category security checklist, logic bug detection *(use before PRs or after major changes)* |
| **branch-review-before-pr** | `/branch-review-before-pr` | Pre-landing gate — query safety, race conditions, trust boundary violations *(use as final check before creating a PR)* |
| **code-simplify** | `/code-simplify` | Refactors for clarity without behavior change — detects nesting, dead code, duplicates *(use to clean up after feature work)* |
| **ast-grep** | `/ast-grep` | Structural code search using AST patterns — finds code by meaning, not text *(use for precise refactoring across a codebase)* |

### Analysis & Estimation

| Skill | Command | What It Does |
|-------|---------|-------------|
| **cost-estimate** | `/cost-estimate` | Development cost report — LOC analysis, productivity rates, overhead multipliers, team costs, Claude ROI *(use for project scoping)* |
| **pr-retro** | `/pr-retro` | Pre-PR branch analysis — commit quality, code churn, test coverage, merge readiness verdict *(use for branch health checks)* |

### Design

| Skill | Command | What It Does |
|-------|---------|-------------|
| **frontend-design-ui-ux** | `/frontend-design-ui-ux` | Implementation-ready design specs — components, responsive rules, interactions, accessibility, tokens *(use before building UI features)* |

### Web Interaction

| Skill | Command | What It Does |
|-------|---------|-------------|
| **browse** | `/browse` | Persistent headless Chromium daemon — navigate, click, fill forms, capture screenshots, ~100ms/command *(use for web testing, scraping, verification)* |

### Self-Improving Learnings

| Skill | Command | What It Does |
|-------|---------|-------------|
| **update-agent-learnings** | `/update-agent-learnings` | Extracts code patterns from sessions, propagates to all relevant agent files *(use when you discover a reusable pattern)* |
| **update-skill-learnings** | `/update-skill-learnings` | Captures meta-patterns about skill design and effectiveness *(use after improving a skill)* |
| **update-claude-learnings** | `/update-claude-learnings` | Captures Claude Code behavioral rules, updates project CLAUDE.md *(use when you discover a behavioral rule)* |

### Setup & Configuration

| Skill | Command | What It Does |
|-------|---------|-------------|
| **update-claude-md-after-install** | `/update-claude-md-after-install` | Discovers project patterns, generates framework-specific CLAUDE.md *(use right after installation)* |
| **update-claude-md-after-install-monorepo** | `/update-claude-md-after-install-monorepo` | Generates per-package CLAUDE.md files for monorepos *(use for multi-package repos)* |
| **update-claude-settings** | `/update-claude-settings` | Audits and configures project settings and allowed commands *(use to set up permissions)* |

---

## Browse Skill

The browse skill gives Claude Code a persistent headless Chromium browser with 40+ commands. It's a compiled CLI binary — not an MCP server — so there's zero protocol overhead.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Claude Code                                                    │
│                                                                 │
│  "browse goto https://staging.myapp.com"                        │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────┐    HTTP POST     ┌──────────────┐                 │
│  │ browse   │ ──────────────── │ Bun HTTP     │                 │
│  │ CLI      │  localhost:9400  │ server       │                 │
│  │          │  Bearer token    │              │                 │
│  │ compiled │ ◄──────────────  │  Playwright  │──── Chromium    │
│  │ binary   │  plain text      │  API calls   │    (headless)   │
│  └──────────┘                  └──────────────┘                 │
│   ~1ms startup                  persistent daemon               │
│                                 auto-starts on first call       │
│                                 auto-stops after 30 min idle    │
└─────────────────────────────────────────────────────────────────┘
```

### Lifecycle

| Phase | What Happens | Latency |
|-------|-------------|---------|
| **First call** | CLI spawns the Bun HTTP server, which launches headless Chromium and writes a state file | ~3s |
| **Subsequent calls** | CLI reads state file, sends HTTP POST with bearer token, prints response | ~100-200ms |
| **Idle shutdown** | After 30 min with no commands, server shuts down and cleans up | Automatic |
| **Crash recovery** | CLI detects dead server on next call and starts a fresh one | ~3s |

### Key Commands

| Category | Commands | What For |
|----------|----------|----------|
| **Navigate** | `goto`, `back`, `forward`, `reload`, `url` | Get to a page |
| **Read** | `text`, `html`, `links`, `forms`, `accessibility` | Extract content |
| **Snapshot** | `snapshot [-i] [-c] [-C] [-d N] [-s sel]` | Get `@ref` labels for interaction |
| **Interact** | `click`, `fill`, `select`, `hover`, `type`, `press`, `scroll`, `wait` | Use the page |
| **Visual** | `screenshot`, `pdf`, `responsive` | Capture what Claude sees |
| **Inspect** | `js`, `eval`, `css`, `attrs`, `console`, `network`, `cookies`, `storage` | Debug and verify |
| **Tabs** | `tabs`, `tab`, `newtab`, `closetab` | Multi-page workflows |
| **Compare** | `diff <url1> <url2>` | Spot differences between environments |

### The Snapshot System

The browse skill's key innovation is ref-based element selection:

```
browse snapshot -i
```

Returns an accessibility tree with refs:

```
@e1 [heading] "Page Title" [level=1]
@e2 [button] "Submit"
@e3 [link] "More info"
```

Then interact using refs:

```
browse click @e3
browse fill @e2 "search term"
```

No CSS selectors to guess. No DOM IDs to hunt for. Just snapshot, read the refs, and interact.

Full documentation: [`src/browse/BROWSER.md`](src/browse/BROWSER.md)

---

## End-to-End Flows

### Feature Development

Use this when building a feature from scratch — the full plan-build-review-ship cycle.

```
/start
  │→ /plan-to-task-list-with-dag     Break feature into tasks
  │→ /plan-founder-review             Review plan before execution
  │→ Build (agent auto-selected)      Agent writes code for your stack
  │→ /find-bugs                       Security + logic review
  │→ /code-simplify                   Clean up without behavior change
  │→ /commit                          Conventional commit with analysis
  │→ /branch-review-before-pr         Pre-landing structural review
  │→ /create-pr                       PR with summary + test plan
```

### Parallel Feature Build

Use this when a feature decomposes into independent pieces that can be built simultaneously.

```
/start
  │→ /plan-to-task-list-with-dag      Decompose into parallel tasks
  │→ /plan-founder-review             Validate plan
  │→ run-parallel-agents-feature-build
  │     ├── Agent 1 (worktree A)       Frontend component
  │     ├── Agent 2 (worktree B)       API endpoint
  │     ├── Agent 3 (worktree C)       Database migration
  │     └── Agent 4 (worktree D)       Tests
  │→ /git-merge-expert                Merge worktrees, resolve conflicts
  │→ /commit + /create-pr
```

### Code Review Pipeline

Use this when a branch is ready and needs a thorough multi-pass review before merging.

```
Branch ready
  │→ /pr-retro                        Branch health + readiness verdict
  │→ /find-bugs                       Security checklist + logic bugs
  │→ /branch-review-before-pr         Structural issues (race conditions, query safety)
  │→ Stack-specific reviewer agent    10-category systematic audit
  │     └── Writes findings to .claude/reviews/<stack>-findings.md
  │→ /create-pr                       PR with all findings resolved
```

### Review-then-Fix (Cross-Session)

Use this when you want to review in one session and fix in another — findings survive between sessions.

```
Session 1: Review
  │→ Reviewer agent runs 10-category audit
  │→ Findings written to .claude/reviews/<stack>-findings.md
  │→ Session ends

Session 2: Fix
  │→ Engineer agent reads .claude/reviews/<stack>-findings.md
  │→ Implements fixes for each finding (CRITICAL first)
  │→ /commit + /create-pr
```

### Parallel Debugging

Use this when multiple independent test failures or bugs need fixing at once.

```
Multiple test failures
  │→ run-parallel-agents-feature-debug
  │     ├── Agent 1 → auth failure
  │     ├── Agent 2 → API failure
  │     └── Agent 3 → UI failure
  │→ Fixes consolidated + cross-checked
  │→ /commit
```

### Session Learning Cycle

Use this at the end of any session to capture insights for future sessions.

```
Session ends
  │→ Code pattern discovered?    → /update-agent-learnings  → all agents improved
  │→ Skill pattern discovered?   → /update-skill-learnings  → skill templates improved
  │→ Behavior rule discovered?   → /update-claude-learnings → CLAUDE.md updated
  │→ Next session starts smarter
```

---

## The Learnings System

| Without Learnings | With Learnings |
|-------------------|----------------|
| Same mistakes repeat across sessions | Mistakes become documented patterns to avoid |
| Best practices stay in one developer's head | Patterns propagate to all agents automatically |
| New sessions start from scratch | Every session benefits from all previous insights |

**Quick decision** — which skill captures your learning?

| What You Learned | Skill | Where It Propagates |
|------------------|-------|-------------------|
| A code pattern, convention, or anti-pattern | `/update-agent-learnings` | All relevant agent `.md` files |
| A meta-pattern about how skills should work | `/update-skill-learnings` | Central skill learnings reference |
| A behavioral rule for Claude Code itself | `/update-claude-learnings` | Project `CLAUDE.md` |

---

## Architecture

How the pieces relate:

```
Claude Code
  │
  ├── reads CLAUDE.md              Project-level behavior rules
  │
  ├── loads .claude/agents/        26 agent definitions (frontmatter + expertise)
  │     ├── *-senior-engineer.md        Builders — write code
  │     └── *-senior-engineer-reviewer.md  Reviewers — audit code
  │
  ├── loads .claude/skills/        23 skill workflows
  │     └── <skill>/
  │           ├── SKILL.md              Skill definition (frontmatter + steps)
  │           └── references/           Supporting docs, templates, examples
  │
  ├── reads .claude/learnings/     Accumulated patterns and rules
  │     └── agent-learnings.md          Cross-agent knowledge base
  │
  ├── reads .claude/reviews/       Persistent findings from reviewers
  │     └── <stack>-findings.md         Structured audit results
  │
  └── runs .claude/skills/browse/browse   Compiled Chromium CLI binary
```

### File Formats

**Agents** (`.claude/agents/*.md`): Markdown with YAML frontmatter (`name`, `description`, `tools`, `model`). Body contains personality, rules, patterns, and domain knowledge. Each file is 680–1,800 lines.

**Skills** (`.claude/skills/<name>/SKILL.md`): Markdown with YAML frontmatter (`name`, `description`). Body contains workflow steps, quality gates, and checklists. Optional `references/` directory for supporting materials.

**Learnings** (`.claude/learnings/`): Accumulated patterns extracted from sessions. Read by all agents to compound knowledge over time.

**Reviews** (`.claude/reviews/`): Structured findings from reviewer agents. Read by builder agents in subsequent sessions. Gitignored — ephemeral per workspace.

**Settings** (`settings.local.json`): Claude Code project settings — allowed commands, permissions, model preferences. Managed by `/update-claude-settings`.

---

## Quick Reference

| What You Want | Command |
|---------------|---------|
| Start a session | `/start` |
| Plan a feature | `/plan-to-task-list-with-dag` |
| Review my plan | `/plan-founder-review` |
| Find bugs in my branch | `/find-bugs` |
| Pre-PR structural review | `/branch-review-before-pr` |
| Simplify changed code | `/code-simplify` |
| Search code by structure | `/ast-grep` |
| Commit my changes | `/commit` |
| Create a pull request | `/create-pr` |
| Branch retrospective | `/pr-retro` |
| Estimate dev cost | `/cost-estimate` |
| Design a UI | `/frontend-design-ui-ux` |
| Browse a URL | `/browse` |
| Merge branches safely | `/git-merge-expert` |
| Merge in worktrees | `/git-merge-expert-worktree` |
| Save code patterns | `/update-agent-learnings` |
| Save skill patterns | `/update-skill-learnings` |
| Save behavioral rules | `/update-claude-learnings` |
| Generate CLAUDE.md | `/update-claude-md-after-install` |
| Generate monorepo docs | `/update-claude-md-after-install-monorepo` |
| Configure settings | `/update-claude-settings` |

---

## Customization

### Adding an Agent

Create `.claude/agents/{name}.md` with this structure:

```yaml
---
name: my-stack-senior-engineer
description: "Expert in My Stack..."
tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "Task"]
model: claude-sonnet-4-6
---
```

Then add sections for personality, rules, prefer/never lists, patterns, and domain knowledge.

### Adding a Reviewer

Create `.claude/agents/{name}-reviewer.md` following the same pattern. Reviewer agents define 10 audit categories (A through J) and write findings to `.claude/reviews/`.

### Adding a Skill

Create `.claude/skills/{name}/SKILL.md` with frontmatter (`name`, `description`) and workflow steps. Add a `references/` directory for supporting templates and documentation.

### Modifying Behavior

| What to Change | How |
|----------------|-----|
| Agent behavior | Edit the agent's `.md` file — Rules, Prefer/Never sections |
| Skill workflow | Edit the skill's `SKILL.md` — steps, gates, checklists |
| Global behavior | `/update-claude-learnings` to update CLAUDE.md |
| Code patterns | `/update-agent-learnings` after discovering patterns |

---

## FAQ

**Browse build fails?**
Check that [Bun](https://bun.sh) is installed and up to date. Try running `cd src/browse && bun install` manually, then `./setup` again.

**Agents don't appear in Claude Code?**
Verify that `.claude/agents/` exists at your project root and contains `.md` files. If using a symlink, check that it points to the correct location: `ls -la .claude`.

**Can I use only some agents?**
Yes. Delete any agent `.md` files you don't need from `.claude/agents/`. Each agent is independent.

**Windows support?**
Claude Code supports macOS, Linux, and Windows (via WSL). The browse skill is untested on native Windows.

**How do I remove dotAiAgent?**
Delete the `.claude/` directory from your project, or remove the symlink: `rm .claude`.

**Which Claude plan do I need?**
Claude Code requires an Anthropic Pro, Team, or Enterprise subscription.

**Does this work with other AI coding tools?**
No. dotAiAgent uses Claude Code's native `.claude/` directory convention. It's purpose-built for Claude Code.

---

## Contributing

### Adding a new tech stack

Create a matched pair: `{stack}-senior-engineer.md` (builder) and `{stack}-senior-engineer-reviewer.md` (reviewer). Follow the patterns in existing agents for structure, frontmatter, and depth.

### Adding a skill

Create `.claude/skills/{name}/SKILL.md`. Study existing skills — especially their quality gates, verification steps, and `references/` directories — to match the quality bar.

### Improving existing agents

Agent files are designed to evolve. Add patterns to the relevant sections, update anti-pattern lists, and refine domain knowledge. Use `/update-agent-learnings` to propagate patterns automatically.

### Browse development

See [`src/browse/BROWSER.md`](src/browse/BROWSER.md) for architecture, development setup, testing, and how to add new commands.

### Issues

Report bugs and request features via [GitHub Issues](https://github.com/CiprianSpiridon/dotAiAgent/issues).

---

## License

MIT
