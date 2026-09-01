# Master Template Cloudflare

Cloudflare-native successor template for full-stack apps.

This repo is intentionally separate from `master-template-netlify-firebase`. Do not edit the Netlify/Firebase template while building this one.

## Direction

- Next.js on Cloudflare Workers through the OpenNext Cloudflare adapter.
- Cloudflare D1 for relational app data.
- Cloudflare R2 for object storage.
- Cloudflare KV for small cached state, feature flags, and session-adjacent data.
- Cloudflare Queues for background work.
- Cloudflare Cron Triggers for scheduled jobs.
- Cloudflare Turnstile for abuse protection.

## Current Status

All core infrastructure and UI elements are fully migrated or defined:

- **Auth, Storage, and Data Path:** Successfully migrated to Cloudflare-native equivalents (D1, Better Auth, R2, and KV).
- **UI Design System & SaaS Landing Page:** Successfully ported! The design system package (`@template/ui`) includes the full primitives + composites codebase (Tailwind v4 / PostCSS). The homepage now renders the rich, multi-section SaaS landing layout (hero, integration-marquee, features, how-it-works, pricing, FAQ, and footer) styled identically to the reference.
- **Next.js App Router (OpenNext):** Full-stack server and UI layer with zero filesystem dependency.
- **Relational SQL (D1 + Drizzle):** Migrations and type-safe schema with Notes and Uploads models.
- **Object Storage (R2 Bucket):** Direct, streaming R2 file upload/download integration (`@template/storage`).
- **Distributed Cache & Flags (KV):** High-performance real-time feature flag get/set wrappers (`@template/config`).
- **Asynchronous Jobs (Queues):** Transactional outbox-compatible contract queue dispatcher (`@template/jobs`).
- **軽軽量 Queue Consumer Worker:** Background worker (`workers/queue-consumer`) that consumes jobs, enforces idempotency using KV, and handles simulated or real Resend emails.
- **Scheduled Tasks (Cron Triggers):** Independent Cron worker calling Next.js self-callback URLs.
- **Spam Protection (Turnstile):** Contact form with Turnstile siteverify verification and queue-based auto-responders.
- **Full Product Dashboard (Deferred):** The remaining complex workspace product UI dashboards (agents, threads, billing, workspace management pages) from the old template are deferred and not ported in this stage.

The migration decisions and read-only legacy inventory remain in:

- `docs/plans/2026-07-10-cloudflare-template-migration.md`
- `docs/plans/firebase-netlify-inventory.md`

## Quick Start

```bash
bun install
# Copy development variables
cp .dev.vars.example .dev.vars
# Run database migrations
bun run db:migrate:local
# Run unit tests to verify storage and jobs helper packages
bun run test
# Build the next app and workers
bun run build && bun run --filter @template/web build:worker
# In another terminal, from apps/web:
bunx wrangler dev -c cloudflare/app-worker/wrangler.jsonc --local --port 8788
```

Then open `http://localhost:8788`, register/sign in, and use the fully interactive capabilities (D1 Notes, R2 uploads, Queue enqueues, KV feature flags, and Turnstile contact form).

## Reference Sources

- Content Rabbit Cloudflare implementation, read-only reference:
  `/Users/parab/Documents/Personal/content-rabbit/code/Content Rabbit`
- Legacy template, read-only only if inventory is needed:
  `/Users/parab/Documents/Personal/master-template-netlify-firebase`
