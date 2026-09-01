# Desktop & iOS shell (Tauri 2)

Thin Tauri webview that hosts the web app from `apps/web` in a desktop window
or iOS app. In dev it loads `http://localhost:3000`; in release it navigates
to a hosted URL baked in at compile time via `option_env!("MASTER_TEMPLATE_PROD_URL")`.

## REPLACE THESE BEFORE SHIPPING (manual setup)

1. **Icons** — `src-tauri/icons/` ships with placeholder icons that are NOT
   neutral and carry a third-party brand. Replace them. Run
   `bunx @tauri-apps/cli icon path/to/your-1024.png` from this directory to
   regenerate every required size. Do this FIRST.
2. **Updater key** — generate once: `cargo tauri signer generate -w ~/.tauri/<product>.key`.
   Paste the public half into `src-tauri/tauri.conf.json` `plugins.updater.pubkey`.
   Save the private half as the `TAURI_SIGNING_KEY` GitHub Actions secret.
3. **Placeholders** in `src-tauri/tauri.conf.json` and `tauri.mobile.conf.json`:
   - `MASTER_TEMPLATE_OWNER` and `MASTER_TEMPLATE_REPO` in the updater endpoint
   - `MASTER_TEMPLATE_IOS_TEAM_ID` in `bundle.iOS.developmentTeam`
   - `productName`, `identifier`, window `title`
4. **Deep-link scheme** — `master-template` in `tauri.conf.json` →
   `plugins.deep-link.desktop.schemes`. Replace with your product's scheme;
   make sure the web app's auth-callback URL emits the same scheme.
5. **Crate name** — `master-template-desktop` / `master_template_desktop_lib`
   in `src-tauri/Cargo.toml`, `src-tauri/src/main.rs`, and `Cargo.lock`.
6. **CSP** — the default `connect-src 'self' https: wss:` is intentionally broad
   so the template builds without knowing your hosted host. Tighten to your
   specific origins before you ship.

## Prerequisites

- **Rust toolchain** — install with `rustup` (https://rustup.rs).
- **Bun** — `bun --version` (already required for the rest of the monorepo).
- **iOS only** — Xcode (latest) + a paid Apple Developer account.

## Dev

From the repo root, in two terminals:

```bash
bun --cwd apps/web run dev          # Next.js on :3000
bun --cwd apps/desktop run dev      # Tauri window pointing at :3000
```

## iOS dev

Set `MASTER_TEMPLATE_IOS_TEAM_ID` in both `tauri.conf.json` and
`tauri.mobile.conf.json` first, then:

```bash
bun --cwd apps/desktop run ios:dev
```

The first run executes `tauri ios init` automatically and writes a `gen/`
directory (gitignored). You'll need Xcode installed.

## Production build

```bash
MASTER_TEMPLATE_PROD_URL=https://your-app.example.com \
  bun --cwd apps/desktop run build
```

The `option_env!` macro reads `MASTER_TEMPLATE_PROD_URL` at compile time and
bakes it into the binary. If unset at build time the bundle falls back to
`http://localhost:3000`.

## Updater

Manual one-time setup before the first release:

```bash
cargo tauri signer generate -w ~/.tauri/<product>.key
```

Commit the public key to `tauri.conf.json` `plugins.updater.pubkey`. Save the
private key contents as the `TAURI_SIGNING_KEY` GitHub Actions secret. Releases
must publish a `latest.json` matching the configured endpoint.

## Capabilities (security)

The default capability set is opt-in only — every permission in
`src-tauri/capabilities/default.json` corresponds to a plugin we actually call
from JS. Adding a new plugin? Add the matching `<plugin>:default` plus any
named permissions you need, never `core:default` alone. See `.claude/rules/desktop.md`.
