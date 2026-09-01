#!/usr/bin/env bash
set -euo pipefail
if rg -n --glob '!**/node_modules/**' --glob '!**/.git/**' -e 'firebase-admin|from ["'\'']firebase["'\'']|require\(["'\'']firebase' apps packages workers 2>/dev/null; then
  echo "FAIL: firebase runtime imports present"
  exit 1
fi
echo "OK: no firebase runtime imports under apps/packages/workers"
