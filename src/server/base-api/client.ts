import "server-only";

import type { ApiEnvelope, ApiMeta, QueryParams } from "./types";

/**
 * The transport. The only place in the site that calls `fetch`.
 *
 * It knows four things and no more: where the API lives, what its envelope
 * looks like, how a response is cached, and that it must never throw. A
 * property site whose API blips should serve a slightly stale page, not a 500
 * to somebody mid-enquiry — so failure is a `null` return, and the layer above
 * decides what to do about it.
 */

const BASE =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5009/api";

/**
 * The backstop refresh, in seconds.
 *
 * Freshness normally comes from the panel: a save posts a tag to
 * `/api/revalidate` and the affected pages rebuild within the second. This is
 * only insurance for the ping that never arrives — a webhook lost to a network
 * blip should cost an hour of staleness, not require a redeploy. Set
 * `API_REVALIDATE=false` to rely on the tags alone.
 */
const REVALIDATE_ENV = process.env.API_REVALIDATE ?? "3600";
export const REVALIDATE: number | false =
  REVALIDATE_ENV === "false" ? false : Number(REVALIDATE_ENV);

/** A slow API must not hold a page open; better to fall back. */
const TIMEOUT_MS = 8000;

export const buildUrl = (path: string, params?: QueryParams) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === "") continue;
    search.append(key, String(value));
  }
  const qs = search.toString();
  return `${BASE.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}${qs ? `?${qs}` : ""}`;
};

export interface RequestOptions {
  /** Cache tags this response belongs to. See `tags.ts`. */
  tags?: string[];
  /** Override the backstop refresh for one read. */
  revalidate?: number | false;
}

/**
 * GET a public endpoint.
 *
 * `null` on any failure — unreachable, timed out, non-2xx, or an envelope that
 * reports `success: false`.
 */
export async function get<T>(
  path: string,
  params?: QueryParams,
  options?: RequestOptions,
): Promise<ApiEnvelope<T> | null> {
  const url = buildUrl(path, params);

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: {
        revalidate: options?.revalidate ?? REVALIDATE,
        tags: options?.tags,
      },
    });

    if (!res.ok) {
      console.warn(`[api] ${res.status} ${url}`);
      return null;
    }

    const json = (await res.json()) as ApiEnvelope<T>;
    return json?.success ? json : null;
  } catch (err) {
    console.warn(`[api] failed ${url}:`, (err as Error).message);
    return null;
  }
}

/**
 * POST to a public endpoint.
 */
export async function post<T>(
  path: string,
  body: unknown,
): Promise<ApiEnvelope<T> | null> {
  const url = buildUrl(path);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      console.warn(`[api] ${res.status} ${url}`);
      return null;
    }

    const json = (await res.json()) as ApiEnvelope<T>;
    return json?.success ? json : null;
  } catch (err) {
    console.warn(`[api] failed POST ${url}:`, (err as Error).message);
    return null;
  }
}

/** The rows of a list endpoint, or `null` if the call did not succeed. */
export async function list<T>(
  path: string,
  params?: QueryParams,
  options?: RequestOptions,
): Promise<{ rows: T[]; meta?: ApiMeta } | null> {
  const res = await get<T[]>(path, params, options);
  if (!res || !Array.isArray(res.data)) return null;
  return { rows: res.data, meta: res.meta };
}

export const baseApi = { get, post, list, url: buildUrl };
