import { cache } from "react";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";

import { applyCmsOverrides } from "@/server/features/cms";

import { isLocale, type Locale } from "./config";
import type enMessages from "./messages/en.json";

/**
 * Dictionary loading.
 *
 * Dynamic `import()` per locale, so only the requested language's JSON is
 * pulled in — and because this only ever runs in Server Components, none of it
 * reaches the client bundle. Adding a language is one JSON file plus one line
 * in `dictionaries`.
 *
 * `getDictionary()` takes no argument: it reads the locale from
 * `next/root-params`, which works in any server component or server-side helper
 * below `app/[lang]`. That is what keeps `lang` from being prop-drilled through
 * every section.
 */

/** English is the source of truth for the shape; every other file must match. */
export type Dictionary = typeof enMessages;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./messages/en.json").then((m) => m.default),
  // Cast, not `satisfies`: TypeScript types a JSON import by its literal string
  // values, so `bn.json` is structurally a *different* type from `en.json` even
  // when the keys match exactly. The build-time check below is what actually
  // guards the shape.
  bn: () => import("./messages/bn.json").then((m) => m.default as Dictionary),
};

export const getLocale = cache(async (): Promise<Locale> => {
  const value = await lang();
  if (!value || !isLocale(value)) notFound();
  return value;
});

/** One CMS-merged dictionary per request — layout + page + sections share it. */
export const getDictionary = cache(async (): Promise<Dictionary> => {
  const locale = await getLocale();
  const dictionary = await dictionaries[locale]();
  // Whatever the desk has edited in the panel wins over the JSON. Nothing
  // edited, or no API to ask, and this hands back the dictionary unchanged.
  return applyCmsOverrides(dictionary, locale);
});

/**
 * Load a dictionary for an explicitly given locale.
 *
 * `getDictionary()` reads the locale from root params and calls `notFound()`
 * when it is missing — which is exactly what a `not-found.tsx` must not do.
 * Boundaries that render *because* a route did not match resolve their own
 * locale (falling back to the default) and come through here instead.
 */
export const getDictionaryFor = cache(
  async (locale: Locale): Promise<Dictionary> => {
    const dictionary = await dictionaries[locale]();
    return applyCmsOverrides(dictionary, locale);
  },
);
