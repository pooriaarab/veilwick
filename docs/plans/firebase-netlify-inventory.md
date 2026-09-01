# Firebase/Netlify Inventory Checklist

Purpose: capture what the legacy `master-template-netlify-firebase` does before building Cloudflare replacements.

Rule: inspect the legacy repo read-only. Do not edit it.

Status: FILLED 2026-07-10 via read-only inspection + GLM/Gemini sidecar synthesis.

## Repo Shape

- Package manager: Bun 1.3.9 (`packageManager: "bun@1.3.9"`)
- Monorepo or single app: Monorepo via Turbo (`turbo@^2.8.15`), Node >=22
- Framework: Next.js App Router (apps/web), Firebase Cloud Functions (apps/web/functions)
- App router/pages router: App Router
- Test tooling: Vitest (unit), Playwright (E2E), Firestore rules tests via emulator
- Build command: `next build` (NODE_OPTIONS='--max-old-space-size=4096')
- Deploy command: web is self-hosted `next start`; functions via `firebase deploy --only functions`

## Netlify Surface

IMPORTANT: there is NO `netlify.toml`. The "netlify" part of the legacy repo name is a misnomer. The actual deploy story is self-hosted Next.js + Firebase Cloud Functions. Nothing to migrate from Netlify specifically.

- `netlify.toml`: none
- `_redirects` / `_headers`: none
- Netlify Functions / Background / Scheduled / Forms / Blobs / Identity: none

## Firebase Surface

- Firebase client SDK imports: `firebase@^12.7.0` (apps/web/src/contexts/auth-context.tsx + client routes)
- Firebase Admin SDK imports: `firebase-admin@^13.6.0` (apps/web/functions/src/firebase.ts, scripts)
- Auth: Firebase Auth client SDK + custom session cookies via /api/v1/auth routes; DEV_AUTH_BYPASS for dev login
- Firestore: 20 collections (see Data Model below), workspace-scoped multi-tenant rules
- Realtime Database: none
- Storage: Firebase Storage (uploads + agent assets), storage.rules present
- Functions: nodejs22 runtime, 3 exports (see Background Work)
- Scheduled functions: `reconcileStripeDaily` (cron)
- Cloud Messaging: none
- App Check: none (visitor captcha via VISITOR_CAPTCHA_PROVIDER/SECRET)
- Analytics: PostHog + GA + Clarity via NEXT_PUBLIC_*
- Emulators: firestore (8080), auth (9099), functions (5001), ui (4000)
- Environment variables: see Environment And Secrets

## Data Model

Legacy Firestore collections and their Cloudflare D1 target. Multi-tenant via `workspaceId`.

| Legacy path | Purpose | Query shapes | Write frequency | Cloudflare target |
| --- | --- | --- | --- | --- |
| workspaces | tenant root | by id, by owner | low | D1 `workspaces` |
| workspace_members | membership (`<wsid>_<uid>` deterministic id) | exists() by ws+uid | low | D1 `workspace_members` |
| users | user profile | by email (unique), by firebase uid | low | D1 `users` |
| sessions | session cookies | by token (unique) | med | D1 `sessions` + KV SESSIONS cache |
| agents | agent config | by workspace, by public_key | low | D1 `agents` |
| agent_memory | agent memory store | by agent, kind | med | D1 `agent_memory` |
| agent_skills / skills | agent skill defs | by agent | low | D1 `agent_skills` |
| agent_integrations | per-agent creds/config | by agent | low | D1 `integrations` (encrypted config) |
| threads | conversation root | by workspace+user | med | D1 `threads` |
| messages | thread messages | by thread, onMessageCreated trigger | high | D1 `messages` + Queue WEBHOOK_QUEUE |
| items | generic workspace items | by workspace, type | med | D1 `items` |
| tools | tool defs | by workspace | low | D1 `tools` |
| uploads | upload metadata | by workspace+user | med | D1 `uploads` (+ R2 object) |
| webhooks | webhook targets + secret | by workspace | low | D1 `webhooks` (secret_hash only) |
| audit_logs | audit trail | by workspace, actor, time | med | D1 `audit_logs` |
| settings | per-workspace settings | by workspace+key | low | D1 `settings` UNIQUE(wsid,key) |
| visitor_sessions | public visitor sessions | by session | high | KV (ephemeral) |
| smoke / _test | test fixtures | - | - | test fixtures only, drop from prod |

## Auth And Sessions

