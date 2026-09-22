import Image, { type AppImageProps as ImageProps } from "@/components/common/image";
import type { ReactNode } from "react";

import { ASPECT_RATIOS, IMAGE_SIZES, shimmerDataUrl, type AspectRatio } from "@/lib/image";
import { cn } from "@/lib/utils";

const ROUNDED = {
  none: "",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
} as const;

export interface ImageFrameProps
  extends Omit<ImageProps, "fill" | "width" | "height" | "placeholder" | "sizes"> {
  ratio?: AspectRatio;
  rounded?: keyof typeof ROUNDED;
  hover?: "none" | "zoom" | "lift";
  /** Dark gradient for text placed on top of the image. */
  overlay?: boolean;
  sizes?: keyof typeof IMAGE_SIZES | (string & {});
  /** Rendered over the image (badges, captions, play buttons…). */
  children?: ReactNode;
  className?: string;
  imageClassName?: string;
}

/**
 * The standard image. Wraps `next/image` with a locked aspect-ratio scale, a
 * shimmer blur placeholder and the hover treatments used across the site, so
 * media never ships without a ratio, `sizes` or a placeholder.
 */
export function ImageFrame({
  ratio = "video",
  rounded = "xl",
  hover = "none",
  overlay = false,
  sizes = "full",
  alt,
  className,
  imageClassName,
  children,
  blurDataURL,
  ...props
}: ImageFrameProps) {
  const resolvedSizes =
    sizes in IMAGE_SIZES ? IMAGE_SIZES[sizes as keyof typeof IMAGE_SIZES] : (sizes as string);

  return (
    <figure
      className={cn(
        "relative isolate overflow-hidden bg-muted",
        ASPECT_RATIOS[ratio],
        ROUNDED[rounded],
        hover === "lift" &&
          "transition-transform duration-500 ease-out-expo hover:-translate-y-1",
        "group/frame",
        className,
      )}
    >
      <Image
        alt={alt}
        fill
        sizes={resolvedSizes}
        placeholder="blur"
        blurDataURL={blurDataURL ?? shimmerDataUrl()}
        className={cn(
          "object-cover object-center",
          hover === "zoom" &&
            "transition-transform duration-700 ease-out-expo group-hover/frame:scale-105",
          imageClassName,
        )}
        {...props}
        quality={90}
      />

      {overlay ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"
        />
      ) : null}

      {children}
    </figure>
  );
}
