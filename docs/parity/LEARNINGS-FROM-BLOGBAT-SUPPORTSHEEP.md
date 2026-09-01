# Learnings from BlogBat + Supportsheep (read-only)

Date captured: 2026-07-11  
Sources (do not edit from this repo):

- `/Users/parab/Documents/Personal/pooriaarab/code/blogbat` — **actual** Firebase → Cloudflare D1/Better Auth migration in flight; M2 nearly complete (`refactor(db): remove firebase-admin entirely`).
- `/Users/parab/Documents/Personal/supportsheep` — **clone of BlogBat**, rebranded; inherits CF patterns + Cloudflare Email + deploy CI; Fable security rounds.

These are live product migrations of master-template lineage onto Cloudflare. Prefer their patterns over reinventing seams for Waves 3–8.

---

## 1. Strategy they proved (not pure greenfield product)

| Decision | BlogBat M2 |
| --- | --- |
| Product tree | **Lift & rebrand / keep page+API surface**, re-platform under it |
| Data | **Greenfield D1** (no Firestore backfill required for template) |
| Auth migration | Dual-read cookie path during transition, then **delete firebase-admin** |
| Delivery | Small domain slices, **one git worktree per slice**, staging e2e before merge |
| Why kill Firebase hard | `firebase-admin` cannot run on Workers: protobufjs `new Function` → **EvalError** at module eval; even a static import of admin from session/api-utils **500s the worker** |

**Implication for master-template-cloudflare:**  
Our CF platform skeleton is fine. Product parity should **import createApiHandler + repository domain slices** like BlogBat, not rewrite every route ad-hoc. Supportsheep shows the clone-then-rebrand path for multi-product factories once one CF base works.

---

## 2. Architecture patterns to reuse

### Auth

- Lazy Better Auth factory (`getAuth()` / not module_scope) so build/dev java don't touch D1 early.
- Drizzle adapter: `provider: "sqlite"`, **`transaction: false`** (D1).
- **`getDb()`** = schema-typed app DB; **`getDbRaw()`** = no app schema for Better Auth adapter only.
- Middleware accepts:
  - `better-auth.session_token`
  - `__Secure-better-auth.session_token`
- Dual-auth during product migration: Better Auth cookie first **only if present**, fall through to legacy (BlogBat still had Firebase briefly). For greenfield template: Better Auth only is OK.
- Magic link (if used): `@/lib/auth/send-magic-link-email` → **`env.EMAIL.send`** (Cloudflare Email Service). Log-only when binding missing.

### API boundary — `createApiHandler`

Declarative route wrapper used by nearly all BlogBat/Supportsheep APIs:

```ts
createApiHandler({
  auth: "user" | "admin" | "session" | "none",
  input?: ZodSchema,
  audit?: AuditAction,
  rateLimit?: { key, maxPerMinute },
  handler: async ({ request, session, body, params, blogId /* or workspaceId */, role }) => NextResponse
})
```

Gives free / consistent: correlation id, session verify, role hierarchy, Zod body, 429, audit log.

**Tenant rule (critical):**  
Handler gets `workspaceId`/`blogId` from **membership resolution**, never from untrusted client body alone.

Role hierarchy example: `owner > admin > editor > viewer > guest` with `roleSatisfies()`.

### Data access — repository per domain

Template of a migrated domain (categories proved it; audit-log on D1 scrubbed Firebase):

1. Drizzle schema table(s) + tenant column + indexes  
2. Repository methods `(…, workspaceId, db = getDb())` always filter by tenant  
3. Routes only call repo via createApiHandler  
4. Vitest against in-memory / miniflare D1  
5. Staging e2e under real Better Auth session  
6. Purge remaining firebase imports in that domain  

### Workers / ops

