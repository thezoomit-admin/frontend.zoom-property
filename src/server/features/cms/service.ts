import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";

import { baseApi, CACHE_TAGS } from "../../base-api";

/**
 * Copy edited in the panel, laid over the built-in dictionary.
 *
 * The panel stores one row per string per language, keyed by its dictionary
 * path with the language on the end — `hero.title.en`. So an override needs no
 * mapping table: the key *is* the path into the dictionary, which is why the
 * CMS schema was generated from these files in the first place.
 *
 * Only what somebody actually edited is stored. Everything else falls through
 * to the JSON, so a page renders the same as it always did until the desk
 * changes a line — and if the API is unreachable, the site simply renders the
 * built-in text rather than failing.
 */

interface CmsRow {
  key: string;
  value?: unknown;
  imageUrl?: string;
  group?: string;
}

/** Every CMS group. One request rather than one per page section. */
const GROUPS = [
  "home",
  "properties",
  "projects",
  "areas",
  "about",
  "services",
  "landowners",
  "blog",
  "reviews",
  "agents",
  "contact",
  "legal",
  "headerFooter",
  "common",
] as const;

/**
 * Writes `value` at a dotted path, but only where the dictionary already has a
 * string.
 *
 * The guard is the point: a stored key that no longer matches the dictionary —
 * a section renamed, a field removed — is ignored rather than grafting a stray
 * branch onto the object the components destructure.
 */
const setPath = (
  target: Record<string, unknown>,
  path: string[],
  value: string | string[] | Record<string, unknown>[],
) => {
  let node = target as Record<string, unknown>;
  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i];
    const nextSegment = path[i + 1];
    if (node[segment] === undefined || node[segment] === null) {
      const isNextNumeric = /^\d+$/.test(nextSegment);
      node[segment] = isNextNumeric ? [] : {};
    }
    node = node[segment] as Record<string, unknown>;
  }
  const last = path[path.length - 1];
  node[last] = value;
};

/** A structural copy, so one request's overrides never leak into the next. */
const clone = <T,>(value: T): T =>
  typeof structuredClone === "function"
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T);

/**
 * Returns the dictionary with the panel's edits applied for this locale.
 *
 * Untouched when nothing is stored, so the cost of the CMS on a site nobody
 * has edited yet is one cached request.
 *
 * Cached per (locale) within a request so layout + page share one CMS fan-out.
 */
export const applyCmsOverrides = cache(async function applyCmsOverrides<
  T extends object,
>(dictionary: T, locale: Locale): Promise<T> {
  const groups = await Promise.all(
    GROUPS.map((group) =>
      baseApi.list<CmsRow>(`dynamic-content/by-group/${group}`, undefined, {
        tags: [CACHE_TAGS.cms],
      }),
    ),
  );

  const rows = groups.flatMap((g) => g?.rows ?? []);
  if (!rows.length) return dictionary;

  const suffix = `.${locale}`;
  const merged = clone(dictionary) as Record<string, unknown>;
  let applied = 0;

  for (const row of rows) {
    if (typeof row?.key !== "string" || !row.key.endsWith(suffix)) continue;
    // A gallery field stores its addresses as an array; everything else is
    // one string. Both come back on `value`, so the shape is what tells them
    // apart — and an empty list means the desk cleared the field, which falls
    // through to the built-in exactly as an empty string does.
    //
    // Object arrays (e.g. pages.match.steps = [{title, body}]) are passed
    // through as-is so repeatable sections can be overridden from the CMS.
    const rawVal = Array.isArray(row.value)
      ? row.value.every((item) => typeof item === "object" && item !== null)
        ? (row.value as Record<string, unknown>[])
        : row.value.filter(
            (item): item is string => typeof item === "string" && !!item.trim(),
          )
      : typeof row.value === "string"
      ? row.value
      : typeof row.imageUrl === "string"
      ? row.imageUrl
      : "";

    if (
      Array.isArray(rawVal)
        ? !rawVal.length
        : typeof rawVal === "string" && !rawVal.trim()
    )
      continue;

    const path = row.key.slice(0, -suffix.length).split(".");
    if (!path.length) continue;

    setPath(merged, path, rawVal);
    applied += 1;
  }

  return applied ? (merged as T) : dictionary;
});
