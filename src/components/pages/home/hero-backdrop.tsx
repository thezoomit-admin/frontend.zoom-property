"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import Image from "@/components/common/image";
import { shimmerDataUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

/** How long each photograph holds before the next one fades up. */
const HOLD_MS = 5000;

/** The crossfade itself — long enough to read as a dissolve, not a cut. */
const FADE_MS = 1400;

/**
 * The hero's background slideshow.
 *
 * Every image is in the DOM from the start and the change is opacity only, so
 * one photograph dissolves into the next instead of one being swapped out and
 * the next arriving half-loaded. Only the first is `priority`: it is the LCP
 * candidate, and preloading four full-bleed photographs to show one would cost
 * more than it buys.
 *
 * There is nothing to swipe and no controls. It sits behind the copy and the
 * search card, which never move — a background that can be driven is a
 * background people try to drive, and the content on top of it would be the
 * thing they lose.
 *
 * It does not run at all for a visitor who asked for reduced motion: a
 * full-screen dissolve every five seconds is exactly the kind of unbidden
 * movement that setting is for.
 */
export function HeroBackdrop({
  images,
  fallbackImages,
  className,
}: {
  images: string[];
  /** Used when a CMS/R2 URL 404s — keeps the hero photographic. */
  fallbackImages?: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || images.length < 2) return;

    const timer = setInterval(
      () => setIndex((current) => (current + 1) % images.length),
      HOLD_MS,
    );

    return () => clearInterval(timer);
  }, [prefersReducedMotion, images.length]);

  return (
    <div className={cn("relative size-full", className)}>
      {images.map((src, position) => (
        <div
          key={`${src}-${position}`}
          aria-hidden={position !== index}
          className="absolute inset-0 transition-opacity ease-out"
          style={{
            opacity: position === index ? 1 : 0,
            transitionDuration: `${FADE_MS}ms`,
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={position === 0}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={shimmerDataUrl()}
            fallbackSrc={
              fallbackImages?.[position % (fallbackImages.length || 1)]
            }
            className="object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}
