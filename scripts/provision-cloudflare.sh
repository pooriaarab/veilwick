#!/usr/bin/env bash
# Provision placeholder Cloudflare resources for master-template-cloudflare.
# Safe-ish: only creates uniquely named template resources; never deletes.
#
# Usage:
#   ./scripts/provision-cloudflare.sh           # create + print IDs
#   ./scripts/provision-cloudflare.sh --write   # also patch wrangler production IDs (local only)
#
# Requires: wrangler authenticated (wrangler whoami)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WRITE_CONFIG=0
if [[ "${1:-}" == "--write" ]]; then
  WRITE_CONFIG=1
fi

need() { command -v "$1" >/dev/null || { echo "missing: $1"; exit 1; }; }
need wrangler
need node

PREFIX="${TEMPLATE_CF_PREFIX:-template}"
echo "==> Provisioning Cloudflare resources with prefix '${PREFIX}-*'"
echo "    Account from: wrangler whoami"

create_d1() {
  local name="$1"
  # If already exists, wrangler may error — swallow and list
  if wrangler d1 list 2>/dev/null | grep -q "${name}"; then
    echo "D1 exists: ${name}"
  else
    echo "Creating D1: ${name}"
    wrangler d1 create "${name}" 2>&1 || true
  fi
}

create_kv() {
  local name="$1"
  if wrangler kv namespace list 2>/dev/null | grep -q "\"title\": \"${name}\""; then
    echo "KV exists: ${name}"
  else
    echo "Creating KV: ${name}"
    wrangler kv namespace create "${name}" 2>&1 || true
  fi
}

create_r2() {
  local name="$1"
  if wrangler r2 bucket list 2>/dev/null | grep -q "${name}"; then
    echo "R2 exists: ${name}"
  else
    echo "Creating R2: ${name}"
    wrangler r2 bucket create "${name}" 2>&1 || true
  fi
}

create_queue() {
  local name="$1"
  if wrangler queues list 2>/dev/null | grep -q "${name}"; then
    echo "Queue exists: ${name}"
  else
    echo "Creating queue: ${name}"
    wrangler queues create "${name}" 2>&1 || true
  fi
}

create_d1 "${PREFIX}-db"
create_d1 "${PREFIX}-tag-cache"
create_kv "${PREFIX}-inc-cache"
create_kv "${PREFIX}-flags"
create_r2 "${PREFIX}-uploads"
create_queue "${PREFIX}-outbox"

echo
echo "==> Collecting IDs (best-effort parse)"
node <<'NODE'
const { execSync } = require("child_process");
function sh(cmd) {
  try { return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); }
  catch (e) { return e.stdout || ""; }
}
const d1 = sh("wrangler d1 list");
const kv = sh("wrangler kv namespace list");
const qs = sh("wrangler queues list");
const prefix = process.env.TEMPLATE_CF_PREFIX || "template";

function findD1(name) {
  // table rows: | uuid | name | ...
  const re = new RegExp(`│\\s*([0-9a-f-]{36})\\s*│\\s*${name}\\s*│`);
  const m = d1.match(re);
  return m?.[1] || null;
}
function findKv(name) {
  try {
    const arr = JSON.parse(kv);
    const hit = arr.find((x) => x.title === name);
    return hit?.id || null;
  } catch {
    return null;
  }
}
function findQueue(name) {
  const re = new RegExp(`│\\s*[0-9a-f]+\\s*│\\s*${name}\\s*│`);
  return re.test(qs) ? name : null;
}

const out = {
  D1_DB_ID: findD1(`${prefix}-db`),
  D1_TAG_CACHE_ID: findD1(`${prefix}-tag-cache`),
  KV_INC_CACHE_ID: findKv(`${prefix}-inc-cache`),
  FLAGS_KV_ID: findKv(`${prefix}-flags`),
  R2_BUCKET: `${prefix}-uploads`,
  QUEUE_NAME: `${prefix}-outbox`,
};
console.log(JSON.stringify(out, null, 2));
require("fs").writeFileSync("/tmp/template-cf-ids.json", JSON.stringify(out, null, 2));
NODE

echo
echo "IDs written to /tmp/template-cf-ids.json"
echo "Next:"
echo "  1. Put those IDs into apps/web/cloudflare/app-worker/wrangler.jsonc env.production"
echo "  2. wrangler secret put BETTER_AUTH_SECRET -c apps/web/cloudflare/app-worker/wrangler.jsonc --env production"
echo "  3. wrangler secret put CRON_SECRET ..."
echo "  4. cd apps/web && bun run db:migrate:remote && bun run deploy"

if [[ "$WRITE_CONFIG" -eq 1 ]]; then
  echo
  echo "==> --write: patching wrangler production placeholders from /tmp/template-cf-ids.json"
  node <<'NODE'
const fs = require("fs");
const path = require("path");
const root = process.env.ROOT || process.cwd();
const ids = JSON.parse(fs.readFileSync("/tmp/template-cf-ids.json", "utf8"));
const wranglerPath = path.join(root, "apps/web/cloudflare/app-worker/wrangler.jsonc");
let text = fs.readFileSync(wranglerPath, "utf8");
const subs = [
  ["<D1_DB_ID>", ids.D1_DB_ID],
  ["<D1_TAG_CACHE_ID>", ids.D1_TAG_CACHE_ID],
  ["<KV_INC_CACHE_ID>", ids.KV_INC_CACHE_ID],
  ["<FLAGS_KV_ID>", ids.FLAGS_KV_ID],
];
for (const [ph, val] of subs) {
  if (!val) {
    console.warn("skip missing id for", ph);
    continue;
  }
  text = text.split(ph).join(val);
}
// also update production bucket/queue names if they're still defaults
text = text.replace(/"bucket_name": "template-uploads-prod"/, `"bucket_name": "${ids.R2_BUCKET}"`);
text = text.replace(/"queue": "template-outbox-prod"/, `"queue": "${ids.QUEUE_NAME}"`);
fs.writeFileSync(wranglerPath, text);
console.log("patched", wranglerPath);
NODE
fi
