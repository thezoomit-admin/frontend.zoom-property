"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Icon } from "@/components/common/icon";
import Image from "@/components/common/image";
import { AppContainer } from "@/components/common/app-container";
import { VideoLightbox } from "@/components/media/video-lightbox";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { VideoItem } from "@/data/videos";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/i18n/href";
import { shimmerDataUrl } from "@/lib/image";

export function ShowcaseVideoGrid({
  videos,
  locale,
  page,
  totalPage,
  basePath,
  title,
  description,
  playLabel,
  closeLabel,
  pageParam = "page",
  className = "",
}: {
  videos: VideoItem[];
  locale: Locale;
  page: number;
  totalPage: number;
  basePath: string;
  title: string;
  description: string;
  playLabel: string;
  closeLabel: string;
  pageParam?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const activeVideo = videos.find((video) => video.id === activeId);
  const pageHref = (nextPage: number) =>
    localeHref(locale, `${basePath}?${pageParam}=${nextPage}#videos`);

  // Embla's `align: "center"` + `loop: true` needs the slide track to run
  // noticeably wider than the viewport to have room to loop through — with
  // only a handful of videos on a page it doesn't, and the carousel rests
  // flush-left instead of centered. Repeating the reel is the standard fix;
  // each replay still opens the same video, so nothing reads as duplicated.
  const loopVideos =
    videos.length > 0 && videos.length < 6
      ? Array.from({ length: Math.ceil(6 / videos.length) }, () => videos).flat()
      : videos;

  useEffect(() => {
    if (!api) return;
    queueMicrotask(() => api.reInit());
  }, [api]);

  return (
    <section id="videos" className={`border-t border-border pt-10 pb-4 sm:py-20 ${className}`}>
      <AppContainer>
        <div className="max-w-2xl">
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {title}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </AppContainer>

      {/* Full-bleed, deliberately outside AppContainer — the carousel reads
          as a filmstrip running edge to edge, not content boxed to the
          page's usual measure. */}
      {videos.length ? (
        <Carousel
          setApi={setApi}
          opts={{ align: "center", loop: true }}
          className="mt-6 sm:mt-10"
        >
            <CarouselContent className="-ml-4">
              {loopVideos.map((video, index) => {
                const titleText = locale === "bn" ? video.titleBn : video.title;
                const category = locale === "bn" ? video.categoryBn : video.category;
                const location = locale === "bn" ? video.locationBn : video.location;
                const verified = locale === "bn" ? "ভেরিফাইড ওয়াকথ্রু" : "Verified Walkthrough";

                return (
                  <CarouselItem
                    key={`${video.id}-${index}`}
                    className="basis-[92%] pl-4 sm:basis-[80%] lg:basis-[68%]"
                  >
                    {/* The whole card is the photo — no caption panel
                        underneath. Badge, title, location and play all sit
                        on top of it. `aspect-video` — the standard 16:9 a
                        YouTube thumbnail uses. */}
                    <button
                      type="button"
                      onClick={() => setActiveId(video.id)}
                      aria-label={`${playLabel}: ${titleText}`}
                      className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg bg-black text-left shadow-[0_1px_2px_rgba(27,35,24,0.04),0_8px_24px_-8px_rgba(75,128,45,0.16)] transition-all duration-500 hover:shadow-[0_2px_4px_rgba(27,35,24,0.06),0_20px_40px_-12px_rgba(75,128,45,0.3)] focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <Image
                        src={video.poster}
                        alt={titleText}
                        fill
                        sizes="(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 85vw"
                        placeholder="blur"
                        blurDataURL={shimmerDataUrl()}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-black/25" />

                      <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between gap-2">
                        <Badge className="border-0 bg-primary text-primary-foreground">
                          {category}
                        </Badge>
                        <span className="flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md tabular-nums">
                          <Icon name="clock" size="xs" />
                          {video.duration}
                        </span>
                      </div>

                      <div className="absolute inset-x-5 bottom-16 flex flex-col gap-1.5 sm:bottom-20">
                        <h3 className="line-clamp-2 font-heading text-xl font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.4)] sm:text-2xl">
                          {titleText}
                        </h3>
                        <span className="flex items-center gap-1.5 text-sm text-white/85">
                          <Icon name="location" size="xs" className="shrink-0 text-brand-green-light" />
                          <span className="truncate">{location}</span>
                          <span className="mx-1 text-white/40">•</span>
                          <Icon name="approved" size="xs" className="shrink-0 text-brand-green-light" />
                          <span className="truncate">{verified}</span>
                        </span>
                      </div>

                      <span
                        aria-hidden
                        className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-300 ease-out group-hover:scale-110 sm:size-12"
                      >
                        <Icon name="play" size="sm" className="ml-0.5 fill-current" />
                      </span>
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
              <CarouselPrevious className="static translate-x-0 translate-y-0" />
              <CarouselNext className="static translate-x-0 translate-y-0" />
            </div>
            <CarouselPrevious className="left-4 hidden sm:flex lg:left-8" />
            <CarouselNext className="right-4 hidden sm:flex lg:right-8" />
          </Carousel>
      ) : (
        <AppContainer>
          <p className="mt-10 text-sm text-muted-foreground">No videos found.</p>
        </AppContainer>
      )}

      <AppContainer>
        {totalPage > 1 ? (
          <nav className="mt-6 sm:mt-10 flex items-center justify-center gap-3" aria-label="Video pagination">
            {page > 1 ? (
              <Link href={pageHref(page - 1)} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
                <Icon name="chevronLeft" size="xs" />
              </Link>
            ) : null}
            <span className="text-sm text-muted-foreground">{page} / {totalPage}</span>
            {page < totalPage ? (
              <Link href={pageHref(page + 1)} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">
                <Icon name="chevronRight" size="xs" />
              </Link>
            ) : null}
          </nav>
        ) : null}

        <VideoLightbox
          url={activeVideo?.youtubeUrl ?? null}
          title={activeVideo ? (locale === "bn" ? activeVideo.titleBn : activeVideo.title) : ""}
          closeLabel={closeLabel}
          onClose={() => setActiveId(null)}
        />
      </AppContainer>
    </section>
  );
}
