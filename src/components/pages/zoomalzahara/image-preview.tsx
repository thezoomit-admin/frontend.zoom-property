"use client";

import { Icon } from "@/components/common/icon";
import { ImageFrame } from "@/components/media/image-frame";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type PreviewShot = { src: string; alt: string };

export function ImagePreview({
  images,
  index,
  open,
  onClose,
  onIndexChange,
  closeLabel,
}: {
  images: PreviewShot[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
  closeLabel: string;
}) {
  const image = images[index];
  if (!image) return null;

  const hasMany = images.length > 1;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        data-lenis-prevent
        overlayClassName="w-screen bg-black/85 supports-backdrop-filter:backdrop-blur-sm"
        className="max-w-[calc(100%-1.5rem)] gap-0 border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-4xl"
      >
        <DialogTitle className="sr-only">{image.alt}</DialogTitle>
        <div className="relative overflow-hidden rounded-lg bg-black">
          <ImageFrame
            src={image.src}
            alt={image.alt}
            ratio="video"
            rounded="lg"
            sizes="90vw"
            className="min-h-72 sm:min-h-120"
          />
          {hasMany && onIndexChange ? (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={() =>
                  onIndexChange((index - 1 + images.length) % images.length)
                }
                className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/60"
              >
                <Icon name="chevronLeft" size="sm" />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => onIndexChange((index + 1) % images.length)}
                className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/60"
              >
                <Icon name="chevronRight" size="sm" />
              </button>
            </>
          ) : null}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-white">
          <p className="font-heading text-sm font-bold">
            {hasMany ? (
              <span className="me-2 text-white/60">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </span>
            ) : null}
            {image.alt}
          </p>
          <DialogClose
            aria-label={closeLabel}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
          >
            <Icon name="close" size="sm" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PreviewTrigger({
  label,
  className,
  onClick,
}: {
  label: string;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-3 right-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-primary",
        className,
      )}
    >
      <Icon name="expand" size="sm" />
    </button>
  );
}
