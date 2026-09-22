import type { Metadata } from "next";

import { JsonLd } from "@/components/common/json-ld";
import { ZoomAlZaharaLanding } from "@/components/pages/zoomalzahara/zoomalzahara-landing";
import { ZOOM_AL_ZAHARA_PHONES } from "@/data/zoomalzahara";
import { localeAlternates } from "@/i18n/alternates";
import { LOCALE_TAGS } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeHref } from "@/i18n/href";
import { siteConfig } from "@/data/site";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const copy = dict.zoomalzahara;

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: localeAlternates(locale, "/zoomalzahara"),
    openGraph: {
      type: "website",
      title: copy.metaTitle,
      description: copy.metaDescription,
      url: absoluteUrl(localeHref(locale, "/zoomalzahara")),
      siteName: siteConfig.name,
      locale: LOCALE_TAGS[locale].replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
  };
}

export default async function ZoomAlZaharaPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const copy = dict.zoomalzahara;
  const path = "/zoomalzahara";

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const residence = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: copy.hero.title,
    description: copy.metaDescription,
    url: absoluteUrl(localeHref(locale, path)),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Basila Garden City, Mohammadpur",
      addressRegion: "Dhaka",
      addressCountry: "BD",
    },
  };

  return (
    <>
      <JsonLd schema={residence} />
      <JsonLd schema={faq} />
      <ZoomAlZaharaLanding
        dict={copy}
        phone={ZOOM_AL_ZAHARA_PHONES.primary}
        whatsapp={ZOOM_AL_ZAHARA_PHONES.primary}
      />
    </>
  );
}
