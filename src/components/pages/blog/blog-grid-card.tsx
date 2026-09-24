import Link from "next/link";

import { Heading } from "@/components/common/heading";
import { Icon } from "@/components/common/icon";
import { Text } from "@/components/common/text";
import { ImageFrame } from "@/components/media/image-frame";
import type { Insight } from "@/data/insights";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/i18n/href";
import { cn } from "@/lib/utils";

/**
 * The card the all-articles grid is built from.
 *
 * One shape for every post — no featured size, no alternate layout — because a
 * grid whose tiles differ in weight reads as a magazine front page, and this
 * page is the index: the visitor is scanning for a subject, not being told what
 * to read first. The editorial hierarchy still exists in the category sections.
 *
 * Byline and date sit on the photograph rather than under the title. They are
 * the two things that date an article, and keeping them off the type block
 * leaves the title and the standfirst as one uninterrupted read.
 *
 * The whole tile is not one link: the image, the title and "Read more" are
 * three links to the same article, which is what a screen reader's link list
 * and a middle-click both expect. The excerpt stays selectable text.
 */
export function BlogGridCard({
  insight,
  locale,
  formattedDate,
  readMoreLabel,
  byLabel,
  className,
}: {
  insight: Insight;
  locale: Locale;
  formattedDate: string;
  readMoreLabel: string;
  /** "By" — the byline preposition, from the dictionary. */
  byLabel: string;
  className?: string;
}) {
  const isBn = locale === "bn";
  const title = isBn && insight.titleBn ? insight.titleBn : insight.title;
  const excerpt = isBn && insight.excerptBn ? insight.excerptBn : insight.excerpt;
  const author =
    isBn && insight.author.nameBn ? insight.author.nameBn : insight.author.name;
  const href = localeHref(locale, `/blog/${insight.id}`);

  return (
    <article className={cn("group flex h-full flex-col gap-4", className)}>
      <Link href={href} prefetch className="relative block">
        <ImageFrame
          src={insight.image}
          alt=""
          ratio="4/3"
          rounded="lg"
          sizes="third"
        />

        {/* Byline bar. Sits inside the frame with a blur behind it so it stays
            readable over a bright photograph as well as a dark one. */}
        <span className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-md border border-white/15 bg-black/45 px-3 py-2 text-xs font-medium text-white/90 backdrop-blur-md">
          <span className="truncate">
            {byLabel} {author}
          </span>

          <span aria-hidden className="size-1 shrink-0 rounded-full bg-white/50" />

          <time dateTime={insight.date} className="ml-auto shrink-0 tabular-nums">
            {formattedDate}
          </time>
        </span>
      </Link>

      <Heading
        as="h3"
        size="h6"
        className="font-heading leading-snug font-bold text-foreground transition-colors duration-200 group-hover:text-primary"
      >
        <Link href={href} prefetch className="line-clamp-2">
          {title}
        </Link>
      </Heading>

      <Text size="sm" className="line-clamp-2 leading-relaxed text-muted-foreground">
        {excerpt}
      </Text>

      <Link
        href={href}
        className="mt-auto inline-flex w-fit items-center gap-1.5 font-heading text-xs font-bold tracking-wider text-primary uppercase transition-colors hover:text-brand-green-dark"
      >
        {readMoreLabel}
        <Icon
          name="arrowRight"
          size="xs"
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      </Link>
    </article>
  );
}
