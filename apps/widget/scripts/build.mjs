#!/usr/bin/env node
/**
 * Build the visitor widget into apps/web/public/widget/widget.js.
 *
 * The widget must be served same-origin as the public API so the
 * `mt_visitor` cookie's Path=/api/v1/public attribute and CORS echo-back
 * line up. Bundling output into apps/web/public ensures a single Next.js
 * deploy ships both surfaces.
 */
import { build } from "esbuild";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outFile = resolve(root, "../web/public/widget/widget.js");

const dev = process.argv.includes("--dev");

mkdirSync(dirname(outFile), { recursive: true });

await build({
  entryPoints: [resolve(root, "src/index.tsx")],
  outfile: outFile,
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2020",
  jsx: "automatic",
  jsxImportSource: "preact",
  minify: !dev,
  sourcemap: dev,
  legalComments: "none",
  logLevel: "info",
  define: {
    "process.env.NODE_ENV": JSON.stringify(dev ? "development" : "production"),
  },
});

console.log(`[widget] built ${outFile}`);
