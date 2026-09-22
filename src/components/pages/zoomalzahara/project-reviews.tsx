"use client";

import { useState } from "react";

import Image from "@/components/common/image";
import { Icon } from "@/components/common/icon";
import { VideoLightbox } from "@/components/media/video-lightbox";
import { landingCardClass } from "@/components/pages/zoomalzahara/landing-card";
import { ZOOM_AL_ZAHARA_REVIEWS } from "@/data/zoomalzahara";
import { cn } from "@/lib/utils";

type ReviewCopy = { name: string; role: string; quote: string };
type VideoCopy = { title: string };

export function ProjectReviews({
  items,
  videos,
  playLabel,
  closeLabel,
}: {
  items: ReviewCopy[];
  videos: VideoCopy[];
  playLabel: string;
  closeLabel: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const cards = items.map((item, index) => {
    const media = ZOOM_AL_ZAHARA_REVIEWS[index];
    return {
      ...item,
      image: media?.image,
      poster: media?.poster,
      video: media?.video,
      videoTitle: videos[index]?.title ?? item.name,
    };
  });

  const extras = ZOOM_AL_ZAHARA_REVIEWS.slice(items.length).map((media, i) => ({
    ...media,
    title: videos[items.length + i]?.title ?? playLabel,
  }));

  const active = openIndex != null ? cards[openIndex] : null;
  const extraOpen = openIndex != null && openIndex >= cards.length ? extras[openIndex - cards.length] : null;

  return (
    <>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card, index) => (
          <li key={card.name}>
            <article className={`flex h-full gap-4 p-4 sm:p-5 ${landingCardClass}`}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  {card.image ? (
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-primary/20">
                      <Image
                        src={card.image}
                        alt={card.name}
                        fill
                        sizes="48px"
                        className="object-cover object-center"
                      />
                    </span>
                  ) : null}
                  <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-extrabold text-foreground">
                      {card.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {card.role}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
                  <Icon
                    name='<i class="fa-solid fa-quote-left"></i>'
                    size="xs"
                    className="me-1.5 inline -translate-y-0.5 text-primary"
                  />
                  {card.quote}
                </p>
              </div>

              {card.video && card.poster ? (
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`${playLabel}: ${card.name}`}
                  className={cn(
                    "group relative aspect-9/16 h-28 w-auto shrink-0 cursor-pointer overflow-hidden rounded-md sm:h-32",
                    "ring-1 ring-border transition-all duration-300 hover:ring-2 hover:ring-primary",
                  )}
                >
                  <Image
                    src={card.poster}
                    alt=""
                    fill
                    sizes="90px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-white text-primary shadow-md transition-transform duration-300 group-hover:scale-110">
                      <Icon name="fa-solid fa-play" size="xs" className="translate-x-px" />
                    </span>
                  </span>
                </button>
              ) : null}
            </article>
          </li>
        ))}
      </ul>

      {extras.length ? (
        <ul className="mt-4 flex flex-wrap gap-3">
          {extras.map((extra, i) => (
            <li key={extra.video}>
              <button
                type="button"
                onClick={() => setOpenIndex(cards.length + i)}
                aria-label={`${playLabel}: ${extra.title}`}
                className="group relative aspect-9/16 h-28 cursor-pointer overflow-hidden rounded-md ring-1 ring-border transition-all duration-300 hover:ring-2 hover:ring-primary sm:h-32"
              >
                <Image
                  src={extra.poster}
                  alt=""
                  fill
                  sizes="90px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center bg-black/35"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-white text-primary shadow-md">
                    <Icon name="fa-solid fa-play" size="xs" className="translate-x-px" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <VideoLightbox
        url={extraOpen?.video ?? active?.video ?? null}
        title={
          extraOpen
            ? extraOpen.title
            : active
              ? `${active.name} — ${active.videoTitle}`
              : ""
        }
        closeLabel={closeLabel}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
