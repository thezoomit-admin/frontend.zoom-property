import { AppContainer } from "@/components/common/app-container";
import { cn } from "@/lib/utils";

/**
 * Shared route-loading skeletons.
 *
 * `loading.tsx` streams the instant a link is clicked, before the page's own
 * data fetch resolves — a route with none shows nothing at all in between,
 * which reads as the click having done nothing. One small shared library
 * instead of fifteen bespoke ones: every route gets the shape closest to its
 * own layout without redesigning a skeleton from scratch each time.
 */

function Pulse({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-muted", className)} />;
}

/** A page opened by a banner photo, like a project, property or area. */
export function BannerSkeleton() {
  return (
    <div className="relative h-[42svh] min-h-56 w-full overflow-hidden bg-muted">
      <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/40 to-transparent" />
      <AppContainer className="relative flex h-full flex-col justify-end pb-10">
        <Pulse className="h-3 w-24 bg-white/30" />
        <Pulse className="mt-3 h-9 w-64 max-w-full bg-white/40" />
        <Pulse className="mt-3 h-4 w-80 max-w-full bg-white/25" />
      </AppContainer>
    </div>
  );
}

/** Grid of card-shaped tiles, for a listing page (projects, properties, …). */
export function CardGridSkeleton({
  count = 6,
  columns = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  columns?: string;
}) {
  return (
    <div className={cn("grid gap-6", columns)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-border">
          <Pulse className="h-48 w-full rounded-none" />
          <div className="space-y-2 p-4">
            <Pulse className="h-4 w-3/4" />
            <Pulse className="h-3 w-1/2" />
            <Pulse className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** A body of running text — an article, a long-form legal page. */
export function ArticleSkeleton({ lines = 8 }: { lines?: number }) {
  return (
    <div className="max-w-2xl space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Pulse key={i} className={cn("h-4", i % 3 === 2 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

/** A row of stat/fact tiles, as a project or property detail opens with. */
export function FactRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border p-4">
          <Pulse className="h-3 w-16" />
          <Pulse className="mt-2 h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

/** Banner, then a fact row, then a two-column body — the shape every
 * project/property/blog detail page opens with. */
export function DetailPageLoading({
  sidebar = true,
}: {
  /** Whether the layout reserves a right-hand rail (an advisor card, etc.). */
  sidebar?: boolean;
}) {
  return (
    <>
      <BannerSkeleton />
      <AppContainer className="mt-10 space-y-8 pb-16">
        <FactRowSkeleton />
        <div className={cn("grid gap-10", sidebar && "lg:grid-cols-[1.6fr_1fr]")}>
          <ArticleSkeleton lines={10} />
          {sidebar ? (
            <div className="h-64 rounded-xl border border-border">
              <Pulse className="h-full w-full rounded-xl" />
            </div>
          ) : null}
        </div>
      </AppContainer>
    </>
  );
}

/** A title, then a card grid — a projects/properties/blog/areas index. */
export function ListPageLoading({
  count = 6,
  columns,
}: {
  count?: number;
  columns?: string;
}) {
  return (
    <AppContainer className="py-10 sm:py-14">
      <Pulse className="h-3 w-28" />
      <Pulse className="mt-3 h-8 w-72 max-w-full" />
      <div className="mt-8">
        <CardGridSkeleton count={count} columns={columns} />
      </div>
    </AppContainer>
  );
}

/** A title and a block of body copy — about, privacy, terms, a static page. */
export function SimplePageLoading() {
  return (
    <AppContainer className="py-10 sm:py-14">
      <Pulse className="h-3 w-28" />
      <Pulse className="mt-3 h-8 w-72 max-w-full" />
      <div className="mt-8">
        <ArticleSkeleton lines={6} />
      </div>
    </AppContainer>
  );
}
