import "server-only";

import type { ApiMedia } from "./types";

/**
 * The mapping every feature needs.
 *
 * One record from the panel looks much like another: populated media, a
 * description that may be an array of paragraphs or a single string, and
 * optional fields the desk has not filled in yet. Solved once here rather than
 * in each feature folder.
 */

/** Public CDN for relative keys when env is unset. */
const R2_PUBLIC_FALLBACK =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/+$/, "") ||
  "https://pub-5b52277bf86041a0b4872bee7a979553.r2.dev";

const r2PublicBase = (): string => {
  const configured = String(process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "")
    .trim()
    .replace(/\/+$/, "");
  return configured || R2_PUBLIC_FALLBACK;
};

/**
 * What this accepts.
 *
 * A populated media document, a bare object key, or an absolute URL — all
 * three turn up depending on which endpoint the record came from, so the
 * union is stated rather than left as `any`.
 */
export type MediaLike = ApiMedia | string | null;

/**
 * The address of a media document.
 * Absolute URLs are left untouched (admin CMS stores full working R2 URLs).
 * Relative keys use the configured public bucket.
 * Bare Mongo ObjectIds (unpopulated refs) return "" — never invent a fake R2 path.
 */
export const mediaUrl = (m?: MediaLike): string => {
  if (!m) return "";
  if (typeof m === "string") {
    if (!m.trim()) return "";
    if (/^(https?:)?\/\//i.test(m)) return m;
    // Unpopulated ObjectId — not a storage key.
    if (/^[a-f0-9]{24}$/i.test(m.trim())) return "";
    return `${r2PublicBase()}/${m.replace(/^\/+/, "")}`;
  }
  if (m.url && typeof m.url === "string" && m.url.trim()) {
    return m.url.trim();
  }
  if (m.key && typeof m.key === "string" && m.key.trim()) {
    if (/^(https?:)?\/\//i.test(m.key)) return m.key.trim();
    if (/^[a-f0-9]{24}$/i.test(m.key.trim())) return "";
    return `${r2PublicBase()}/${m.key.replace(/^\/+/, "")}`;
  }
  return "";
};

/** The addresses of a list of media documents, blanks dropped. */
export const mediaUrls = (list?: MediaLike[] | null): string[] =>
  (list ?? []).map(mediaUrl).filter(Boolean);

/**
 * A gallery that always opens on the cover.
 *
 * The cover leads so a card and the banner it opens show the same frame, and
 * duplicates are dropped so a cover that also sits in the gallery is not shown
 * twice.
 */
export const gallery = (
  cover?: ApiMedia | null,
  rest?: ApiMedia[] | null,
): string[] =>
  Array.from(new Set([mediaUrl(cover), ...mediaUrls(rest)].filter(Boolean)));

/**
 * A description as the site wants it: one string per paragraph.
 *
 * The API stores an array, but older records carry a single string, so both
 * are accepted and anything empty is dropped.
 */
export const paragraphs = (value?: string[] | string | null): string[] => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value];
  return [];
};

/** An ISO date, or "" — never the string "Invalid Date". */
export const isoDate = (value?: string | Date | null): string => {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
};
