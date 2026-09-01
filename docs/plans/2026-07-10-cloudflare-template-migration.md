# Cloudflare Template Migration Plan

Date: 2026-07-10

Goal: create `master-template-cloudflare` as a Cloudflare-native successor template without touching `master-template-netlify-firebase`.

## Inputs Used

- GLM 5.2 sidecar through Pi for migration critique and risk list.
- Gemini personal sidecar for a second checklist. It could not access sibling repos from its sandbox, so concrete config from that output is treated as untrusted.
- Content Rabbit read-only reference at `/Users/parab/Documents/Personal/content-rabbit/code/Content Rabbit`.
- Cloudflare docs checked on 2026-07-10:
  - Next.js on Workers via OpenNext: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
  - D1 overview: https://developers.cloudflare.com/d1/
  - Queues overview: https://developers.cloudflare.com/queues/
  - R2 overview: https://developers.cloudflare.com/r2/

## Target Architecture

Use Cloudflare Workers as the full-stack runtime, with the Next.js app built by `@opennextjs/cloudflare`.

Primary components:

- `apps/web`: Next.js app, route handlers, UI, auth screens, server actions.
- `apps/web/cloudflare/app-worker/wrangler.jsonc`: authoritative OpenNext worker config.
- `workers/queue-consumer`: separate queue consumer Worker.
- `workers/cron`: separate scheduled Worker.
- `packages/db`: D1 schema, migrations, query helpers.
- `packages/storage`: R2 helpers.
- `packages/auth`: auth/session helpers.
- `packages/jobs`: queue message contracts and producers.
- `packages/config`: shared env validation and feature flags.

Cloudflare services:

- Workers and Workers Assets for the app.
- D1 for relational application data.
- R2 for uploads and generated assets.
- KV for cache, feature flags, short-lived app state, and possibly session indexes.
- Queues for async jobs.
- Cron Triggers for scheduled jobs.
- Turnstile for abuse protection.
- Durable Objects later only when realtime rooms or strongly consistent per-room state are required.

## Planned File Tree

```txt
master-template-cloudflare/
├── apps/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── cloudflare/
│       │   ├── app-worker/
│       │   │   └── wrangler.jsonc
│       │   └── docs/
│       │       └── README.md
│       ├── next.config.mjs
│       ├── open-next.config.ts
│       └── package.json
├── workers/
│   ├── queue-consumer/
│   │   ├── src/index.ts
│   │   └── wrangler.jsonc
│   └── cron/
│       ├── src/index.ts
│       └── wrangler.jsonc
├── packages/
│   ├── auth/
│   ├── config/
│   ├── db/
│   │   ├── migrations/
│   │   └── src/
│   ├── jobs/
│   └── storage/
├── docs/
│   ├── decisions/
│   └── plans/
├── .dev.vars.example
├── .gitignore
├── package.json
├── tsconfig.base.json
└── turbo.json
```

## Migration Map

Replace these old-template concepts:

- Netlify deploys -> Cloudflare Workers deploys through Wrangler.
- Netlify Functions -> route handlers or separate Workers.
- Netlify background functions -> Cloudflare Queues.
- Firebase scheduled functions -> Cloudflare Cron Triggers.
- Firestore -> D1 schema and migrations.
- Firebase Storage -> R2.
- Firebase Remote Config -> KV-backed feature flags or typed env vars.
- Firebase App Check / bot checks -> Turnstile.
- Firebase Auth -> D1/KV-compatible auth layer. Candidate: Better Auth or Auth.js with a Workers-compatible adapter.

Cut from the first migration:

- Realtime Firestore parity.
- Public UGC and moderation systems.
- Push notifications.
- Full-text search.
- AI/Vectorize/Workers AI defaults.
- Data backfill tooling from Firebase, unless a real app with production data requires it.
- Desktop/mobile packaging. This repo should first be a clean web template.

## Implementation Phases

### Phase 0: Inventory

Read-only inventory of `master-template-netlify-firebase`:

- Package manager and monorepo shape.
- Firebase imports and services used.
- Netlify files and deploy assumptions.
- Auth model, session model, protected route pattern.
- Storage/upload model.
- Background jobs and scheduled jobs.
- Environment variables and secrets.

Output: `docs/plans/firebase-netlify-inventory.md`.

### Phase 1: Cloudflare Skeleton

Create the template structure without porting product features:

- Root package scripts.
- `apps/web` Next.js app configured for OpenNext.
- App worker `wrangler.jsonc` with placeholder bindings.
- Separate queue and cron workers.
- Shared TypeScript config.
- `.dev.vars.example`.
- GitHub Actions CI with lint, typecheck, test, OpenNext build, and Wrangler validation.

