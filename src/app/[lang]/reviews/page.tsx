import type { Metadata } from "next";

import { ReviewsPage } from "@/components/pages/reviews/reviews-page";
import { ContactCta } from "@/components/common/contact-cta";
import { localeAlternates } from "@/i18n/alternates";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getReviewPage, getVideoReviewPage } from "@/server/features/reviews";

/** Quotes per page. Two columns, so an even number keeps the grid square. */
const PER_PAGE = 4;

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.reviews.metaTitle,
    description: dict.reviews.metaDescription,
    alternates: localeAlternates(locale, "/reviews"),
  };
}

export default async function ReviewsRoute({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; videoPage?: string }>;
}) {
  const query = await searchParams;
  // `?page=abc` is a URL somebody edited; treat it as the first page rather
  // than passing NaN down.
  const requested = Number.parseInt(query.page ?? "1", 10);
  const requestedVideo = Number.parseInt(query.videoPage ?? "1", 10);

  const [dict, locale, page, videoPage] = await Promise.all([
    getDictionary(),
    getLocale(),
    getReviewPage(Number.isFinite(requested) ? requested : 1, PER_PAGE),
    getVideoReviewPage(Number.isFinite(requestedVideo) ? requestedVideo : 1, 4),
  ]);

  return (
    <>
      <ReviewsPage locale={locale} t={dict.reviews} page={page} videoPage={videoPage} />
      <div className="mb-8 md:mb-12 lg:mb-20">
        <ContactCta />
      </div>
    </>
  );
}
