"use client";

import { useState } from "react";

import { Icon } from "@/components/common/icon";
import { ImageFrame } from "@/components/media/image-frame";
import { landingCardClass } from "@/components/pages/zoomalzahara/landing-card";
import { ImagePreview } from "@/components/pages/zoomalzahara/image-preview";
import { ZOOM_AL_ZAHARA_ELEVATIONS } from "@/data/zoomalzahara";
import { cn } from "@/lib/utils";

type ViewCopy = { label: string; hint?: string };

const VISIBLE_THUMBS = 4;

export function ProjectElevations({
  views,
  previewLabel,
  closeLabel,
}: {
  views: ViewCopy[];
  previewLabel: string;
  closeLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const images = ZOOM_AL_ZAHARA_ELEVATIONS.map((view, viewIndex) => ({
    src: view.src,
    alt: views[viewIndex]?.label ?? view.alt,
  }));

  if (!images[0]) return null;

  const current = images[index];
  const copy = views[index];
  const total = images.length;
  const hasRail = total > 1;
  const railScrolls = total > VISIBLE_THUMBS;

  return (
    <>
      <div className={`mt-8 overflow-hidden ${landingCardClass}`}>
        <div
          className={cn(
            "grid gap-2 p-2",
            hasRail && "lg:grid-cols-[minmax(0,1fr)_13.75rem]",
          )}
        >
          <div className="relative min-h-72 overflow-hidden rounded-md lg:h-120 lg:min-h-0">
            <ImageFrame
              key={`${index}-${current.src}`}
              src={current.src}
              alt={current.alt}
              ratio="auto"
              rounded="md"
              hover="none"
              overlay
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="size-full min-h-72 rounded-md lg:min-h-0"
            />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={`${previewLabel}: ${current.alt}`}
              className="absolute inset-0 z-10 cursor-pointer rounded-md"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute top-3 right-3 z-20 flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-md"
            >
              <Icon name="expand" size="sm" />
            </span>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/80 via-black/35 to-transparent px-4 py-4 sm:px-5">
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </p>
              <p className="mt-1 font-heading text-xl font-bold text-white sm:text-2xl">
                {copy?.label ?? current.alt}
              </p>
              {copy?.hint ? (
                <p className="mt-0.5 text-sm text-white/80">{copy.hint}</p>
              ) : null}
            </div>
          </div>

          {hasRail ? (
            <ul
              className={cn(
                "az-thumb-scroll flex gap-2 overflow-x-auto snap-x snap-mandatory overscroll-x-contain",
                "lg:h-120 lg:snap-none lg:flex-col lg:overflow-x-hidden",
                railScrolls
                  ? "lg:overflow-y-auto lg:pr-0.5"
                  : "lg:overflow-hidden",
              )}
            >
              {images.map((image, viewIndex) => {
                const selected = viewIndex === index;
                const itemCopy = views[viewIndex];

                return (
                  <li
                    key={`${viewIndex}-${image.src}`}
                    className="relative h-20 w-[31%] shrink-0 snap-start lg:h-[calc((100%-1.5rem)/4)] lg:w-auto lg:min-h-0 lg:shrink-0 lg:snap-normal"
                  >
                    <ImageFrame
                      src={image.src}
                      alt={image.alt}
                      ratio="auto"
                      rounded="md"
                      hover="none"
                      overlay
                      sizes="(min-width: 1024px) 14vw, 31vw"
                      className="size-full rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setIndex(viewIndex)}
                      aria-pressed={selected}
                      aria-label={itemCopy?.label ?? image.alt}
                      className={cn(
                        "absolute inset-0 z-20 cursor-pointer rounded-md ring-2 ring-inset transition-all",
                        selected
                          ? "ring-primary"
                          : "ring-transparent hover:ring-foreground/30",
                      )}
                    />
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
      <ImagePreview
        images={images}
        index={index}
        open={open}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
        closeLabel={closeLabel}
      />
    </>
  );
}
