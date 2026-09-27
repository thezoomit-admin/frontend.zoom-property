import { NextResponse, type NextRequest } from "next/server";

import { baseApi } from "@/server/base-api";
import { getSession } from "@/server/features/auth/session";

/** Same shape as the admin's own upload, re-posted with the caller's token.
 *
 * The incoming multipart body is piped straight through as a raw stream —
 * never parsed into a `FormData` here. `request.formData()` turned out to be
 * unreliable on large bodies (it threw "Failed to parse body as FormData" on
 * some multi-megabyte files but not others, size not being a clean predictor
 * — a runtime bug, not anything about the file). Forwarding the body
 * untouched sidesteps that assembly step entirely and, since the browser's
 * original `FormData` already carries the `folder` field, needs no
 * reconstruction to preserve it.
 *
 * Deliberately NOT `runtime = "edge"`. That was tried first, to dodge
 * Vercel's ~4.5MB body cap on Node Serverless Functions — but the Edge
 * runtime here corrupted large multipart bodies outright (truncated
 * mid-stream, "Unexpected end of form" on the backend), reproducible with
 * plain curl uploads at 10MB+ while 8–9MB passed; `nodejs` handled every
 * size from 6MB to 25MB+ without a single failure. A real large-upload
 * ceiling on a Node Function deploy is a smaller, known problem than random
 * data corruption on an Edge one. */
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Not signed in" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data") || !request.body) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const res = await fetch(baseApi.url("media-library"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": contentType,
      },
      body: request.body,
      // @ts-expect-error -- required by undici/fetch when streaming a ReadableStream body
      duplex: "half",
    });
    const json = await res.json().catch(() => null);
    if (!json) {
      const text = await res.text().catch(() => "");
      console.error(`[media upload] non-JSON response from backend, status ${res.status}:`, text.slice(0, 500));
      return NextResponse.json(
        { success: false, message: `Upload backend returned ${res.status}: ${text.slice(0, 200)}` },
        { status: 502 },
      );
    }
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    console.error("[media upload] handler threw:", err);
    return NextResponse.json(
      {
        success: false,
        message: `Upload failed: ${(err as Error)?.message || String(err)}`,
      },
      { status: 500 },
    );
  }
}
