# Migration Status: master-template → master-template-cloudflare

Date: 2026-07-11

## Short answer

**No — this is not a complete 1:1 clone/migration of every surface from `master-template-netlify-firebase`.**

What exists is a **Cloudflare-native successor template**: same monorepo intent (Bun + Turbo + Next App Router), but runtime and data collected under Cloudflare (Workers / OpenNext / D1 / R2 / KV / Queues / Better Auth / Turnstile).

The legacy repo remains untouched at:

`/Users/parab/Documents/Personal/master-template-netlify-firebase`

## What moved / was reimplemented

| Legacy concept | Cloudflare status |
| --- | --- |
| Bun + Turbo monorepo | ✅ |
| Next.js App Router | ✅ (OpenNext Workers) |
| Auth sessions | ✅ Better Auth + D1 (not Firebase Auth) |
| Relational app data | ✅ D1 + Drizzle (not Firestore) |
| Object uploads | ✅ R2 + `upload` table (not Firebase Storage) |
| Background jobs | ✅ Queues + `workers/queue-consumer` (not Cloud Functions triggers) |
| Scheduled jobs | ✅ `workers/cron` HTTP callback (not Firebase scheduled functions) |
| Bot/captcha | ✅ Turnstile (template contact form) |
| Feature flags | ✅ KV `FLAGS` |
| Multi-tenant workspaces shell | ✅ Better Auth Organization + D1 workspace mirror (minimal) |
| Notes CRUD example | ✅ |
| **Landing page design system** | ✅ Ported! Full landing sections, headers, and footer ported and styled with Tailwind v4. |
| **Full `@repo/ui` product shell** | ✅ Ported packages/ui to `@template/ui` with full primitives + composites. |
| Agents / threads / billing / items UIs | ❌ Deferred (product features, not platform primitives) |
| Tauri desktop / visitor widget | ❌ Explicitly cut from v1 |
| Stripe billing parity | ❌ Deferred |
| AI SDK chat/template agents | ❌ Deferred |
| Firebase → Cloudflare account backfill | ❌ N/A for template (new auth baseline) |

## Phase checklist

| Phase | Intent | Status |
| --- | --- | --- |
| 0 | Inventory Firebase/Netlify surface | ✅ `docs/plans/firebase-netlify-inventory.md` |
| 1 | Cloudflare skeleton + auth + notes | ✅ |
| 2 | packages config/storage/jobs + R2/KV/queue | ✅ |
| 3 | Example proof app (upload, job, turnstile, flags) | ✅ |
| 4 | Local verification + deploy dry-run + provision scripts | ✅ local smoke + dry-run; remote resource scripts |
| 4b | Design system + landing parity with old template | ✅ Completed! Ported @template/ui and full SaaS landing. |
| Later | Full SaaS dashboard product surfaces | Not started |

## Design system honesty

Old template home is a **marketing landing** composed of:

- `apps/web/src/components/landing/*` (hero, marquee, features, pricing, FAQ, …)
- `packages/ui` Radix/shadcn primitives
- Tailwind v4 + extensive CSS variables / theme presets

Cloudflare template home after Phase 1–3 was a **scaffold capability card**, not that design system. That was a real gap vs “migrate everything.”

## Runtime verification (Phase 4 local)

Commands:

```bash
bun run typecheck
bun run test
cd apps/web && bun run db:migrate:local && bun run build:worker
bunx wrangler deploy -c cloudflare/app-worker/wrangler.jsonc --dry-run --env=""
```

Live smoke on `http://localhost:8788`: signup, notes CRUD, R2 upload put/complete/get, queue job enqueue, Turnstile contact (dev bypass).