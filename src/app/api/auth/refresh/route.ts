import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { refreshAccessToken } from "@/server/features/auth/session";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  cookieOptions,
} from "@/server/features/auth/cookies";

/**
 * Mints a fresh access token from the refresh cookie and persists it.
 *
 * `getSession()` already does this same exchange mid-render when the access
 * token has expired, but a render can't write a cookie — only a Server
 * Action or a Route Handler can. This is that write, for a client component
 * (the edit modal, before a save) to call proactively.
 */
export async function POST() {
  const token = await refreshAccessToken();
  if (!token) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  (await cookies()).set(ACCESS_COOKIE, token, {
    ...cookieOptions,
    maxAge: ACCESS_MAX_AGE,
  });
  return NextResponse.json({ success: true });
}
