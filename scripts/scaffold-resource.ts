import { mkdir, writeFile, access, readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";

interface Options {
  /** Override CWD for tests. */
  workDir?: string;
}

const NAME_RE = /^[a-z][a-z0-9]*s$/;

const TEMPLATES: Record<string, string> = {
  "packages/shared/src/schemas/__NAME__.ts": `import { z } from "zod";

export const __NAME__CreateSchema = z.object({
  name: z.string().min(1).max(200),
});

export const __NAME__UpdateSchema = __NAME__CreateSchema.partial();

export const __NAME__EntitySchema = __NAME__CreateSchema.extend({
  id: z.string(),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type __PASCAL__Create = z.infer<typeof __NAME__CreateSchema>;
export type __PASCAL__Update = z.infer<typeof __NAME__UpdateSchema>;
export type __PASCAL__Entity = z.infer<typeof __NAME__EntitySchema>;
`,

  "packages/shared/src/__tests__/__NAME__.schema.test.ts": `import { describe, it, expect } from "vitest";
import { __NAME__CreateSchema } from "../schemas/__NAME__";

describe("__NAME__ schema", () => {
  it("accepts valid input", () => {
    expect(__NAME__CreateSchema.parse({ name: "x" })).toEqual({ name: "x" });
  });
  it("rejects empty name", () => {
    expect(() => __NAME__CreateSchema.parse({ name: "" })).toThrow();
  });
});
`,

  "apps/web/src/app/api/v1/__NAME__/route.ts": `import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { createApiHandler } from "@/lib/create-api-handler";
import { getDb } from "@/lib/db";
import { __NAME__CreateSchema, __NAME__EntitySchema, type __PASCAL__Entity } from "@repo/shared";

function map__PASCAL_SINGULAR__(id: string, data: FirebaseFirestore.DocumentData): __PASCAL__Entity {
  return __NAME__EntitySchema.parse({
    id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt,
  });
}

export const GET = createApiHandler({
  auth: "user",
  handler: async ({ session }) => {
    const db = getDb();
    const snap = await db
      .collection("__NAME__")
      .where("ownerId", "==", session.uid)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();
    const items = snap.docs.map((d) => map__PASCAL_SINGULAR__(d.id, d.data()));
    return NextResponse.json({ items });
  },
});

export const POST = createApiHandler({
  auth: "user",
  input: __NAME__CreateSchema,
  audit: "create___SINGULAR__",
  handler: async ({ session, body }) => {
    const db = getDb();
    const ref = await db.collection("__NAME__").add({
      ...body,
      ownerId: session.uid,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  },
});
`,

  "apps/web/src/app/api/v1/__NAME__/[id]/route.ts": `import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { createApiHandler } from "@/lib/create-api-handler";
import { getDb } from "@/lib/db";
import { __NAME__EntitySchema, __NAME__UpdateSchema, type __PASCAL__Entity } from "@repo/shared";

interface Params { params: { id: string } }

function map__PASCAL_SINGULAR__(id: string, data: FirebaseFirestore.DocumentData): __PASCAL__Entity {
  return __NAME__EntitySchema.parse({
    id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt,
  });
}

export const GET = createApiHandler<unknown, Params["params"]>({
  auth: "user",
  handler: async ({ session, params }) => {
    const db = getDb();
    const doc = await db.collection("__NAME__").doc(params.id).get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const data = doc.data()!;
    if (data.ownerId !== session.uid) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(map__PASCAL_SINGULAR__(doc.id, data));
  },
});

export const PATCH = createApiHandler<unknown, Params["params"]>({
  auth: "user",
  input: __NAME__UpdateSchema,
  audit: "update___SINGULAR__",
  handler: async ({ session, body, params }) => {
    const db = getDb();
    const ref = db.collection("__NAME__").doc(params.id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.ownerId !== session.uid)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    await ref.update({ ...body, updatedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ id: params.id });
  },
});

export const DELETE = createApiHandler<unknown, Params["params"]>({
  auth: "user",
  audit: "delete___SINGULAR__",
  handler: async ({ session, params }) => {
    const db = getDb();
    const ref = db.collection("__NAME__").doc(params.id);
    const doc = await ref.get();
    if (!doc.exists || doc.data()?.ownerId !== session.uid)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    await ref.delete();
    return NextResponse.json({ ok: true });
  },
});
`,

  "apps/web/src/app/(dashboard)/__NAME__/page.tsx": `"use client";

import { PageShell } from "@/components/ui/layout/page-shell";
import { DataTable } from "@/components/ui/data-display/data-table";
import { use__PASCAL__Query } from "@/hooks/use-__NAME__-query";
import { __NAME__Columns } from "@/components/__NAME__/__NAME__-columns";

export default function __PASCAL__Page() {
  const { data, isLoading } = use__PASCAL__Query();
  return (
    <PageShell title="__PASCAL__">
      <DataTable columns={__NAME__Columns} data={data?.items ?? []} isLoading={isLoading} />
    </PageShell>
  );
}
`,

  "apps/web/src/components/__NAME__/__NAME__-columns.tsx": `import type { ColumnDef } from "@tanstack/react-table";
import type { __PASCAL__Entity } from "@repo/shared";

export const __NAME__Columns: ColumnDef<__PASCAL__Entity>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "createdAt", header: "Created" },
];
`,

  "apps/web/src/hooks/use-__NAME__-query.ts": `import { useQuery } from "@tanstack/react-query";
import type { __PASCAL__Entity } from "@repo/shared";

export function use__PASCAL__Query() {
  return useQuery<{ items: __PASCAL__Entity[] }>({
    queryKey: ["__NAME__"],
    queryFn: async () => {
      const res = await fetch("/api/v1/__NAME__");
      if (!res.ok) throw new Error("Failed to fetch __NAME__");
      return res.json();
    },
  });
}
`,
};

function pascal(name: string): string {
  return name
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toUpperCase());
}

