export type VideoProvider = "youtube" | "vimeo" | "facebook";

/** Facebook plugin player for a public video or reel URL. */
export function facebookEmbedUrl(
  pageUrl: string,
  size: { width?: number; height?: number } = {},
) {
  const width = String(size.width ?? 267);
  const height = String(size.height ?? 476);
  const params = new URLSearchParams({
    href: pageUrl,
    show_text: "false",
    width,
    height,
    t: "0",
  });
  return `https://www.facebook.com/plugins/video.php?${params.toString()}`;
}

/** Extracts the video id from the common YouTube / Vimeo URL shapes. */
export function parseVideoId(url: string, provider: VideoProvider) {
  if (provider === "youtube") {
    const match = url.match(
      /(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{6,})/,
    );
    return match?.[1] ?? url;
  }

  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match?.[1] ?? url;
}

export function embedUrl(id: string, provider: VideoProvider) {
  return provider === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    : `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0`;
}

/**
 * The player that sits *in* a card: YouTube's own frame, parked on its first
 * frame and never starting by itself.
 *
 * `autoplay=0` is the whole point — the card shows a video rather than a
 * picture of one, but nothing plays until a visitor asks. Chrome is stripped
 * because the card is not where the video gets watched: the click opens the
 * lightbox instead, so this layer is rendered `pointer-events-none` by the
 * caller and never handles input itself.
 */
export function cardEmbedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&mute=1&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1`;
}

/**
 * Zero-request poster for YouTube. `hqdefault` is the only size guaranteed to
 * exist for every video — `maxresdefault` 404s on older or low-res uploads.
 * Pass `poster` to <VideoEmbed /> to override it (Vimeo always needs one).
 */
export function youtubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
