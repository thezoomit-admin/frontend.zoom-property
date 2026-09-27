import { NextResponse } from "next/server";

import { getSession } from "@/server/features/auth/session";

/**
 * Hands the caller's own access token to their already-authenticated browser
 * so an upload can go straight from there to the backend, bypassing this
 * app's own server entirely.
 *
 * Why: proxying the file through a Route Handler here (POST /api/media/upload)
 * puts a Vercel Node Serverless Function in the middle of the request, which
 * caps the body at ~4.5MB before any of our code runs — a phone photo alone
 * clears that. The admin panel never hits this because it uploads straight
 * from its own browser to the backend; this mirrors that path instead of
 * fighting the proxy hop.
 *
 * The token this returns is the same bearer token already used for every
 * other authenticated call this session makes — handing it to its own
 * client-side JS for one more direct request doesn't widen what that XSS
 * exposure already covers.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Not signed in" }, { status: 401 });
  }
  return NextResponse.json({ success: true, token: session.token });
}
