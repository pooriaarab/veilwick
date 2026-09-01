# Master Template Cloudflare Agent Guide

## Mission

Build this repo as the Cloudflare-native version of the master template. Keep it independent from the Netlify/Firebase template.

## Hard Boundaries

- Do not edit `/Users/parab/Documents/Personal/master-template-netlify-firebase`.
- Do not copy Firebase or Netlify implementation patterns into this repo.
- Do not commit real Cloudflare account IDs, database IDs, namespace IDs, bucket names, API tokens, OAuth secrets, or app secrets.
- Use placeholders for infrastructure IDs until resources are intentionally created.

## Preferred Platform Shape

- Next.js deployed to Cloudflare Workers with `@opennextjs/cloudflare`.
- `wrangler.jsonc` is the authoritative app worker config.
- Separate Workers for queue consumers and cron jobs.
- D1 migrations live in version control.
- Bindings are typed through Wrangler-generated types.
- Local secrets use `.dev.vars`; remote secrets use Wrangler or dashboard-managed secrets.

## Reference Repos

Use `/Users/parab/Documents/Personal/content-rabbit/code/Content Rabbit` as the primary read-only Cloudflare implementation reference. Its useful patterns include:

- OpenNext app worker config.
- Separate queue and cron workers.
- D1, KV, queue, and environment-specific bindings.
- Type generation and deployment scripts.

Use `/Users/parab/Documents/Personal/master-template-netlify-firebase` only for read-only inventory if a migration requires knowing what the old template did.

## Delegation Model

Codex owns orchestration, integration, edits, and verification. Use sidecars for independent planning, critique, and review.

Preferred routes:

- GLM through Pi: `pi --model zai/glm-5.2 --no-session --no-tools --print "<prompt>"`
- Gemini personal: `zsh -ic 'gemini-personal --prompt "<prompt>"'`
- Claude personal advisor/reviewer:
  - `zsh -ic 'claude-personal --model sonnet --print "<prompt>"'`
  - `zsh -ic 'claude-personal --model opus --print "<prompt>"'`
  - `zsh -ic 'claude-personal --model fable --print "<prompt>"'`

Do not use bare `gemini` for personal work. Do not use bare `claude` when the user asked for personal routing. If `gemini-personal` or `claude-personal` fails, report the exact blocker instead of falling back to work/default configs.

Escalation ladder:

1. GLM 5.2 and Gemini personal for cheap first-pass inventory, migration checklists, and critique.
2. Claude personal Sonnet for final review of non-trivial implementation plans.
3. Claude personal Opus or Fable for high-stakes architecture or launch decisions.
4. Verified GPT routes through Pi: `openai-codex/gpt-5.6-luna`, `openai-codex/gpt-5.6-terra`, and `openai-codex/gpt-5.6-sol`.
   - Luna/Terra: orchestration, fast technical tie-breaks, and bounded migration planning.
   - Sol: expensive architecture/planning only; use sparingly.
   - Default implementation/review work still goes first to Gemini personal / GLM 5.2.

Sidecars default to read-only prompts. Let them write only if Codex assigns a narrow, disjoint write scope.

## Verification Standard

Before claiming implementation is done:

- Run typecheck and tests.
- Run the OpenNext build.
- Run a Wrangler preview or dry-run style validation.
- Verify D1 migrations apply locally.
- Verify no Firebase or Netlify dependencies remain unless documented as intentional compatibility shims.

## Parity freeze (2026-07-11)

**HumanOrVibe was paused** for template parity. Structural 8-wave port landed (`parity-complete-skeleton`). Full legacy product e2e/UX hardening continues; HumanOrVibe may resume for app work while template deepens via domain slices.

Primary plan: `docs/superpowers/plans/2026-07-11-100-percent-parity-port.md`  
Checklist: `docs/parity/CHECKLIST.md`

Do not start new HumanOrVibe features from this template until that gate is green unless the user explicitly overrides.
