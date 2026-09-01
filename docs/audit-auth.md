# VeilWick Auth / Age Gate / 2257 / Payments Audit

Date: 2026-09-01 — project root `apps/web` (Next 15 + Better Auth + D1 + OpenNext/Cloudflare)

## Summary verdict

| Domain | Status | Risk before NSFW goes public |
|--------|--------|------------------------------|
| Age gate — client dialog | Implemented | Low (works as UX) |
| Age gate — httpOnly cookie + server enforcement | Partial — middleware protects page + API routes, but coverage gaps remain | High if NSFW ships without closing gaps |
| 2257 statement | Implemented as fictional-demo disclosure (footer + `/legal/2257`) | High — custodian is placeholder, no record-keeping prod flow |
| Better Auth (email/password + org) | Implemented (D1/Drizzle adapter, org mirror) | Medium — email verification off, no NSFW paywall integration |
| Payments (CCBill / Stripe) | Stub / mock only — not wired | Blocker for paid NSFW |

---

## 1. Age gate

### 1.1 Client dialog — IMPLEMENTED

- **File:** `apps/web/src/components/age-gate.tsx`
- **Behaviour:** `Dialog` blocks UI until `I am 18 or older — Enter`. Persists in two places:
  - `localStorage` key `veilwick:age-verified:v1 = "1"` (immediate UI, client-read)
  - `document.cookie` `veilwick_age_verified=1` (non-httpOnly fallback, `SameSite=Lax`, 1-year)
  - Then `POST /api/age-verGate` (and alias `/api/age-gate` fallback) to set **httpOnly** cookie.
- **Bypass:** `enabled={false}` hides gate entirely — fed by KV flag (see 1.3).
- **Layout wiring:** `apps/web/app/(app)/layout.tsx` (`"use client"`). Fetches `GET /api/flags/age-gate` to decide `enabled`; skips gate for `pathname === "/legal/2257"` (public legal). Mounts `<AgeGate>` above `{children}` for all `/feed`, `/series`, `/live` pages.
- **Finding:** client gate is bypassable by design (editable cookie/localStorage). This is expected — real enforcement is `middleware.ts` httpOnly check. UX copy is safe: `Fictional demo environment. No real persons are depicted.` No explicit prompts in component.

### 1.2 Server cookie endpoints — IMPLEMENTED (both paths)

- `apps/web/app/api/age-verGate/route.ts` — `POST` sets `veilwick_age_verified=1` with `httpOnly: true`, `secure: production`, `SameSite=lax`, `path=/`, `maxAge= 1 year`. Accepts any JSON (`{verified:true}` optional).
- `apps/web/app/api/age-gate/route.ts` — identical alias. Client hits `age-verGate` first, falls back to `age-gate`.
- **Findings:**
  - No request validation beyond try/catch JSON — intentionally permissive (anyone who clicks confirm gets the cookie).
  - No CSRF token; relies on `SameSite=Lax` + `secure` in prod.
  - `GET` on both routes returns `{ok:true}` — no auth, no-op.

### 1.3 KV feature flag — IMPLEMENTED

- `apps/web/app/api/flags/age-gate/route.ts` — `GET` reads `FLAGS` KV via `getFlag(cfEnv.FLAGS, "age-gate", true)`.
- Safe defaults: if no `FLAGS` binding or KV error → `enabled: true` (fail-closed = gate on).
- **Gap:** dev/local without KV binding always defaults to enabled — gate cannot be toggled off without binding `FLAGS`. Document for `.dev.vars`/wrangler local.

### 1.4 Middleware — PARTIAL (protects `/feed` but gaps elsewhere)

- **File:** `apps/web/middleware.ts`
- Checks `request.cookies.get("veilwick_age_verified")?.value === "1"` only for paths where `isAgeGated(path) === true`.
- `isAgeGated` returns `true` for:
  - Pages: `/feed`, `/feed/*`, `/series`, `/series/*`, `/live`, `/live/*`
  - APIs: `/api/feed`, `/api/feed/*`, `/api/series`, `/api/series/*`
  - Public exception: `/legal/2257`, `/legal/2257/*` (and redundant `/legal/*` guard)
