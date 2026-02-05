# Git Worktree Troubleshooting

## Error Messages and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `fatal: '<branch>' is already checked out at '<path>'` | Branch is checked out in another worktree | Use `-b` to create a new branch, or `--detach` for read-only inspection |
| `fatal: '<path>' already exists` | Target directory already exists | Choose a different path, or remove the existing directory first |
| `fatal: not a git repository (or any parent up to mount point)` | Not inside a git repository | Navigate into the repo before running worktree commands |
| `fatal: invalid reference: '<branch>'` | Branch doesn't exist locally | Run `git fetch origin` first, then use `origin/<branch>` |
| `fatal: '<path>' is a linked worktree; use 'git worktree remove'` | Tried `rm -rf` on a worktree, then re-add at same path | Run `git worktree prune` first, then re-add |
| `fatal: working tree '<path>' is locked` | Worktree was locked (manually or with `--lock`) | Run `git worktree unlock <path>` first |

---

## Submodule Behavior

Each worktree gets its own submodule checkout. After creating a worktree in a repo with submodules:

```bash
cd ../myproject--worktree
git submodule update --init --recursive
```

Key points:
- `.gitmodules` is a tracked file and shared across worktrees
- Submodule working directories are per-worktree (independent checkouts)
- Submodule `.git` data may be stored in the main repo's `.git/modules/` and shared
- Changes to submodule commits in one worktree don't affect other worktrees until committed and checked out

---

## Lock/Unlock Scenarios

### What Lock Protects Against

| Operation | Without Lock | With Lock |
|-----------|-------------|-----------|
| `git worktree prune` | Removes stale ref | Skips locked worktree |
| `git worktree remove` | Removes worktree | Refuses (use `--force` to override) |
| `git worktree remove --force` | Force removes | Refuses (use `--force` twice) |
| Editing files in worktree | Allowed | Allowed (lock doesn't restrict this) |
| Committing in worktree | Allowed | Allowed |
| `git push` from worktree | Allowed | Allowed |

### When to Lock

- Worktree on a removable drive or network mount (prevents prune when unmounted)
- Long-running CI/CD job using the worktree
- Shared machine where others might run cleanup scripts
- Before going on vacation with active worktrees

### When NOT to Lock

- Normal daily worktrees (just remember to clean up)
- Short-lived worktrees (hotfix, PR review)
- Worktrees you're actively using (you'd notice if someone tried to delete them)

---

## Performance Considerations

### Disk Usage

Each worktree duplicates the working tree (all tracked files) but shares the `.git` object database.

| Component | Shared or Per-Worktree | Typical Size |
|-----------|----------------------|--------------|
| `.git` object database | Shared | Can be large (full history) |
| Working tree files | Per-worktree | Project source size |
| `node_modules/` | Per-worktree | Often 200MB-1GB+ |
| Build output (`dist/`) | Per-worktree | Varies |
| `.env` and local configs | Per-worktree (must copy) | Tiny |

**Biggest cost:** `node_modules` in Node.js projects. Each worktree needs its own full install.

### Optimization Tips

```bash
# Use offline cache for faster npm install in worktrees
npm install --prefer-offline

# Use pnpm for shared storage across worktrees (hard links)
pnpm install

# Skip devDependencies if only running/testing production code
npm install --production
```

### Recommended Limits

- **Max 5 concurrent worktrees** for typical Node.js projects
- Monitor disk usage: `du -sh ../myproject--*`
- Clean up promptly after merging branches

---

## Stale Reference Cleanup

When a worktree directory is manually deleted (instead of using `git worktree remove`), git retains stale administrative references.

### Symptoms

- `git worktree list` shows a worktree that no longer exists on disk
- `git branch -d <branch>` fails saying branch is checked out in another worktree

### Fix

```bash
# Preview what will be cleaned
git worktree prune --dry-run

# Clean up stale references
git worktree prune -v

# Verify
git worktree list
```

After pruning, `git branch -d` will work again for branches that were checked out in the deleted worktree.

---

## Edge Cases

### Rebasing in a Worktree

Rebase state is per-worktree. You can rebase in one worktree while another worktree is in a normal state.

```bash
cd ../myproject--feature
git rebase origin/main
# Resolve conflicts if needed — only affects this worktree
```

### Cherry-Picking Across Worktrees

The object database is shared. A commit made in worktree A is immediately available in worktree B by hash:

```bash
# In worktree B, cherry-pick a commit from worktree A's branch
git cherry-pick abc1234
```

### Git Hooks

- Hooks in `.git/hooks/` run for ALL worktrees
- For per-worktree hooks (Git 2.37+), place them in `.git/worktrees/<name>/hooks/`
- Alternatively, set `core.hooksPath` per worktree:
  ```bash
  cd ../myproject--feature
  git config core.hooksPath .my-hooks
  ```

### Bisecting in a Worktree

Each worktree can independently bisect. For bisection without affecting your working branch:

```bash
# Create a detached-HEAD worktree for bisection
git worktree add --detach ../myproject--bisect HEAD
cd ../myproject--bisect
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
# ... bisect as normal ...
git bisect reset
cd ../myproject
git worktree remove ../myproject--bisect
```

### Garbage Collection

`git gc` respects all worktree refs. Objects referenced by any worktree are protected from garbage collection. Running `git gc` from any worktree (or the main repo) is safe.

### Worktrees and Sparse Checkout

Combine worktrees with sparse checkout for large monorepos:

```bash
git worktree add --no-checkout ../myproject--sparse feature-x
cd ../myproject--sparse
git sparse-checkout init --cone
git sparse-checkout set packages/my-package
git checkout
```

This creates a worktree with only the specified paths checked out, saving disk space.

---

## Recovery

### After Manually Moving a Worktree

If you moved a worktree directory with `mv` instead of `git worktree move`:

```bash
# From the main repo or any valid worktree
git worktree repair /new/path/to/worktree
```

### Force Remove a Corrupted Worktree

```bash
# If normal remove fails
git worktree remove --force ../myproject--broken

# If that also fails, manually delete and prune
rm -rf ../myproject--broken
git worktree prune
```

### Reset After Catastrophic Failure

If worktree references are completely broken:

```bash
# List all worktree admin data
ls .git/worktrees/

# Manually remove a stale entry
rm -rf .git/worktrees/<worktree-name>

# Then prune to be safe
git worktree prune -v
```

This is a last resort. Prefer `git worktree repair` and `git worktree prune` first.
