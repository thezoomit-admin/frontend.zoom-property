/**
 * Locale configuration.
 *
 * Kept free of any `server-only` or `next/*` import so the proxy (edge), server
 * components and client components can all read it.
 */
export const LOCALES = ["en"] as const;

/** Keep the legacy locale type for stored bilingual content; only English is routable. */
export type Locale = "en" | "bn";

export const DEFAULT_LOCALE: Locale = "en";

/** BCP-47 tags for `<html lang>`, hreflang and Intl formatters. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en",
  bn: "bn-BD",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** The site is English-only; paths never include a locale prefix. */
export function localizePath(pathname: string) {
  return pathname.replace(/^\/(?:en|bn)(?=\/|$)/, "") || "/";
}
