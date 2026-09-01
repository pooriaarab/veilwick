# Security Policy

## Reporting a Vulnerability

If you discover a security issue in code generated from this template or in this template itself, **do not open a public issue**.

Email: **security@example.com** (replace with project contact in generated repos).

Include:
- A description of the issue and the component affected.
- Steps to reproduce or a proof-of-concept.
- Your name and how you'd like to be credited (optional).

We aim to acknowledge within 48 hours. Published fixes for confirmed issues typically land within 30 days; complex cases may take longer. Generated projects forking this template should adjust this SLA to match their team's capacity.

## Scope

In scope:
- Code in this repository.
- Default Firestore rules, security headers, and auth flows shipped with the template.

Out of scope:
- Vulnerabilities in third-party dependencies that have already been disclosed upstream.
- Misconfiguration in repos generated from this template (those are owned by the generated project).

## Disclosure

We coordinate disclosure with reporters. Public advisories are published via GitHub Security Advisories on this repository after a fix ships.

## Hardening Defaults Already Enabled

- Firestore default-deny rules with auth/admin/owner helpers.
- HTTP security headers via `lib/security-headers.ts` (CSP, HSTS, X-Frame-Options, Referrer-Policy).
- Session cookies: HttpOnly, Secure, SameSite=Strict.
- API auth, validation, and audit baked into `createApiHandler`.
- Rate limiting via Firestore-backed counters (when enabled — see `docs/rate-limiting.md`).
- Gitleaks secret scanning in CI.
- Dependabot for dependency updates.
