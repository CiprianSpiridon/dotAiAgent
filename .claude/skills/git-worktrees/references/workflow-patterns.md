# Git Worktree Workflow Patterns

## Workflow 1: Hotfix While Working on a Feature

The most common worktree use case. You are mid-feature and need to fix a production issue without losing context.

**Scenario:** You are on `feature/shopping-cart` with uncommitted work. A critical bug is reported in production.

**Steps:**

```bash
# 1. From your project directory, create a hotfix worktree based on main
git worktree add -b hotfix/payment-fix ../myproject--hotfix origin/main

# 2. Set up the worktree environment
cp .env ../myproject--hotfix/.env
cp .env.local ../myproject--hotfix/.env.local  # if exists
cd ../myproject--hotfix
npm install

# 3. Fix the bug, test, commit
# ... make changes ...
git add -A && git commit -m "fix: resolve payment processing error"
git push -u origin hotfix/payment-fix

# 4. Open PR, get it reviewed and merged

# 5. Clean up (from any worktree)
cd ../myproject
git worktree remove ../myproject--hotfix
git branch -d hotfix/payment-fix        # delete local branch (already merged)
```

**Key benefit:** Your feature branch working directory is completely untouched. No stashing, no WIP commits, no lost context.

---

## Workflow 2: PR Review in Separate Worktree

Review a colleague's pull request by checking it out in a separate worktree. You can run the code, run tests, and inspect behavior without disrupting your current work.

**Steps:**

```bash
# 1. Fetch latest remote branches
git fetch origin

# 2. Create worktree from the PR branch
git worktree add ../myproject--pr-42 origin/feature/new-api

# 3. Set up and test
cp .env ../myproject--pr-42/.env
cd ../myproject--pr-42
npm install
npm test
npm run dev  # try it out

# 4. Review the code, leave feedback on the PR

# 5. Clean up
cd ../myproject
git worktree remove ../myproject--pr-42
```

**For GitHub PRs specifically:**
```bash
# You can also use `gh` CLI to checkout PR directly
git fetch origin pull/42/head:pr-42
git worktree add ../myproject--pr-42 pr-42
```

---

## Workflow 3: Parallel Feature Development

When you need to develop multiple independent features simultaneously, create a worktree for each.

**Steps:**

```bash
# 1. Create worktrees for each feature
git worktree add -b feature/auth ../myproject--auth origin/main
git worktree add -b feature/notifications ../myproject--notifications origin/main

# 2. Set up each worktree
for wt in ../myproject--auth ../myproject--notifications; do
  cp .env "$wt/.env"
  (cd "$wt" && npm install)
done

# 3. Work on each in separate terminals
# Terminal 1: cd ../myproject--auth && npm run dev
# Terminal 2: cd ../myproject--notifications && npm run dev

# 4. Commit and push independently in each worktree

# 5. After merging, clean up
git worktree remove ../myproject--auth
git worktree remove ../myproject--notifications
git branch -d feature/auth feature/notifications
```

**Tip:** If features share a database or external service, be mindful of port conflicts. Use different `PORT` values in each worktree's `.env`.

---

## Workflow 4: Testing in a Worktree

Run a long test suite or build on the current state without blocking your development.

**Steps:**

```bash
# 1. Create a detached-HEAD worktree at current commit
git worktree add --detach ../myproject--test-runner HEAD

# 2. Set up and run tests
cp .env ../myproject--test-runner/.env
cd ../myproject--test-runner
npm install
npm test  # long-running test suite

# 3. Continue coding in your main worktree while tests run

# 4. Check test results, then clean up
cd ../myproject
git worktree remove ../myproject--test-runner
```

**Why detached HEAD:** We only want a snapshot to test against; we don't need a named branch. This avoids the branch-already-checked-out conflict.

---

## Workflow 5: Claude Code Multi-Agent Pattern

When using the `run-parallel-agents-feature-build` skill, create isolated worktrees so each agent has its own working directory. This prevents file conflicts when agents modify files in parallel.

### Setup Script

