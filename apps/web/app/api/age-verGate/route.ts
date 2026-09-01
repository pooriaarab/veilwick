import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "veilwick_age_verified";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * POST /api/age-verGate
 * Sets httpOnly veilwick_age_verified cookie after client confirms 18+ via localStorage.
 * Body optional: { verified: true } — always sets cookie to 1.
 * Store-safe: no content, just cookie.
 */
export async function POST(request: Request) {
  // Allow empty body or JSON; don't require specific payload
  try {
    await request.json().catch(() => null);
  } catch {
    // ignore
  }

  const res = NextResponse.json({ ok: true, verified: true });
  res.cookies.set(COOKIE_NAME, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return res;
}

export async function GET() {
  // Public check — returns whether cookie is present is done via middleware,
  // but expose a simple status for debugging; no auth.
  return NextResponse.json({ ok: true });
}
