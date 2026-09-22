"use client";

import { useState } from "react";

import { ImageFrame } from "@/components/media/image-frame";
import { Reveal } from "@/components/motion/reveal";
import {
  ImagePreview,
  PreviewTrigger,
} from "@/components/pages/zoomalzahara/image-preview";
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
  const current = images[index];
  const copy = views[index];

  if (!current) return null;

  return (
    <>
      <Reveal className="mt-8">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex gap-1 border-b border-border p-1.5 sm:gap-1.5">
            {views.map((view, viewIndex) => {
              const selected = viewIndex === index;

              return (
                <button
                  key={view.label}
                  type="button"
                  onClick={() => setIndex(viewIndex)}
                  aria-pressed={selected}
                  className={cn(
                    "flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors sm:px-3",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "font-heading text-[11px] font-bold tracking-wide",
                      selected ? "text-primary-foreground/70" : "text-primary",
                    )}
                  >
                    {String(viewIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-heading text-xs font-bold sm:text-sm">
                      {view.label}
                    </span>
                    {view.hint ? (
                      <span
                        className={cn(
                          "mt-0.5 hidden truncate text-[11px] sm:block",
                          selected
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        {view.hint}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <ImageFrame
              src={current.src}
              alt={current.alt}
              ratio="video"
              rounded="none"
              hover="zoom"
              overlay
              sizes="(min-width: 1024px) 80vw, 100vw"
              className="min-h-72 sm:min-h-96 lg:min-h-128"
            />
            <PreviewTrigger
              label={`${previewLabel}: ${current.alt}`}
              onClick={() => setOpen(true)}
            />
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 sm:p-6">
              <div>
                <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(images.length).padStart(2, "0")}
                </p>
                <p className="mt-1 font-heading text-lg font-bold text-white sm:text-xl">
                  {copy?.label}
                </p>
                {copy?.hint ? (
                  <p className="mt-0.5 text-sm text-white/75">{copy.hint}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
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