- **Enforcement:**
  - API gated path without cookie → `403 {error:"Age verification required", code:"age_gate_required"}`
  - Page gated path without cookie → `302 -> /` (landing, store-safe) with `?next=<path>`
- **Matcher (Next `config.matcher`) — this is the real gate for what the Worker executes:**
  ```ts
  ["/dashboard/:path*", "/dashboard", "/feed", "/feed/:path*",
   "/series", "/series/:path*", "/live/:path*", "/live",
   "/api/feed", "/api/feed/:path*", "/api/series", "/api/series/:path*"]
  ```
- **Gaps / stubs:**
  1. **No `/api/feed` → direct R2/media bypass?** `isAgeGated` covers `/api/feed` and `/api/series` but **not** `/api/live/*`, `/api/interaction`, `/api/generate`, or asset/R2 object routes. NSFW video delivery is via `/api/feed` + `/api/feed/prefetch` (covered) and direct R2/Uploads bindings (`template-uploads` bucket) — R2 object fetches bypass middleware if served via `/api/v1/uploads/*` or CDN domain.
  2. **Series videos served as R2 keys + external URLs** — `series` episodes store `videoUrl = videos/series/{slug}/epN.mp4` and `posterUrl` — served via R2 or `*.r2.dev`/`cdn.veilwick.com`. No httpOnly check on media fetch path documented.
  3. **Client bypass still renders before redirect:** `(app)/layout.tsx` is `"use client"` — age check is async fetch after mount; briefly renders gated content before redirect when navigating client-side. Middleware catches direct navigations/reloads but soft navigations may flash. Recommend `layout.tsx` as server component reading `cookies()` for flicker-free SSR gate (or keep middleware as authoritative gate and accept flash as UX-only).
  4. **No RTA header, no age-verGate rate limit.** RTA (`Rating: RTA-5042-1996-1400-1577-RTA`) label not emitted. No `Age-Gate` header or `block-all-mixed-content`.
  5. **`veilwick_age_verified` is forgeable** — value is literal `"1"` with no HMAC/signature. Any client can `document.cookie="veilwick_age_verified=1"`. For demo this is intentional; for prod NSFW barrier, consider signed token (`HMAC(secret, "1")`) or tying to session.

### 1.5 Recommendation before NSFW

- Extend `isAgeGated` + `config.matcher` to `/api/live/*`, `/api/interaction`, `/api/generate`, and any R2/media delivery route. Add a shared helper that also gates `GET /api/v1/uploads/:id/content` when `isNsfw`.
- Add `RTA` label: middleware `NextResponse.next().headers.set("X-RTA", "RTA-5042-1996-1400-1577-RTA")` or `<meta name="rating" content="RTA-5042-1996-1400-1577-RTA">` on gated layouts + `Rating` HTTP header for crawlers.
- Consider signing age cookie: `value = 1.<hmac>` validated in middleware with `BETTER_AUTH_SECRET` or dedicated `AGE_GATE_SECRET`.
- Move `(app)/layout.tsx` age logic server-side (`cookies()` + `KV` read) to eliminate flash; keep client dialog as progressive enhancement.

---

## 2. 2257 (18 U.S.C. § 2257 / 28 C.F.R. Part 75)

### 2.1 Footer disclosure — IMPLEMENTED

- `apps/web/src/components/landing/footer.tsx` — bottom strip:
  > `18 U.S.C. § 2257 — Fictional Demo: All persons depicted are AI-generated fictional adults 18+ — no real persons. Wan 2.4-14B synthetic wellness only.`
- `apps/web/app/page.tsx` — second 2257 strip below `<Footer>` with longer text (actual persons OR synthetic, records maintained, reliance on producer compliance).
- `apps/web/app/(app)/feed/page.tsx` — fixed bottom bar with 2257 notice (`All depictions are performed by consenting adults 18+ or are entirely synthetic.`).

### 2.2 Dedicated page — IMPLEMENTED (fictional-demo framing)