function singular(plural: string): string {
  if (plural.endsWith("ies")) return plural.slice(0, -3) + "y";
  if (/(?:sses|ches|shes|xes|zes)$/.test(plural)) return plural.slice(0, -2);
  if (plural.endsWith("s")) return plural.slice(0, -1);
  return plural;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function dirExists(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    return s.isDirectory();
  } catch {
    return false;
  }
}

async function ensureSharedSchemasDir(work: string): Promise<void> {
  const dir = join(work, "packages/shared/src/schemas");
  if (!(await dirExists(dir))) {
    await mkdir(dir, { recursive: true });
  }
  const indexPath = join(dir, "index.ts");
  if (!(await fileExists(indexPath))) {
    await writeFile(
      indexPath,
      "// Auto-managed by scripts/scaffold-resource.ts. Add new schema re-exports here in alphabetical order.\n",
      "utf8",
    );
  }
}

async function maybeWarnZodMissing(work: string): Promise<void> {
  const pkgPath = join(work, "packages/shared/package.json");
  if (!(await fileExists(pkgPath))) return;
  try {
    const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
    const hasZod =
      Boolean(pkg.dependencies?.zod) || Boolean(pkg.devDependencies?.zod);
    if (!hasZod) {
      console.warn(
        "[scaffold-resource] zod is not in packages/shared/package.json. Run: bun add zod --cwd packages/shared",
      );
    }
  } catch {
    // ignore parse errors
  }
}

