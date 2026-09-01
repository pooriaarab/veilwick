import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "veilwick_age_verified";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * POST /api/age-gate
 * Alias for /api/age-verGate — sets httpOnly veilwick_age_verified cookie.
 * Supports both paths; middleware expects httpOnly cookie.
 */
export async function POST(request: Request) {
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
  return NextResponse.json({ ok: true });
}
