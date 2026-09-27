import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ContactCta } from "@/components/common/contact-cta";
import { pageBanners } from "@/data/page-banners";
import { AreaComparisonSection } from "@/components/pages/areas/area-comparison";
import { AreasPaginated } from "@/components/pages/areas/areas-paginated";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeAlternates } from "@/i18n/alternates";
import { getAreas } from "@/server/features/areas";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.areas.metaTitle,
    description: dict.areas.metaDescription,
    alternates: localeAlternates(locale, "/areas"),
  };
}

/**
 * All service areas, ten to a page.
 *
 * Reading `page` from the query string makes this route render per request
 * rather than at build time. That is the cost of putting every page of results
 * in the HTML instead of behind client state, and for a list this size it is
 * the right side of the trade.
 */
export default async function AreasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [dict, locale, query, allAreas] = await Promise.all([
    getDictionary(),
    getLocale(),
    searchParams,
    getAreas(100),
  ]);

  const page = Number.parseInt(query.page ?? "1", 10);

  return (
    <>
      <PageHeader
        eyebrow={dict.areas.eyebrow}
        title={dict.areas.pageTitle}
        description={dict.areas.pageDescription}
        image={dict.areas.backgroundImage || pageBanners.areas}
        cmsPageId="areas"
        cmsSectionId="areas"
      />

      <AreasPaginated
        page={Number.isNaN(page) ? 1 : page}
        locale={locale}
        t={dict.areas.service}
        areas={allAreas}
      />

      <AreaComparisonSection areas={allAreas} />
      <ContactCta tone="surface" noBackground />
    </>
  );
}
