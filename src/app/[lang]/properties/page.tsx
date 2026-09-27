import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ContactCta } from "@/components/common/contact-cta";
import { pageBanners } from "@/data/page-banners";
import { ListingsSection } from "@/components/pages/properties/listings-section";
import { ShowcaseVideoGrid } from "@/components/pages/home/showcase-video-grid";
import type { Purpose } from "@/data/properties";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeHref } from "@/i18n/href";
import { localeAlternates } from "@/i18n/alternates";
import {
  getProperties,
  getPropertyTypes,
  type ApiPropertyType,
} from "@/server/features/properties";
import { getAreas } from "@/server/features/areas";
import { getVideosPage } from "@/server/features/videos";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.listings.metaTitle,
    description: dict.listings.metaDescription,
    alternates: localeAlternates(locale, "/properties"),
  };
}

/** A query-string number, or undefined when it is missing or not a number. */
function toNumber(value?: string) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * All listings.
 *
 * The home page's property calculator arrives here with its filters in the
 * query string — `?purpose=sale&area=gulshan&type=apartment&min=…&max=…` — so a
 * search is a URL that can be shared and reopened rather than state that only
 * exists in the tab it was typed in.
 */
export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    purpose?: string;
    area?: string;
    q?: string;
    type?: string;
    min?: string;
    max?: string;
    videoPage?: string;
  }>;
}) {
  const query = await searchParams;
  const [dict, locale, allProperties, allAreas, propertyTypes, showcaseVideos] = await Promise.all([
    getDictionary(),
    getLocale(),
    getProperties({
      limit: 100,
      purpose: query.purpose,
      area: query.area,
      type: query.type,
      q: query.q,
      min: toNumber(query.min),
      max: toNumber(query.max),
    }),
    getAreas(60),
    getPropertyTypes(),
    getVideosPage(Number.parseInt(query.videoPage ?? "1", 10) || 1, 8),
  ]);

  const filters = {
    purpose:
      query.purpose === "sale" || query.purpose === "rent"
        ? (query.purpose as Purpose)
        : undefined,
    area: query.area,
    q: query.q,
    type: query.type,
    min: toNumber(query.min),
    max: toNumber(query.max),
  };

  return (
    <>
      {/* 1. Fast / Top Header Section */}
      <PageHeader
        eyebrow={dict.listings.eyebrow}
        title={dict.listings.pageTitle}
        description={dict.listings.pageDescription.replace(
          "{count}",
          String(allProperties.length),
        )}
        image={dict.listings.backgroundImage || pageBanners.properties}
        cmsPageId="properties"
        cmsSectionId="listings"
      />

      {/* 2. Middle Properties Section with Dynamic Area Filters & Cards */}
      <ListingsSection
        variant="full"
        limit={6}
        filters={filters}
        properties={allProperties}
        areas={allAreas}
        types={propertyTypes.map((t: ApiPropertyType) => ({
          value: t.name,
          label: locale === "bn" && t.nameBn ? t.nameBn : t.description || t.name,
        }))}
        clearHref={localeHref(locale, "/properties")}
      />
      <ContactCta />
      <ShowcaseVideoGrid
        videos={showcaseVideos.videos}
        locale={locale}
        page={showcaseVideos.meta.page}
        totalPage={showcaseVideos.meta.totalPage}
        basePath="/properties"
        pageParam="videoPage"
        title={dict.videoSection.title}
        description={dict.videoSection.description}
        playLabel={dict.videoSection.play}
        closeLabel={dict.videoSection.close}
      />
    </>
  );
}
