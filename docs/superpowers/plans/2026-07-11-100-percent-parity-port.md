# 100% Parity Port — master-template → master-template-cloudflare

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan wave-by-wave. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reach checkable 100% functional, UI, CI/CD, multi-workspace/org, and multi-platform parity with `master-template-netlify-firebase` on Cloudflare Workers — then resume HumanOrVibe.

**Architecture:** Hybrid “product-clone + platform-swap” (advisor hybrid of A+B). Treat legacy as **product source of truth** (pages, packages, CI, e2e, desktop, widget). Treat current CF as **platform source of truth** (OpenNext, wrangler, D1, Better Auth, R2, KV, Queues, Cron). Do not soft-reset onto Firebase. Import product trees mechanically into CF branches/worktrees and rewire platform seams.

**Tech Stack:** Bun + Turbo monorepo, Next.js App Router (OpenNext on Workers), Drizzle + D1, Better Auth (+ Organization), R2, KV, Queues, Cron Workers, Stripe, Cloudflare Email, AI SDK, Radix/Tiptap, Playwright.

**HumanOrVibe:** Paused until parity checklist is ✅ (or user unpauses).

---

## Advisor synthesis (2026-07-11)

| Advisor | Reachable? | Strategy pick |
| --- | --- | --- |
| GLM 5.2 | ✅ | **A** — clone legacy, replace platform in place |
| Gemini personal | ✅ | **B** — keep CF runtime, wholesale product import |
| Claude Sonnet/Opus/Fable | ❌ monthly spend limit | — |
| Codex personal | ❌ usage limit until ~5:29 PM | — |

**Orchestrator decision: Strategy C* (A+B hybrid)**

- **GLM is right** that greenfield-only will lose UX/e2e/CI edge cases.
- **Gemini is right** that cloning Firebase and living broken for weeks is worse than a bootable CF trunk.
- **Adopted shape:** keep bootable CF `main`, but run *product import waves* that copy legacy trees wholesale into feature worktrees, then swap only the platform seams (auth/db/storage/functions). That maximizes retained code while keeping Workers runnable after each wave.

---

## Definition of Done (100% ported)

Checkable gates — all must be true:

1. **Pages:** Every path in `docs/parity/CHECKLIST.md` pages section is ✅ (or explicit `n/a-cut` with user sign-off).
2. **APIs:** Every checked legacy `/api/v1/*` route exists on CF and returns compatible JSON (schema tests or golden fixtures).
3. **Auth/RBAC:** Signup → create workspace → invite member → role gates → switch workspace works on Better Auth + D1.
4. **Billing:** Stripe-test webhook provisions tier in D1; checkout/portal/info/usage routes live.
5. **Uploads:** R2 path supports create/put/complete/get equivalent to legacy upload UX.
6. **Jobs:** Webhook dispatch + email send + Stripe reconcile run via Queues/Cron (not Firebase Functions).
7. **Packages:** `email`, `shared`, `types`, `ui` consume-able; no Firebase imports.
8. **Apps:** `web` fully; `desktop` + `widget` auth against CF app API (or signed cut if user later de-scopes).
9. **CI:** gitleaks + typecheck + unit + Playwright e2e on wrangler `:8788` + release/changesets workflow ported.
10. **Dead platform:** `rg firebase\|firebase-admin\|firestore` finds zero runtime hits under apps/packages (tests may have firestore rules fitness only after removal).
11. **E2E:** All legacy Playwright specs either pass against wrangler local or have certified replacements covering same behaviors.
12. **Review:** Each wave SHIP’d by Claude Sonnet or Codex (when available) before merge to `main`.

Living tracker: `docs/parity/CHECKLIST.md`.

---

## Waves (PRs / worktrees)

Branch format: `port/wN-<domain>/<slug>`  
Worktree path: `.worktrees/port-wN-<domain>-<slug>/`

### Wave 0 — Freeze + registry (this plan)
- [x] Multi-model strategy consult
- [x] Write plan + checklist skeleton
- [ ] Commit plan to `main`
- [ ] Tag `parity-start`
- [ ] Pause HumanOrVibe work in AGENTS.md note

### Wave 1 — Process + monorepo factory assets
**Branch:** `port/w1-process/factory-assets`  
**Import from legacy (no Firebase runtime):**
- SECURITY.md, CONTRIBUTING.md, CODEOWNERS, commitlint, changesets config
- gitleaks + release workflows (adapted for wrangler)
- Playwright scaffolding files (specs may skip until APIs exist)
- `packages/shared`, `packages/types` (strip firebase types)
- `scripts/scaffold-resource.ts`, MANIFEST tooling if used
- `packages/email` skeleton adapted to Cloudflare Email Service (may queue later)

**Done when:** typecheck green; no firebase in new packages; CI lint/typecheck/test runs.

### Wave 2 — Data model parity (D1 schemas)
**Branch:** `port/w2-data/d1-domain-schema`  
- Map inventory collections → Drizzle tables (workspaces already partial; add agents, threads, messages, items, tools, skills, webhooks, audit_logs, settings, billing tables, uploads expand, visitors…).
- Migrations + seed fixtures for e2e.
- Better Auth org ↔ workspace mirror verified for multi-tenant FKs.

**Done when:** migrations apply local; schema tests; inventory table matrix all ✅.

