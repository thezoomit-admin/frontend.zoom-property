import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { FiguresBand } from "@/components/pages/about/figures-band";
import { GallerySection } from "@/components/pages/about/gallery-section";
import { MilestonesSection } from "@/components/pages/about/milestones-section";
import { StorySection } from "@/components/pages/about/story-section";
import { VettingSection } from "@/components/pages/about/vetting-section";
import { pageBanners } from "@/data/page-banners";
import { localeAlternates } from "@/i18n/alternates";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/common/contact-cta";
import AppContainer from "@/components/common/app-container";

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
      />

      <StorySection />
      <FiguresBand />
      <VettingSection />
      <MilestonesSection />
      <GallerySection />
      
      <AppContainer>
        <Reveal>
        <section className="h-60 w-full overflow-hidden rounded-2xl border-t border-border bg-muted sm:h-80 md:h-100 lg:h-112.5">
          <iframe
            src={(dict.contact as Record<string, unknown>).mapUrl as string || "https://www.google.com/maps?q=ZOOM+IT+Work+Station&output=embed"}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          />
        </section>
      </Reveal>
      </AppContainer>
       <div className="mt-8 md:mt-12 lg:mt-20">
              <ContactCta  tone="surface"/>
            </div>
    </>
  );
}
