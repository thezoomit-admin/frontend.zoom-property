import type { Metadata } from "next";

import type { Locale } from "./config";

/**
 * Canonical URL for one public page.
 *
 * Must be called by every page that defines `generateMetadata`: Next *replaces*
 * the parent's `alternates` object rather than merging into it, so a page that
 * sets only `{ canonical }` silently drops the value the layout emitted.
 */
export function localeAlternates(
  _locale: Locale,
  path: string,
): Metadata["alternates"] {
  return {
    canonical: path.replace(/^\/(?:en|bn)(?=\/|$)/, "") || "/",
  };
}