### Wave 3 — Auth + workspace shell + API foundations
**Branch:** `port/w3-auth/workspace-shell`  
- Port middleware, nav, dashboard layout shell, workspace switcher.
- Port `/api/v1/workspaces*`, `/workspace/current`, members, settings.
- Port session helpers previously on Firebase cookies → Better Auth.
- DEV auth bypass only in development if reintroduced carefully.

**Done when:** login → dashboard shell → create/switch workspace e2e green.

### Wave 4 — Core product APIs
**Branch family (parallel ok after W3):**
- `port/w4-api/agents-*`
- `port/w4-api/threads-*`
- `port/w4-api/items-tools-skills`
- `port/w4-api/uploads-audit-users`
- Port remaining `/api/v1/*` with D1 + ownership checks.

**Done when:** route checklist ✅; idempotent writes; no answer-leaking auth bugs.

### Wave 5 — Core product UI pages
**Branch family:**
- `port/w5-ui/dashboard-home`
- `port/w5-ui/agents-threads`
- `port/w5-ui/settings-workspaces`
- `port/w5-ui/users-admin-onboarding`
- Import page components + hooks; rewire data clients from Firestore SDK to fetch/ typed client.

**Done when:** page checklist ✅; visual smoke via agent-browser/Playwright.

### Wave 6 — Billing + background platform
**Branch:** `port/w6-async/billing-queues-cron`  
- Stripe routes + webhook + reconcile cron.
- Email queue consumer real Cloudflare Email path.
- Message→webhook outbox (from spike pattern).

**Done when:** stripe-cli webhook smoke; cron worker hits app; queue consumer idempotent.

### Wave 7 — Multi-platform
**Branch:** `port/w7-apps/desktop-widget`  
- Port `apps/desktop`, `apps/widget` pointing at CF API/auth.
- Desktop CI workflow adapted.

**Done when:** desktop/widget build + auth handshake smoke.

### Wave 8 — E2E hard gate + Firebase purge
**Branch:** `port/w8-qa/e2e-and-purge`  
- Playwright against `wrangler dev :8788` with D1 seed.
- Port/specs adaptation; gitleaks; full CI green.
- Remove leftover Firebase packages and functions app.

**Done when:** Definition of Done 1–12 all true → tag `parity-complete` → unpause HumanOrVibe.

---

## File ownership / seams (do not invent second designs)

| Concern | Source | Target in CF |
| --- | --- | --- |
| Product pages/components | legacy `apps/web/src/**` | `apps/web/app` or `apps/web/src` (pick one layout; currently CF uses `app/` at apps/web root — migrate consistently) |
| Domain types | legacy `packages/types` | `packages/types` |
| Shared utils | legacy `packages/shared` | `packages/shared` |
| Email | legacy `packages/email` | `packages/email` + Queue |
| UI primitives | already `@template/ui` (ported) | keep `@template/ui`; align `@repo/ui` imports via package alias if needed |
| Auth | CF Better Auth | expand org/roles; delete Firebase auth routes |
| DB | CF Drizzle/D1 | expand schemas from inventory |
| Storage | CF R2 | expand for workspace scoping |
| Jobs | CF Queues + cron workers | replace Cloud Functions |
| Deploy | CF wrangler/OpenNext | enhance CI |

---

## E2E strategy (Workers)

1. `bunx wrangler dev -c apps/web/cloudflare/app-worker/wrangler.jsonc --local --port 8788`
2. Playwright `baseURL=http://localhost:8788`
3. `globalSetup`: apply migrations + seed SQL via `wrangler d1 execute --local`
4. Mock Stripe/Cloudflare Email (Stripe CLI forward optional locally; MSW for Cloudflare Email)
5. CI job starts wrangler background, waits for Ready, runs Playwright, tears down

Avoid testing only `next dev` — it is not production-like for bindings.

---

## Subagent rules

1. One worktree per branch; **disjoint write scopes** in prompts.
2. Default implementer: `gemini-personal` (cheap).  
3. Reviewer: `claude-personal --model sonnet` when available; else GLM / local orchestration review.  
4. Never edit legacy `master-template-netlify-firebase` (read-only).  
5. Never resume HumanOrVibe feature work until `parity-complete` except bugfix if user overrides.  
6. Each PR: typecheck + relevant tests + checklist ticks + SHIP review.

---

## Immediate next actions (Wave 0→1)

1. Commit this plan + checklist to `main`.
2. Create worktree `.worktrees/port-w1-process-factory-assets` on `port/w1-process/factory-assets`.
3. Import process/CI/shared/types/email shells from legacy; strip Firebase.
4. Open PR / merge when green.
5. Spawn Wave 2 worktree for D1 domain schema.

---

## Risks explicitly accepted

- Realtime Firestore listeners → polling or later Durable Objects (document UX deltas).
- Full pixel parity of every animation may need visual follow-ups after functional pass.
- Desktop/widget may lag web if native auth redirects need CF base URL work.

---

## External learnings (BlogBat / Supportsheep)

See `docs/parity/LEARNINGS-FROM-BLOGBAT-SUPPORTSHEEP.md`.

Actionable deltas:
- W3 first lands `createApiHandler` + workspace/tenant resolve + Better Auth session cookies (BlogBat pattern).
- W4 domains use repository + createApiHandler; never trust workspaceId from body alone.
- Deploy CI mirrors Supportsheep: migrate D1 → OpenNext deploy → re-put secrets.
- OpenNext has no `scheduled()`; keep HTTP cron worker.
- Email stays Cloudflare Email Service only (BlogBat purged Resend).
- Wave 8 must `rg firebase-admin` empty under apps/web.
