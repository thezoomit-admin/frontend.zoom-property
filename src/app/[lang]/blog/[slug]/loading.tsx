import { DetailPageLoading } from "@/components/common/route-loading";

/** Instant shell while an article's RSC resolves — a card click changes the
 * page immediately instead of sitting still. */
export default function BlogPostLoading() {
  return <DetailPageLoading sidebar />;
}
