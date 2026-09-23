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
 * `limit` is a ceiling, not a target. If nobody has ticked "on home page" the
 * caller gets the built-in list rather than an empty grid — an unconfigured
 * site should still look finished.
 */
export async function getHomeAreas(limit = 10): Promise<Area[]> {
  const picked = await areas.query({ isHome: true, limit });
  return picked ?? fallback.slice(0, limit);
}

/** Every service area, in the desk's order, for `/areas`. */
export const getAreas = (limit = 60) => areas.list({ limit });

/** One area by its slug, or `null` when there is none. */
export async function getAreaBySlug(slug: string): Promise<Area | null> {
  return areas.bySlug(slug);
}
