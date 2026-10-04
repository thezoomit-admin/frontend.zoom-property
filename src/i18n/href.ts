import type { Locale } from "./config";

/** Internal links are unprefixed because the public site is English-only. */
export function localeHref(_locale: Locale, path: string) {
  return path.replace(/^\/(?:en|bn)(?=\/|$)/, "") || "/";
}