- Current providers: Firebase Auth (email/password + OAuth implied), custom session cookies via /api/v1/auth/{login,logout,session,test-login}
- Session storage: signed cookies validated against `sessions` collection
- Protected route pattern: Next.js middleware + server-side checks in route handlers
- Server-side auth checks: route handlers read session cookie -> sessions collection -> user
- Client-side auth checks: auth-context.tsx React context
- DEV_AUTH_BYPASS / DEV_AUTH_EMAIL / DEV_AUTH_ADMIN for dev login
- Account migration needed for real apps: YES (Firebase Auth accounts don't auto-migrate; template should ship a new auth baseline, not pretend old users move)
- Cloudflare recommendation: Better Auth with Organization plugin (matches workspaces/workspace_members multi-tenant shape), D1 adapter, edge-native

## Storage And Uploads

- Upload entry points: /api/v1/uploads (create), /api/v1/uploads/[id]/url (presigned), /api/v1/uploads/[id]/complete (multipart complete)
- File types: arbitrary (agent assets, user uploads)
- Max file size assumptions: multipart supported
- Access control: workspace-scoped via rules
- Public URL strategy: via uploads metadata + presigned URLs
- Background processing: none beyond multipart complete
- Cloudflare R2 target design: R2 bucket `UPLOADS` (+ optional `ASSETS`), presigned URLs via worker, multipart via R2 helpers

## Background Work

| Legacy job/function | Trigger | Inputs | Side effects | Cloudflare target |
| --- | --- | --- | --- | --- |
| dispatchWebhookOnMessageCreated | Firestore onMessageCreated trigger | message doc | HTTP POST to registered webhooks | Queue producer in route handler + Queue consumer worker (with DLQ) |
| sendEmailTask | callable/task | email payload | Resend send | Queue EMAIL_QUEUE + consumer worker |
| reconcileStripeDaily | scheduled cron | - | Stripe subscription reconciliation | Cron Trigger worker (daily) |

Note: D1 has no triggers. The onMessageCreated behavior must move app-side: enqueue inside the message-create route handler after the D1 insert.

## Scheduled Work

| Legacy schedule | Purpose | Cloudflare Cron target |
| --- | --- | --- |
| reconcileStripeDaily | daily Stripe subscription reconciliation | `[triggers].crons: ["0 3 * * *"]` on a worker |

## Environment And Secrets

Never paste secret values here. List names only.

| Name | Legacy use | Cloudflare target |
| --- | --- | --- |
| STRIPE_SECRET_KEY | Stripe API | Workers secret |
| STRIPE_WEBHOOK_SECRET | webhook signature verify | Workers secret |
| STRIPE_PRICE_PRO_MONTHLY / YEARLY | billing price IDs | Workers vars or KV FEATURES |
| STRIPE_PRICE_TEAM_MONTHLY / YEARLY | billing price IDs | Workers vars or KV FEATURES |
| RESEND_API_KEY | email | Workers secret |
| ANTHROPIC_API_KEY | AI SDK | Workers secret |
| EMAIL_FROM / EMAIL_REPLY_TO | email sender | Workers vars |
| DEV_AUTH_BYPASS / EMAIL / ADMIN | dev login | local `.dev.vars` only, never prod |
| NEXT_PUBLIC_FIREBASE_* (API_KEY, AUTH_DOMAIN, PROJECT_ID) | Firebase client | DROP (no Firebase) |
| FIREBASE_*EMULATOR_HOST | emulators | DROP (use wrangler dev + local D1) |
| NEXT_PUBLIC_ENVIRONMENT / APP_VERSION | runtime config | Workers vars |
| NEXT_PUBLIC_POSTHOG_KEY/HOST, GA_ID, CLARITY_ID | analytics | Workers vars (keep client SDKs) |
| NEXT_PUBLIC_SUPABASE_URL / ANON_KEY | (present, unused?) | verify usage; likely DROP |
| VISITOR_CAPTCHA_PROVIDER / SECRET | visitor captcha | Turnstile: TURNSTILE_SITE_KEY (var) + TURNSTILE_SECRET (secret) |
| SESSION_SECRET (new) | session signing | Workers secret |
| CREDENTIALS_KMS_KEY (new) | encrypt integration creds | Workers secret |

## Migration Decisions

- Keep: monorepo shape (Bun+Turbo), App Router, packages/{email,shared,types,ui}, Stripe billing, Resend email, AI SDK, Radix/Tiptap UI, multi-tenant workspace model
- Replace: Firestore -> D1 (+Drizzle), Firebase Storage -> R2, Firebase Auth -> Better Auth, Cloud Functions -> Queues/Cron in worker, visitor captcha -> Turnstile, RemoteConfig -> KV
- Cut from Cloudflare template v1: Tauri desktop (defer), widget (defer), Firestore emulators (use wrangler dev), security-rules layer (enforce in middleware/handlers), DEV_AUTH_BYPASS prod paths
- Requires a real-app migration script: Firestore->D1 backfill only if a production app with real data needs it; a template ships empty
- Requires user-visible reset or re-auth: YES for any real app (new auth baseline); no for a fresh template

## Verification After Port

- OpenNext build: `npx @opennextjs/cloudflare build`
- Wrangler preview: `wrangler dev`
- D1 migrations local: `wrangler d1 migrations apply --local`
- Auth smoke test: signup -> session -> protected route
- R2 upload smoke test: create upload -> presigned PUT -> complete -> read
- Queue enqueue/consume smoke test: enqueue email message -> consumer sends via Resend mock
- Cron local trigger smoke test: `wrangler dev --test-scheduled` + `curl /__scheduled`
- No Firebase dependencies: `grep -r firebase apps/web/src packages && echo FAIL`
- No Netlify dependencies: `ls netlify* && echo FAIL` (should be none)
