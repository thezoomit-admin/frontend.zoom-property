import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { baseApi, CACHE_TAGS } from "@/server/base-api";
import { getSession } from "@/server/features/auth/session";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get("group");
    if (!group) {
      return NextResponse.json(
        { success: false, error: "Group query parameter is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      baseApi.url(`dynamic-content/map?group=${encodeURIComponent(group)}`),
      {
        cache: "no-store",
      }
    );

    const json = await res.json().catch(() => null);
    return NextResponse.json({
      success: true,
      data: json?.data || {},
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch CMS content" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session?.token) {
      return NextResponse.json(
        { success: false, error: "Authentication required to edit content" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { contents = [], clear = [] } = body || {};

    if (contents.length > 0) {
      const upsertRes = await fetch(baseApi.url("dynamic-content/bulk-upsert"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ contents }),
      });

      if (!upsertRes.ok) {
        const errJson = await upsertRes.json().catch(() => null);
        return NextResponse.json(
          {
            success: false,
            error: errJson?.message || "Failed to update dynamic content",
          },
          { status: upsertRes.status }
        );
      }
    }

    if (clear.length > 0) {
      const deleteRes = await fetch(baseApi.url("dynamic-content/bulk-delete"), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({ keys: clear }),
      });

      if (!deleteRes.ok) {
        const errJson = await deleteRes.json().catch(() => null);
        return NextResponse.json(
          {
            success: false,
            error: errJson?.message || "Failed to clear deleted fields",
          },
          { status: deleteRes.status }
        );
      }
    }

    // Invalidate Next.js CMS cache tag
    try {
      revalidateTag(CACHE_TAGS.cms, { expire: 0 });
    } catch {
      // Ignore in development or if revalidateTag behaves differently
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to save CMS changes" },
      { status: 500 }
    );
  }
}
