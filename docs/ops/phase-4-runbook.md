# Phase 4 Runbook — Verification & Release

## Local verification (required before claim of Phase 4)

```bash
cd /Users/parab/Documents/Personal/master-template-cloudflare
bun install
bun run typecheck
bun run test
cd apps/web
bun run db:migrate:local
bun run build:worker
# dry-run deploy (no remote) — temp top-level env
bunx wrangler deploy -c cloudflare/app-worker/wrangler.jsonc --dry-run --env=""
# live local preview
bunx wrangler dev -c cloudflare/app-worker/wrangler.jsonc --local --port 8788
```

Smoke checklist on `http://localhost:8788`:

1. Home page renders (post design-system port: marketing landing)
2. Sign up email/password → session cookie
3. Protected notes create/list
4. R2 upload: create → PUT content → complete → GET content
5. Queue demo enqueue returns jobId
6. Contact form returns success (Turnstile bypass only when `ENVIRONMENT!=production` and no secret)

## Remote provision (optional — mutates your Cloudflare account)

```bash
# creates template-db, template-tag-cache, template-inc-cache,
# template-flags, template-uploads, template-outbox
./scripts/provision-cloudflare.sh

# or auto-patch wrangler production IDs after create:
./scripts/provision-cloudflare.sh --write
```

Then:

```bash
cd apps/web
bunx wrangler secret put BETTER_AUTH_SECRET -c cloudflare/app-worker/wrangler.jsonc --env production
bunx wrangler secret put CRON_SECRET -c cloudflare/app-worker/wrangler.jsonc --env production
# optional:
# bunx wrangler secret put TURNSTILE_SECRET_KEY ...
# bunx wrangler secret put RESEND_API_KEY ...
bun run db:migrate:remote
bun run deploy   # or: bunx wrangler deploy -c cloudflare/app-worker/wrangler.jsonc --env production
```

Also deploy side workers:

```bash
cd workers/cron && bunx wrangler deploy
cd workers/queue-consumer && bunx wrangler deploy
```

## What Phase 4 is NOT

- Not a full product clone of legacy agents/threads/billing UIs
- Not automatic Firebase Auth user migration
- Not required to use real Turnstile/Resend keys for local scaffold

See `docs/migration-status.md` for the honest port matrix.