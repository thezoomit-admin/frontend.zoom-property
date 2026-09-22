import "server-only";

/**
 * The site's server-side data layer.
 *
 *   base-api/            the one client — nothing else here calls `fetch`
 *     client.ts          transport: address, envelope, caching, never throws
 *     resource.ts        the factory every feature service is built from
 *     tags.ts            cache tags, shared with the backend's revalidation
 *     mappers.ts         media, paragraph and date helpers
 *     types.ts           envelope, paging, populated media
 *
 *   features/<name>/     one folder per thing the panel manages
 *     types.ts           the shape the API returns
 *     mapper.ts          that shape to the type `src/data` defines
 *     service.ts         the reads a page actually calls
 *     index.ts           what the rest of the site may import
 *
 * Three rules hold throughout. A page never sees an API shape — it receives
 * `Area`, `Project`, `Property`, `Review`, `Insight` exactly as `src/data`
 * defines them, so a card need not know whether its photograph arrived as an
 * object key or a URL. Nothing throws: when the API is unreachable the
 * built-in data is served, because a stale page beats an empty one. And every
 * read is tagged, so a save in the panel refreshes exactly the pages that
 * showed it — see `app/api/revalidate/route.ts`.
 *
 * Import the feature you need (`@/server/features/projects`); this barrel is
 * for the few callers that need several.
 */

export { getAreaBySlug, getAreas, getHomeAreas } from "./features/areas";
export { applyCmsOverrides } from "./features/cms";
export {
  getHomeInsights,
  getInsightBySlug,
  getInsights,
  getInsightsByCategory,
} from "./features/insights";
export {
  getHomeProjects,
  getProjectBySlug,
  getProjects,
} from "./features/projects";
export { getLandingByPath, getLandingChrome } from "./features/project-landing";
export {
  getHomeProperties,
  getProperties,
  getPropertyBySlug,
} from "./features/properties";
export {
  getHomeReviews,
  getReviews,
  getVideoReviews,
} from "./features/reviews";
export { getHomeVideos, getVideos } from "./features/videos";
export { getLandownerBlocks } from "./features/landowners";
export { getAgents } from "./features/agents";

export {
  ALL_CACHE_TAGS,
  baseApi,
  CACHE_TAGS,
  createResource,
  resolveTag,
} from "./base-api";
export type {
  ApiMedia,
  ApiMeta,
  CacheTagName,
  QueryParams,
  Resource,
} from "./base-api";