- OpenNext worker: `nodejs_compat` + `global_fetch_strictly_public`, smart placement.
- Env splits: `wrangler deploy --env staging|production`; **secrets** via `wrangler secret put`, not vars.
- **CI:** `bun install --frozen-lockfile` → D1 migrate env → `cf:deploy:env` → re-put secrets that deploy can drop (INTERNAL_CRON_SECRET lesson).
- Cron: OpenNext export may **lack `scheduled()`** — Supportsheep/BlogBat use **HTTP cron worker POST** to app with shared secret (`x-internal-cron-secret` / `CRON_SECRET`). Matches our template cron worker.
- R2 media + D1 metadata; delete D1 first, best-effort R2 delete.
- Rate limit public endpoints on **D1**, not memory-only.
- Heavy Node SDKs (googleapis): **dynamic import** after worker start or public pages 500.
- Staging vs prod routes: more-specific zone routes beat `*/*` SaaS catch-alls (custom domain footgun).

### Email

- BlogBat/Supportsheep **purged Resend** in favor of Cloudflare Email Service.
- Binding: `"send_email": [{ "name": "EMAIL", "remote": true }]` for local → real service.
- Aligns with template decision: **no React Email, no Resend**.

---

## 3. Security lessons (Fable rounds on Supportsheep)

Lift these into Wave 8 / createApiHandler defaults:

1. Email domain allowlist: normalize to `@domain` or use `endsWith` wrong → `evilacme.io` bypass.  
2. `test-login` / DEV bypass: hard rate limit; never open in prod.  
3. Middleware public prefixes: **exact / trailing-slash-safe**, not naive `startsWith` that opens `interviewsAdmin`.  
4. Dead API-key helpers that ignore scopes — delete or implement.  
5. Netlify.toml prod invariants must be re-encoded in **wrangler env comments + CI**.

---

## 4. Adjust master-template parity plan (what changes)

| Wave | BlogBat-informed change |
| --- | --- |
| W3 | Land **`createApiHandler` + `getDb`/`getDbRaw` + session + workspace resolve`)+`middleware cookie** first; model after BlogBat `create-api-handler.ts` |
| W4 | Port domains with **repository pattern**, one slice at a time (workspaces → agents → threads → …) |
| W5 | UI only after API handlers for that slice exist (same as categories route rewrite) |
| W6 | Billing as a domain slice; queue/outbox already exist; email uses `env.EMAIL` only |
| W7 | Desktop/widget= BlogBat `apps/desktop` Tauri already in that lineage — copy + retarget auth URL to CF |
| W8 | E2E staging bootstrap: magic-link or test-login gated; assert **no firebase-admin imports**; deploy workflow like Supportsheep |

**Path rule:** Prefer **Supportsheep/BlogBat as CF product chassis** for handler middleware forensics; prefer **master-template-netlify-firebase** as **product feature inventory** (agents/threads/workspaces depth). Do not reintroduce Firebase dual path unless needed for data migration of a live app (template: greenfield D1 only).

---

## 5. Files worth reading before coding a slice

| Topic | Path in BlogBat (or Supportsheep twin) |
| --- | --- |
| Master migration design | `docs/superpowers/specs/2026-06-02-blogbat-m2-master-migration-design.md` |
| createApiHandler | `apps/web/src/lib/create-api-handler.ts` |
| Session dual / BA | `apps/web/src/lib/auth/session.ts` |
| Better Auth factory | `apps/web/src/lib/auth/better-auth.ts` |
| CF email magic link | `apps/web/src/lib/auth/send-magic-link-email.ts` |
| getDb / getDbRaw | `apps/web/src/db/index.ts` |
| Domain slice example | categories design + repo under `apps/web/src/lib/categories` |
| Deploy CI | `supportsheep/.github/workflows/deploy.yml` desert (main→staging, release→prod) |
| Wrangler real envs | `apps/web/wrangler.jsonc` send_email + D1 + R2 + routes |
| Security follow-ups | `supportsheep/docs/fable-findings/round2-security.md` |

---

## 6. One-line principle

**Ship the factory by domain slices on a bootable Workers runtime; never leave `firebase-admin` on the Workers graph; tenant identity is server-resolved; email is Cloudflare.**