### Phase 2: Data/Auth/Storage

Add reusable Cloudflare-native primitives:

- D1 schema and migrations.
- DB client helper using D1 binding.
- Auth/session layer.
- R2 helper for upload/download metadata.
- KV helper for feature flags and short cache entries.
- Queue message contracts and producer helper.

### Phase 3: Template Example App

Add a minimal SaaS-style example that proves the stack:

- Public page.
- Auth flow.
- Protected dashboard.
- D1-backed CRUD example.
- R2 upload example.
- Queue-backed async job example.
- Cron-backed maintenance example.
- Turnstile-protected form.

### Phase 4: Verification And Release

Run:

- Typecheck.
- Unit tests.
- D1 migration apply locally.
- OpenNext build.
- Wrangler preview or deploy dry-run.
- Browser smoke test for auth, CRUD, upload, queue enqueue, and protected route.

Then push an initial commit and keep this repo separate from the Netlify/Firebase repo.

## Config Principles

Follow the Content Rabbit pattern:

- Keep app worker config under the app's `cloudflare/app-worker/` directory.
- Keep cron and queue consumers as separate Worker projects.
- Use `wrangler.jsonc` for app worker config.
- Use environment-specific bindings for staging and production.
- Generate binding types with Wrangler and commit the generated type file only if the template intentionally uses committed types.

OpenNext notes from current Cloudflare docs:

- Cloudflare documents Next.js on Workers through the OpenNext adapter.
- Preview should run in the Workers runtime through Wrangler because `next dev` runs in Node.js and is less production-like.
- Next.js on Cloudflare requires the `nodejs_compat` compatibility flag and a compatible date at or after Cloudflare's documented minimum.

## Risks

- Firestore to D1 is a data-model rewrite, not a mechanical rename.
- Firebase Auth account migration is hard. A template should ship a new auth baseline instead of pretending old users migrate automatically.
- Workers runtime incompatibilities will surface in packages that depend on Node-only APIs or native binaries.
- Queues are async and consumers must be idempotent.
- D1 is a relational SQLite-backed database. Design schemas and writes deliberately instead of porting document shapes directly.
- OpenNext support changes over time, so versions must be pinned and verified.
- Gemini sidecar output included plausible but unverified config details. Do not use generated IDs, made-up bucket names, or Pages-only commands from that output.

## Sidecar Follow-Ups To Verify

These came from sidecar review and should be verified locally before implementation:

- If OpenNext local dev initializes Miniflare bindings inside `next dev`, test third-party SDKs such as Stripe, Resend, and OpenAI. Do not add global `fetch`/`Request`/`Response` restoration code unless a real failure reproduces.
- If the template uses Better Auth, verify its CLI/schema generation path with D1. Some auth CLIs expect a local SQLite connection, while runtime code expects a Cloudflare D1 binding.
- Treat queue consumers as at-least-once. Add idempotency keys for email, webhook, and billing jobs from the first scaffold.
- Avoid direct high-frequency writes to D1 for realtime-ish features. Use Queues or later Durable Objects if write bursts appear.
- Use placeholder binding IDs in committed `wrangler.jsonc`; create real IDs only through setup scripts or documented manual steps.
- Confirm whether the legacy template has desktop/Tauri, Google Cloud Tasks, Firebase custom claims, or storage upload hooks before carrying over any related concept.

## Phase 1 Concrete Deliverables (synthesized from GLM + Gemini)

Phase 0 inventory is now complete in `firebase-netlify-inventory.md`. The following is the concrete Phase 1 target, synthesized from two independent sidecar passes and verified against the read-only inventory.

### Auth recommendation

Better Auth with the Organization plugin, D1 adapter, edge-native.

Justification: first-class Cloudflare Workers/D1 support, no Node polyfills, and the Organization plugin maps directly onto the existing multi-tenant model. This is the single biggest de-risking decision for the scaffold. Auth.js is the fallback if Better Auth's D1 schema-generation path proves brittle on Workers.

CRITICAL (opus review): Better Auth OWNS its auth schema. The Organization plugin generates and manages `user`, `session`, `account`, `organization`, `member`, `invitation` tables itself. Therefore:

- Map `workspaces` -> Better Auth `organization`.
- Map `workspace_members` -> Better Auth `member`.
- DROP the bespoke `users` and `sessions` D1 tables from the mapping below; let Better Auth own them.
- Keep the legacy Firebase uid only as a seed/migration column on the Better Auth user record, NOT as the PK Better Auth expects to mint.

This removes a schema collision the first D1 draft introduced.

### File tree (Phase 1 target)

