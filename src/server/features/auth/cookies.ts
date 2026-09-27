/**
 * Cookie names and options shared between `session.ts` (Server Components /
 * Actions, via `next/headers`) and `middleware.ts` (Edge, via
 * `NextRequest`/`NextResponse` cookies). Deliberately its own file, with no
 * `next/headers` import and no `"server-only"` tag: middleware runs on the
 * Edge runtime, which `next/headers`'s `cookies()` isn't built for, so it
 * needs a version of these constants it can import cleanly.
 */

export const ACCESS_COOKIE = "zp_session";
export const REFRESH_COOKIE = "zp_refresh";

/** Matches the backend's own JWT_ACCESS/REFRESH_EXPIRES_IN. */
export const ACCESS_MAX_AGE = 60 * 60 * 24;
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

const isProd = process.env.NODE_ENV === "production";

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};
