# Visitor widget — Cloudflare port notes

Point `apiBase` at the CF worker. Public agent endpoints use agent `publicKey` + Turnstile (template).
Firestorestore removed; threads/messages are D1-backed under `/api/v1/public/*` (wire in product apps).
