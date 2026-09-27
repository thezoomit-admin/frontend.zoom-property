"use client";

import { Children, type ReactNode, useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

/**
 * Thumbnail strip — horizontal drag-slider at every breakpoint.
 * (Desktop used to switch to a wrapping grid, which left a lonely 7th thumb
 * on a second row when there were many images.)
 */
export function ThumbRail({
  children,
  className,
  itemClassName,
  columns = 4,
  desktop = "none",
}: {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  columns?: 4 | 6;
  /** `grid` = Embla on mobile, grid from `sm`. `none` = slider everywhere. */
  desktop?: "grid" | "none";
}) {
  const items = Children.toArray(children);
  const [api, setApi] = useState<CarouselApi>();
  const [progress, setProgress] = useState(0);
  const showTrack = items.length > 3;

  useEffect(() => {
    if (!api) return;

    const sync = () => setProgress(api.scrollProgress());
    queueMicrotask(sync);
    api.on("scroll", sync);
    api.on("reInit", sync);
    api.on("select", sync);

    return () => {
      api.off("scroll", sync);
      api.off("reInit", sync);
      api.off("select", sync);
    };
  }, [api]);

  const grid =
    columns === 6 ? "sm:grid-cols-6" : "sm:grid-cols-4";

  const slideBasis =
    columns === 6
      ? "basis-[31%] sm:basis-[15.5%]"
      : "basis-[31%] sm:basis-[23%]";

  return (
    <>
      <div
        className={cn(
          "relative mt-3 touch-pan-x",
          desktop === "grid" && "sm:hidden",
          className,
        )}
        data-lenis-prevent
      >
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            dragFree: true,
            containScroll: "trimSnaps",
            duration: 22,
            skipSnaps: false,
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          <CarouselContent className="-ml-2 select-none">
            {items.map((child, index) => (
              <CarouselItem
                key={index}
                className={cn(
                  "min-w-0 pl-2",
                  itemClassName ?? slideBasis,
                )}
              >
                {child}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {showTrack ? (
          <div
            aria-hidden
            className="mx-auto mt-2.5 h-0.5 w-16 overflow-hidden rounded-full bg-foreground/10"
          >
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${Math.min(100, Math.max(16, progress * 100))}%`,
              }}
            />
          </div>
        ) : null}
      </div>

      {desktop === "grid" ? (
        <ul
          className={cn(
            "mt-3 hidden gap-2 sm:grid sm:gap-3",
            grid,
          )}
        >
          {items.map((child, index) => (
            <li key={index} className="min-w-0">
              {child}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
