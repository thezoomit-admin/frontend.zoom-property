import type { MetadataRoute } from "next";

import { galleryImages, siteConfig } from "@/data/site";
import { services } from "@/data/services";
import { DEFAULT_LOCALE, LOCALES, LOCALE_TAGS } from "@/i18n/config";
import { getInsights } from "@/server/features/insights";
import { getLandingChrome } from "@/server/features/project-landing";
import { getProjects } from "@/server/features/projects";
import { getProperties } from "@/server/features/properties";

/** English-only public routes. `changeFrequency` and `priority` are omitted. */
const ROUTES = [
  "",
  "/properties",
  "/projects",
  "/areas",
  "/agents",
  "/landowners",
  "/blog",
  "/about",
  "/contact",
  "/reviews",
  "/terms",
  "/privacy",
] as const;

const url = (_locale: string, route: string) => `${siteConfig.url}${route}`;

/** One entry per article. Use publication date rather than build time. */
function articleEntries(insights: Awaited<ReturnType<typeof getInsights>>): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    insights.map((insight) => {
      const route = `/blog/${insight.id}`;
      return {
        url: url(locale, route),
        lastModified: new Date(insight.date),
        alternates: {
          languages: {
            ...Object.fromEntries(
              LOCALES.map((l) => [LOCALE_TAGS[l], url(l, route)]),
            ),
            "x-default": url(DEFAULT_LOCALE, route),
          },
        },
        images: [insight.image],
      };
    }),
  );
}

/**
 * One entry per listing per locale. No `lastModified` that pretends to be a
 * content date — the listings carry no updated-at, and a build timestamp on
 * every one of them is worth less than nothing.
 */
function propertyEntries(properties: Awaited<ReturnType<typeof getProperties>>): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    properties.map((property) => {
      const route = `/properties/${property.slug}`;
      return {
        url: url(locale, route),
        alternates: {
          languages: {
            ...Object.fromEntries(
              LOCALES.map((l) => [LOCALE_TAGS[l], url(l, route)]),
            ),
            "x-default": url(DEFAULT_LOCALE, route),
          },
        },
        images: property.images,
      };
    }),
  );
}

/** One entry per development per locale. */
function projectEntries(projects: Awaited<ReturnType<typeof getProjects>>): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    projects.map((project) => {
      const route = `/projects/${project.slug}`;
      return {
        url: url(locale, route),
        alternates: {
          languages: {
            ...Object.fromEntries(
              LOCALES.map((l) => [LOCALE_TAGS[l], url(l, route)]),
            ),
            "x-default": url(DEFAULT_LOCALE, route),
          },
        },
        images: project.images,
      };
    }),
  );
}

function serviceEntries(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    services.map((service) => {
      const route = `/services/${service.id}`;
      return {
        url: url(locale, route),
        alternates: {
          languages: {
            ...Object.fromEntries(
              LOCALES.map((l) => [LOCALE_TAGS[l], url(l, route)]),
            ),
            "x-default": url(DEFAULT_LOCALE, route),
          },
        },
        images: [service.image],
      };
    }),
  );
}

/** One entry per published campaign landing per locale. */
function landingEntries(
  landings: Awaited<ReturnType<typeof getLandingChrome>>,
): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    landings
      .filter((row) => row.href && row.href !== "/")
      .map((row) => {
        const route = row.href;
        return {
          url: url(locale, route),
          alternates: {
            languages: {
              ...Object.fromEntries(
                LOCALES.map((l) => [LOCALE_TAGS[l], url(l, route)]),
              ),
              "x-default": url(DEFAULT_LOCALE, route),
            },
          },
        };
      }),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [insights, properties, projects, landings] = await Promise.all([
    getInsights(1_000),
    getProperties(1_000),
    getProjects(1_000),
    getLandingChrome(DEFAULT_LOCALE),
  ]);
  const lastModified = new Date();

  const pages = LOCALES.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: url(locale, route),
      lastModified,
      alternates: {
        languages: {
          ...Object.fromEntries(
            LOCALES.map((l) => [LOCALE_TAGS[l], url(l, route)]),
          ),
          "x-default": url(DEFAULT_LOCALE, route),
        },
      },
      ...(route === ""
        ? {
            images: [
              ...properties.map((property) => property.images[0]),
              ...galleryImages.map((image) => image.src),
            ],
          }
        : {}),
    })),
  );

  return [
    ...pages,
    ...propertyEntries(properties),
    ...projectEntries(projects),
    ...articleEntries(insights),
    ...serviceEntries(),
    ...landingEntries(landings),
  ];
}