```bash
#!/bin/bash
# create-agent-worktrees.sh
# Usage: ./create-agent-worktrees.sh auth notifications payments

PROJECT_DIR=$(git rev-parse --show-toplevel)
PROJECT_NAME=$(basename "$PROJECT_DIR")

for feature in "$@"; do
  BRANCH="feature/$feature"
  WORKTREE="../${PROJECT_NAME}--${feature}"

  echo "Creating worktree for $feature..."
  git worktree add -b "$BRANCH" "$WORKTREE" origin/main

  # Copy environment files
  cp "$PROJECT_DIR/.env" "$WORKTREE/.env"
  [ -f "$PROJECT_DIR/.env.local" ] && cp "$PROJECT_DIR/.env.local" "$WORKTREE/.env.local"

  # Install dependencies
  (cd "$WORKTREE" && npm install --prefer-offline)

  echo "Ready: $WORKTREE on branch $BRANCH"
done

echo ""
echo "Worktrees created. Launch agents with these working directories."
git worktree list
```

### Agent Brief Template

When delegating to a specialized agent via the Task tool, include the worktree path:

```
Build [feature]:
- Working directory: ../myproject--[feature]
- Branch: feature/[feature]
- Environment is set up (node_modules installed, .env copied)
- Requirements: [bullet points]
- When done: commit all changes, push the branch
```

### Merge Strategy After Agents Complete

After all agents finish, merge branches sequentially to avoid conflicts:

```bash
cd ../myproject  # main worktree

# Merge each feature branch
for feature in auth notifications payments; do
  git merge "feature/$feature" --no-ff -m "merge: $feature feature"
done
```

If conflicts arise, resolve them one branch at a time. The sequential merge order should go from least to most likely to conflict.

### Cleanup Script

```bash
#!/bin/bash
# cleanup-agent-worktrees.sh
# Usage: ./cleanup-agent-worktrees.sh auth notifications payments

PROJECT_NAME=$(basename "$(git rev-parse --show-toplevel)")

for feature in "$@"; do
  WORKTREE="../${PROJECT_NAME}--${feature}"
  BRANCH="feature/$feature"

  echo "Removing worktree: $WORKTREE"
  git worktree remove "$WORKTREE" 2>/dev/null || git worktree remove --force "$WORKTREE"

  echo "Deleting branch: $BRANCH"
  git branch -d "$BRANCH" 2>/dev/null || echo "  Branch not merged or already deleted"
done

git worktree prune
echo "Cleanup complete."
git worktree list
```

### Safety Checks Before Creating Agent Worktrees

Before creating worktrees for parallel agents:

```bash
# Check disk space (each worktree ~ project size minus .git)
df -h .

# Check existing worktrees (avoid accumulation)
git worktree list

# Verify branches don't already exist
git branch --list "feature/*"
```

**Recommended limits:**
- Max 5 concurrent worktrees for typical Node.js projects (node_modules is heavy)
- Ensure each agent gets a unique branch name
- Use `--prefer-offline` for npm install to reduce network overhead

---

## Workflow 6: Bare Repository Workflow

For teams that use worktrees as their primary workflow. All branches are equal -- there is no "main" working directory.

### Initial Setup

```bash
# 1. Clone as bare repository
git clone --bare git@github.com:org/project.git project.git

# 2. Fix fetch refspec (bare clones restrict this by default)
cd project.git
git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
git fetch origin

# 3. Create worktrees
git worktree add ../project-main main
git worktree add ../project-dev develop
git worktree add -b feature/new-ui ../project-new-ui origin/main
```

### Directory Layout

```
parent/
  project.git/              # bare repo (no working files, just git internals)
  project-main/             # worktree for main
  project-dev/              # worktree for develop
  project-new-ui/           # worktree for feature
```

### Daily Operations

```bash
# Fetch from any worktree or the bare repo
cd ../project.git && git fetch origin

# Create a new worktree for a task
cd ../project.git
git worktree add ../project-hotfix -b hotfix/fix origin/main

# Remove when done
git worktree remove ../project-hotfix
```

### When to Use This Pattern

- Teams that frequently work on 3+ branches simultaneously
- CI/CD systems that need multiple branches checked out
- Projects where the "main worktree" concept causes confusion about which directory is canonical

### Tradeoffs

- More complex initial setup
- Some tools assume a non-bare repository (may need adjustment)
- Need to remember to `cd` into the bare repo or a worktree for git commands
