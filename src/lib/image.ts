/** Aspect ratios used across media components. One list, one vocabulary. */
export const ASPECT_RATIOS = {
  square: "aspect-square",
  "4/3": "aspect-[4/3]",
  "4/5": "aspect-[4/5]",
  "3/2": "aspect-[3/2]",
  video: "aspect-video",
  ultrawide: "aspect-[21/9]",
  portrait: "aspect-[3/4]",
  tall: "aspect-[2/3]",
  auto: "",
} as const;

export type AspectRatio = keyof typeof ASPECT_RATIOS;

/** Inline SVG shimmer used as the default blur placeholder for remote images. */
export function shimmerDataUrl(width = 700, height = 475) {
  const svg = `<svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#e5e5e5" offset="20%" />
      <stop stop-color="#f5f5f5" offset="50%" />
      <stop stop-color="#e5e5e5" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#e5e5e5" />
  <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1.4s" repeatCount="indefinite" />
</svg>`;

  const base64 =
    typeof window === "undefined"
      ? Buffer.from(svg).toString("base64")
      : window.btoa(svg);

  return `data:image/svg+xml;base64,${base64}`;
}

/** Sensible `sizes` presets so we stop guessing at every call site. */
export const IMAGE_SIZES = {
  full: "100vw",
  half: "(min-width: 768px) 50vw, 100vw",
  third: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  quarter: "(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw",
  card: "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw",
} as const;
