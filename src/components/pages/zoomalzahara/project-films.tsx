"use client";

import { useState } from "react";

import Image from "@/components/common/image";
import { Icon } from "@/components/common/icon";
import { LandingSlider } from "@/components/pages/zoomalzahara/landing-slider";
import { landingCardClass } from "@/components/pages/zoomalzahara/landing-card";
import { embedUrl, facebookEmbedUrl, isFacebookVideo, parseVideoId } from "@/lib/video";
import { cn } from "@/lib/utils";

function FilmCard({
  title,
  src,
  poster,
  index,
  playLabel,
  playing,
  onPlay,
}: {
  title: string;
  src: string;
  poster: string;
  index: number;
  playLabel: string;
  playing: boolean;
  onPlay: () => void;
}) {
  return (
    <article className={cn("flex h-full flex-col overflow-hidden", landingCardClass)}>
      <div
        data-video-embed
        data-lenis-prevent
        className="overflow-hidden bg-black"
      >
        <div className="relative aspect-9/16 w-full">
          {playing ? (
            <iframe
              src={src}
              title={title}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 size-full border-none"
            />
          ) : (
            <button
              type="button"
              onClick={onPlay}
              aria-label={`${playLabel}: ${title}`}
              className="group absolute inset-0 cursor-pointer"
            >
              {poster ? (
                <Image
                  src={poster}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 22vw, 78vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <span aria-hidden className="absolute inset-0 bg-zinc-900" />
              )}
              <span
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent"
              />
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-md transition-transform duration-300 group-hover:scale-110">
                  <Icon name="fa-solid fa-play" size="sm" className="translate-x-px" />
                </span>
              </span>
            </button>
          )}
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
}: {
  films: {
    title: string;
    url: string;
    poster?: string;
    provider?: "facebook" | "youtube";
  }[];
  playLabel: string;
}) {
  const [playing, setPlaying] = useState<number | null>(null);

  const cards = films
    .filter((film) => film.url)
    .map((film, index) => {
      const facebook =
        film.provider === "facebook" || isFacebookVideo(film.url);
      const src = facebook
        ? facebookEmbedUrl(film.url, { width: 360, height: 640, autoplay: true })
        : embedUrl(parseVideoId(film.url, "youtube"), "youtube");

      return (
        <FilmCard
          key={`${film.url}-${index}`}
          title={film.title}
          src={src}
          poster={film.poster || ""}
          index={index}
          playLabel={playLabel}
          playing={playing === index}
          onPlay={() => setPlaying(index)}
        />
      );
    });

  if (!cards.length) return null;

  return (
    <LandingSlider itemClassName="basis-[78%] sm:basis-1/2 lg:basis-1/4" autoplayMs={0}>
      {cards}
    </LandingSlider>
  );
}
