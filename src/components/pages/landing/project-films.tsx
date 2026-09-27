"use client";

import { useState } from "react";
import Image from "@/components/common/image";
import { Icon } from "@/components/common/icon";
import { VideoLightbox } from "@/components/media/video-lightbox";
import { landingCardClass } from "./landing-card";
import {
  parseVideoId,
  playerEmbed,
  resolveVideoProvider,
  youtubeThumbnail,
} from "@/lib/video";
import { cn } from "@/lib/utils";

export interface ProjectFilmsProps {
  films: {
    title: string;
    url: string;
    poster?: string;
    provider?: "facebook" | "youtube" | "vimeo";
  }[];
  playLabel: string;
  closeLabel?: string;
}

/**
 * Modern Split-View Video Section:
 * - Left Side: Large 16:9 interactive video stage (with inline play and lightbox).
 * - Right Side: Vertical playlist of video items matching the wireframe layout.
 */
export function ProjectFilms({
  films,
  playLabel,
  closeLabel = "Close",
}: ProjectFilmsProps) {
  const [index, setIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const validFilms = films.filter((f) => f && f.url);

  if (!validFilms.length) return null;

  const current = validFilms[index] || validFilms[0];
  const isPlayingInline = playingIndex === index;
  const total = validFilms.length;
  const hasMultiple = total > 1;

  // Resolve video metadata
  const provider = resolveVideoProvider(current.url, current.provider);
  const isFacebook = provider === "facebook";
  const youtubeId = isFacebook ? "" : parseVideoId(current.url, "youtube");
  const thumb =
    current.poster?.trim() || (youtubeId ? youtubeThumbnail(youtubeId) : "");

  const embedSrc = playerEmbed(current.url).src;

  const toBanglaNumber = (num: number) => {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((d) => bnDigits[parseInt(d, 10)] ?? d)
      .join("");
  };

  return (
    <div className="mt-8">
      <div className={`overflow-hidden ${landingCardClass}`}>
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-5">
          {/* Main Grid: Left Stage (16:9 Widescreen) + Right Playlist Rail */}
          <div
            className={cn(
              "flex flex-col gap-4",
              hasMultiple && "lg:flex-row lg:items-stretch lg:gap-5"
            )}
          >
            {/* ── Left Side: Main Featured Video Stage ───────────────────── */}
            <div className="relative min-w-0 flex-1 overflow-hidden rounded-xl bg-zinc-950 shadow-md">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-950">
                {isPlayingInline ? (
                  <iframe
                    src={embedSrc}
                    title={current.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 size-full border-0"
                  />
                ) : (
                  <>
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={current.title}
                        fill
                        unoptimized
                        priority={index === 0}
                        className="object-cover object-center transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-zinc-950 to-black" />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

                    {/* Top Status Badge */}
                    <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/15 shadow-sm">
                        <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                        {isFacebook ? "Facebook Video" : "Official Video"}
                      </span>
                    </div>

                    {/* Big Centered Play Trigger */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setPlayingIndex(index)}
                        aria-label={`${playLabel}: ${current.title}`}
                        className="group relative flex size-16 sm:size-20 items-center justify-center rounded-full bg-white text-primary shadow-2xl transition-all duration-300 hover:scale-115 hover:bg-primary hover:text-white cursor-pointer"
                      >
                        <span className="absolute -inset-2.5 rounded-full bg-white/20 animate-ping opacity-60 pointer-events-none" />
                        <Icon
                          name="play"
                          size="lg"
                          className="translate-x-0.5 fill-current text-current transition-colors"
                        />
                      </button>
                    </div>

                    {/* Bottom Floating Info inside stage */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between gap-3">
                      <div className="space-y-1 max-w-[80%]">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-white/70 drop-shadow-sm">
                          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                        </p>
                        <h3 className="line-clamp-2 text-sm sm:text-base font-bold text-white drop-shadow-md">
                          {current.title}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsLightboxOpen(true)}
                        className="h-8 px-3 rounded-lg bg-white/20 hover:bg-white/35 text-white backdrop-blur-md border border-white/20 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                        title="Open in theater lightbox"
                      >
                        <Icon name="expand" size="xs" />
                        <span className="hidden sm:inline">Fullscreen</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── Right Side: Vertical Playlist Rail (Matching Wireframe) ── */}
            {hasMultiple ? (
              <div className="flex shrink-0 flex-col gap-2.5 lg:w-80 xl:w-96">
                <div className="flex items-center justify-between px-1 pb-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Icon name="video" size="xs" className="text-primary" />
                    ভিডিও তালিকা ({validFilms.length})
                  </span>
                  <span className="text-[11px] font-semibold text-primary">
                    {toBanglaNumber(index + 1)} / {toBanglaNumber(total)}
                  </span>
                </div>

                <div
                  className="az-thumb-scroll-y flex gap-2.5 overflow-x-auto pb-1.5 lg:flex-col lg:overflow-y-auto lg:max-h-[380px] xl:max-h-[440px] lg:pb-0 lg:pr-1"
                  data-lenis-prevent
                >
                  {validFilms.map((film, filmIndex) => {
                    const isSelected = filmIndex === index;
                    const filmProvider = resolveVideoProvider(film.url, film.provider);
                    const isFb = filmProvider === "facebook";
                    const ytId = isFb ? "" : parseVideoId(film.url, "youtube");
                    const filmThumb =
                      film.poster?.trim() || (ytId ? youtubeThumbnail(ytId) : "");

                    return (
                      <button
                        key={`${film.url}-${filmIndex}`}
                        type="button"
                        onClick={() => setIndex(filmIndex)}
                        aria-pressed={isSelected}
                        className={cn(
                          "group relative flex w-64 shrink-0 items-center gap-3 rounded-xl border p-2 text-left transition-all duration-200 cursor-pointer lg:w-full",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/30"
                            : "border-border/70 bg-card hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        {/* 16:9 Thumbnail Box */}
                        <div className="relative aspect-video w-24 sm:w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-900 shadow-inner">
                          {filmThumb ? (
                            <Image
                              src={filmThumb}
                              alt={film.title}
                              fill
                              unoptimized
                              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center bg-zinc-900 text-zinc-600">
                              <Icon name="play" size="sm" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span
                              className={cn(
                                "flex size-6 items-center justify-center rounded-full text-white shadow-md transition-transform group-hover:scale-110",
                                isSelected ? "bg-primary" : "bg-black/60 backdrop-blur-xs"
                              )}
                            >
                              <Icon name="play" size="xs" className="translate-x-0.2" />
                            </span>
                          </div>
                        </div>

                        {/* Title & Metadata */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                                isSelected
                                  ? "bg-primary text-white"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              #{String(filmIndex + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-medium truncate">
                              {isFb ? "Facebook" : "YouTube"}
                            </span>
                          </div>
                          <h4
                            className={cn(
                              "line-clamp-2 text-xs font-semibold transition-colors",
                              isSelected
                                ? "text-primary font-bold"
                                : "text-foreground group-hover:text-primary"
                            )}
                          >
                            {film.title}
                          </h4>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          {/* ── Bottom Information / Caption (Matching Elevation standard) ── */}
          <div className="mt-2 border-t border-border/60 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                {toBanglaNumber(index + 1)} / {toBanglaNumber(total)} · ভিডিও প্রদর্শন
              </p>
              <h4 className="text-sm font-bold text-foreground">
                {current.title}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPlayingIndex(index)}
                className="h-8 px-3 rounded-lg bg-primary text-white hover:bg-primary/90 text-xs font-medium transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Icon name="play" size="xs" className="fill-white" />
                <span>{playLabel || "প্লে করুন"}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="h-8 px-3 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Icon name="expand" size="xs" />
                <span>ফুলস্ক্রিন</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <VideoLightbox
          url={current.url}
          title={current.title}
          closeLabel={closeLabel}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}
