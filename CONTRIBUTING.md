# Contributing

This template ships as the substrate for new SaaS products. Most consumers fork it once and never PR back. If you do contribute, follow this guide.

## Development setup

```bash
bun install
bun run dev
```

Required local tools (see `README.md`): `gh`, `gcloud`, `firebase`, `netlify`.

## Branch + commit conventions

- Branch off `main`, name `<type>/<slug>` (e.g., `feat/billing-portal`, `fix/audit-log-shape`).
- Commit format: `<type>: <description>` (Conventional Commits, enforced by `commitlint`).
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `ci`, `build`, `perf`, `style`, `revert`.
- Keep commits focused — `git rebase -i` to clean up before opening a PR.

## Pre-PR checklist

```bash
bun run lint && bun run typecheck && bun run test && bun run build
```

If you touched UI: `bun run test:e2e`.
If you touched user-visible strings: review the message rubric in the team error-message guide (the `errors.md` rule lands in a later PR; until then, prefer concrete, blame-free messages with a clear next step).

## Pull requests

- Title: imperative, ≤70 chars, no trailing period.
- Description: what changed, why, test plan, screenshots if UI.
- Mark a Changeset for any user-visible change: `bunx changeset` (PR1+).
- Rebase onto `origin/main` before requesting review (`git fetch origin main && git rebase origin/main`).
- Force-push with `--force-with-lease` only.

## Code review

The `claude.yml` GitHub Action posts an automated review on every PR. Address its comments before requesting a human review. Human review is required for changes that:
- modify auth, billing, or rate-limiting code,
- change Firestore rules or storage rules,
- alter the public surface of `createApiHandler`,
- introduce a new external dependency.

## What goes where

- `apps/web/` — the Next.js app (UI + API routes + Firebase admin).
- `apps/desktop/` — Tauri shell for desktop and iOS.
- `packages/ui/` — primitives and composites shared across apps.
- `packages/types/`, `packages/shared/` — shared types and pure utilities.
- `docs/` — design docs, plans, software-factory bootstrap docs.
- `scripts/` — Bun scripts for scaffolding and codegen.
