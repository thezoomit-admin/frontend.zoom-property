"use client";

import { useState } from "react";

import Image from "@/components/common/image";
import { Icon } from "@/components/common/icon";
import { LandingSlider } from "@/components/pages/zoomalzahara/landing-slider";
import { landingCardClass } from "@/components/pages/zoomalzahara/landing-card";
import { VideoLightbox } from "@/components/media/video-lightbox";
import {
  facebookEmbedUrl,
  parseVideoId,
  resolveVideoProvider,
  youtubeThumbnail,
} from "@/lib/video";
import { cn } from "@/lib/utils";

/** One card size for every film — vertical 9:16 like the Facebook reels. */
function FilmCard({
  title,
  url,
  previewSrc,
  thumb,
  isFacebook,
  index,
  playLabel,
  onPlay,
}: {
  title: string;
  url: string;
  previewSrc?: string;
  thumb: string;
  isFacebook: boolean;
  index: number;
  playLabel: string;
  onPlay: () => void;
}) {
  if (!url) return null;

  return (
    <article className={cn("flex flex-col overflow-hidden", landingCardClass)}>
      <div data-video-embed data-lenis-prevent className="overflow-hidden bg-black">
        <div className="relative aspect-9/16 w-full">
          {isFacebook && previewSrc ? (
            <iframe
              src={previewSrc}
              title={title}
              allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
              className="pointer-events-none absolute inset-0 size-full border-none"
              tabIndex={-1}
            />
          ) : thumb ? (
            <Image
              src={thumb}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 22vw, 78vw"
              className="object-cover object-center"
            />
          ) : (
            <span aria-hidden className="absolute inset-0 bg-zinc-900" />
          )}

          <button
            type="button"
            onClick={onPlay}
            aria-label={`${playLabel}: ${title}`}
            className="group absolute inset-0 z-10 cursor-pointer"
          >
            <span
              aria-hidden
              className={cn(
                "absolute inset-0",
                isFacebook ? "bg-black/35" : "bg-black/25",
              )}
            />
            <span
              aria-hidden
              className="absolute inset-0 grid place-items-center"
            >
              <span className="grid size-12 place-items-center rounded-full bg-white shadow-md transition-transform duration-300 group-hover:scale-110">
                <Icon
                  name="play"
                  size="sm"
                  className="translate-x-0.5 fill-primary text-primary"
                />
              </span>
            </span>
          </button>
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="font-heading text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="truncate font-heading text-sm font-extrabold text-foreground">
          {title}
        </h3>
      </div>
    </article>
  );
}

export function ProjectFilms({
  films,
  playLabel,
  closeLabel = "Close",
}: {
  films: {
    title: string;
    url: string;
    provider?: "facebook" | "youtube" | "vimeo";
  }[];
  playLabel: string;
  closeLabel?: string;
}) {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState("");

  const cards = films
    .filter((film) => film.url)
    .map((film, index) => {
      const provider = resolveVideoProvider(film.url, film.provider);
      const isFacebook = provider === "facebook";
      const youtubeId = isFacebook
        ? ""
        : parseVideoId(film.url, "youtube");

      const previewSrc = isFacebook
        ? facebookEmbedUrl(film.url, {
            width: 360,
            height: 640,
            autoplay: false,
          })
        : undefined;

      const thumb = youtubeId ? youtubeThumbnail(youtubeId) : "";

      return (
        <FilmCard
          key={`${film.url}-${index}`}
          title={film.title}
          url={film.url}
          previewSrc={previewSrc}
          thumb={thumb}
          isFacebook={isFacebook}
          index={index}
          playLabel={playLabel}
          onPlay={() => {
            setActiveUrl(film.url);
            setActiveTitle(film.title);
          }}
        />
      );
    });

  if (!cards.length) return null;

  return (
    <>
      <LandingSlider
        itemClassName="basis-[78%] sm:basis-1/2 lg:basis-1/4"
        autoplayMs={0}
      >
        {cards}
      </LandingSlider>
      <VideoLightbox
        url={activeUrl}
        title={activeTitle}
        closeLabel={closeLabel}
        onClose={() => setActiveUrl(null)}
      />
    </>
  );
}
