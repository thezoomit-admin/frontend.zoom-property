import "server-only";

import { cache } from "react";

import { areas as fallback, type Area } from "@/data/areas";

import { CACHE_TAGS, createResource } from "../../base-api";
import { getAllPublicSubAreas } from "../sub-areas/service";
import type { SubArea } from "../sub-areas/mapper";
import { type LeadAreaOption } from "./lead-options";
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

/** Every live service area from the API (demo fallback only if API is down / empty). */
export async function getAreas(limit = 60): Promise<Area[]> {
  const page = await areas.paginate({ limit });
  if (page?.rows?.length) return page.rows;
  return limit > 0 ? fallback.slice(0, limit) : fallback;
}
/** One area by its slug, or `null` when there is none. Deduped per request. */
export const getAreaBySlug = cache(async (slug: string): Promise<Area | null> => {
  return areas.bySlug(slug);
});

/**
 * Areas + nested sub-areas for enquiry forms (hero, site CTA, contact).
 */
export async function getLeadAreaOptions(
  locale: "en" | "bn" = "en",
  limit = 60,
): Promise<LeadAreaOption[]> {
  const [list, allSubs] = await Promise.all([
    getAreas(limit),
    getAllPublicSubAreas(200),
  ]);

  const byAreaSlug = new Map<string, SubArea[]>();
  for (const sub of allSubs) {
    const key = sub.areaSlug;
    if (!key) continue;
    const bucket = byAreaSlug.get(key) ?? [];
    bucket.push(sub);
    byAreaSlug.set(key, bucket);
  }

  return list.map((area) =>
    toLeadAreaOption(area, byAreaSlug.get(area.id) ?? [], locale),
  );
}

function toLeadAreaOption(
  area: Area,
  subs: SubArea[],
  locale: "en" | "bn",
): LeadAreaOption {
  const label = locale === "bn" && area.nameBn ? area.nameBn : area.name;
  return {
    value: area.name,
    label,
    slug: area.id,
    subAreas: subs.map((sub) => ({
      value: sub.name,
      label: locale === "bn" && sub.nameBn ? sub.nameBn : sub.name,
    })),
  };
}
