import Image from "@/components/common/image";
import Link from "next/link";

import { Icon } from "@/components/common/icon";
import { Heading } from "@/components/common/heading";
import { Text } from "@/components/common/text";
import { ImageFrame } from "@/components/media/image-frame";
import type { Insight } from "@/data/insights";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/i18n/href";
import { cn } from "@/lib/utils";

interface CardBaseProps {
  insight: Insight;
  locale: Locale;
  categoryLabel: string;
  formattedDate: string;
  readMoreLabel: string;
  minReadLabel: string;
  className?: string;
}

/**
 * Large full-bleed image card with dark scrim overlay.
 * Used for main hero stories and primary category highlights.
 */
export function BlogFeaturedOverlayCard({
  insight,
  locale,
  categoryLabel,
  formattedDate,
  minReadLabel,
  className,
  priority = false,
}: CardBaseProps & { priority?: boolean }) {
  const isBn = locale === "bn";
  const title = (isBn && insight.titleBn) ? insight.titleBn : insight.title;
  const excerpt = (isBn && insight.excerptBn) ? insight.excerptBn : insight.excerpt;
  const authorName = (isBn && insight.author.nameBn) ? insight.author.nameBn : insight.author.name;
  const href = localeHref(locale, `/blog/${insight.id}`);

  return (
    <article
      className={cn(
        "group relative isolate flex flex-col justify-end overflow-hidden rounded-lg border border-border/60 bg-brand-charcoal transition-all duration-300 ease-out",
        "shadow-[0_1px_2px_rgba(27,35,24,0.04),0_8px_24px_-8px_rgba(75,128,45,0.16)]",
        "hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_2px_4px_rgba(27,35,24,0.06),0_20px_40px_-12px_rgba(75,128,45,0.3)]",
        className,
      )}
    >
      <Image
        src={insight.image}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover object-center"
      />
      {/* Multi-layer gradient scrim ensuring high contrast readability */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/95 via-black/60 to-black/20 transition-opacity duration-300 group-hover:via-black/50"
      />

      <div className="relative z-10 flex flex-col gap-3.5 p-6 sm:p-8 lg:p-10">
        {/* Category badge and read time */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center rounded-full bg-primary/90 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-sm">
            {categoryLabel}
          </span>
          {insight.trending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-green-dark/90 px-2.5 py-0.5 text-xs font-semibold text-white">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              HOT
            </span>
          )}
          <span className="text-xs font-medium text-white/75">
            {insight.readMinutes} {minReadLabel}
          </span>
        </div>

        {/* Title */}
        <Heading
          as="h2"
          size="h3"
          className="text-balance font-extrabold text-white transition-colors duration-200 group-hover:text-brand-green-light"
        >
          <Link href={href} prefetch className="focus:outline-none focus:underline">
            {title}
          </Link>
        </Heading>

        {/* Excerpt */}
        <Text
          size="sm"
          className="line-clamp-2 text-white/80 sm:line-clamp-3 sm:text-base leading-relaxed"
        >
          {excerpt}
        </Text>

        {/* Meta / Author row */}
        <div className="mt-2 flex items-center justify-between border-t border-white/15 pt-4 text-xs sm:text-sm text-white/80">
          <div className="flex items-center gap-2.5">
            {insight.author.avatar ? (
              <div className="relative size-7 overflow-hidden rounded-full border border-white/30">
                <Image
                  src={insight.author.avatar}
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}
            <span className="font-medium text-white">{authorName}</span>
          </div>
          <time dateTime={insight.date} className="text-white/70">
            {formattedDate}
          </time>
        </div>
      </div>
    </article>
  );
}

/**
 * Standard vertical card with photograph above title and metadata.
 * Clean, structured, highly readable.
 */
export function BlogStandardCard({
  insight,
  locale,
  categoryLabel,
  formattedDate,
  readMoreLabel,
  minReadLabel,
  className,
}: CardBaseProps) {
  const isBn = locale === "bn";
  const title = (isBn && insight.titleBn) ? insight.titleBn : insight.title;
  const excerpt = (isBn && insight.excerptBn) ? insight.excerptBn : insight.excerpt;
  const href = localeHref(locale, `/blog/${insight.id}`);

  const authorName = (isBn && insight.author.nameBn) ? insight.author.nameBn : insight.author.name;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-all duration-300 ease-out",
        "shadow-[0_1px_2px_rgba(27,35,24,0.04),0_8px_24px_-8px_rgba(75,128,45,0.16)]",
        "hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_2px_4px_rgba(27,35,24,0.06),0_20px_40px_-12px_rgba(75,128,45,0.3)]",
        className,
      )}
    >
      {/* ── Photo ─────────────────────────────────────────────────── */}
      <Link href={href} prefetch tabIndex={-1} aria-hidden className="block">
        <ImageFrame
          src={insight.image}
          alt=""
          ratio="3/2"
          rounded="none"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/40 to-transparent"
          />
          <div className="pointer-events-none absolute left-3 top-3 flex gap-1.5">
            <span className="inline-flex rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
              {categoryLabel}
            </span>
            {insight.trending ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                Hot
              </span>
            ) : null}
          </div>
          <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            <Icon name="clock" size="xs" className="size-3" />
            {insight.readMinutes} {minReadLabel}
          </span>
        </ImageFrame>
      </Link>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2.5 px-5 pt-4 pb-4">
        <time dateTime={insight.date} className="text-xs font-medium text-muted-foreground">
          {formattedDate}
        </time>

        <Heading
          as="h3"
          size="h6"
          weight="bold"
          className="line-clamp-2 text-foreground transition-colors duration-200 group-hover:text-primary"
        >
          <Link href={href} prefetch>
            {title}
          </Link>
        </Heading>

        <Text size="sm" className="line-clamp-2 leading-relaxed text-muted-foreground">
          {excerpt}
        </Text>
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 border-t border-border/70 px-5 py-3">
        <div className="flex min-w-0 items-center gap-2">
          {insight.author.avatar ? (
            <span className="relative size-6 shrink-0 overflow-hidden rounded-full ring-2 ring-card">
              <Image src={insight.author.avatar} alt="" fill sizes="24px" className="object-cover" />
            </span>
          ) : null}
          <span className="truncate text-xs font-medium text-foreground">{authorName}</span>
        </div>

        <Link
          href={href}
          aria-label={readMoreLabel}
          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary"
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:max-w-24 group-hover:opacity-100">
            {readMoreLabel}
          </span>
          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
            <Icon name="arrowRight" size="xs" />
          </span>
        </Link>
      </div>
    </article>
  );
}

