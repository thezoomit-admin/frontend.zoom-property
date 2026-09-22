"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

import { Icon } from "@/components/common/icon";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { playerEmbed } from "@/lib/video";
import { cn } from "@/lib/utils";

export interface VideoLightboxProps {
  url: string | null;
  title: string;
  closeLabel: string;
  onClose: () => void;
}

/**
 * Portrait (FB reel): height = 90% of screen, width = that height × 9/16.
 * Landscape (YouTube): wide 16:9.
 */
export function VideoLightbox({
  url,
  title,
  closeLabel,
  onClose,
}: VideoLightboxProps) {
  const lenis = useLenis();

  useEffect(() => {
    if (!url || !lenis) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis, url]);

  if (!url) return null;

  const player = playerEmbed(url);

  // Inline styles so calc(90dvh * 9 / 16) always resolves (Tailwind arbitrary
  // calc without spaces can compile wrong and leave a tiny width).
  const portraitFrameStyle = {
    height: "90dvh",
    width: "min(92vw, calc(90dvh * 9 / 16))",
  } as const;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        data-lenis-prevent
        overlayClassName="bg-black/85 supports-backdrop-filter:backdrop-blur-sm"
        className={cn(
          "!flex !flex-col !gap-0 !border-0 !bg-transparent !p-0 !ring-0",
          "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          "max-h-[calc(100dvh-1rem)] text-white shadow-none",
          player.portrait
            ? "!w-auto !max-w-none"
            : "!w-[min(94vw,56rem)] !max-w-[min(94vw,56rem)] sm:!max-w-4xl lg:!max-w-5xl",
        )}
        style={player.portrait ? { width: portraitFrameStyle.width } : undefined}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div className="relative w-full">
          <div className="rounded-2xl bg-linear-to-br from-white/35 via-white/10 to-white/5 p-px shadow-2xl shadow-black/70">
            <div className="rounded-[15px] bg-brand-charcoal p-1.5 sm:p-2">
              <div
                data-video-embed
                className={cn(
                  "relative overflow-hidden rounded-xl bg-zinc-950 ring-1 ring-white/10",
                  !player.portrait && "aspect-video w-full",
                )}
                style={player.portrait ? portraitFrameStyle : undefined}
              >
                {player.src ? (
                  <iframe
                    src={player.src}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 size-full border-none"
                  />
                ) : (
                  <p className="absolute inset-0 grid place-items-center px-4 text-center text-sm text-white/80">
                    Video could not be loaded. Check the URL.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogClose
            aria-label={closeLabel}
            className="absolute -top-11 right-0 flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-primary sm:-right-2 sm:-top-2"
          >
            <Icon name="close" size="sm" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
