import Link from "next/link";

import Image from "@/components/common/image";
import { AppContainer } from "@/components/common/app-container";
import { Icon } from "@/components/common/icon";
import { SectionHeading } from "@/components/common/section-heading";
import { Text } from "@/components/common/text";
import { PageHeader } from "@/components/layout/page-header";
import { ReviewVideoCarousel } from "@/components/pages/home/review-video-carousel";
import { Reveal } from "@/components/motion/reveal";
import { pageBanners } from "@/data/page-banners";
import { localeHref } from "@/i18n/href";
import { LOCALE_TAGS, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { ReviewPage } from "@/server/features/reviews";
import type { VideoReviewPage } from "@/server/features/reviews";
import { cn } from "@/lib/utils";

/**
 * `/reviews`.
 *
 * Everything on this page comes from the database \u2014 the quotes, the average,
 * and the films at the bottom. The layout is exactly what it was; only where
 * the words come from has changed.
 *
 * The list is paged through the URL rather than in the browser, because the
 * page is rendered on the server: `?page=3` is a real address that can be
 * shared, reopened and crawled, and each page is cached on its own.
 */
/** Where a page link lands, so paging does not throw you back to the banner. */
const ANCHOR = "all-reviews";

export function ReviewsPage({
  locale,
  t,
  page,
  videoPage,
}: {
  locale: Locale;
  t: Dictionary["reviews"];
  page: ReviewPage;
  videoPage: VideoReviewPage;
}) {
  const { reviews, total, totalPages, page: current, from, average } = page;
  const number = new Intl.NumberFormat(LOCALE_TAGS[locale], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const base = localeHref(locale, "/reviews");
  const href = (target: number) =>
    target <= 1 ? `${base}#${ANCHOR}` : `${base}?page=${target}#${ANCHOR}`;

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.pageTitle}
        description={t.pageDescription}
        image={t.backgroundImage || pageBanners.reviews}
        cmsPageId="reviews"
        cmsSectionId="reviews"
      />

      <section className="border-b border-border bg-muted/30 py-10 sm:py-14">
        <AppContainer>
          <Reveal>
            <div className="flex max-w-xl items-center gap-5 rounded-lg border border-border bg-card p-5 sm:p-6">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-h1 leading-none text-foreground">
                      {number.format(average)}
                    </span>
                    <span className="text-sm text-muted-foreground">{t.outOf}</span>
                  </div>
                  <div className="mt-2 flex gap-0.5" aria-label={`${number.format(average)} / 5`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <Icon key={index} name="star" size="xs" className="fill-brand text-brand" />
                    ))}
                  </div>
                </div>
                <div className="h-12 w-px bg-border" aria-hidden />
                <Text size="sm" className="max-w-xs text-muted-foreground">
                  {t.ratingNote}
                </Text>
            </div>
          </Reveal>
        </AppContainer>
      </section>

      <section id={ANCHOR} className="scroll-mt-24 bg-background py-16 sm:py-24">
        <AppContainer>
          <SectionHeading title={t.allReviewsTitle} description={t.description} />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {reviews.map((review, index) => (
              <Reveal key={review.id} delay={index * 0.05}>
                <figure className="flex h-full flex-col gap-6 rounded-lg border border-border/60 bg-card p-6 sm:p-8 shadow-[0_1px_2px_rgba(27,35,24,0.04),0_8px_24px_-8px_rgba(75,128,45,0.16)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_2px_4px_rgba(27,35,24,0.06),0_20px_40px_-12px_rgba(75,128,45,0.3)]">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5" aria-label={`${review.rating} / 5`}>
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <Icon key={starIndex} name="star" size="xs" className={starIndex < review.rating ? "fill-brand text-brand" : "text-border"} />
                      ))}
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {t.verified}
                    </span>
                  </div>
                  <blockquote className="flex-1">
                    <Text size="lead">“{review.quote}”</Text>
                  </blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-border pt-5">
                    {/* A recorded review is never asked for a portrait, and
                        its still is optional too — so the frame may have
                        nothing to put in it. An initial beats a broken image
                        box, and `next/image` throws on an empty `src`. */}
                    {review.image ? (
                      <Image src={review.image} alt="" width={48} height={48} className="size-12 rounded-full object-cover" />
                    ) : (
                      <span
                        aria-hidden
                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-base font-semibold text-primary"
                      >
                        {review.name.trim().charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span className="flex min-w-0 flex-col">
                      <span className="text-sm font-semibold text-foreground">{review.name}</span>
                      <span className="text-xs text-muted-foreground">{review.role} · {review.property}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          {totalPages > 1 ? (
            <Reveal
              delay={0.1}
              className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row"
            >
              <Text size="sm" className="text-muted-foreground">
                {t.showing
                  .replace("{from}", String(from))
                  .replace("{to}", String(from + reviews.length - 1))
                  .replace("{total}", String(total))}
              </Text>

              <nav
                className="flex max-w-full items-center gap-2 overflow-x-auto pb-2"
                // The count is spelled out in the readout beside this nav, so
                // the landmark only has to name where you are.
                aria-label={t.page.replace("{page}", String(current))}
              >
                <Step
                  href={href(current - 1)}
                  label={t.prev}
                  icon="chevronLeft"
                  disabled={current === 1}
                />

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <Link
                    key={n}
                    href={href(n)}
                    aria-current={n === current ? "page" : undefined}
                    aria-label={t.page.replace("{page}", String(n))}
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
                      n === current
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
                    )}
                  >
                    {n}
                  </Link>
                ))}

                <Step
                  href={href(current + 1)}
                  label={t.next}
                  icon="chevronRight"
                  disabled={current === totalPages}
                />
              </nav>
            </Reveal>
          ) : null}
        </AppContainer>
      </section>

      {videoPage.reviews.length > 0 ? (
        <section className="border-y border-border bg-muted/30 py-16 sm:py-24">
          <AppContainer>
            <SectionHeading title={t.videoTitle} description={t.videoDescription} />
            <div className="mt-10">
              <ReviewVideoCarousel
                reviews={videoPage.reviews}
                labels={{ play: t.playVideo, close: t.closeVideo }}
              />
            </div>
            {videoPage.totalPages > 1 ? (
              <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Video review pagination">
                {videoPage.page > 1 ? (
                  <Link href={`${base}?page=${current}&videoPage=${videoPage.page - 1}`} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
                    <Icon name="chevronLeft" size="xs" />
                  </Link>
                ) : null}
                <span className="text-sm text-muted-foreground">{videoPage.page} / {videoPage.totalPages}</span>
                {videoPage.page < videoPage.totalPages ? (
                  <Link href={`${base}?page=${current}&videoPage=${videoPage.page + 1}`} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">
                    <Icon name="chevronRight" size="xs" />
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </AppContainer>
        </section>
      ) : null}
    </>
  );
}

/**
 * Previous / next.
 *
 * Disabled at the ends as a `span` rather than a dead link: a link that goes
 * nowhere is still focusable and still announced as a link.
 */
function Step({
  href,
  label,
  icon,
  disabled,
}: {
  href: string;
  label: string;
  icon: "chevronLeft" | "chevronRight";
  disabled: boolean;
}) {
  const shared =
    "flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors";

  if (disabled) {
    return (
      <span aria-hidden className={cn(shared, "opacity-40")}>
        <Icon name={icon} size="xs" />
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(shared, "bg-card hover:border-primary/40 hover:text-primary")}
    >
      <Icon name={icon} size="xs" />
    </Link>
  );
}
