import Link from "next/link";

import { Heading } from "@/components/common/heading";
import { Icon, type IconName } from "@/components/common/icon";
import { ImageFrame } from "@/components/media/image-frame";
import type { Property } from "@/data/properties";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/i18n/href";
import { formatArea, formatKatha } from "@/lib/format";
import { FormatBdt } from "@/components/ui/format-bdt";
import { cn } from "@/lib/utils";

export interface PropertyCardProps {
  property: Property;
  /** Needed for the link. Defaults to English, the default locale. */
  locale?: Locale;
  className?: string;
  featured?: boolean;
}

/**
 * The card links to the listing as a whole: the title is the accessible name
 * of that link, and everything else on the card is inside it. One link per
 * card rather than three, because a keyboard walking a grid of twelve should
 * pass twelve stops, not thirty-six.
 *
 * Reading order is what a buyer actually scans: purpose and trust marks on
 * the photo, then price, then what and where, then the numbers. The footer
 * carries the one legal fact that decides a viewing — RAJUK — and an arrow
 * that says the whole card is the button.
 */
export function PropertyCard({
  property,
  locale = "en",
  className,
  featured = false,
}: PropertyCardProps) {
  const {
    title: englishTitle,
    titleBn,
    area,
    areaBn,
    city,
    price,
    purpose,
    status = "available",
    beds,
    baths,
    size,
    katha,
    images,
    badge,
    rajukApproved,
    hasVirtualTour,
    furnishing,
    handover,
  } = property;
  const isSold = status === "sold";
  const title = locale === "bn" && titleBn ? titleBn : englishTitle;
  const displayArea = locale === "bn" && areaBn ? areaBn : area;

  const specs: { icon: IconName; value: string; label: string }[] = [
    ...(beds > 0 ? [{ icon: "bed" as const, value: String(beds), label: "Beds" }] : []),
    { icon: "bath", value: String(baths), label: "Baths" },
    { icon: "area", value: formatArea(size), label: "Area" },
    ...(katha ? [{ icon: "layers" as const, value: formatKatha(katha), label: "Land" }] : []),
  ].slice(0, 4);

  return (
    <Link
      href={localeHref(locale, `/properties/${property.slug}`)}
      aria-label={`${title}, ${displayArea}`}
      prefetch
      className="block h-full"
    >
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/60 transition-all duration-300 ease-out",
          "shadow-[0_1px_2px_rgba(27,35,24,0.04),0_8px_24px_-8px_rgba(75,128,45,0.16)]",
          "hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_2px_4px_rgba(27,35,24,0.06),0_20px_40px_-12px_rgba(75,128,45,0.3)]",
          isSold ? "bg-muted/60" : "bg-card",
          className,
        )}
      >
        {/* ── Photo ─────────────────────────────────────────────────── */}
        <ImageFrame
          src={images[0]}
          alt={`${title}, ${displayArea}`}
          ratio={featured ? "3/2" : "4/3"}
          rounded="none"
          sizes="card"
          className={cn(isSold && "grayscale-[0.4]")}
        >
          {/* Soft foot shade so the pills read on any photo. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/45 to-transparent"
          />

          {/* Top-left: purpose + editorial badge. */}
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
            <span
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm",
                isSold
                  ? "bg-foreground/85 text-background"
                  : purpose === "rent"
                    ? "bg-white text-primary"
                    : "bg-primary text-white",
              )}
            >
              {isSold ? "Sold" : `For ${purpose}`}
            </span>
            {badge && !isSold ? (
              <span className="rounded-md bg-brand-green-light px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1b2318] shadow-sm">
                {badge}
              </span>
            ) : null}
          </div>

          {/* Bottom-left: 360 tour. Bottom-right: photo count. */}
          <div className="absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-2">
            {hasVirtualTour ? (
              <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                360° Tour
              </span>
            ) : (
              <span />
            )}
            <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Icon name="gallery" size="xs" />
              {images.length}
            </span>
          </div>
        </ImageFrame>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-3 px-5 pt-4 pb-4">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                "font-heading text-h4 font-bold tracking-tight",
                isSold ? "text-muted-foreground line-through decoration-2" : "text-primary",
              )}
            >
              <FormatBdt value={price} />
            </span>
            {purpose === "rent" && !isSold ? (
              <span className="text-sm font-medium text-muted-foreground">/ month</span>
            ) : null}
          </div>

          {/* What and where */}
          <div className="flex flex-col gap-1">
            <Heading
              as="h3"
              size="h6"
              weight="semibold"
              className="line-clamp-2 text-foreground transition-colors group-hover:text-primary"
            >
              {title}
            </Heading>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon name="location" size="xs" className="shrink-0 text-primary" />
              <span className="truncate">
                {displayArea}, {city}
              </span>
            </span>
          </div>

          {/* Numbers */}
          <ul className="mt-auto grid grid-cols-2 gap-1.5 pt-1 sm:grid-cols-4">
            {specs.map((spec) => (
              <li
                key={spec.label}
                className="flex flex-col items-center gap-0.5 rounded-lg bg-muted/70 px-1 py-2 text-center"
              >
                <Icon name={spec.icon} size="xs" className="text-primary" />
                <span className="text-xs font-bold leading-tight text-foreground">
                  {spec.value}
                </span>
                <span className="text-xs leading-none text-muted-foreground">
                  {spec.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 border-t border-border/70 px-5 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {rajukApproved ? (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                <Icon name="approved" size="xs" className="size-3" />
                RAJUK
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                Title in review
              </span>
            )}
            <span className="truncate text-[11px] text-muted-foreground">
              {furnishing} · {handover}
            </span>
          </div>

          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary">
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-24 group-hover:opacity-100">
              View details
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
