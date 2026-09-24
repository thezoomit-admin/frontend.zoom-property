import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { ContactCta } from "@/components/common/contact-cta";
import { pageBanners } from "@/data/page-banners";
import { ConstructionStagesSection } from "@/components/pages/projects/construction-stages-section";
import { ProjectsSection } from "@/components/pages/projects/projects-section";
import { ShowcaseVideoGrid } from "@/components/pages/home/showcase-video-grid";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeAlternates } from "@/i18n/alternates";
import { getVideosPage } from "@/server/features/videos";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.projects.metaTitle,
    description: dict.projects.metaDescription,
    alternates: localeAlternates(locale, "/projects"),
  };
}

/** Video strip — streamed so the project grid paints without waiting. */
async function ProjectsVideos({ videoPage }: { videoPage?: string }) {
  const [dict, locale, showcaseVideos] = await Promise.all([
    getDictionary(),
    getLocale(),
    getVideosPage(Number.parseInt(videoPage ?? "1", 10) || 1, 8),
  ]);

  return (
    <ShowcaseVideoGrid
      videos={showcaseVideos.videos}
      locale={locale}
      page={showcaseVideos.meta.page}
      totalPage={showcaseVideos.meta.totalPage}
      basePath="/projects"
      pageParam="videoPage"
      title={dict.videoSection.title}
      description={dict.videoSection.description}
      playLabel={dict.videoSection.play}
      closeLabel={dict.videoSection.close}
    />
  );
}

/**
 * Projects catalogue — filters live on the client (URL only), so changing
 * stage/search does not re-block on a loading shell.
 */
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    stage?: string;
    q?: string;
    page?: string;
    videoPage?: string;
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
      />

      <ProjectsSection
        variant="full"
        initialStage={query?.stage}
        initialSearch={query?.q}
        initialPage={query?.page ? Number(query.page) : undefined}
      />

      <ConstructionStagesSection />
      <ContactCta />
      <Suspense fallback={null}>
        <ProjectsVideos videoPage={query.videoPage} />
      </Suspense>
    </>
  );
}
