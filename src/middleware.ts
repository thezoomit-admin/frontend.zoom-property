import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE } from "@/i18n/config";
import { PATHNAME_HEADER } from "@/lib/not-found";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  cookieOptions,
  REFRESH_COOKIE,
} from "@/server/features/auth/cookies";

/**
 * Locale routing.
 *
 * Public paths are unprefixed and always render English. Legacy `/en/...` and
 * `/bn/...` links redirect to their unprefixed equivalents; unprefixed paths
 * are internally rewritten to the existing `[lang]` route tree.
 *
 * It also stamps the requested path onto `x-pathname`. The 404 pages need it:
 * a request that matches no route reaches them with no params, and
 * `usePathname()` prerenders as `/_not-found`, so the real URL can only come
 * from here.
 *
 */
/** Refresh 5 minutes before actual expiry, not at the instant it lapses —
 * the point is that a page load never has to gamble on a token that's still
 * technically valid but might not survive the request. */
const REFRESH_SKEW_MS = 5 * 60 * 1000;

/** Reads a JWT's `exp` claim without verifying the signature — this is only
 * ever used to decide *when to bother refreshing*, a UX question. Whether
 * the token is actually trusted is the backend's call, made fresh on every
 * request it receives, regardless of what this returns. */
function jwtExpiryMs(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

/**
 * Keeps the editor's session cookie alive across page loads.
 *
 * A Server Component's own fallback (`getSession()`) can refresh an expired
 * token for its own render, but it cannot persist that back to a cookie —
 * only middleware, a Server Action or a Route Handler can write one. Without
 * this, every request past the access token's lifetime re-authenticates in
 * memory and throws the result away, which works until the refresh itself
 * hiccups once — at which point the visitor is logged out with no cookie
 * left to retry from. Middleware runs on every navigation, so it's the one
 * place that can renew the cookie *before* that becomes visible.
 */
async function refreshSessionCookie(request: NextRequest, response: NextResponse) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return; // logged out — nothing to refresh

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const expiresAt = accessToken ? jwtExpiryMs(accessToken) : null;
  if (expiresAt !== null && expiresAt - Date.now() > REFRESH_SKEW_MS) {
    return; // still good for a while
  }

  try {
    const base = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5009/api").replace(/\/+$/, "");
    const res = await fetch(`${base}/auth/refresh-token`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    if (!res.ok) return;
    const json = await res.json();
    const newToken = json?.data?.accessToken;
    if (newToken) {
      response.cookies.set(ACCESS_COOKIE, newToken, { ...cookieOptions, maxAge: ACCESS_MAX_AGE });
    }
  } catch {
    // Best-effort — a request that hits this on a bad network still has
    // `getSession()`'s in-render fallback for this one page load.
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const legacyLocale = pathname.match(/^\/(en|bn)(?=\/|$)/);

  if (legacyLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(legacyLocale[0].length) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  const headers = new Headers(request.headers);
  headers.set(PATHNAME_HEADER, pathname);
  const response = NextResponse.rewrite(url, { request: { headers } });
  await refreshSessionCookie(request, response);
  return response;
}

export const config = {
  // Skip Next internals and anything with a file extension (images, icons,
  // robots.txt, sitemap.xml) — those must not be pushed under a locale.
  matcher: ["/((?!_next|api|.*\\.).*)"],
};
