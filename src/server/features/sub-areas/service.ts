import "server-only";

import { CACHE_TAGS, createResource } from "../../base-api";
import { toSubArea, type SubArea } from "./mapper";
import type { ApiSubArea } from "./types";

const subAreas = createResource<ApiSubArea, SubArea>({
  path: "sub-areas/public",
  tag: CACHE_TAGS.areas,
  map: toSubArea,
  fallback: [],
  sort: "order",
  slugOf: (s) => s.id,
});

/** Active sub-areas for one neighbourhood (area slug or ObjectId). */
export async function getSubAreasByArea(
  area: string,
  limit = 60,
): Promise<SubArea[]> {
  const rows = await subAreas.query({ area, limit, sort: "order" });
  return rows ?? [];
}

/** All active public sub-areas (for lead-form nesting). */
export async function getAllPublicSubAreas(limit = 200): Promise<SubArea[]> {
  const rows = await subAreas.query({ limit, sort: "order" });
  return rows ?? [];
}

export async function getSubAreaBySlugs(
  areaSlug: string,
  subSlug: string,
): Promise<SubArea | null> {
  const res = await subAreas.raw<ApiSubArea>(
    `sub-areas/public/${encodeURIComponent(areaSlug)}/${encodeURIComponent(subSlug)}`,
  );
  return res?.data ? toSubArea(res.data) : null;
}

export type { SubArea };
