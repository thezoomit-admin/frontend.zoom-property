import { AppContainer } from "@/components/common/app-container";
import { BannerSkeleton, CardGridSkeleton } from "@/components/common/route-loading";

/** Instant shell for the home page while its sections resolve. */
export default function HomeLoading() {
  return (
    <>
      <BannerSkeleton />
      <AppContainer className="py-10 sm:py-14">
        <CardGridSkeleton count={3} columns="sm:grid-cols-2 lg:grid-cols-3" />
      </AppContainer>
    </>
  );
}
