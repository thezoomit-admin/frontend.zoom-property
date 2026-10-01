"use client";

import { useState } from "react";
import Image from "@/components/common/image";

import { Icon } from "@/components/common/icon";
import { ImageFrame } from "@/components/media/image-frame";
import { embedUrl, parseVideoId, youtubeThumbnail, type VideoProvider } from "@/lib/video";
import type { AspectRatio } from "@/lib/image";
import { cn } from "@/lib/utils";

export interface VideoEmbedProps {
  /** Full URL or bare id. */
  url: string;
  provider?: VideoProvider;
  title: string;
  /** Overrides the provider thumbnail (required for Vimeo). */
  poster?: string;
  ratio?: AspectRatio;
  className?: string;
}

/**
 * Lite YouTube / Vimeo embed. Renders a poster + play button and only injects
 * the provider iframe after a click — no third-party JS, cookies or ~1MB of
 * player payload on first load.
 *
 * When `ratio="auto"` the caller's `className` must supply the aspect/height
 * (e.g. `className="aspect-[21/6]"`). The poster and iframe then fill that
 * container edge-to-edge with `object-cover`.
 */
export function VideoEmbed({
  url,
  provider = "youtube",
  title,
  poster,
  ratio = "video",
  className,
}: VideoEmbedProps) {
  const [active, setActive] = useState(false);
  const id = parseVideoId(url, provider);
  const thumbnail = poster ?? (provider === "youtube" ? youtubeThumbnail(id) : undefined);
  const isAuto = ratio === "auto";

  if (active) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl bg-black", className)}>
        <div className={isAuto ? "absolute inset-0" : "aspect-video"}>
          <iframe
            src={embedUrl(id, provider)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="size-full"
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={`Play video: ${title}`}
      className={cn("group/video relative block w-full cursor-pointer overflow-hidden", className)}
    >
      {isAuto ? (
        // Caller's className supplies the aspect ratio / height.
        // Fill the box with object-cover — no bg-muted bleed.
        <>
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover object-center"
              quality={90}
            />
          )}
          {/* dark gradient overlay */}
          <span
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"
          />
          <PlayBadge />
        </>
      ) : (
        <ImageFrame
          src={thumbnail ?? ""}
          alt={title}
          ratio={ratio}
          sizes="full"
          hover="none"
          overlay
        >
          <PlayBadge />
        </ImageFrame>
      )}
    </button>
  );
}

function PlayBadge() {
  return (
    <span className="absolute inset-0 flex items-center justify-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-black shadow-xl transition-transform duration-300 ease-out-expo group-hover/video:scale-110 sm:size-20">
        <Icon name="play" size="lg" className="translate-x-0.5 fill-current" />
      </span>
    </span>
  );
}
