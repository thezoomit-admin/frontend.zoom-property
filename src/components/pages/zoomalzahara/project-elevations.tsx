"use client";

import { useState } from "react";

import { Icon } from "@/components/common/icon";
import { ImageFrame } from "@/components/media/image-frame";
import { Reveal } from "@/components/motion/reveal";
import { ImagePreview } from "@/components/pages/zoomalzahara/image-preview";
import { ZOOM_AL_ZAHARA_ELEVATIONS } from "@/data/zoomalzahara";
import { cn } from "@/lib/utils";

type ViewCopy = { label: string; hint?: string };

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
  const railScrolls = total > 4;

  return (
    <>
      <div
        className={cn(
          "mt-8 grid gap-3",
          hasRail && "lg:grid-cols-[minmax(0,1.45fr)_minmax(15.5rem,0.85fr)]",
        )}
      >
        <Reveal className="relative min-h-72 lg:h-[32rem]">
          <ImageFrame
            key={current.src}
            src={current.src}
            alt={current.alt}
            ratio="auto"
            rounded="lg"
            hover="zoom"
            overlay
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="h-full min-h-72 lg:min-h-0"
          />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`${previewLabel}: ${current.alt}`}
            className="absolute inset-0 z-10 cursor-pointer rounded-lg"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-3 right-3 z-20 flex size-9 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md"
          >
            <Icon name="expand" size="sm" />
          </span>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6">
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </p>
            <p className="mt-1 font-heading text-xl font-bold text-white sm:text-2xl">
              {copy?.label ?? current.alt}
            </p>
            {copy?.hint ? (
              <p className="mt-1 text-sm text-white/80">{copy.hint}</p>
            ) : null}
          </div>
        </Reveal>

        {hasRail ? (
          <Reveal delay={0.05} className="min-h-0 lg:h-[32rem]">
            <ul
              className={cn(
                "flex gap-3 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory",
                "lg:h-full lg:flex-col lg:overflow-x-hidden lg:pb-0 lg:snap-none",
                railScrolls
                  ? "lg:overflow-y-auto lg:scrollbar-thin lg:scrollbar-track-transparent lg:scrollbar-thumb-primary/35"
                  : "lg:overflow-y-hidden",
              )}
            >
              {images.map((image, viewIndex) => {
                const selected = viewIndex === index;
                const itemCopy = views[viewIndex];

                return (
                  <li
                    key={image.src}
                    className={cn(
                      "relative min-h-28 shrink-0 snap-start",
                      "w-[min(17rem,78vw)] sm:w-56",
                      railScrolls
                        ? "lg:w-auto lg:min-h-36 lg:shrink-0"
                        : "lg:w-auto lg:min-h-0 lg:flex-1",
                    )}
                  >
                    <ImageFrame
                      src={image.src}
                      alt={image.alt}
                      ratio="auto"
                      rounded="lg"
                      hover="zoom"
                      overlay
                      sizes="(min-width: 1024px) 22vw, 78vw"
                      className="h-full min-h-28 lg:min-h-full"
                    />
                    <button
                      type="button"
                      onClick={() => setIndex(viewIndex)}
                      aria-pressed={selected}
                      aria-label={itemCopy?.label ?? image.alt}
                      className={cn(
                        "absolute inset-0 z-10 cursor-pointer rounded-lg ring-2 ring-inset transition-all",
                        selected
                          ? "ring-primary"
                          : "ring-transparent hover:ring-white/40",
                      )}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute top-2.5 left-2.5 z-20 flex size-7 items-center justify-center rounded-full border border-white/20 bg-black/35 font-heading text-[10px] font-bold text-white backdrop-blur-md"
                    >
                      {String(viewIndex + 1).padStart(2, "0")}
                    </span>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3">
                      <p className="font-heading text-sm font-bold text-white">
                        {itemCopy?.label ?? image.alt}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ) : null}
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
