import { NextResponse, type NextRequest } from "next/server";

import { baseApi } from "@/server/base-api";
import { getSession } from "@/server/features/auth/session";

/**
 * Authenticated proxy for folder management in the media library.
 */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Not signed in" }, { status: 401 });
  }

  const url = new URL(baseApi.url("folders"));
  const params = request.nextUrl.searchParams;
  const parent = params.get("parent");
  if (parent) {
    url.searchParams.set("parent", parent);
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${session.token}` },
    cache: "no-store",
  });
  const json = await res.json().catch(() => null);
  return NextResponse.json(json, { status: res.status });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Not signed in" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !body.name) {
    return NextResponse.json(
      { success: false, message: "Folder name is required" },
      { status: 400 }
    );
  }

  const res = await fetch(baseApi.url("folders/create"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  return NextResponse.json(json, { status: res.status });
}