- `apps/web/app/(app)/legal/2257/page.tsx` — `force-dynamic`, `robots: index,follow`.
- Sections: Custodian of Records, Compliance Statement, Synthetic disclaimer, Age requirement (references `veilwick_age_verified` cookie, `SameSite=Lax`, 1y), Third-party content, No SFW version, Contact/Takedown, Fictional Demo Notice (amber callout).
- **Custodian block:**
  ```
  VeilWick LLC
  Custodian of Records — 18 U.S.C. § 2257
  548 Market Street, Suite 40012
  San Francisco, CA 94104
  United States
  Email: legal@veilwick.com
  ```
- Not exempt from age gate: layout explicitly excludes `/legal/2257` from gate; middleware excludes it (302→/ bypassed). Correct.

### 2.3 Gaps — STUB / PLACEHOLDER

- **Custodian is a placeholder address.** 2257 requires a real street address + real custodian name responsible for making records available for inspection. `548 Market St Suite 40012` is a mailbox; legal review required before claiming compliance.
- **No record-keeping backend.** Text claims records "maintained by the Custodian … available for inspection as required by law" but no D1 table, R2 folder, or admin UI stores performer ID + DOB + legal name cross-reference. For synthetic-only this is arguably exempt, but page also covers "actual persons" and third-party uploads — then 2257 applies.
- **No per-asset 2257 statement linking.** The 2257 page is not linked from footer nav (`Footer` links are Feed/Live/Login/Docs) nor from series/feed cards. Only discoverable via `/legal/2257` + landing bottom strip. Recommend adding `2257` link to footer nav + `rel="2257"` anchor.
- **Synthetic vs. actual segregation not enforced in DB.** `videos` / `series.episodes` have no `isSynthetic` / `is2257Exempt` flag; `videoTable` has no `2257StatementUrl` column. Cannot filter exempt synthetic from regulated depictions programmatically. Add column before mixing real-person content.
- **No RTA + no `noindex` on gated media.** `feed`, `series/[id]`, `live/*` set `robots: noindex` correctly; landing + 2257 are `index`. Good.

---

## 3. BetterAuth config

### 3.1 Schema — IMPLEMENTED

- `apps/web/src/db/schema/auth.ts` (+ `user.ts`, `organization.ts`):
  - `auth_session` (id, token, userId, expiresAt, ipAddress, userAgent) — indexed on user/token/expiresAt.
  - `auth_account` (providerId/accountId, password hash field named `password` as required by adapter, access/refresh/id tokens) — indexed.
  - `auth_verification_token` (identifier, value, expiresAt, consumedAt).
  - `organization`, `member`, `invitation` — Better Auth org plugin tables (separate from app `workspace`/`workspace_member`).

### 3.2 Server instantiation — IMPLEMENTED

- `apps/web/src/server/auth.ts` — `betterAuth({ database: drizzleAdapter(getDBRaw(), {provider:"sqlite", transaction:false, schema:{user,session,account,verification,organization,member,invitation}}), baseURL, secret, trustedOrigins, session:{expiresIn:7d, updateAge:1d}, emailAndPassword:{enabled:true, requireEmailVerification:false}, socialProviders?google, plugins:[anonymous(), organization({afterCreate/afterUpdate hooks})] })`
- **BaseURL:** `NEXT_PUBLIC_BETTER_AUTH_URL` required in prod (throws), falls back to `http://localhost:3000` in dev. `trustedOrigins` = localhost triad + deployed origin. Good.
- **Secret:** `BETTER_AUTH_SECRET` required in prod, throws if missing. Dev fallback `development-secret-not-for-production`.
- **Org mirror:** `afterCreateOrganization` inserts `workspace` + `workspaceMember(role:owner)` via `onConflictDoNothing`; `afterUpdateOrganization` mirrors name/slug. Isolate-safe lazy singleton `getAuth()` (no build-time D1 touch).

### 3.3 Client + session helpers — IMPLEMENTED

- `apps/web/src/lib/auth-client.ts` — `"use client"` `createAuthClient({baseURL:NEXT_PUBLIC_BETTER_AUTH_URL})`, exports `signIn/signOut/signUp/useSession`.
- `apps/web/src/lib/session.ts` — `verifyRequest()` calls `auth.api.getSession({headers: await headers()})`, throws `AuthError(401)` if no `user.id`.
- `apps/web/src/lib/create-api-handler.ts` — enforces `auth:"user"|"admin"|"session"|"none"` via `verifyRequest()` + `resolveTenantForUser()` + `roleSatisfies`. Used by all `/api/v1/*`.
- `apps/web/middleware.ts` — dashboard gate via `getSessionCookie(request)` (Better Auth cookie), redirect `-> /login?next=<path>`.
- `apps/web/app/api/auth/[...all]/route.ts` — Better Auth catch-all `GET|POST` → `auth.handler(request)` with `force-dynamic`.

