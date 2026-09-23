"use client";

import { useState } from "react";

import Image from "@/components/common/image";
import { Icon } from "@/components/common/icon";
import { VideoLightbox } from "@/components/media/video-lightbox";
import { landingCardClass } from "@/components/pages/zoomalzahara/landing-card";
import { facebookEmbedUrl, parseVideoId, resolveVideoProvider, youtubeThumbnail } from "@/lib/video";
import { cn } from "@/lib/utils";

export function ProjectReviews({
  items,
  playLabel,
  closeLabel,
}: {
  items: {
    name: string;
    role: string;
    quote: string;
    avatar?: string;
    poster?: string;
    videoUrl?: string;
  }[];
  playLabel: string;
  closeLabel: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items.length) return null;

  const active = openIndex != null ? items[openIndex] : null;

  return (
    <>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((card, index) => {
          const videoUrl = card.videoUrl?.trim() || "";
          const provider = videoUrl ? resolveVideoProvider(videoUrl) : null;
          const isFacebook = provider === "facebook";
          const youtubeId =
            provider === "youtube"
              ? parseVideoId(videoUrl, "youtube")
              : "";
          const thumb =
            card.poster?.trim() ||
            (youtubeId ? youtubeThumbnail(youtubeId) : "");
          const fbPreview = isFacebook
            ? facebookEmbedUrl(videoUrl, {
                width: 90,
                height: 160,
                autoplay: false,
              })
            : "";

          return (
            <li key={`${card.name}-${index}`}>
              <article className={`flex h-full gap-4 p-4 sm:p-5 ${landingCardClass}`}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    {card.avatar ? (
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-primary/20">
                        <Image
                          src={card.avatar}
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
                      {card.role ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {card.role}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {card.quote ? (
                    <p className="mt-4 text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
                      <Icon
                        name='<i class="fa-solid fa-quote-left"></i>'
                        size="xs"
                        className="me-1.5 inline -translate-y-0.5 text-primary"
                      />
                      {card.quote}
                    </p>
                  ) : null}
                </div>

                {videoUrl ? (
                  <button
                    type="button"
                    onClick={() => setOpenIndex(index)}
                    aria-label={`${playLabel}: ${card.name}`}
                    className={cn(
                      "group relative aspect-9/16 h-28 w-auto shrink-0 cursor-pointer overflow-hidden rounded-md bg-zinc-900 sm:h-32",
                      "ring-1 ring-border transition-all duration-300 hover:ring-2 hover:ring-primary",
                    )}
                  >
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        unoptimized
                        sizes="90px"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : fbPreview ? (
                      <iframe
                        src={fbPreview}
                        title=""
                        className="pointer-events-none absolute inset-0 size-full scale-110 border-none"
                        tabIndex={-1}
                      />
                    ) : null}
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-black/35"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 grid place-items-center"
                    >
                      <span className="grid size-8 place-items-center rounded-full bg-white text-primary shadow-md transition-transform duration-300 group-hover:scale-110">
                        <Icon
                          name="play"
                          size="xs"
                          className="translate-x-px fill-primary text-primary"
                        />
                      </span>
                    </span>
                  </button>
                ) : null}
              </article>
            </li>
          );
        })}
      </ul>

      <VideoLightbox
        url={active?.videoUrl ?? null}
        title={active ? `${active.name}` : ""}
        closeLabel={closeLabel}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
