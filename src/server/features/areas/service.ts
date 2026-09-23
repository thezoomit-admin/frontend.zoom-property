import "server-only";

import { areas as fallback, type Area } from "@/data/areas";

import { CACHE_TAGS, createResource } from "../../base-api";
import { toArea } from "./mapper";
import type { ApiArea } from "./types";

const areas = createResource<ApiArea, Area>({
  path: "areas/public",
  tag: CACHE_TAGS.areas,
  map: toArea,
  fallback,
  sort: "order",
  slugOf: (a) => a.id,
});

/**
 * The areas picked for the home page.
 *
 * Uses the API only. Demo fallback only when the API is unreachable — an empty
 * panel choice must not resurrect the built-in list.
 */
export async function getHomeAreas(limit = 10): Promise<Area[]> {
  const page = await areas.paginate({ isHome: true, limit });
  if (page) return page.rows;
  return fallback.slice(0, limit);
}

/** Every live service area from the API (demo fallback only if API is down). */
export async function getAreas(limit = 60): Promise<Area[]> {
  const page = await areas.paginate({ limit });
  if (page) return page.rows;
  return limit > 0 ? fallback.slice(0, limit) : fallback;
}
/** One area by its slug, or `null` when there is none. */
export async function getAreaBySlug(slug: string): Promise<Area | null> {
  return areas.bySlug(slug);
}
