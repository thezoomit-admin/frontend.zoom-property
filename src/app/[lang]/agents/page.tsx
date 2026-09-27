import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { pageBanners } from "@/data/page-banners";
import { AdvisorMatchSection } from "@/components/pages/agents/advisor-match-section";
import { AgentsSection } from "@/components/pages/agents/agents-section";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeAlternates } from "@/i18n/alternates";
import AppContainer from "@/components/common/app-container";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/common/contact-cta";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.agentsSection.metaTitle,
    description: dict.agentsSection.metaDescription,
    alternates: localeAlternates(locale, "/agents"),
  };
}

export default async function AgentsPage() {
  const dict = await getDictionary();

  return (
    <>
      <PageHeader
        eyebrow={dict.agentsSection.eyebrow}
        title={dict.agentsSection.pageTitle}
        description={dict.agentsSection.pageDescription}
        image={(dict.agentsSection as Record<string, unknown>).backgroundImage as string || pageBanners.agents}
        cmsPageId="agents"
        cmsSectionId="agents"
      />

      <AgentsSection />
      <AdvisorMatchSection />
      
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
