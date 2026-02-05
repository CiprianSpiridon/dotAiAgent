# Git Worktree Command Reference

## git worktree add

Create a new worktree linked to this repository.

**Syntax:**
```
git worktree add [-f] [--detach] [--checkout] [--lock [--reason <string>]] [-b <new-branch>] <path> [<commit-ish>]
```

**Flags:**

| Flag | Purpose |
|------|---------|
| `-b <branch>` | Create a new branch and check it out in the worktree |
| `-B <branch>` | Create or reset a branch and check it out |
| `--detach` | Create worktree with detached HEAD (no branch) |
| `-f` / `--force` | Allow adding even if `<path>` is registered to another worktree |
| `--lock` | Lock the worktree immediately after creation |
| `--reason <string>` | Reason for lock (requires `--lock`) |
| `--no-checkout` | Suppress checkout to allow sparse-checkout config before |
| `--orphan` | Create worktree with a new orphan branch (no parents) |

**Common usage patterns:**

```bash
# From an existing remote branch
git worktree add ../project--feature origin/feature-branch

# Create a new branch based on current HEAD
git worktree add -b hotfix/urgent ../project--hotfix

# Create a new branch based on a specific ref
git worktree add -b hotfix/urgent ../project--hotfix origin/main

# Detached HEAD for inspecting a tag or release
git worktree add --detach ../project--release v2.0.0

# Create and immediately lock (for network drives)
git worktree add --lock --reason "on NFS mount" ../project--shared feature-x

# Sparse checkout: create without checking out files, configure, then checkout
git worktree add --no-checkout ../project--sparse feature-x
cd ../project--sparse
git sparse-checkout set src/core
git checkout
```

**Notes:**
- A branch can only be checked out in one worktree at a time. To inspect a branch that is already checked out elsewhere, use `--detach`.
- `<commit-ish>` defaults to HEAD if omitted.
- `-B` is like `-b` but resets the branch if it already exists (use with caution).

---

## git worktree list

List all worktrees linked to this repository.

```bash
# Human-readable format
git worktree list

# Machine-parseable format (for scripts)
git worktree list --porcelain
```

**Output format (default):**
```
/path/to/main           abc1234 [main]
/path/to/project--fix   def5678 [hotfix/fix]
/path/to/project--test  ghi9012 (detached HEAD)
```

**Porcelain format:**
```
worktree /path/to/main
HEAD abc1234abc1234abc1234abc1234abc1234abc12345
branch refs/heads/main

worktree /path/to/project--fix
HEAD def5678def5678def5678def5678def5678def56789
branch refs/heads/hotfix/fix
```

---

## git worktree remove

Remove a linked worktree. The main worktree cannot be removed.

```bash
# Remove a clean worktree
git worktree remove ../project--fix

# Force remove (discards uncommitted changes)
git worktree remove --force ../project--fix
```

**Behavior:**
- Refuses to remove if there are uncommitted changes (without `--force`)
- Refuses to remove locked worktrees (use `git worktree unlock` first, or `--force` twice)
- Deletes the worktree directory and cleans up internal references
- Does NOT delete the branch; use `git branch -d` separately

---

## git worktree move

Relocate a worktree to a new path.

```bash
git worktree move ../old-path ../new-path
```

**Constraints:**
- Cannot move the main worktree
- Cannot move locked worktrees (unlock first)
- Target path must not already exist

---

## git worktree prune

Remove stale worktree administrative references. Needed when a worktree directory was manually deleted instead of using `git worktree remove`.

```bash
# Preview what would be pruned
git worktree prune --dry-run

# Prune with verbose output
git worktree prune -v

# Just prune
git worktree prune
```

**When pruning happens automatically:** Git may auto-prune during `git gc` or certain other operations, but relying on manual `prune` after manual deletion is safer.

---

## git worktree lock / unlock

Lock prevents `git worktree prune` and `git worktree remove` from deleting a worktree.

```bash
# Lock a worktree
git worktree lock ../project--fix

# Lock with a reason (shows up in `git worktree list`)
git worktree lock --reason "long-running CI job" ../project--fix

# Unlock
git worktree unlock ../project--fix
```

**When to use:**
- Worktree is on a removable or network drive that may be temporarily unmounted
- Long-running process using the worktree (CI, agent)
- Preventing accidental cleanup by collaborators

**What lock does NOT do:** It does not prevent modifications inside the worktree. It only prevents administrative removal/pruning.

---

## git worktree repair

Fix administrative data after worktrees have been manually moved or the main worktree has been moved.

```bash
# Repair from inside any worktree
git worktree repair

# Repair with explicit paths
git worktree repair /path/to/moved-worktree
```

**When needed:**
- After manually moving a worktree directory (without `git worktree move`)
- After moving the main repository directory
- When `git worktree list` shows incorrect paths

---

## Bare Repository Clone Pattern

For a worktree-first workflow where all branches are equal (no "main" working directory):

```bash
# 1. Clone as bare repository (no working tree)
git clone --bare git@github.com:org/project.git project.git

# 2. Fix the fetch refspec (bare clones set a restrictive default)
cd project.git
git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
git fetch origin

# 3. Create worktrees for each branch you need
git worktree add ../project-main main
git worktree add ../project-feature feature-branch
git worktree add -b hotfix/fix ../project-hotfix origin/main
```

**Directory layout:**
```
parent/
  project.git/            # bare repo (no files, just .git internals)
  project-main/           # worktree for main branch
  project-feature/        # worktree for feature branch
  project-hotfix/         # worktree for hotfix
```

**Advantages:**
- No "primary" worktree — all branches treated equally
- Clean separation between git data and working directories
- Natural for teams that heavily use worktrees

**Tradeoff:** Slightly more complex initial setup. Best for long-lived projects with frequent parallel work.
