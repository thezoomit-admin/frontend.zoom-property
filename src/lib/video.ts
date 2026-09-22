export type VideoProvider = "youtube" | "vimeo" | "facebook";

/** Facebook plugin player for a public video or reel URL. */
export function facebookEmbedUrl(
  pageUrl: string,
  size: { width?: number; height?: number; autoplay?: boolean } = {},
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
  if (size.autoplay) params.set("autoplay", "true");
  return `https://www.facebook.com/plugins/video.php?${params.toString()}`;
}

export function isFacebookVideo(url: string) {
  return /facebook\.com|fb\.watch|fb\.com/i.test(url);
}

export function isYoutubeVideo(url: string) {
  return /youtu\.be|youtube\.com/i.test(url);
}

/**
 * Prefer the URL shape over a stored provider — the schema default was
 * `facebook`, which silently broke YouTube links.
 */
export function resolveVideoProvider(
  url: string,
  preferred?: VideoProvider | string | null,
): VideoProvider {
  if (isYoutubeVideo(url)) return "youtube";
  if (isFacebookVideo(url)) return "facebook";
  if (preferred === "vimeo") return "vimeo";
  if (preferred === "youtube" || preferred === "facebook") return preferred;
  return "youtube";
}

export function playerEmbed(url: string) {
  const provider = resolveVideoProvider(url);
  if (provider === "facebook") {
    return {
      src: facebookEmbedUrl(url, { width: 540, height: 960, autoplay: true }),
      portrait: true as const,
      provider,
    };
  }

  const id = parseVideoId(url, provider === "vimeo" ? "vimeo" : "youtube");
  const shorts = provider === "youtube" && /\/shorts\//i.test(url);
  return {
    src: embedUrl(id, provider === "vimeo" ? "vimeo" : "youtube"),
    portrait: shorts,
    provider,
  };
}

/** Extracts the video id from the common YouTube / Vimeo URL shapes. */
export function parseVideoId(url: string, provider: VideoProvider) {
  if (provider === "youtube") {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|v=)([A-Za-z0-9_-]{6,})/,
    );
    return match?.[1] ?? "";
  }

  if (provider === "vimeo") {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match?.[1] ?? "";
  }

  return "";
}

export function embedUrl(id: string, provider: VideoProvider) {
  if (!id) return "";
  return provider === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    : `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0`;
}

/**
 * The player that sits *in* a card: YouTube's own frame, parked on its first
 * frame and never starting by itself.
 */
export function cardEmbedUrl(id: string) {
  if (!id) return "";
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&mute=1&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1`;
}

/**
 * Zero-request poster for YouTube. `hqdefault` is the only size guaranteed to
 * exist for every video — `maxresdefault` 404s on older or low-res uploads.
 */
export function youtubeThumbnail(id: string) {
  if (!id) return "";
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