### 3.4 Gaps

- `requireEmailVerification:false` — accounts active before email verified. Acceptable for demo; for paid NSFW, enable verification + rate limit sign-ups.
- No `BETTER_AUTH_SECRET` / `NEXT_PUBLIC_BETTER_AUTH_URL` in `.env` or `.env.example` (neither file exists) and not in `wrangler.jsonc` vars. Secrets must be provisioned via `wrangler secret put` / `.dev.vars` (gitignored) before deploy — document in `docs/tasks.md` secrets section.
- `anonymous()` plugin enabled — allows anonymous sessions that can still hit age-gated feed. Decide if anonymous should be blocked after NSFW.
- Session lifetime 7d / `updateAge` 1d is generous for adult content — consider shorter (24h) once payments gate.

---

## 4. Payments — CCBill / Stripe

### 4.1 Current state — MOCK ONLY, NOT WIRED

- **No `stripe` / `ccbill` / `CCBILL` references** in app source outside unrelated `node_modules/aws-sdk` payment types. No provider SDK installed (`package.json` has `better-auth`, `drizzle-orm`, `next` only).
- `wrangler.jsonc` has no Stripe/CCBill env vars or secrets. `apps/web/.env*` and `.env.example` do not exist.
- Billing implementation is a local mock in `apps/web/src/lib/billing/repository.ts`:
  - `getBilling(workspaceId)` — returns/lazily creates `billingTable` row `{plan:"free", status:"active", entitlements:{aiTokens:10000,members:3}}`.
  - `applyCheckoutMock(plan:"pro"|"team")` — sets `plan/status/active`, `customerId:cus_mock_`, `subscriptionId:sub_mock_`, `currentPeriodEnd:+30d`, entitlements `{pro:100k/10, team:1M/25}`.
  - `recordBillingEvent(type, payload)` — inserts `billingEventTable` row.
- API routes under `apps/web/app/api/v1/billing/`:
  - `POST /api/v1/billing/checkout` (`auth:admin`, `zod {plan:pro|team}`) → `applyCheckoutMock` + `recordBillingEvent("checkout.mock")` → `{billing, checkoutUrl:null, note:"Mock checkout queued entitlements; wire Stripe Checkout in production."}`
  - `GET /api/v1/billing/info` (`auth:user`) → `{billing}`
  - `POST /api/v1/billing/portal` (`auth:admin`) → `{url:null, customerId, note:"Stripe customer portal not configured in template mock."}`
  - `GET /api/v1/billing/usage` (`auth:user`) → `{usage:{aiTokens:0,members:1}, entitlements, periodEnd}`
  - `POST /api/v1/billing/webhook` — **no auth** — ingests any JSON `{type}` → `recordBillingEvent(type, payload)` → `{received:true}`. No Stripe signature verification (`stripe.webhooks.constructEvent`), no HMAC check. Accepts arbitrary payload; would accept forged events in prod.

### 4.2 What is missing to go live (CCBill or Stripe)

