---
name: git-worktrees
description: Use when starting feature work that needs isolation from current workspace, working on multiple branches simultaneously, reviewing PRs without stashing, performing hotfixes while preserving feature work, running parallel Claude Code agents on separate branches, or managing multiple working directories from a single git repository. Covers worktree creation, environment setup, cleanup, directory strategies, and integration with parallel agent workflows.
---

<EXTREMELY-IMPORTANT>
Before creating ANY worktree, you **ABSOLUTELY MUST**:

1. Verify you're inside a git repository (git rev-parse --git-dir)
2. Check existing worktrees (git worktree list)
3. Confirm target branch is NOT already checked out
4. Verify parent directory exists and has sufficient disk space
5. Plan for cleanup after work is complete

**Creating worktrees without verification = branch conflicts, orphaned directories, disk bloat**

This is not optional. Worktrees require disciplined lifecycle management.
</EXTREMELY-IMPORTANT>

# Git Worktrees

## MANDATORY FIRST RESPONSE PROTOCOL

Before creating ANY worktree, you **MUST** complete this checklist:

1. ☐ Verify inside git repository: `git rev-parse --show-toplevel`
2. ☐ List existing worktrees: `git worktree list`
3. ☐ Identify target branch/commit
4. ☐ Confirm branch is not already checked out elsewhere
5. ☐ Choose directory strategy (sibling vs dedicated folder)
6. ☐ Plan environment setup (.env, node_modules)
7. ☐ Announce: "Creating worktree for [purpose] at [path]"

**Creating worktrees WITHOUT completing this checklist = conflicts and orphaned state.**

## Overview

Git worktrees allow multiple working directories attached to the same repository. Each worktree has its own checked-out branch, index, and working tree, but all share the same `.git` history, remotes, and configuration.

**Core principle:** Use worktrees to eliminate context-switching overhead. Instead of stashing or committing WIP to switch branches, create a separate worktree and work in both simultaneously.

## When to Use This Skill

**Use when:**
- Working on a hotfix while keeping feature work untouched
- Reviewing a PR in a separate directory without disrupting current work
- Running tests or builds on one branch while coding on another
- Spinning up parallel Claude Code agents that each need their own branch/directory
- Comparing behavior across branches side-by-side
- Any situation where `git stash` + `git checkout` feels disruptive

**Do NOT use when:**
- Working on a single branch linearly (standard git workflow is fine)
- Only reading code from another branch (`git show branch:file` suffices)
- Repository is shallow-cloned with restricted fetch depth
- Disk space is severely constrained (each worktree duplicates the working tree)

## Core Workflow

Follow these 6 steps for any worktree operation.

### Step 1: Verify Prerequisites

**Gate: All pre-checks pass before proceeding to Step 2.**

```
Pre-creation checklist:
- [ ] Inside a git repository (git rev-parse --git-dir)
- [ ] Identified the project root (git rev-parse --show-toplevel)
- [ ] Checked existing worktrees (git worktree list)
- [ ] Target branch is NOT already checked out in another worktree
- [ ] Parent directory for the new worktree exists and is writable
```

```bash
# Quick verification
git rev-parse --show-toplevel && git worktree list
```

### Step 2: Choose a Directory Strategy

**Gate: Directory strategy selected before proceeding to Step 3.**

**Strategy A — Sibling directory (default, recommended):**

```
parent/
  myproject/              # main worktree (origin clone)
  myproject--hotfix/      # worktree for hotfix branch
  myproject--pr-42/       # worktree for PR review
```

Naming convention: `<project>--<branch-or-purpose>`

**Strategy B — Dedicated worktrees folder (for heavy worktree usage):**

```
parent/
  myproject/              # main worktree
  myproject-worktrees/
    hotfix/               # worktree
    pr-42/                # worktree
```

**Selection guidance:**
- Use Strategy A for ad-hoc, short-lived worktrees (hotfixes, PR reviews)
- Use Strategy B for long-running parallel development with many worktrees
- Never create worktrees inside the main project directory

### Step 3: Create the Worktree

**Gate: Worktree exists and branch is checked out before proceeding to Step 4.**

```bash
# From an existing remote branch
git worktree add ../myproject--feature origin/feature-branch

# Create a new branch based on origin/main
git worktree add -b hotfix/urgent ../myproject--hotfix origin/main

# Detached HEAD for read-only inspection (tag, release, specific commit)
git worktree add --detach ../myproject--release v2.0.0
```

