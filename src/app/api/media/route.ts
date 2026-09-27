import { NextResponse, type NextRequest } from "next/server";

import { baseApi } from "@/server/base-api";
import { getSession } from "@/server/features/auth/session";

/**
 * A thin authenticated pass-through to the backend's media library, for the
 * editor's picker. Not the admin's Redux/RTK-Query media API — that stack
 * doesn't exist here — just enough surface (list, paged and filtered) for a
 * client component to fetch with plain `fetch()`.
 */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Not signed in" }, { status: 401 });
  }

  const url = new URL(baseApi.url("media-library"));
  const params = request.nextUrl.searchParams;
  for (const key of ["page", "limit", "search", "type", "folder"]) {
    const value = params.get(key);
    if (value) url.searchParams.set(key, value);
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${session.token}` },
    cache: "no-store",
  });
  const json = await res.json().catch(() => null);
  return NextResponse.json(json, { status: res.status });
}