1. **Processor choice + compliance.** Adult NSFW requires high-risk processor: CCBill (adult-friendly) or Stripe with adult policy clearance. Stripe will flag explicit adult without prior approval. Choose CCBill for launch; keep Stripe mock for SFW tier if needed.
2. **Secrets & env.** `STRIPE_SECRET/PUBLISHABLE/WEBHOOK_SECRET` or `CCBILL_CLIENT_KEY/ACCOUNT` + `BETTER_AUTH_SECRET` + `NEXT_PUBLIC_BETTER_AUTH_URL` + `WAVESPEED_API_KEY` must be in `.dev.vars` (local) and `wrangler secret put` (prod). None are provisioned today.
3. **Checkout + portal wiring.** Replace `applyCheckoutMock` with `stripe.checkout.sessions.create({customer, price, mode:subscription, success_url, cancel_url})` or CCBill FlexForms/Webhooks; return `checkoutUrl` and redirect.
4. **Webhook verification.** Replace open `recordBillingEvent` with signature-checked handler (`stripe.webhooks.constructEvent(rawBody, sigHeader, webhookSecret)` / CCBill `X-CCBill-Signature`). Reject unsigned payloads with 400.
5. **Entitlement gating.** `series.episodes.locked` + `isEpisodeLocked(n)` already exists for E3-5 paywall but is **not enforced by billing status** — UI reads `locked` boolean statically; no check of `billing.status/plan` or `subscriptionId`. Wire `assertEpisodeAccess(n, {isSubscribed})` to real subscription check.
6. **RTA + CCBill 2257 handoff.** CCBill requires 2257 custodian address on file + age-gate proof before approving adult account. Placeholder custodian will block approval.

---

## 5. `.env` / secrets inventory

- No `.env`, `.env.local`, `.env.example`, `.dev.vars` found in repo (all gitignored / not checked in — correct for secrets, but onboarding gap).
- Authoritative local secrets location is `.dev.vars` at `apps/web/.dev.vars` (gitignored) read by `wrangler dev --local`. Not present — local dev uses safe defaults / defaults to `http://localhost:3000` and `development-secret-not-for-production`.
- `wrangler.jsonc` vars set only `ENVIRONMENT` + email defaults. All secrets (`BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID/SECRET`, `WAVESPEED_API_KEY`, future Stripe/CCBill) must be added as `wrangler secret put` in each env block.
- Recommend adding `apps/web/.env.example` listing required keys with placeholders so new dev can copy to `.dev.vars`.

---

## 6. File-level matrix

| Path | Verdict | Notes |
|------|---------|-------|
| `apps/web/src/components/age-gate.tsx` | Implemented (client) | dual localStorage+cookie, dialog, `enabled` flag, alias fallback |
| `apps/web/app/(app)/layout.tsx` | Implemented (client) | fetches KV flag, excludes `/legal/2257`, client flash |
| `apps/web/middleware.ts` | Partial | httpOnly check + matcher for feed/series/live/api-feed/series; missing api/live, interaction, generate, R2; cookie unsigned |
| `apps/web/app/api/flags/age-gate/route.ts` | Implemented | KV read, fail-closed to enabled |
| `apps/web/src/components/landing/footer.tsx` | Implemented (2257 strip) | short synthetic disclaimer |
| `apps/web/app/page.tsx` | Implemented (2257 strip) | longer 2257 notice + RTA-adjacent copy, landing public |
| `apps/web/src/db/schema/auth.ts` | Implemented | sessions/accounts/verification/invites indexed correctly |
| `apps/web/src/server/auth.ts` | Implemented | D1 adapter, secret/trustedOrigins guards, org mirror |
| `apps/web/app/api/auth/[...all]/route.ts` | Implemented | Better Auth catch-all |
| `apps/web/app/api/age-gate` + `age-verGate` | Implemented | httpOnly Lax 1y cookie |
| CCBill/Stripe integration | Stub | mock billing only, no SDK, no secrets |
| `.env` / `.dev.vars` | Missing (stub) | no example file, no provisioned secrets |

---

## 7. Prioritized fixes (before public NSFW)

1. **Expand middleware matcher** to every NSFW delivery route (`/api/live/*`, `/api/interaction`, `/api/generate`, `/api/v1/uploads/:id/content`, R2 media route) and add RTA header.
2. **Sign `veilwick_age_verified`** (HMAC) or replace with signed JWT short-lived token.
3. **Replace custodian placeholder** with real legal name + address; add `isSynthetic`/`2257StatementUrl` to `videos`/`episodes`; link `/legal/2257` from footer nav.
4. **Wire real payments** (CCBill FlexForms) + signature-checked webhook + `assertEpisodeAccess` against `billing.status`.
5. **Add `apps/web/.env.example`** and document `wrangler secret put` for all required secrets.
6. **Server-side gate in `(app)/layout.tsx`** (read `cookies()` on server) to remove client flash; use client dialog only as fallback.

