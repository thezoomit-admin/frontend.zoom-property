"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";

import { MediaPicker, type PickedMedia } from "./media-picker";

/** One image slot: current thumbnail (if any) doubles as the picker trigger.
 * `value`/`onChange` carry the media id — what the PATCH body needs — while
 * `url` is only for the preview. */
export function ImageField({
  previewUrl,
  onChange,
  className,
}: {
  previewUrl?: string;
  onChange: (media: PickedMedia) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/40 hover:border-primary"
        }
      >
        {previewUrl ? (
          <Image src={previewUrl} alt="" fill sizes="96px" className="object-cover" />
        ) : (
          <ImagePlus className="size-5 text-muted-foreground" />
        )}
      </button>
      <MediaPicker
        open={open}
        onOpenChange={setOpen}
        onSelect={onChange}
      />
    </>
  );
}