See `references/worktree-commands.md` for complete flag reference.

### Step 4: Set Up the Worktree Environment

**Gate: Project builds or runs correctly before proceeding to Step 5.**

A new worktree has NO `node_modules`, NO `.env`, and NO gitignored config files.

```bash
# Copy environment files from main worktree
cp .env ../myproject--hotfix/.env
cp .env.local ../myproject--hotfix/.env.local  # if exists

# Install dependencies
cd ../myproject--hotfix
npm install --prefer-offline
```

```
Post-creation checklist:
- [ ] .env / .env.local copied from main worktree
- [ ] npm install completed successfully
- [ ] Any other gitignored config files copied
- [ ] Project builds or runs correctly
```

### Step 5: Do the Work

**Gate: Work complete and changes committed before proceeding to Step 6.**

Work normally. All git commands (commit, push, pull, log) work as usual. Changes in one worktree do NOT affect another worktree's staging area or working directory.

### Step 6: Clean Up

**Gate: Worktree removed and state verified before marking workflow complete.**

After merging or completing work:

```bash
# Return to main worktree
cd ../myproject

# Remove the worktree
git worktree remove ../myproject--hotfix

# Delete the branch if no longer needed
git branch -d hotfix/urgent

# If the directory was manually deleted instead, prune stale refs
git worktree prune
```

```
Cleanup checklist:
- [ ] All changes committed and pushed
- [ ] Branch merged (if applicable)
- [ ] git worktree remove <path> executed
- [ ] Branch deleted if no longer needed
- [ ] git worktree list shows only expected worktrees
```

### Step 7: Verification (MANDATORY)

After cleanup, verify complete lifecycle:

#### Check 1: Worktree Removed
- [ ] `git worktree list` does NOT show the removed worktree
- [ ] Directory no longer exists on disk

#### Check 2: Branch Handled
- [ ] Branch merged (if applicable)
- [ ] Branch deleted locally if no longer needed
- [ ] Branch pushed/PR created (if not merged yet)

#### Check 3: No Stale References
- [ ] `git worktree prune --dry-run` shows nothing to clean

#### Check 4: No Disk Bloat
- [ ] node_modules and build artifacts removed with worktree
- [ ] Disk space recovered

#### Check 5: Clean State
- [ ] Main worktree is in expected state
- [ ] No accidental changes to main worktree

**Gate:** Do NOT mark worktree workflow complete until all 5 checks pass.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `git worktree add <path> <branch>` | Create worktree from existing branch |
| `git worktree add -b <new> <path> [<start>]` | Create worktree with new branch |
| `git worktree add --detach <path> [<commit>]` | Create worktree at detached HEAD |
| `git worktree list` | List all worktrees |
| `git worktree list --porcelain` | Machine-readable list (for scripts) |
| `git worktree remove <path>` | Remove a worktree |
| `git worktree remove --force <path>` | Force remove (discards uncommitted changes) |
| `git worktree move <old> <new>` | Relocate a worktree |
| `git worktree prune` | Remove stale worktree references |
| `git worktree lock <path>` | Protect worktree from pruning/removal |
| `git worktree unlock <path>` | Remove prune protection |
| `git worktree repair` | Fix references after manual moves |

**Naming conventions:**
- `<project>--<branch>` for branch-based worktrees
- `<project>--pr-<number>` for PR reviews
- `<project>--<purpose>` for purpose-based (e.g., `myproject--testing`)

## What Is Shared vs. Isolated

**Shared across all worktrees** (single copy):
- `.git` directory (object database, refs, config)
- Commit history, all branches, remotes
- Git hooks in `.git/hooks/` (shared by default)
- Git config (`.git/config`)

**Isolated per worktree** (independent copy):
- Working directory (all files)
- Index / staging area
- HEAD (each worktree points to its own branch/commit)
- `node_modules/` (must install separately)
- Any gitignored files (`.env`, build output, caches)

**Key implication:** A commit made in any worktree is immediately visible to all worktrees (shared object database). But staged changes and working directory modifications are completely isolated.

## Integration with Claude Code

When spinning up parallel Claude Code agents, each agent needs its own worktree to avoid file conflicts.

### Pattern: Parallel Agent Worktrees

1. Identify independent tasks that can run in parallel
2. Create a worktree per agent with a dedicated branch:
   ```bash
   git worktree add -b feature/agent-1-task ../project--agent-1 origin/main
   git worktree add -b feature/agent-2-task ../project--agent-2 origin/main
   ```
