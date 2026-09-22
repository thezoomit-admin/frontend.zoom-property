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

export async function getLandingChrome(locale: Locale): Promise<LandingChrome[]> {
  const res = await baseApi.get<ApiLandingChrome[]>(
    "projects/public/landing/chrome",
    undefined,
    options,
  );
  if (!Array.isArray(res?.data)) return [];
  return res.data.map((row) => toLandingChrome(row, locale));
}
