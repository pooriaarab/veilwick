import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { CloudflareEnv } from "@/types/cloudflare-env";
import { getFlag } from "@template/config";

export const dynamic = "force-dynamic";

/**
 * Public endpoint that returns whether the age-gate feature flag is enabled.
 * No auth required — this just controls the 18+ modal on public pages.
 */
export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const cfEnv = env as CloudflareEnv;
    if (!cfEnv.FLAGS) {
      // No KV binding — default to enabled for safety
      return NextResponse.json({ enabled: true });
    }
    const enabled = await getFlag(cfEnv.FLAGS, "age-gate", true);
    return NextResponse.json({ enabled });
  } catch {
    // KV unavailable — default to enabled
    return NextResponse.json({ enabled: true });
  }
}