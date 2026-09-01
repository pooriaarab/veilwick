import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/cron/wan-batch
 * Nightly curated short-library generation via Wan 2.4-14B + LoRAs 1333923/1428098.
 * NOT for personalized scroll feed (H3 owns that).
 */
export async function POST(request: Request) {
  if (request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const ctx: any = await getCloudflareContext({ async: true }).catch(() => null);
    const queue: Queue<any> | null = ctx?.env?.OUTBOX_QUEUE ?? null;
    if (!queue) return NextResponse.json({ ok: true, queued: 0, reason: "no_queue" });

    // Candy.ai-style curated shorts — LoRAs 1333923 (POV Blowjob), 1428098 (COWGIRL)
    const batch = [
      { prompt: "candy.ai curated blowjob POV short, soft studio light, 24fps", category: "blowjob", loraId: 1333923 },
      { prompt: "candy.ai curated cowgirl short, bedroom warm light, 24fps", category: "cowgirl", loraId: 1428098 },
    ];
    for (const b of batch) {
      await queue.send({
        type: "wan.generate",
        id: crypto.randomUUID(),
        payload: { prompt: b.prompt, category: b.category, videoId: `batch_${Date.now()}_${b.category}`, loraId: b.loraId } as any,
        createdAt: new Date().toISOString(),
      });
    }
    return NextResponse.json({ ok: true, queued: batch.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "unknown" }, { status: 500 });
  }
}
