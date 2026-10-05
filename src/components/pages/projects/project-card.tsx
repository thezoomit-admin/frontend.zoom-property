import Link from "next/link";

import { Heading } from "@/components/common/heading";
import { Icon } from "@/components/common/icon";
import { ImageFrame } from "@/components/media/image-frame";
import type { Project } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/i18n/href";
import { cn } from "@/lib/utils";

/**
 * One development, as a card.
 *
 * The photograph leads the card, followed by the project name and address.
 * Unit sizes and the project link sit in the footer.
 */
export function ProjectCard({
  project,
  locale = "en",
  className,
}: {
  project: Project;
  /** Needed for the link. Defaults to English, the default locale. */
  locale?: Locale;
  className?: string;
}) {
  const displayName =
    locale === "bn" && project.nameBn ? project.nameBn : project.name;

  return (
    <Link
      href={localeHref(locale, `/projects/${project.slug}`)}
      aria-label={`${displayName}, ${project.area}`}
      prefetch
      className="block h-full"
    >
      <article
        // Anchor target for the footer's project line — the cards are the only
        // page a project has, so `/projects#<id>` is its address.
        id={project.id}
        className={cn(
          "scroll-mt-24",
          "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 ease-out",
          "shadow-md shadow-primary/10",
          "hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/25",
          className,
        )}
      >
        {/* ── Photo ─────────────────────────────────────────────────── */}
        <ImageFrame
          src={project.thumbnailImage || project.image}
          alt={`${displayName}, ${project.area}`}
          ratio="square"
          rounded="none"
          sizes="third"
          imageClassName="object-contain"
        >
          {/* Live feed indicator. */}
          <div className="absolute inset-x-3 top-3 z-10 flex justify-end">
            {project.cctvStreamActive ? (
              <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                </span>
                Live CCTV
              </span>
            ) : null}
          </div>

        </ImageFrame>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-4 px-5 pt-4 pb-4">
          <div className="flex flex-col gap-1">
            <Heading
              as="h3"
              size="h5"
              weight="bold"
              className="line-clamp-2 text-foreground transition-colors group-hover:text-primary"
            >
              {displayName}
            </Heading>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon name="location" size="xs" className="shrink-0 text-primary" />
              <span className="truncate">
                {project.area}, {project.city}
              </span>
            </span>
          </div>

          {/* Sizes */}
          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="area" size="xs" className="text-primary" />
              <span className="font-medium text-foreground">{project.sizeRange}</span>
              <span className="text-xs">floor sizes</span>
            </div>

            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
              <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-24 group-hover:opacity-100">
                View project
              </span>
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon name="arrowRight" size="xs" />
              </span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
