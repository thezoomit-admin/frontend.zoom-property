import { AppContainer } from "@/components/common/app-container";
import { OrnamentDivider } from "@/components/common/ornament-divider";
import { SectionHeading } from "@/components/common/section-heading";
import { VideoCarousel } from "@/components/pages/home/video-carousel";
import { videoSectionBackdrop } from "@/data/videos";
import { getHomeVideos } from "@/server/features/videos";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

/**
 * Home video showcase section.
 *
 * Displays the curated architectural and walkthrough carousel over the
 * cinematic home backdrop. The catalogue card design is used on inner pages.
 */
export async function VideoSection() {
  const [dict, locale, videos] = await Promise.all([
    getDictionary(),
    getLocale(),
    getHomeVideos(),
  ]);
  const t = dict.videoSection;
  return (
    <section
      className="relative isolate overflow-hidden bg-cover bg-center bg-fixed py-14 max-md:bg-scroll sm:py-28"
      style={{ backgroundImage: `url(${videoSectionBackdrop})` }}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-b from-black/90 via-black/80 to-black/95"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 -z-10 size-96 rounded-full bg-primary/20 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 -z-10 size-96 rounded-full bg-brand/15 blur-[140px]"
      />

      <AppContainer>
        <SectionHeading title={t.title} align="center" tone="inverse" />
        <OrnamentDivider tone="inverse" className="mt-7" />
        <div className="mt-8 sm:mt-12">
          <VideoCarousel videos={videos} locale={locale} dict={t} />
        </div>
      </AppContainer>
    </section>
  );
}
