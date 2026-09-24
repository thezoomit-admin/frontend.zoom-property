import Link from "next/link";

import { Heading } from "@/components/common/heading";
import { Icon, type IconName } from "@/components/common/icon";
import { ImageFrame } from "@/components/media/image-frame";
import { FormatBdt } from "@/components/ui/format-bdt";
import type { Project } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/i18n/href";
import { cn } from "@/lib/utils";

/**
 * One development, as a card.
 *
 * The photograph carries the name and the address so the picture and the
 * place are read as one thing; everything under it is the two questions a
 * buyer asks next — how far along is it, and what does it start at. Units
 * left sits in the footer beside the arrow because scarcity is the nudge
 * that makes someone click through.
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
  const sold = project.units - project.unitsLeft;
  const soldPercent = project.units ? Math.round((sold / project.units) * 100) : 0;
  const progress = Math.max(0, Math.min(100, project.progress));

  const status = project.status?.toLowerCase();
  const statusTone: { icon: IconName; className: string } =
    status === "completed" || status === "done"
      ? { icon: "check", className: "bg-primary text-white" }
      : status === "processing" || status === "under construction"
        ? { icon: "construction", className: "bg-white text-primary" }
        : { icon: "building", className: "bg-white/90 text-foreground" };

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
          "group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-all duration-300 ease-out",
          "shadow-[0_1px_2px_rgba(27,35,24,0.04),0_8px_24px_-8px_rgba(75,128,45,0.16)]",
          "hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_2px_4px_rgba(27,35,24,0.06),0_20px_40px_-12px_rgba(75,128,45,0.3)]",
          className,
        )}
      >
        {/* ── Photo with name overlay ───────────────────────────────── */}
        <ImageFrame
          src={project.image}
          alt={`${displayName}, ${project.area}`}
          ratio="3/2"
          rounded="none"
          sizes="third"
        >
          {/* Deep foot gradient: the title sits on it. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10"
          />

          {/* Top row: build stage, live feed. */}
          <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm",
                statusTone.className,
              )}
            >
              <Icon name={statusTone.icon} size="xs" className="size-3" />
              {project.status}
            </span>

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

          {/* Foot: name + address on the photo. */}
          <div className="absolute inset-x-5 bottom-4 z-10 flex flex-col gap-1">
            <Heading
              as="h3"
              size="h5"
              weight="bold"
              className="line-clamp-2 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]"
            >
              {displayName}
            </Heading>
            <span className="flex items-center gap-1.5 text-sm text-white/85">
              <Icon name="location" size="xs" className="shrink-0 text-brand-green-light" />
              <span className="truncate">
                {project.area}, {project.city}
              </span>
            </span>
          </div>
        </ImageFrame>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-4 px-5 pt-4 pb-4">
          {/* Price + handover */}
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Starting from
              </span>
              <span className="font-heading text-h4 font-bold tracking-tight text-primary">
                <FormatBdt value={project.startingPrice} />
              </span>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Handover
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-foreground">
                <Icon name="handover" size="xs" className="text-primary" />
                {project.handover}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="flex flex-col gap-2 rounded-md bg-muted/70 p-3.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-foreground">
                Construction progress
              </span>
              <span className="font-heading text-lg font-bold leading-none text-primary">
                {progress}%
              </span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-border/70"
              role="img"
              aria-label={`${progress} percent complete`}
            >
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-brand-green transition-[width] duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {project.milestones.length ? (
              <ul className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1">
                {project.milestones.slice(0, 2).map((m) => (
                  <li
                    key={m.label}
                    className="flex items-center justify-between gap-2 text-[11px]"
                  >
                    <span className="flex min-w-0 items-center gap-1 text-muted-foreground">
                      <Icon
                        name={m.completed ? "check" : "clock"}
                        size="xs"
                        className={cn("size-3 shrink-0", m.completed ? "text-primary" : "text-muted-foreground")}
                      />
                      <span className="truncate">{m.label}</span>
                    </span>
                    <span className="shrink-0 font-semibold text-foreground">{m.percent}%</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Sizes */}
          <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="area" size="xs" className="text-primary" />
            <span className="font-medium text-foreground">{project.sizeRange}</span>
            <span className="text-xs">floor sizes</span>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 border-t border-border/70 px-5 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                project.unitsLeft <= 5
                  ? "bg-red-50 text-red-700"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              <Icon name="building" size="xs" className="size-3" />
              {project.unitsLeft} of {project.units} left
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {soldPercent}% booked
            </span>
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
      </article>
    </Link>
  );
}
