import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { FiguresBand } from "@/components/pages/about/figures-band";
import { StorySection } from "@/components/pages/about/story-section";
import { TeamSection } from "@/components/pages/about/team-section";
import { pageBanners } from "@/data/page-banners";
import { localeAlternates } from "@/i18n/alternates";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

import { ContactCta } from "@/components/common/contact-cta";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.about.metaTitle,
    description: dict.about.metaDescription,
    alternates: localeAlternates(locale, "/about"),
  };
}

/**
 * About.
 *
 * Five sections, each laid out differently on purpose. The page has to carry
 * prose, numbers, a process, a history and photographs, and running all five
 * through the same card grid is how an About page becomes a wall nobody
 * finishes:
 *   5  Gallery    an image grid, and the only section that is all picture
 *
 * The order alternates weight as well as layout — read, count, read, scan,
 * look — so no two adjacent sections ask the same thing of the reader.
 */
export default async function AboutPage() {
  const dict = await getDictionary();

  return (
    <>
      <PageHeader
        eyebrow={dict.about.eyebrow}
        title={dict.about.title}
        description={dict.about.description}
        image={dict.about.backgroundImage || pageBanners.about}
        cmsPageId="about"
        cmsSectionId="about"
      />

      <StorySection />
      <FiguresBand />
      <TeamSection />

      <div className="mt-8 md:mt-12 lg:mt-20">
        <ContactCta tone="surface" className="bg-muted/40" />
      </div>
    </>
  );
}
