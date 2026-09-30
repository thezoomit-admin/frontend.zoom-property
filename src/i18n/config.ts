/**
 * Locale configuration.
 *
 * Kept free of any `server-only` or `next/*` import so the proxy (edge), server
 * components and client components can all read it.
 */
export const LOCALES = ["en", "bn"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, { native: string; english: string }> = {
  en: { native: "English", english: "English" },
  bn: { native: "বাংলা", english: "Bangla" },
};

/** BCP-47 tags for `<html lang>`, hreflang and Intl formatters. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en",
  bn: "bn-BD",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Swap the locale segment of a path: `/bn/properties` + `en` → `/en/properties`.
 * Used by the language switcher so it keeps you on the page you were reading.
 */
export function localizePath(pathname: string, locale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  return `/${segments.join("/")}`;
}