3. Set up each worktree (copy `.env`, `npm install`)
4. Launch each agent with its worktree path as the working directory
5. After agents complete, merge branches sequentially from main worktree
6. Clean up worktrees and branches

### Safety Checks Before Agent Worktrees

```bash
# Check disk space
df -h .

# Check existing worktrees
git worktree list

# Verify target branch names are available
git branch --list "feature/*"
```

**Limits:** Max 5 concurrent worktrees for typical Node.js projects (`node_modules` is heavy). Use `npm install --prefer-offline` to reduce setup overhead.

### Integration with `run-parallel-agents-feature-build`

When using the parallel agents skill, include worktree creation in the setup phase and cleanup in the aggregation phase. Each agent brief should specify the worktree working directory path.

See `references/workflow-patterns.md` for complete multi-agent setup/cleanup scripts and merge strategies.

## Common Mistakes

**1. Checking out an already-checked-out branch**
Git prevents two worktrees from having the same branch. Error: `fatal: '<branch>' is already checked out at '<path>'`.
Fix: Create a new branch with `-b`, or use `--detach` for read-only inspection.

**2. Manually deleting the worktree directory**
Using `rm -rf` instead of `git worktree remove` leaves stale references.
Fix: Run `git worktree prune` to clean up.

**3. Forgetting `node_modules` and `.env`**
A new worktree has no `node_modules` and no gitignored config files. The project will fail to build.
Fix: Always run `npm install` and copy `.env` files after creating a worktree.

**4. Creating worktrees inside the project directory**
Causes gitignore confusion and accidental staging.
Fix: Always use `../` prefix to create sibling directories.

**5. Forgetting to clean up worktrees**
Leftover worktrees consume disk space and prevent branch deletion.
Fix: After merging, always `git worktree remove` and optionally `git branch -d`.

**6. Expecting `git stash` to cross worktrees**
Stashes are global but applying them in the wrong worktree can cause conflicts.
Fix: Use branches and commits to share work between worktrees, not stash.

See `references/troubleshooting.md` for error messages, edge cases, and recovery procedures.

## Resources

### references/

- **worktree-commands.md** — Complete command reference for all git worktree subcommands with every flag, option, and detailed usage examples. Includes the bare repository clone pattern for worktree-first workflows.

- **workflow-patterns.md** — Detailed workflow scenarios: hotfix-while-on-feature, PR review, parallel feature development, CI/testing in worktree, Claude Code multi-agent pattern with setup/cleanup scripts, and the bare repository workflow.

- **troubleshooting.md** — Comprehensive troubleshooting guide covering error messages, submodule behavior, lock/unlock scenarios, performance considerations, stale reference cleanup, edge cases (rebasing, cherry-picking, hooks, bisecting), and recovery procedures.

---

## Quality Checklist (Must Score 8/10)

Score yourself honestly before marking worktree workflow complete:

### Pre-Creation Verification (0-2 points)
- **0 points:** Created worktree without checking prerequisites
- **1 point:** Some checks done but incomplete
- **2 points:** All 7 pre-creation checks completed

### Directory Strategy (0-2 points)
- **0 points:** Created worktree inside project directory
- **1 point:** Used sibling directory but poor naming
- **2 points:** Proper sibling directory with clear naming convention

### Environment Setup (0-2 points)
- **0 points:** Forgot .env or node_modules
- **1 point:** Partial setup (missing some config files)
- **2 points:** Full environment setup, project builds correctly

### Work Execution (0-2 points)
- **0 points:** Made changes without committing
- **1 point:** Committed but didn't push
- **2 points:** Changes committed, pushed, PR created (if applicable)

### Cleanup (0-2 points)
- **0 points:** Left worktree orphaned
- **1 point:** Removed worktree but left stale branch
- **2 points:** Full cleanup: worktree removed, branch handled, verified clean

**Minimum passing score: 8/10**

---

## Common Rationalizations (All Wrong)

These are excuses. Don't fall for them:

- **"I'll just quickly create a worktree"** → STILL run pre-creation checks
- **"I know the branch isn't checked out"** → STILL run `git worktree list`
- **"I'll clean up later"** → Clean up NOW or set a reminder
- **"node_modules is the same"** → Each worktree needs its own install
- **"rm -rf is faster than git worktree remove"** → Use proper commands to avoid stale refs
- **"This is just a quick hotfix"** → Quick work still needs proper lifecycle
- **".env is committed"** → Even if .env.example exists, local secrets aren't
- **"I'll remember which worktrees exist"** → Run `git worktree list` to be sure

