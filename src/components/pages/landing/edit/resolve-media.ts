import type { ApiMedia } from "@/server/base-api/types";

/**
 * The client-safe counterpart to `mediaUrl` (which is `server-only` and
 * assumes a raw key needs a bucket prefix). Editable documents come back
 * already populated — `{_id, key, url}` — so there's nothing to build, only
 * to read.
 */
export function resolveMedia(
  media: ApiMedia | string | null | undefined,
): { id: string; url: string } | null {
  if (!media) return null;
  if (typeof media === "string") return null; // unpopulated id — nothing to preview
  if (!media._id || !media.url) return null;
  return { id: media._id, url: media.url };
}
