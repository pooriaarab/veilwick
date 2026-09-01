import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const AGE_VERIFIED_COOKIE = "veilwick_age_verified";

function isAgeGated(path: string): boolean {
  // Public legal page must remain accessible without verification
  if (path === "/legal/2257" || path.startsWith("/legal/2257/")) return false;
  if (path === "/legal" || path.startsWith("/legal/")) {
    // Only /legal/2257 is explicitly public; other legal paths if added also public
    // but we treat /legal/2257 as the one guaranteed public per spec
    if (path.startsWith("/legal/2257")) return false;
  }
  // Page routes requiring age verification
  if (path === "/feed" || path.startsWith("/feed/")) return true;
  if (path === "/series" || path.startsWith("/series/")) return true;
  if (path === "/live" || path.startsWith("/live/")) return true;
  // API routes requiring age verification
  if (path === "/api/feed" || path.startsWith("/api/feed/")) return true;
  if (path === "/api/series" || path.startsWith("/api/series/")) return true;
  return false;
}

function isApiRoute(path: string): boolean {
  return path.startsWith("/api/");
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const sessionCookie = getSessionCookie(request);
  const path = request.nextUrl.pathname;

  // --- Dashboard auth (existing) ---
  const needsAuth = path.startsWith("/dashboard");
  if (needsAuth && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // --- NSFW age gate (httpOnly cookie) ---
  if (isAgeGated(path)) {
    const ageVerified = request.cookies.get(AGE_VERIFIED_COOKIE)?.value === "1";
    if (!ageVerified) {
      if (isApiRoute(path)) {
        return NextResponse.json(
          { error: "Age verification required", code: "age_gate_required" },
          { status: 403 },
        );
      }
      // For page routes, redirect to home (public, store-safe) with next param
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/feed",
    "/feed/:path*",
    "/series",
    "/series/:path*",
    "/live/:path*",
    "/live",
    "/api/feed",
    "/api/feed/:path*",
    "/api/series",
    "/api/series/:path*",
  ],
};
