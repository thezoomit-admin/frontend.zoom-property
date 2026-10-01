import { createCn } from "cn/config";

/**
 * `cn` = clsx + tailwind-merge (via the `cn` package).
 *
 * The custom `text-display` … `text-h6` / `text-eyebrow` / `text-lead` sizes
 * from `globals.css` have to be registered as font sizes, otherwise
 * tailwind-merge reads them as *colour* utilities and silently drops them when
 * a class like `text-muted-foreground` follows. Keep this list in sync with the
 * `--text-*` tokens in `src/app/globals.css`.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "eyebrow",
            "lead",
          ],
        },
      ],
    },
  },
});

/**
 * Standardize Google Maps URLs to embeddable iframes.
 * Extracts from pasted iframes, or converts share links to output=embed.
 */
export function getMapEmbedUrl(url: string, lang: string = "en"): string {
  if (!url) return "";
  
  const iframeMatch = url.match(/src="([^"]+)"/);
  if (iframeMatch) return iframeMatch[1];
  
  if (url.includes("output=embed") || url.includes("/embed")) return url;
  
  const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) return `https://maps.google.com/maps?q=${llMatch[1]},${llMatch[2]}&hl=${lang}&z=14&output=embed`;
  
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return `https://maps.google.com/maps?q=${atMatch[1]},${atMatch[2]}&hl=${lang}&z=14&output=embed`;
  
  const placeMatch = url.match(/\/place\/([^/]+)/);
  if (placeMatch) return `https://maps.google.com/maps?q=${placeMatch[1]}&hl=${lang}&z=14&output=embed`;
  
  const qMatch = url.match(/[?&]q=([^&]+)/);
  if (qMatch) return `https://maps.google.com/maps?q=${qMatch[1]}&hl=${lang}&z=14&output=embed`;

  // Fallback: try appending output=embed
  return url + (url.includes("?") ? "&" : "?") + "output=embed";
}