/**
 * Compact horizontal list item card with thumbnail on left,
 * title, date, and reading time on right. Perfect for sidebar / lists.
 */
export function BlogHorizontalCard({
  insight,
  locale,
  categoryLabel,
  formattedDate,
  minReadLabel,
  className,
}: Omit<CardBaseProps, "readMoreLabel">) {
  const isBn = locale === "bn";
  const title = (isBn && insight.titleBn) ? insight.titleBn : insight.title;
  const href = localeHref(locale, `/blog/${insight.id}`);

  return (
    <article
      className={cn(
        "group flex items-center gap-3.5 rounded-lg border border-border/60 bg-card p-2.5 transition-colors duration-200 hover:border-primary/40 hover:bg-muted/40",
        className,
      )}
    >
      <Link
        href={href}
        className="relative size-20 sm:size-24 shrink-0 overflow-hidden rounded-md bg-muted"
      >
        <Image
          src={insight.image}
          alt=""
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-center gap-1 min-w-0">
        <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-primary">
          {categoryLabel}
        </span>

        <h4 className="line-clamp-2 text-xs sm:text-sm font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
          <Link href={href} className="focus:outline-none">
            {title}
          </Link>
        </h4>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <time dateTime={insight.date}>{formattedDate}</time>
          <span>•</span>
          <span>{insight.readMinutes} {minReadLabel}</span>
        </div>
      </div>
    </article>
  );
}
