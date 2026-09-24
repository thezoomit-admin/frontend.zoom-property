import { DetailPageLoading } from "@/components/common/route-loading";

/** Instant shell while a listing's RSC resolves — a card click changes the
 * page immediately instead of sitting still. */
export default function PropertyDetailLoading() {
  return <DetailPageLoading sidebar />;
}
