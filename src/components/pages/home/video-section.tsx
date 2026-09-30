import { AppContainer } from "@/components/common/app-container";
import { OrnamentDivider } from "@/components/common/ornament-divider";
import { SectionHeading } from "@/components/common/section-heading";
import { VideoCarousel } from "@/components/pages/home/video-carousel";
import { getHomeVideos } from "@/server/features/videos";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { CmsSectionEditControl } from "@/components/cms/cms-section-edit-control";

/**
 * Home video showcase section.
 *
 * Displays the curated architectural and walkthrough carousel. Flat dark
 * ground rather than a photo backdrop — the cards carry the imagery.
 */
export async function VideoSection() {
  const [dict, locale, videos] = await Promise.all([
    getDictionary(),
    getLocale(),
    getHomeVideos(),
  ]);
  const t = dict.videoSection;
  return (
    <section className="relative isolate overflow-hidden pt-8 pb-14 sm:pb-28 sm:pt-10">
      <AppContainer className="relative z-10">
        <CmsSectionEditControl
          pageId="home"
          sectionId="videoSection"
          label="Video Section"
          position="-top-6 right-0 sm:-top-10 sm:right-2"
        />
        <SectionHeading title={t.title} align="center" />
        <OrnamentDivider className="mt-7" />
      </AppContainer>

      {/* Full-bleed, deliberately outside AppContainer — the carousel reads
          as a filmstrip running edge to edge, not content boxed to the
          page's usual measure. */}
      <div className="relative z-10 mt-8 sm:mt-12">
        <VideoCarousel videos={videos} locale={locale} dict={t} />
      </div>
    </section>
  );
}
