import type { Metadata } from "next";

import { LegalPage } from "@/components/pages/legal/legal-page";
import { pageBanners } from "@/data/page-banners";
import { localeAlternates } from "@/i18n/alternates";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.terms.metaTitle,
    description: dict.terms.metaDescription,
    alternates: localeAlternates(locale, "/terms"),
  };
}

/**
 * Terms & Conditions.
 *
 * Every word is in the dictionary, so the desk edits it in the panel and the
 * Bangla version is a translation rather than a second page nobody maintains.
 */
export default async function TermsPage() {
  const dict = await getDictionary();
  return <LegalPage content={dict.terms} fallbackImage={pageBanners.blog} cmsSectionId="terms" />;
}
