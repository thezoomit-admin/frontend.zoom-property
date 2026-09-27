import { NextResponse, type NextRequest } from "next/server";

import { baseApi } from "@/server/base-api";
import { getSession } from "@/server/features/auth/session";

/** Same shape as the admin's own upload, re-posted with the caller's token —
 * read fully into memory and forwarded rather than streamed, since landing
 * page images are a handful of megabytes at most, not video. */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Not signed in" }, { status: 401 });
  }

  const incoming = await request.formData();
  const file = incoming.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
  }

  const outgoing = new FormData();
  outgoing.set("file", file, file.name);
  const folder = incoming.get("folder");
  if (typeof folder === "string" && folder) outgoing.set("folder", folder);

  const res = await fetch(baseApi.url("media-library"), {
    method: "POST",
    headers: { Authorization: `Bearer ${session.token}` },
    body: outgoing,
  });
  const json = await res.json().catch(() => null);
  return NextResponse.json(json, { status: res.status });
}
