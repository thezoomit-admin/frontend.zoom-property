import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { ContactCta } from "@/components/common/contact-cta";
import { pageBanners } from "@/data/page-banners";
import { ProjectsSection } from "@/components/pages/projects/projects-section";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeAlternates } from "@/i18n/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.projects.metaTitle,
    description: dict.projects.metaDescription,
    alternates: localeAlternates(locale, "/projects"),
  };
}

/**
 * Projects catalogue — status tabs live on the client (URL only), so changing
 * status does not re-block on a loading shell.
 */
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    stage?: string;
    page?: string;
  }>;
}) {
  const query = await searchParams;
  const dict = await getDictionary();

  return (
    <>
      <PageHeader
        eyebrow={dict.projects.eyebrow}
        title={dict.projects.pageTitle}
        description={dict.projects.pageDescription}
        image={dict.projects.backgroundImage || pageBanners.projects}
        cmsPageId="projects"
        cmsSectionId="projects"
      />

      <ProjectsSection
        variant="full"
        initialStage={query?.stage}
        initialPage={query?.page ? Number(query.page) : undefined}
      />

      <ContactCta />
    </>
  );
}
