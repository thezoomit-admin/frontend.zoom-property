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
  /** `null` keeps the dialog unmounted — that is what closes it. */
  url: string | null;
  /** Accessible name for the dialog and the frame. */
  title: string;
  closeLabel: string;
  onClose: () => void;
}

/**
 * The one video player dialog.
 *
 * The video and nothing else: whatever context a card carries is already on
 * the card behind it, and repeating it here only shrinks the picture.
 *
 * Mounted only while a url is passed, so the iframe is created on open and
 * destroyed on close — that is what stops the audio, and it also keeps YouTube
 * off the page entirely for visitors who never press play.
 */
export function VideoLightbox({
  url,
  title,
  closeLabel,
  onClose,
}: VideoLightboxProps) {
  const lenis = useLenis();

  // Radix locks the *body*, but Lenis drives the scroll position on the root
  // element and keeps going right past that lock — the page would slide away
  // under the open dialog. Pause it for as long as the player is up.
  useEffect(() => {
    if (!url || !lenis) return;

    lenis.stop();
    return () => lenis.start();
  }, [lenis, url]);

  if (!url) return null;

  const player = playerEmbed(url);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        data-lenis-prevent
        overlayClassName="bg-black/85 supports-backdrop-filter:backdrop-blur-sm"
        className={cn(
          "max-h-[calc(100dvh-6rem)] max-w-[calc(100%-3rem)] gap-0 border-0 bg-transparent p-0 text-white shadow-none ring-0",
          player.portrait
            ? "w-[min(68vw,15.5rem)] sm:max-w-[16rem]"
            : "sm:max-w-2xl lg:max-w-4xl",
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-primary/25 blur-3xl"
          />

          <div className="rounded-2xl bg-linear-to-br from-white/35 via-white/10 to-white/5 p-px shadow-2xl shadow-black/70">
            <div className="rounded-[15px] bg-brand-charcoal p-1.5 sm:p-2.5">
              <div
                data-video-embed
                className={cn(
                  "relative overflow-hidden rounded-xl bg-black ring-1 ring-white/10",
                  player.portrait
                    ? "mx-auto aspect-9/16 h-[min(50dvh,24rem)] w-auto max-w-full"
                    : "aspect-video w-full",
                )}
              >
                <iframe
                  src={player.src}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 size-full border-none"
                />
              </div>
            </div>
          </div>

          <DialogClose
            aria-label={closeLabel}
            className="absolute -top-11 right-0 flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-brand-green-light hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-light sm:-right-3 sm:-top-3"
          >
            <Icon name="close" size="sm" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
