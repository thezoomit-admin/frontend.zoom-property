"use client";

import { useState } from "react";

import { ImageFrame } from "@/components/media/image-frame";
import { landingCardClass } from "@/components/pages/zoomalzahara/landing-card";
import {
  ImagePreview,
  PreviewTrigger,
} from "@/components/pages/zoomalzahara/image-preview";
import { ThumbRail } from "@/components/pages/zoomalzahara/thumb-rail";
import { ZOOM_AL_ZAHARA_GALLERY } from "@/data/zoomalzahara";
import { cn } from "@/lib/utils";

type ShotCopy = { label: string };

export function ProjectGallery({
  shots,
  openLabel,
  closeLabel,
}: {
  shots: ShotCopy[];
  openLabel: string;
  closeLabel: string;
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const image = ZOOM_AL_ZAHARA_GALLERY[active];
  const label = shots[active]?.label ?? image?.alt;

  if (!image) return null;

  const previewImages = ZOOM_AL_ZAHARA_GALLERY.map((shot, index) => ({
    src: shot.src,
    alt: shots[index]?.label ?? shot.alt,
  }));

  return (
    <div className="mt-8">
      <div className={`relative overflow-hidden ${landingCardClass}`}>
        <ImageFrame
          src={image.src}
          alt={label}
          ratio="video"
          rounded="lg"
          hover="zoom"
          overlay
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="min-h-64 sm:min-h-88"
        />
        <PreviewTrigger
          label={`${openLabel}: ${label}`}
          onClick={() => setOpen(true)}
        />
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
          <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(ZOOM_AL_ZAHARA_GALLERY.length).padStart(2, "0")}
          </p>
          <p className="mt-1 font-heading text-base font-bold text-white sm:text-lg">
            {label}
          </p>
        </div>
      </div>

      <ThumbRail columns={6}>
        {ZOOM_AL_ZAHARA_GALLERY.map((shot, index) => {
          const selected = index === active;
          const shotLabel = shots[index]?.label ?? shot.alt;

          return (
            <button
              key={shot.src}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={selected}
              aria-label={shotLabel}
              className={cn(
                "block w-full cursor-pointer overflow-hidden rounded-lg border transition-all",
                selected
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-primary/40",
              )}
            >
              <ImageFrame
                src={shot.src}
                alt={shotLabel}
                ratio="4/3"
                rounded="lg"
                hover="zoom"
                sizes="(min-width: 640px) 16vw, 31vw"
              />
            </button>
          );
        })}
      </ThumbRail>

      <ImagePreview
        images={previewImages}
        index={active}
        open={open}
        onClose={() => setOpen(false)}
        onIndexChange={setActive}
        closeLabel={closeLabel}
      />
    </div>
  );
}
