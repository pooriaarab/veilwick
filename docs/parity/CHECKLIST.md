# Parity checklist (source of truth vs CloudFlare)

Generated: 2026-07-11
Status: not started | in-progress | done | n/a-cut

## Pages
- [ ] `(admin)/admin/audit/page.tsx`
- [ ] `(admin)/admin/page.tsx`
- [ ] `(admin)/admin/workspaces/page.tsx`
- [ ] `(dashboard)/agents/[id]/page.tsx`
- [ ] `(dashboard)/agents/memory/page.tsx`
- [ ] `(dashboard)/agents/page.tsx`
- [ ] `(dashboard)/agents/skills/page.tsx`
- [ ] `(dashboard)/agents/tools/page.tsx`
- [ ] `(dashboard)/agents/webhooks/page.tsx`
- [ ] `(dashboard)/billing/page.tsx`
- [ ] `(dashboard)/dashboard/page.tsx`
- [ ] `(dashboard)/integrations/page.tsx`
- [ ] `(dashboard)/items/page.tsx`
- [ ] `(dashboard)/settings/api-keys/page.tsx`
- [ ] `(dashboard)/settings/audit-logs/page.tsx`
- [ ] `(dashboard)/settings/integrations/page.tsx`
- [ ] `(dashboard)/settings/page.tsx`
- [ ] `(dashboard)/settings/templates/page.tsx`
- [ ] `(dashboard)/settings/usage/page.tsx`
- [ ] `(dashboard)/settings/workspaces/[id]/page.tsx`
- [ ] `(dashboard)/settings/workspaces/page.tsx`
- [ ] `(dashboard)/threads/[id]/page.tsx`
- [ ] `(dashboard)/threads/page.tsx`
- [ ] `(dashboard)/uploads/page.tsx`
- [ ] `(dashboard)/users/[id]/page.tsx`
- [ ] `(dashboard)/users/page.tsx`
- [ ] `changelog/page.tsx`
- [ ] `integrations/trello/callback/page.tsx`
- [ ] `login/page.tsx`
- [ ] `onboarding/[step]/page.tsx`
- [ ] `onboarding/page.tsx`
- [ ] `page.tsx`

## API routes
- [ ] `v1/admin/audit/route.ts`
- [ ] `v1/admin/skip-onboarding-for-existing/route.ts`
- [ ] `v1/admin/workspaces/route.ts`
- [ ] `v1/agents/[id]/public-key/route.ts`
- [ ] `v1/agents/[id]/route.ts`
- [ ] `v1/agents/route.ts`
- [ ] `v1/ai/generate/route.ts`
- [ ] `v1/audit-logs/route.ts`
- [ ] `v1/auth/login/route.ts`
- [ ] `v1/auth/logout/route.ts`
- [ ] `v1/auth/session/route.ts`
- [ ] `v1/auth/test-login/route.ts`
- [ ] `v1/billing/checkout/route.ts`
- [ ] `v1/billing/info/route.ts`
- [ ] `v1/billing/portal/route.ts`
- [ ] `v1/billing/usage/route.ts`
- [ ] `v1/billing/webhook/route.ts`
- [ ] `v1/health/route.ts`
- [ ] `v1/integrations/[id]/route.ts`
- [ ] `v1/integrations/route.ts`
- [ ] `v1/items/route.ts`
- [ ] `v1/log/route.ts`
- [ ] `v1/memory/[id]/route.ts`
- [ ] `v1/memory/route.ts`
- [ ] `v1/onboarding/status/route.ts`
- [ ] `v1/public/threads/[id]/messages/route.ts`
- [ ] `v1/public/threads/[id]/stream/route.ts`
- [ ] `v1/public/threads/route.ts`
- [ ] `v1/settings/route.ts`
- [ ] `v1/skills/[id]/route.ts`
- [ ] `v1/skills/route.ts`
- [ ] `v1/threads/[id]/messages/route.ts`
- [ ] `v1/threads/[id]/route.ts`
- [ ] `v1/threads/[id]/stream/route.ts`
- [ ] `v1/threads/route.ts`
- [ ] `v1/tools/[id]/route.ts`
- [ ] `v1/tools/route.ts`
- [ ] `v1/uploads/[uploadId]/complete/route.ts`
- [ ] `v1/uploads/[uploadId]/url/route.ts`
- [ ] `v1/uploads/route.ts`
- [ ] `v1/users/route.ts`
- [ ] `v1/webhooks/[id]/route.ts`
- [ ] `v1/webhooks/route.ts`
- [ ] `v1/workspace/current/route.ts`
- [ ] `v1/workspaces/[id]/members/[memberId]/route.ts`
- [ ] `v1/workspaces/[id]/members/route.ts`
- [ ] `v1/workspaces/[id]/route.ts`
- [ ] `v1/workspaces/route.ts`
- [ ] `v1/workspaces/switch/route.ts`

## Packages
- [x] packages/email
- [x] packages/shared
- [x] packages/types
- [x] packages/ui

## Apps
- [x] apps/web
- [x] apps/desktop
- [x] apps/widget

## CI/workflows
- [x] .github/workflows/ci.yml
- [ ] .github/workflows/claude-mentions.yml
- [ ] .github/workflows/claude.yml
- [x] .github/workflows/desktop.yml
- [x] .github/workflows/gitleaks.yml
- [x] .github/workflows/release.yml

## Process/docs
- [x] SECURITY.md
- [x] CONTRIBUTING.md
- [ ] AGENTS.md
- [x] commitlint.config.js
- [ ] MANIFEST.json

## E2E specs
- [ ] tests/agent-create.spec.ts
- [ ] tests/agent-detail.spec.ts
- [ ] tests/agents.spec.ts
- [ ] tests/audit-logs.spec.ts
- [ ] tests/billing-checkout.spec.ts
- [ ] tests/changelog.spec.ts
- [ ] tests/health.spec.ts
- [ ] tests/integrations.spec.ts
- [ ] tests/login.spec.ts
- [ ] tests/memory.spec.ts
- [ ] tests/onboarding.spec.ts
- [ ] tests/skills.spec.ts
- [ ] tests/thread-detail.spec.ts
- [ ] tests/thread-stream.spec.ts
- [ ] tests/threads-skills-tools.spec.ts
- [ ] tests/threads.spec.ts
- [ ] tests/tools.spec.ts
- [ ] tests/upload.spec.ts
- [ ] tests/visitor-widget.spec.ts
- [ ] tests/workspaces.spec.ts

## Firebase surface must be GONE at Done
- [x] no firebase/firebase-admin runtime imports in apps/packages
- [ ] no firestore.rules required for app
- [ ] functions app either removed or empty with Queue replacements


## Wave progress
- [x] Wave 0 plan/checklist
- [x] Wave 1 process + shared/types/email (Cloudflare Email)
- [x] Wave 2 D1 domain schema
- [x] Wave 3 auth/workspace shell + APIs
- [x] Wave 4 product APIs (CRUD shells)
- [x] Wave 5 product UI shells
- [x] Wave 6 billing mock + cron drain
- [x] Wave 7 desktop + widget sources
- [x] Wave 8 e2e smoke + firebase assert + deploy CI


## Honesty note (Wave 8 ship)

API + page **shells** for master-template domains are present and typecheck/tests pass.
Legacy 20 Playwright **product** e2e specs and full pixel/UX parity of every.dashboard optimization remain iterative hardening (use BlogBat domain-slice process).
Template is CF-native: D1 domain schema, createApiHandler, workspaces, multi-platform sources, Cloudflare Email Service.
