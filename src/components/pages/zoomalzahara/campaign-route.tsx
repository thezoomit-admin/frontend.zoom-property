import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/common/json-ld";
import { ZoomAlZaharaLanding } from "@/components/pages/zoomalzahara/zoomalzahara-landing";
import { localeAlternates } from "@/i18n/alternates";
import { LOCALE_TAGS } from "@/i18n/config";
import { getLocale } from "@/i18n/dictionaries";
import { localeHref } from "@/i18n/href";
import { siteConfig } from "@/data/site";
import { absoluteUrl } from "@/lib/seo";
import { getLandingByPath } from "@/server/features/project-landing";
import type { LandingView } from "@/server/features/project-landing/types";

function digits(value: string) {
  return value.replace(/\D/g, "");
}

export async function generateLandingMetadata(path: string): Promise<Metadata> {
  const locale = await getLocale();
  const landing = await getLandingByPath(path, locale);
  if (!landing) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }

  const title = landing.metaTitle || landing.projectName;
  const description = landing.metaDescription || landing.hero.lead;

  return {
    title,
    description,
    alternates: localeAlternates(locale, landing.href),
    openGraph: {
      type: "website",
      title,
      description,
      url: absoluteUrl(localeHref(locale, landing.href)),
      siteName: siteConfig.name,
      locale: LOCALE_TAGS[locale].replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function landingSchemas(landing: LandingView, localePath: string) {
  const schemas: Record<string, unknown>[] = [];
  const phone = landing.phone ? `+88${digits(landing.phone)}` : undefined;

  schemas.push({
    "@context": "https://schema.org",
    "@type": "Residence",
    name: landing.projectName || landing.hero.title,
    description: landing.metaDescription || landing.hero.lead || undefined,
    url: absoluteUrl(localePath),
    telephone: phone,
    sameAs: landing.facebookUrl ? [landing.facebookUrl] : undefined,
    address: landing.hero.location
      ? {
          "@type": "PostalAddress",
          streetAddress: landing.hero.location,
          addressCountry: "BD",
        }
      : undefined,
  });

  if (landing.sections.faq && landing.faq.items.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: landing.faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return schemas;
}

export async function ProjectLandingRoute({ path }: { path: string }) {
  const locale = await getLocale();
  const landing = await getLandingByPath(path, locale);
  if (!landing) notFound();

  const schemas = landingSchemas(landing, localeHref(locale, landing.href));

  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLd key={index} schema={schema} />
      ))}
      <ZoomAlZaharaLanding landing={landing} />
    </>
  );
}
