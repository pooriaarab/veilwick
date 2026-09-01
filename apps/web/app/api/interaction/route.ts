import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuth } from "@/server/auth";
import { getDB } from "@/db";
import { userInteractionsTable } from "@/db/schema/veilwick";

export const dynamic = "force-dynamic";

/**
 * POST /api/interaction
 *
 * Instrumentation checkpoint: capture feed signals for future ranking.
 * Body: { videoId, category, watchMs?, liked?, bookmarked?, shared?, action?, scrollDepth? }
 * Auth optional — anon feed writes with user_id = null (FK set null), real users persist to D1.
 * Returns { ok: true, id }.
 */
const Body = z.object({
  videoId: z.string().min(1).max(128),
  category: z.string().min(1).max(80),
  watchMs: z.number().int().min(0).max(3_600_000).optional().default(0),
  liked: z.boolean().optional().default(false),
  bookmarked: z.boolean().optional().default(false),
  shared: z.boolean().optional().default(false),
  action: z.enum(["view", "like", "bookmark", "share", "dwell", "scroll"]).optional().default("view"),
  scrollDepth: z.number().min(0).max(1).optional().nullable(),
});

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
  }
  const body = parsed.data;

  // Optional auth — anon feed is allowed (userId stays null)
  let userId: string | null = null;
  try {
    const session = await (await getAuth()).api.getSession({ headers: await headers() });
    if (session?.user?.id) userId = session.user.id;
  } catch {
    // anon
  }

  const db = await getDB();
  const scrollDepthInt =
    body.scrollDepth == null ? null : Math.round(body.scrollDepth * 1000); // 0..1000

  const [row] = await db
    .insert(userInteractionsTable)
    .values({
      userId,
      videoId: body.videoId,
      category: body.category,
      watchMs: body.watchMs,
      liked: body.liked,
      bookmarked: body.bookmarked,
      shared: body.shared,
      action: body.action,
      scrollDepth: scrollDepthInt,
    })
    .returning({ id: userInteractionsTable.id });

  return NextResponse.json({ ok: true, id: row?.id ?? null }, { status: 201 });
}

/** GET /api/interaction — debug: last 20 rows for signed-in user (or 401). */
export async function GET() {
  const { headers: h } = await import("next/headers");
  const session = await (await getAuth()).api.getSession({ headers: await h() });
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = await getDB();
  const { eq, desc } = await import("drizzle-orm");
  const rows = await db
    .select()
    .from(userInteractionsTable)
    .where(eq(userInteractionsTable.userId, session.user.id))
    .orderBy(desc(userInteractionsTable.createdAt))
    .limit(20);
  return NextResponse.json({ interactions: rows });
}