---

## Failure Modes

### Failure Mode 1: Branch Already Checked Out

**Symptom:** `fatal: '<branch>' is already checked out at '<path>'`
**Fix:** Use `-b` to create a new branch, or `--detach` for read-only. Check `git worktree list` first.

### Failure Mode 2: Orphaned Worktree References

**Symptom:** `git worktree list` shows worktrees that don't exist on disk
**Fix:** Run `git worktree prune` to clean stale references.

### Failure Mode 3: Project Won't Build in Worktree

**Symptom:** Missing modules, environment variables, or config files
**Fix:** Copy `.env`, `.env.local`, and run `npm install` after creating worktree.

### Failure Mode 4: Disk Space Exhausted

**Symptom:** System running out of space after multiple worktrees
**Fix:** Limit to 5 concurrent worktrees. Clean up promptly. Use `npm install --prefer-offline`.

### Failure Mode 5: Can't Delete Branch After Worktree

**Symptom:** `git branch -d` fails saying branch is checked out
**Fix:** The worktree was manually deleted. Run `git worktree prune` first.

---

## Quick Workflow Summary

```
STEP 1: VERIFY PREREQUISITES
├── Check inside git repo
├── List existing worktrees
├── Confirm branch not checked out
└── Gate: All pre-checks pass

STEP 2: CHOOSE DIRECTORY STRATEGY
├── Sibling (../project--purpose) vs dedicated folder
├── Apply naming convention
└── Gate: Strategy selected

STEP 3: CREATE WORKTREE
├── git worktree add [-b] <path> <branch>
├── Verify creation
└── Gate: Worktree exists

STEP 4: SET UP ENVIRONMENT
├── Copy .env files
├── npm install
├── Verify project runs
└── Gate: Environment ready

STEP 5: DO THE WORK
├── Make changes
├── Commit and push
└── Gate: Work complete

STEP 6: CLEAN UP
├── git worktree remove <path>
├── Delete branch if merged
├── git worktree prune (if needed)
└── Gate: Worktree removed

STEP 7: VERIFICATION
├── Check 1: Worktree removed
├── Check 2: Branch handled
├── Check 3: No stale refs
├── Check 4: Disk space recovered
├── Check 5: Clean state
└── Gate: All 5 checks pass
```

---

## Completion Announcement

When worktree workflow is complete, announce:

```
Worktree workflow complete.

**Quality Score: X/10**
- Pre-Creation Verification: X/2
- Directory Strategy: X/2
- Environment Setup: X/2
- Work Execution: X/2
- Cleanup: X/2

**Worktree Summary:**
- Path: [worktree path]
- Branch: [branch name]
- Purpose: [what was done]
- Duration: [how long active]

**Lifecycle:**
- Created: [timestamp or step]
- Work completed: [timestamp or step]
- Cleaned up: [timestamp or step]

**Verification:**
- Worktree removed: ✅
- Branch handled: [merged/pushed/deleted]
- Stale refs: None
- State: Clean

**Next steps:**
[Any remaining work or follow-up]
```

---

## Integration with Other Skills

The `git-worktrees` skill integrates with:

- **`start`** — Use `start` first to identify if worktrees are needed
- **`plan-enhanced`** — Plans with high parallelizability may require worktrees
- **`run-parallel-agents-feature-build`** — Each parallel agent SHOULD use a separate worktree
- **`run-parallel-agents-feature-debug`** — Each debugging agent SHOULD use a separate worktree

**Workflow with Parallel Agents:**

```
plan-enhanced (identifies 3+ parallel streams)
       │
       ▼
git-worktrees (create worktree per agent)
       │
       ├── Worktree A: ../project--agent-1 → laravel-senior-engineer
       ├── Worktree B: ../project--agent-2 → nextjs-senior-engineer
       └── Worktree C: ../project--agent-3 → express-senior-engineer
       │
       ▼
run-parallel-agents-feature-build (each agent works in its worktree)
       │
       ▼
Merge branches sequentially
       │
       ▼
git-worktrees (cleanup all worktrees)
```

**When to Auto-Invoke git-worktrees:**

If `plan-enhanced` or `run-parallel-agents-feature-build` identifies 2+ parallel agents that will modify files, consider invoking `git-worktrees` to create isolated working directories.
