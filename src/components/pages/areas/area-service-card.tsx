import Link from "next/link";

import { Icon } from "@/components/common/icon";
import Image from "@/components/common/image";
import type { Area } from "@/data/areas";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/i18n/href";
import { shimmerDataUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

const ACCENT_THEMES = [
  {
    surface: "bg-linear-to-br from-white via-white to-sky-50/80",
    icon: "text-sky-500",
    arrow: "bg-sky-100 text-sky-600 group-hover:bg-sky-500",
  },
  {
    surface: "bg-linear-to-br from-white via-white to-emerald-50/80",
    icon: "text-emerald-500",
    arrow: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500",
  },
  {
    surface: "bg-linear-to-br from-white via-white to-violet-50/80",
    icon: "text-violet-500",
    arrow: "bg-violet-100 text-violet-600 group-hover:bg-violet-500",
  },
  {
    surface: "bg-linear-to-br from-white via-white to-orange-50/80",
    icon: "text-orange-500",
    arrow: "bg-orange-100 text-orange-600 group-hover:bg-orange-500",
  },
] as const;

/**
 * The service-area card.
 *
 * The photograph is the card: full-bleed on top, with the area name set on
 * a dark foot so the place and its picture are read together. The strip
 * under it answers the two things that decide whether to look further —
 * how much is on the market here, and what a square foot costs — and the
 * service promise sits above an arrow that fills in on hover.
 *
 * `inAreaLabel` arrives pre-composed from the dictionary so the sentence can
 * be ordered differently per language rather than concatenated here.
 */
export function AreaServiceCard({
  area,
  locale,
  inAreaLabel,
  className,
}: {
  area: Area;
  locale: Locale;
  /** Already interpolated, e.g. "in Badda Area". */
  inAreaLabel: string;
  className?: string;
}) {
  const isBn = locale === "bn";
  const name = isBn && area.nameBn ? area.nameBn : area.name;
  const tagline = isBn && area.taglineBn ? area.taglineBn : area.tagline;
  const themeIndex = Array.from(area.id).reduce((total, char) => total + char.charCodeAt(0), 0)
    % ACCENT_THEMES.length;
  const theme = ACCENT_THEMES[themeIndex];

  return (
    <Link
      href={localeHref(locale, `/areas/${area.id}`)}
      prefetch
      className={cn(
        "group relative isolate flex h-full min-h-36 flex-col overflow-hidden rounded-lg border border-gray-200 p-3.5 transition-all duration-300 ease-out",
        "shadow-[0_1px_2px_rgba(27,35,24,0.05),0_11px_30px_-8px_rgba(75,128,45,0.25)] hover:border-primary/40 hover:bg-primary/[0.03] hover:shadow-[0_2px_4px_rgba(27,35,24,0.07),0_24px_44px_-12px_rgba(75,128,45,0.36)]",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary",
        theme.surface,
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-8 size-28 rounded-full bg-white/70 blur-xl transition-transform duration-500 group-hover:scale-125"
      />

      {/* Circular image makes each neighbourhood easy to recognise at a glance. */}
      <div className="relative z-10 h-14 w-21 overflow-hidden rounded-full border-2 border-white bg-muted">
        <Image
          src={area.image}
          alt=""
          fill
          sizes="72px"
          placeholder="blur"
          blurDataURL={shimmerDataUrl()}
          className="object-cover"
        />
      </div>

      <div className="relative z-10 mt-2.5 flex min-w-0 items-center gap-1.5">
        <Icon name="location" size="sm" className={cn("shrink-0", theme.icon)} />
        <span className="truncate font-heading text-[15px] font-bold text-foreground">{name}</span>
      </div>

      <span className="relative z-10 mt-1.5 line-clamp-1 text-[11px] leading-relaxed text-muted-foreground">
        {tagline || inAreaLabel}
      </span>
      <span className="relative z-10 line-clamp-1 text-[11px] text-muted-foreground/80">{inAreaLabel}</span>

      <span
        aria-hidden
        className={cn(
          "absolute right-3.5 bottom-3.5 z-10 flex size-8 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 group-hover:text-white",
          theme.arrow,
        )}
      >
        <Icon name="arrowRight" size="xs" className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
