import { Icon } from "@/components/common/icon";
import { ZOOM_AL_ZAHARA_FILMS } from "@/data/zoomalzahara";
import { embedUrl, facebookEmbedUrl, parseVideoId } from "@/lib/video";

type FilmCopy = { title: string; caption: string };

export function ProjectFilms({
  films,
  watchLabel,
}: {
  films: FilmCopy[];
  watchLabel: string;
}) {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {ZOOM_AL_ZAHARA_FILMS.map((film, index) => {
        const copy = films[index];
        const title = copy?.title ?? "Zoom Al-Zahra";
        const src =
          film.provider === "facebook"
            ? facebookEmbedUrl(film.url)
            : embedUrl(parseVideoId(film.url, "youtube"), "youtube");

        return (
          <li key={film.url} className="min-w-0">
            <article className="overflow-hidden rounded-lg border border-border bg-card">
              <div
                data-video-embed
                data-lenis-prevent
                className="overflow-hidden bg-black"
              >
                <div className="relative aspect-9/16 w-full">
                  <iframe
                    src={src}
                    title={title}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 size-full border-none"
                  />
                </div>
              </div>
              <div className="flex items-start justify-between gap-2 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="font-heading text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-0.5 truncate font-heading text-sm font-bold text-foreground">
                    {title}
                  </h3>
                </div>
                <a
                  href={film.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md px-2 text-xs font-semibold text-primary hover:bg-primary/10"
                >
                  {watchLabel}
                  <Icon name="arrowUpRight" size="xs" />
                </a>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
