#!/usr/bin/env node
/**
 * Bundle-size gate. Fails the build if the gzipped widget exceeds the
 * 50KB budget agreed in the Phase 2.2 design.
 */
import { gzipSync } from "node:zlib";
import { readFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const widgetPath = resolve(__dirname, "../../web/public/widget/widget.js");
const BUDGET_BYTES = 50 * 1024;

const raw = readFileSync(widgetPath);
const rawSize = statSync(widgetPath).size;
const gz = gzipSync(raw).length;

const fmt = (n) => `${(n / 1024).toFixed(2)}KB`;
const ratio = ((gz / BUDGET_BYTES) * 100).toFixed(1);

console.log(`[widget] size: raw ${fmt(rawSize)}, gzip ${fmt(gz)} (${ratio}% of 50KB budget)`);

if (gz > BUDGET_BYTES) {
  console.error(`[widget] ERROR: gzipped size ${fmt(gz)} exceeds 50KB budget`);
  process.exit(1);
}
