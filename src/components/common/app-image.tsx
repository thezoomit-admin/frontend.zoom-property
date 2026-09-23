"use client";

import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { useMemo, useState, type SyntheticEvent } from "react";

import { shimmerDataUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

export interface AppImageProps extends Omit<NextImageProps, "src"> {
  src: NextImageProps["src"] | string | null | undefined;
  /** Optional. Never defaults to a stock Unsplash photo — that hid real media. */
  fallbackSrc?: string;
}

const SERVER_URL = (
  process.env.NEXT_PUBLIC_IMAGE_ACCESS_URL ??
  process.env.NEXT_PUBLIC_SERVER_URL ??
  "http://localhost:5008"
).replace(/\/+$/, "");

/** Buckets that have held Zoom Property public media (current + older). */
const R2_PUBLIC_HOSTS = [
  "https://pub-fe014e73b16347aab5e799483354b483.r2.dev",
  "https://pub-5b52277bf86041a0b4872bee7a979553.r2.dev",
] as const;

const R2_PUBLIC_FALLBACK =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/+$/, "") ||
  R2_PUBLIC_HOSTS[0];

/** If a key 404s on one public bucket, try the other — media spans both. */
function alternateR2Url(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.toLowerCase().endsWith(".r2.dev")) return undefined;
    const key = parsed.pathname.replace(/^\/+/, "");
    if (!key) return undefined;
    const current = `${parsed.protocol}//${parsed.host}`;
    const other = R2_PUBLIC_HOSTS.find(
      (base) => base.toLowerCase() !== current.toLowerCase(),
    );
    return other ? `${other}/${key}` : undefined;
  } catch {
    return undefined;
  }
}

export function resolveImageSrc(src: string | null | undefined): string {
  if (!src) return "";
  if (typeof src !== "string") return src;
  // Absolute URLs stay as stored in CMS/admin — do not rewrite hosts.
  if (
    /^(https?:)?\/\//i.test(src) ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return src.startsWith("//") ? `https:${src}` : src;
  }
  if (src.startsWith("/") && !src.startsWith("/uploads")) {
    return src;
  }
  const clean = src.replace(/^\/+/, "");
  if (clean.includes("-") || /\.(avif|webp|jpe?g|png|gif)$/i.test(clean)) {
    return `${R2_PUBLIC_FALLBACK}/${clean}`;
  }
  return `${SERVER_URL}/${clean}`;
}

export function AppImage({
  src,
  alt = "",
  fallbackSrc,
  placeholder,
  blurDataURL,
  className,
  onError,
  ...props
}: AppImageProps) {
  const candidates = useMemo(() => {
    const resolved = typeof src === "string" ? resolveImageSrc(src) : "";
    const list: string[] = [];
    const push = (value?: string | null) => {
      const v = String(value || "").trim();
      if (v && !list.includes(v)) list.push(v);
    };
    push(resolved);
    if (resolved) push(alternateR2Url(resolved));
    push(fallbackSrc);
    return list;
  }, [src, fallbackSrc]);

  const resetKey = `${typeof src === "string" ? src : ""}::${fallbackSrc ?? ""}`;
  const [retry, setRetry] = useState({ key: resetKey, n: 0 });
  // When src/fallback changes, treat attempt as 0 without an effect setState.
  const attempt = retry.key === resetKey ? retry.n : 0;

  const imageSrc = candidates[attempt] || "";
  const exhausted = !imageSrc;

  const resolvedBlur =
    placeholder === "blur" ? (blurDataURL ?? shimmerDataUrl()) : blurDataURL;

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setRetry((prev) => ({
      key: resetKey,
      n: (prev.key === resetKey ? prev.n : 0) + 1,
    }));
    onError?.(e);
  };

  if (exhausted) {
    return (
      <span
        aria-hidden
        className={cn("block size-full bg-muted", className)}
        style={props.fill ? { position: "absolute", inset: 0 } : undefined}
      />
    );
  }

  const isLocal =
    imageSrc.startsWith("http://localhost") ||
    imageSrc.startsWith("http://127.0.0.1") ||
    imageSrc.startsWith("/");

  return (
    <NextImage
      key={imageSrc}
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
