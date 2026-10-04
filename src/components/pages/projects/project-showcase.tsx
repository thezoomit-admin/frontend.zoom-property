"use client";

import { useCallback, useState } from "react";
import Lightbox, { type SlideImage } from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { ImageFrame } from "@/components/media/image-frame";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const arrowClass =
  "bg-primary text-primary-foreground border-primary hover:bg-primary/85 hover:text-primary-foreground";

/** The top of a project page: a plain, swipeable image slider. */
export function ProjectShowcase({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [index, setIndex] = useState(-1);
  const close = useCallback(() => setIndex(-1), []);

  const slides: SlideImage[] = images.map((src, position) => ({
    src,
    alt: position === 0 ? alt : `${alt} — ${position + 1}`,
  }));

  return (
    <>
      <Carousel
        opts={{ loop: images.length > 1, align: "start" }}
        className={cn("mx-auto w-full max-w-7xl", className)}
      >
        <CarouselContent>
          {images.map((src, position) => (
            <CarouselItem key={src}>
              <button
                type="button"
                onClick={() => setIndex(position)}
                aria-label={alt}
                className="block w-full cursor-pointer"
              >
                {/* Banner shape (project banners are 1344x527), filled edge to
                    edge — no empty bands. Other shapes are cropped to fit. */}
                <ImageFrame
                  src={src}
                  alt={position === 0 ? alt : `${alt} — ${position + 1}`}
                  ratio="auto"
                  className="aspect-1344/527 overflow-hidden"
                  rounded="2xl"
                  hover="none"
                  sizes="100vw"
                  priority={position === 0}
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images.length > 1 ? (
          <>
            <CarouselPrevious className={cn("left-3", arrowClass)} />
            <CarouselNext className={cn("right-3", arrowClass)} />
          </>
        ) : null}
      </Carousel>

      <Lightbox
        open={index >= 0}
        index={Math.max(index, 0)}
        close={close}
        slides={slides}
        plugins={[Zoom, Thumbnails, Counter]}
        carousel={{ finite: false, padding: 0 }}
        thumbnails={{ border: 0, borderRadius: 8, padding: 0, gap: 8 }}
        animation={{ fade: 250, swipe: 400 }}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .92)" } }}
      />
    </>
  );
}
