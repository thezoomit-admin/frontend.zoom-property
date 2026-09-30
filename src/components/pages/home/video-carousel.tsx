"use client";

import { useEffect, useState } from "react";
import Image from "@/components/common/image";
import { Icon } from "@/components/common/icon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { VideoLightbox } from "@/components/media/video-lightbox";
import type { VideoItem } from "@/data/videos";
import { shimmerDataUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

export interface VideoCarouselDict {
  play?: string;
  close?: string;
  verified?: string;
  prev?: string;
  next?: string;
  channelAction?: string;
}

export interface VideoCarouselProps {
  videos: VideoItem[];
  locale: string;
  dict?: VideoCarouselDict;
}

export function VideoCarousel({ videos, locale, dict }: VideoCarouselProps) {
  const isBn = locale === "bn";
  const prevLabel = dict?.prev ?? (isBn ? "পূর্ববর্তী ভিডিও" : "Previous video");
  const nextLabel = dict?.next ?? (isBn ? "পরবর্তী ভিডিও" : "Next video");
  const playLabel = dict?.play ?? (isBn ? "ভিডিও দেখুন" : "Play Video");
  const closeLabel = dict?.close ?? (isBn ? "ভিডিও বন্ধ করুন" : "Close Player");
  const verifiedLabel = dict?.verified ?? (isBn ? "ভেরিফাইড ওয়াকথ্রু" : "Verified Walkthrough");

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeVideo = videos.find((video) => video.id === activeId) ?? null;

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    const onReInit = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    };

    // Embla measures the track on mount, but with `loop: true` that first
    // pass can settle on an off-center start position — a `reInit` once the
    // real widths are in hand snaps it to the correct centered slide instead
    // of leaving the first view looking flush-left until the visitor
    // interacts with it.
    queueMicrotask(() => {
      api.reInit();
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    });

    api.on("select", onSelect);
    api.on("reInit", onReInit);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onReInit);
    };
  }, [api]);

  const scrollPrev = () => {
    api?.scrollPrev();
  };

  const scrollNext = () => {
    api?.scrollNext();
  };

  return (
    <div className="relative w-full">
      {/* Navigation Header / Controls */}
      <div className="mb-6 flex items-center justify-between px-5 sm:px-6 lg:px-10 xl:px-16">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="size-2 rounded-full bg-brand animate-pulse" />
          <span>
            {String(current + 1).padStart(2, "0")} / {String(count || videos.length).padStart(2, "0")}
          </span>
        </div>

        {/* Prev / Next controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label={prevLabel}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            <Icon name="chevronLeft" size="sm" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label={nextLabel}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            <Icon name="chevronRight" size="sm" />
          </button>
        </div>
      </div>

      {/* Main Carousel Slider */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {videos.map((video) => {
            const title = locale === "bn" ? video.titleBn : video.title;
            const category = locale === "bn" ? video.categoryBn : video.category;
            const location = locale === "bn" ? video.locationBn : video.location;

            return (
              <CarouselItem
                key={video.id}
                className="basis-[78%] pl-4 sm:basis-[60%] lg:basis-[46%]"
              >
                {/* The whole card is the photo — no caption panel underneath.
                    Everything (badge, title, location, play) sits on top of
                    it, the way the reference showed it. */}
                <div className="group relative aspect-4/3 w-full overflow-hidden rounded-lg bg-black shadow-[0_1px_2px_rgba(27,35,24,0.04),0_8px_24px_-8px_rgba(75,128,45,0.16)] transition-all duration-500 hover:shadow-[0_2px_4px_rgba(27,35,24,0.06),0_20px_40px_-12px_rgba(75,128,45,0.3)]">
                  <Image
                    src={video.poster}
                    alt={title}
                    fill
                    sizes="(min-width: 1024px) 42vw, (min-width: 640px) 50vw, 85vw"
                    placeholder="blur"
                    blurDataURL={shimmerDataUrl()}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient scrim: dark enough at the foot for the title,
                      clear enough up top that the badge reads on its own chip. */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-black/25"
                  />

                  {/* Top: category badge + duration */}
                  <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      <span className="size-1.5 rounded-full bg-brand" />
                      {category}
                    </span>

                    <span className="flex items-center gap-1 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md tabular-nums">
                      <Icon name="clock" size="xs" />
                      {video.duration}
                    </span>
                  </div>

                  {/* Foot: title + location, on the photo. */}
                  <div className="absolute inset-x-5 bottom-16 flex flex-col gap-1.5 sm:bottom-20">
                    <h3 className="line-clamp-2 font-heading text-xl font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.4)] sm:text-2xl">
                      {title}
                    </h3>
                    <span className="flex items-center gap-1.5 text-sm text-white/85">
                      <Icon name="location" size="xs" className="shrink-0 text-brand-green-light" />
                      <span className="truncate">{location}</span>
                      <span className="mx-1 text-white/40">•</span>
                      <Icon name="approved" size="xs" className="shrink-0 text-brand-green-light" />
                      <span className="truncate">{verifiedLabel}</span>
                    </span>
                  </div>

                  {/* Play — bottom-right corner, like the reference. */}
                  <span
                    aria-hidden
                    className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-300 ease-out group-hover:scale-110 sm:size-12"
                  >
                    <Icon name="play" size="sm" className="ml-0.5 fill-current" />
                  </span>

                  {/* Stretched trigger: the whole card opens the player. Last in the
                      DOM so it sits over the scrims without a z-index war. */}
                  <button
                    type="button"
                    onClick={() => setActiveId(video.id)}
                    className="absolute inset-0 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-light"
                  >
                    <span className="sr-only">{`${playLabel}: ${title}`}</span>
                  </button>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Slide dots indicator below */}
      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                current === index
                  ? "w-8 bg-primary shadow-sm shadow-primary/50"
                  : "w-2 bg-border hover:bg-muted-foreground/40",
              )}
            />
          ))}
        </div>
      )}

      <VideoLightbox
        url={activeVideo?.youtubeUrl ?? null}
        title={
          activeVideo
            ? locale === "bn"
              ? activeVideo.titleBn
              : activeVideo.title
            : ""
        }
        closeLabel={closeLabel}
        onClose={() => setActiveId(null)}
      />
    </div>
  );
}
