"use client";

import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { useState, type SyntheticEvent } from "react";

import { shimmerDataUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

export interface AppImageProps extends Omit<NextImageProps, "src"> {
  src: NextImageProps["src"] | string | null | undefined;
  fallbackSrc?: string;
}

const SERVER_URL = (
  process.env.NEXT_PUBLIC_IMAGE_ACCESS_URL ??
  process.env.NEXT_PUBLIC_SERVER_URL ??
  "http://localhost:5008"
).replace(/\/+$/, "");

/** Live media bucket. Retire stale pub-* hosts that 404 every key. */
const R2_PUBLIC_FALLBACK = "https://pub-fe014e73b16347aab5e799483354b483.r2.dev";
const STALE_R2_HOSTS = new Set(["pub-5b52277bf86041a0b4872bee7a979553.r2.dev"]);

const rewriteStaleR2Url = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (!STALE_R2_HOSTS.has(parsed.hostname.toLowerCase())) return url;
    const key = parsed.pathname.replace(/^\/+/, "");
    return key ? `${R2_PUBLIC_FALLBACK}/${key}` : R2_PUBLIC_FALLBACK;
  } catch {
    return url;
  }
};

export function resolveImageSrc(src: string | null | undefined): string {
  if (!src) return "";
  if (typeof src !== "string") return src;
  if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:") || src.startsWith("blob:")) {
    return rewriteStaleR2Url(src);
  }
  if (src.startsWith("/") && !src.startsWith("/uploads")) {
    return src;
  }
  const clean = src.replace(/^\/+/, "");
  return `${SERVER_URL}/${clean}`;
}

export function AppImage({
  src,
  alt = "",
  fallbackSrc = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  placeholder,
  blurDataURL,
  className,
  onError,
  ...props
}: AppImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  // Safe fallback if src is missing or failed
  const resolved = typeof src === "string" ? resolveImageSrc(src) : src;
  const resolvedKey = typeof resolved === "string" ? resolved : "";
  const imageSrc =
    !resolved || failedSrc === resolvedKey ? fallbackSrc : resolved;

  // Resolve blur placeholder
  const resolvedBlur =
    placeholder === "blur" ? (blurDataURL ?? shimmerDataUrl()) : blurDataURL;

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    if (resolvedKey) setFailedSrc(resolvedKey);
    onError?.(e);
  };

  const isLocal =
    typeof imageSrc === "string" &&
    (imageSrc.startsWith("http://localhost") ||
      imageSrc.startsWith("http://127.0.0.1") ||
      imageSrc.startsWith("/"));

  return (
    <NextImage
      src={imageSrc}
      alt={alt}
      placeholder={placeholder}
      blurDataURL={resolvedBlur}
      onError={handleError}
      unoptimized={isLocal || props.unoptimized}
      className={cn("transition-opacity duration-300", className)}
      {...props}
    />
  );
}

export { AppImage as Image };
export default AppImage;
