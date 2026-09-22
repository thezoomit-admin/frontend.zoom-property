"use client";

import { Children, type ReactNode, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function LandingSlider({
  children,
  itemClassName = "basis-[82%] sm:basis-1/2 xl:basis-1/3",
  autoplayMs = 5500,
}: {
  children: ReactNode;
  itemClassName?: string;
  autoplayMs?: number;
}) {
  const items = Children.toArray(children);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!api) return;

    const sync = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    };

    queueMicrotask(sync);
    api.on("select", sync);
    api.on("reInit", sync);

    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused || prefersReducedMotion || autoplayMs <= 0 || items.length < 2) {
      return;
    }

    const timer = setInterval(() => api.scrollNext(), autoplayMs);
    return () => clearInterval(timer);
  }, [api, paused, prefersReducedMotion, autoplayMs, items.length]);

  if (items.length <= 1) {
    return <div className="mt-8">{items}</div>;
  }

  return (
    <div
      className="relative mt-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          duration: 22,
          containScroll: "trimSnaps",
        }}
        className="cursor-grab px-0 touch-pan-x active:cursor-grabbing"
        data-lenis-prevent
      >
        <CarouselContent className="-ml-3 select-none">
          {items.map((child, index) => (
            <CarouselItem
              key={index}
              className={cn("min-w-0 pl-3", itemClassName)}
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 size-9 border-border bg-background/90 shadow-sm backdrop-blur-md disabled:hidden" />
        <CarouselNext className="right-2 size-9 border-border bg-background/90 shadow-sm backdrop-blur-md disabled:hidden" />
      </Carousel>

      {count > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`${index + 1}`}
              className={cn(
                "h-1.5 cursor-pointer rounded-full transition-all duration-300",
                current === index
                  ? "w-7 bg-primary"
                  : "w-2 bg-foreground/15 hover:bg-foreground/30",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
