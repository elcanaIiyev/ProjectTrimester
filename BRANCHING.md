# Branching Rules

## Branches

- **`elcan`** — Backend code only
- **`gulustan`** — Frontend code only
- **`main`** — Merged / stable branch

## Workflow

1. Always check the current branch before making any changes.
2. Switch to `elcan` before writing or modifying any backend code.
3. Switch to `gulustan` before writing or modifying any frontend code.
4. Push backend changes to `elcan`, frontend changes to `gulustan`.
5. Merge branches into `main` only when both sides are ready and stable.
