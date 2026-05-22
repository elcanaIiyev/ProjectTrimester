# Branching Rules

## Branch Structure

- **`main`** — Final production version only. Never commit directly here.
- **`dev`** — Active development branch. All features merge here via PR.
- **`feature/elcan`** — Backend code only (API routes, Supabase, AI, middleware, types, validators)
- **`feature/gulustan`** — Frontend code only (pages, components, layouts, styles)

## Workflow

1. Always check the current branch before making any changes.
2. Switch to `feature/elcan` before writing or modifying any backend code.
3. Switch to `feature/gulustan` before writing or modifying any frontend code.
4. Push changes to the respective feature branch.
5. Open a **Pull Request** on GitHub to merge into `dev`.
6. Merge `dev` into `main` only for final releases.

## Pull Request Flow

```
feature/elcan   ──┐
                  ├──► PR ──► dev ──► PR ──► main
feature/gulustan ─┘
```

## Simulating 2 Contributors

- `feature/elcan` = "Elcan" (backend developer)
- `feature/gulustan` = "Gulustan" (frontend developer)
- Each feature branch should have its own PRs so it looks like two separate people contributed.
