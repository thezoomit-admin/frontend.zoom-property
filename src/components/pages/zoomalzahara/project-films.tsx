"use client";

import { LandingSlider } from "@/components/pages/zoomalzahara/landing-slider";
import { landingCardClass } from "@/components/pages/zoomalzahara/landing-card";
import { ZOOM_AL_ZAHARA_FILMS } from "@/data/zoomalzahara";
import { embedUrl, facebookEmbedUrl, parseVideoId } from "@/lib/video";
import { cn } from "@/lib/utils";

type FilmCopy = { title: string; caption: string };

function FilmCard({
  title,
  src,
  index,
}: {
  title: string;
  src: string;
  index: number;
}) {
  return (
    <article className={cn("flex h-full flex-col overflow-hidden", landingCardClass)}>
      <div
        data-video-embed
        data-lenis-prevent
        className="overflow-hidden bg-black"
      >
        <div className="relative aspect-9/16 w-full">
          <iframe
            src={src}
            title={title}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full border-none"
          />
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

export function ProjectFilms({ films }: { films: FilmCopy[] }) {
  const cards = ZOOM_AL_ZAHARA_FILMS.map((film, index) => {
    const title = films[index]?.title ?? "Zoom Al-Zahra";
    const src =
      film.provider === "facebook"
        ? facebookEmbedUrl(film.url, { width: 360, height: 640 })
        : embedUrl(parseVideoId(film.url, "youtube"), "youtube");

    return (
      <FilmCard key={film.url} title={title} src={src} index={index} />
    );
  });

  return (
    <LandingSlider itemClassName="basis-[78%] sm:basis-1/2 lg:basis-1/4" autoplayMs={0}>
      {cards}
    </LandingSlider>
  );
}
