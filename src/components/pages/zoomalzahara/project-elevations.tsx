"use client";

import { useState } from "react";

import { ImageFrame } from "@/components/media/image-frame";
import { landingCardClass } from "@/components/pages/zoomalzahara/landing-card";
import {
  ImagePreview,
  PreviewTrigger,
} from "@/components/pages/zoomalzahara/image-preview";
import { cn } from "@/lib/utils";

/**
 * Elevation: tall/wide composites with object-contain.
 * Thumbs on the right — when there are too many, the rail scrolls.
 */
export function ProjectElevations({
  views,
  previewLabel,
  closeLabel,
}: {
  views: { src: string; alt: string; label?: string; hint?: string }[];
  previewLabel: string;
  closeLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const images = views.filter((view) => view.src);

  if (!images[0]) return null;

  const current = images[index];
  const total = images.length;
  const label = current.label || current.alt;
  const hasThumbs = total > 1;

  return (
    <div className="mt-8">
      <div className={`overflow-hidden ${landingCardClass}`}>
        <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
          <div
            className={cn(
              "flex flex-col gap-3",
              hasThumbs && "sm:flex-row sm:items-stretch sm:gap-4",
            )}
          >
            <div className="relative min-h-100 min-w-0 flex-1 overflow-hidden rounded-lg bg-linear-to-b from-slate-100 to-slate-200/80 sm:min-h-112 lg:min-h-160">
              <ImageFrame
                key={`${index}-${current.src}`}
                src={current.src}
                alt={label}
                ratio="auto"
                rounded="lg"
                hover="none"
                overlay={false}
                sizes="(min-width: 1024px) 65vw, 100vw"
                className="absolute inset-0 size-full rounded-lg bg-transparent"
                imageClassName="object-contain object-center p-2 sm:p-3"
              />
              <PreviewTrigger
                label={`${previewLabel}: ${label}`}
                onClick={() => setOpen(true)}
              />
            </div>

            {hasThumbs ? (
              <ul
                className={cn(
                  "az-thumb-scroll-y flex shrink-0 gap-2",
                  /* Mobile: horizontal strip with scrollbar when overflowing */
                  "max-w-full overflow-x-auto overflow-y-hidden pb-1",
                  /* Desktop: vertical rail locked to main image height */
                  "sm:h-auto sm:w-44 sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:pb-0 sm:pr-1 lg:w-52",
                )}
                data-lenis-prevent
              >
                {images.map((image, viewIndex) => {
                  const selected = viewIndex === index;
                  const thumbLabel = image.label || image.alt;

                  return (
                    <li
                      key={`${viewIndex}-${image.src}`}
                      className="w-36 shrink-0 sm:w-full"
                    >
                      <button
                        type="button"
                        onClick={() => setIndex(viewIndex)}
                        aria-pressed={selected}
                        aria-label={thumbLabel}
                        className={cn(
                          "block w-full cursor-pointer overflow-hidden rounded-lg border bg-muted transition-all",
                          selected
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-transparent hover:border-primary/40",
                        )}
                      >
                        <ImageFrame
                          src={image.src}
                          alt={thumbLabel}
                          ratio="4/3"
                          rounded="lg"
                          hover="zoom"
                          sizes="208px"
                          imageClassName="object-contain object-center p-1"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <div>
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </p>
            <p className="mt-1 font-heading text-base font-bold text-foreground sm:text-lg">
              {label}
            </p>
            {current.hint ? (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {current.hint}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <ImagePreview
        images={images.map((image) => ({
          src: image.src,
          alt: image.label || image.alt,
        }))}
        index={index}
        open={open}
        onClose={() => setOpen(false)}
        onIndexChange={setIndex}
        closeLabel={closeLabel}
        ratio="auto"
        contain
      />
    </div>
  );
}