```txt
master-template-cloudflare/
├── apps/
│   ├── web/                      # Next.js App Router -> OpenNext (@opennextjs/cloudflare)
│   │   ├── app/                  # routes
│   │   │   └── api/v1/           # route handlers (~48 to port incrementally)
│   │   ├── lib/
│   │   │   ├── db/               # Drizzle client from env.DB
│   │   │   ├── auth/             # Better Auth
│   │   │   ├── r2/               # R2 helpers
│   │   │   ├── email/            # Resend wrapper
│   │   │   └── ai/               # Vercel AI SDK
│   │   ├── migrations/           # D1 SQL (drizzle output)
│   │   ├── middleware.ts
│   │   ├── open-next.config.ts
│   │   ├── wrangler.jsonc        # app worker + bindings
│   │   ├── drizzle.config.ts
│   │   ├── next.config.ts
│   │   └── package.json
│   ├── desktop/                  # DEFER (Tauri, calls web API)
│   └── widget/                   # DEFER (embed, calls web API)
├── workers/
│   ├── queue-consumer/           # email + webhook queue consumers
│   └── cron/                     # reconcileStripeDaily
├── packages/
│   ├── db/                       # NEW - drizzle schema source of truth
│   │   └── src/schema/           # one file per D1 table
│   ├── email/                    # react-email + resend (unchanged)
│   ├── shared/                   # zod, utils (unchanged)
│   ├── types/                    # TS types (unchanged)
│   └── ui/                       # Radix design system (unchanged)
├── scripts/
│   └── seed.ts
├── turbo.json
├── package.json
├── bunfig.toml
├── .dev.vars.example
└── README.md
```

### Bindings map (legacy concern -> Cloudflare)

| Legacy concern | Binding | Name | Notes |
|---|---|---|---|
| Firestore (20 collections) | D1 | `DB` | Drizzle ORM, migrations under apps/web/migrations |
| Storage uploads | R2 | `UPLOADS` | presigned via worker, multipart complete |
| Storage agent assets | R2 | `ASSETS` | separate bucket |
| Session hot lookups | KV | `SESSIONS` | cache; D1 = source of truth |
| Feature flags / RemoteConfig | KV | `FEATURES` | list+get, ~60s TTL |
| Public agent keys / webhook secret cache | KV | `PUBLIC` | low-write read-heavy |
| Visitor rate limits | KV | `RL` | optional |
| dispatchWebhookOnMessageCreated | Queue + worker | `WEBHOOK_QUEUE` | enqueue on messages insert; DLQ + retries |
| sendEmailTask | Queue + worker | `EMAIL_QUEUE` | Resend call in consumer |
| reconcileStripeDaily | Cron Trigger | `[triggers].crons` | daily 03:00 UTC |
| Visitor captcha | Turnstile | siteKey var + secret | replaces VISITOR_CAPTCHA_* |
| Secrets (Stripe/Resend/Anthropic/SESSION_SECRET) | Workers secrets | env.* | not bindings |
| AI inference (optional) | Workers AI | `AI` | if dropping direct provider calls |
| Agent memory semantic retrieval | Vectorize | `MEMORY_VECTORS` | D1 has NO vector search; agent_memory.embedding is dead storage without this binding. Decide now: Vectorize for similarity, or embeddings are not a feature. |
| Observability | Analytics Engine / Logpush | `ANALYTICS` | keep client SDKs for PostHog/GA |

### D1 schema mapping (tenant-scoped, workspace_id on all tenant tables)

| Legacy collection | D1 table | PK | Key columns |
|---|---|---|---|
| workspaces | BETTER AUTH `organization` | id | (managed by Better Auth Organization plugin; add plan/stripe_customer_id as app columns) |
| workspace_members | BETTER AUTH `member` | id | (managed by Better Auth; role via member.role) |
| users | BETTER AUTH `user` | id | (managed by Better Auth; legacy firebase_uid kept as optional seed column) |
| sessions | BETTER AUTH `session` | id | (managed by Better Auth; do not hand-roll) |
| agents | `agents` | id | workspace_id, name, model, system_prompt, public_key (UNIQUE), temperature |
| agent_memory | `agent_memory` | id | workspace_id, agent_id, kind, content, vectorize_index_id (semantics live in Vectorize, not D1) |
| agent_skills/skills | `agent_skills` | id | workspace_id, agent_id, name, definition (JSON), enabled |
| agent_integrations | `integrations` | id | workspace_id, agent_id, provider, config (JSON, encrypted), connected |
| threads | `threads` | id | workspace_id, agent_id, user_id, title, status |
| messages | `messages` | id | workspace_id, thread_id, role, content, tokens_in, tokens_out |
| items | `items` | id | workspace_id, type, data (JSON), owner_id |
| tools | `tools` | id | workspace_id, name, kind, config (JSON), enabled |
| uploads | `uploads` | id | workspace_id, user_id, filename, r2_key (UNIQUE), size, content_type, status |
| webhooks | `webhooks` | id | workspace_id, url, secret_hash, events (JSON), active |
| audit_logs | `audit_logs` | id | workspace_id, actor_uid, action, target_type, target_id, metadata (JSON) |
| settings | `settings` | id | workspace_id, key, value (UNIQUE workspace_id+key) |

