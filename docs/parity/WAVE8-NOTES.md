# Wave 8 — QA gate

- Playwright smoke against wrangler `:8788` (`apps/web/tests/*.spec.ts`)
- Deploy workflow (build + dry-run); secrets must be added for real deploy
- `scripts/assert-no-firebase.sh` fail CI if firebase returns
- Full product e2e (20 legacy specs) remain to be re-homed domain-by-domain as staging hardens

Evidence required for `parity-complete` tag: typecheck, unit tests, assert-no-firebase, e2e health/landing/login green.
