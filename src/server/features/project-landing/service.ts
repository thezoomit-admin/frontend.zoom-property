import "server-only";

import type { Locale } from "@/i18n/config";

import { baseApi, CACHE_TAGS } from "../../base-api";
import { toLandingChrome, toLandingView } from "./mapper";
import type { ApiLandingChrome, ApiProjectLanding, LandingChrome, LandingView } from "./types";

const options = { tags: [CACHE_TAGS.projects] };

export async function getLandingByPath(
  path: string,
  locale: Locale,
): Promise<LandingView | null> {
  const res = await baseApi.get<ApiProjectLanding>(
    `projects/public/landing/${encodeURIComponent(path)}`,
    undefined,
    options,
  );
  if (!res?.data) return null;
  return toLandingView(res.data, locale);
}

/**
 * The same document `getLandingByPath` reads, unmapped.
 *
 * `toLandingView` picks one locale and drops `_id` / the raw bilingual pairs
 * on the way — exactly what a visitor's page needs and exactly what an
 * editor's form doesn't have enough of. Only called when a session exists,
 * so an anonymous render never pays for it; when it does run, it shares the
 * same URL and cache tag as the public read, so Next's request memoization
 * collapses the two into one network call per render rather than two.
 */
export async function getRawLandingByPath(
  path: string,
): Promise<ApiProjectLanding | null> {
  const res = await baseApi.get<ApiProjectLanding>(
    `projects/public/landing/${encodeURIComponent(path)}`,
    undefined,
    options,
  );
  return res?.data ?? null;
}

export async function getLandingChrome(locale: Locale): Promise<LandingChrome[]> {
  const res = await baseApi.get<ApiLandingChrome[]>(
    "projects/public/landing/chrome",
    undefined,
    options,
  );
  if (!Array.isArray(res?.data)) return [];
  return res.data.map((row) => toLandingChrome(row, locale));
}