Conventions: workspace_id TEXT FK indexed on all tenant tables. UUIDs as TEXT. JSON as TEXT. Timestamps ISO-8601 TEXT. Indexes: idx_(table)_workspace_id, idx_messages_thread_id, idx_workspace_members_user_id, idx_audit_logs_created_at. Auth tables (user/session/account/organization/member/invitation) are owned by Better Auth; do not add app-level PK conventions to them.

### Top risks (ranked, specific to this legacy template)

1. 48 route handlers depend on Node APIs (Stripe SDK, Firebase Admin, Resend). On Workers these need compatibility flags or library swaps. Highest implementation risk.
2. Vercel AI SDK streaming on Workers: LLM streaming is I/O wait on the fetch to the provider, which does NOT count against Workers CPU time (30s default, 5min paid). The real ceilings are subrequest duration + overall request wall-time. Do NOT pre-split routes for this; let the spike measure actual numbers first.
3. D1 multi-tenancy: Firestore's exists() security rules become relational queries; a missed workspace_id filter leaks across tenants. Enforce in middleware + service layer, not just routes.
4. Firestore triggers -> Queues: enqueue-after-commit cannot be made atomic and IS the dual-write bug. Use a TRANSACTIONAL OUTBOX: insert the message row + an outbox row in the same D1 `batch()`, then drain outbox->Queue via a consumer/cron. The spike must exercise this pattern, not just a plain read/write.
5. Tauri desktop cookie/CORS: moving off Firebase Auth to session cookies risks cross-origin / secure-cookie domain issues in the Tauri webview (deferred to after web MVP).
6. Stripe webhook D1 concurrency: burst webhooks can cause D1 lock contention. Serialize via Queue with idempotency keys.
7. TipTap SSR bundle size can approach Workers script limits; may need dynamic imports / route splitting.

### Highest-leverage validation test (do this FIRST, before scaffolding the whole template)

Deploy ONE minimal OpenNext App Router route to a worker that simultaneously:

- authenticates via Better Auth (D1 adapter),
- reads + writes a row to D1,
- streams a response via Vercel AI SDK,
- writes a message + outbox row in a single D1 `batch()` and drains the outbox to a Queue (proves the transactional-outbox pattern for the trigger->queue replacement).

This validates edge-runtime compatibility, bundle-size limits, stream timeouts, the Better-Auth-on-D1 path, AND the outbox pattern before committing to the full scaffold. If this fails, adjust the auth provider / streaming / outbox strategy before building anything else.

## Execution Status (2026-07-11)

Completed:

- Phase 0 read-only legacy inventory: `firebase-netlify-inventory.md`.
- Transactional outbox D1 + Queue spike: PASSED and committed at `spike/outbox-d1/`.
- Phase 1 scaffold: OpenNext app, D1/Drizzle migrations, Better Auth, Organization plugin + workspace mirror, protected D1 notes CRUD, and separate authenticated Cron Worker.
- Phase 2 reusable Cloudflare-native primitives: Added `@template/config` (KV feature flags), `@template/storage` (direct R2 streaming helpers), `@template/jobs` (typed outbox message contracts and producer helper), and a separate `workers/queue-consumer` background worker with KV-based idempotency checks.
- Phase 3 Template Example App proof surfaces: Implemented interactive frontend and secure backend API routes for R2 file uploads/downloads, Queue job enqueues, KV feature flags toggling, and Turnstile CAPTCHA protected contact submissions with async confirmation auto-responders.
- Local verification: Fully type-checked, unit-tested (using `bun test` in packages), database migrated, and smoke tested on local Wrangler port 8788. All flows are 100% green and verified.
- Final code review: claude-personal Sonnet VERDICT: SHIP. Its cron-test auth and workspace-member idempotency findings were fixed and re-verified.

Deferred validation:

- Vercel AI SDK streaming with a real provider key.
- Stripe/Resend compatibility on Workers.
- Tauri cookie/CORS behavior.
- Remote staging/prod Cloudflare resource provisioning and deployment.

## Next Concrete Step

Build the HumanOrVibe vertical slice on this scaffold: curated daily run -> four binary guesses -> result/podium -> same-seed friend challenge -> persisted score/leaderboard. Delegate schema/content/routes first passes to Gemini personal or GLM; integrate and verify in the main agent.