async function registerInBarrel(work: string, name: string): Promise<void> {
  // Prefer schemas/index.ts if it exists; else fall back to src/index.ts.
  const schemasIndex = join(work, "packages/shared/src/schemas/index.ts");
  const srcIndex = join(work, "packages/shared/src/index.ts");
  const target = (await fileExists(schemasIndex)) ? schemasIndex : srcIndex;
  if (!(await fileExists(target))) return;

  const exportLine =
    target === schemasIndex
      ? `export * from "./${name}";`
      : `export * from "./schemas/${name}";`;

  const original = await readFile(target, "utf8");
  if (original.includes(exportLine)) return;

  // Collect existing matching export lines (same form), insert alphabetically.
  const lines = original.split("\n");
  const reForm =
    target === schemasIndex
      ? /^export \* from "\.\/([a-z0-9-]+)";\s*$/
      : /^export \* from "\.\/schemas\/([a-z0-9-]+)";\s*$/;

  const existing: { idx: number; key: string }[] = [];
  lines.forEach((line, idx) => {
    const m = line.match(reForm);
    if (m) existing.push({ idx, key: m[1] });
  });

  let insertAt: number;
  if (existing.length === 0) {
    // Append to end (after a blank line if file didn't end with one).
    insertAt = lines.length;
    if (lines[lines.length - 1] !== "") {
      lines.push("");
    }
  } else {
    // Find first existing key that sorts after `name`.
    const after = existing.find((e) => e.key.localeCompare(name) > 0);
    insertAt = after ? after.idx : existing[existing.length - 1].idx + 1;
  }

  lines.splice(insertAt, 0, exportLine);
  let next = lines.join("\n");
  if (!next.endsWith("\n")) next += "\n";
  await writeFile(target, next, "utf8");
}

async function ensureSchemasReExport(work: string): Promise<void> {
  const indexPath = join(work, "packages/shared/src/index.ts");
  const reExport = 'export * from "./schemas";';
  const reExportRe = /export \* from ["']\.\/schemas["'];?/;
  if (!(await fileExists(indexPath))) {
    await mkdir(dirname(indexPath), { recursive: true });
    await writeFile(indexPath, `${reExport}\n`, "utf8");
    return;
  }
  const original = await readFile(indexPath, "utf8");
  if (reExportRe.test(original)) return;
  const next = original.endsWith("\n")
    ? `${original}${reExport}\n`
    : `${original}\n${reExport}\n`;
  await writeFile(indexPath, next, "utf8");
}

export async function scaffoldResource(name: string, opts: Options = {}): Promise<void> {
  if (!NAME_RE.test(name)) {
    throw new Error(
      `Resource name must be lowercase plural, alphanumeric, ending in "s". Got: ${name}`,
    );
  }

  const work = opts.workDir ?? process.cwd();
  const pascalName = pascal(name);
  const singularName = singular(name);
  const pascalSingularName = pascal(singularName);

  // Ensure packages/shared/src/schemas exists with an index.ts.
  await ensureSharedSchemasDir(work);

  // Pre-flight: refuse if any target file already exists.
  const targets: { outPath: string; body: string }[] = [];
  for (const [tplPath, tplBody] of Object.entries(TEMPLATES)) {
    const outPath = join(work, tplPath.replace(/__NAME__/g, name));
    if (await fileExists(outPath)) {
      throw new Error(`Refusing to overwrite: ${outPath} already exists`);
    }
    const body = tplBody
      .replace(/__NAME__/g, name)
      .replace(/__PASCAL_SINGULAR__/g, pascalSingularName)
      .replace(/__PASCAL__/g, pascalName)
      .replace(/__SINGULAR__/g, singularName);
    targets.push({ outPath, body });
  }

  for (const { outPath, body } of targets) {
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, body, "utf8");
  }

  await registerInBarrel(work, name);
  await ensureSchemasReExport(work);
  await maybeWarnZodMissing(work);
}

// CLI entry
const isMain = (() => {
  try {
    if (typeof process === "undefined" || !process.argv[1]) return false;
    return import.meta.url === `file://${process.argv[1]}`;
  } catch {
    return false;
  }
})();

if (isMain) {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: bun scripts/scaffold-resource.ts <name-plural>");
    process.exit(1);
  }
  scaffoldResource(arg).then(
    () => {
      console.log(`Scaffolded resource: ${arg}`);
    },
    (err: Error) => {
      console.error(err.message);
      process.exit(1);
    },
  );
}
