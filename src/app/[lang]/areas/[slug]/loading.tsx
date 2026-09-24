import { AppContainer } from "@/components/common/app-container";

/**
 * Instant route shell while the area detail RSC resolves —
 * so a card click changes the page immediately instead of sitting still.
 */
export default function AreaDetailLoading() {
  return (
    <>
      <div className="relative h-[42svh] min-h-56 w-full overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/40 to-transparent" />
        <AppContainer className="relative flex h-full flex-col justify-end pb-10">
          <div className="h-3 w-24 animate-pulse rounded bg-white/30" />
          <div className="mt-3 h-9 w-64 max-w-full animate-pulse rounded bg-white/40" />
          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-white/25" />
        </AppContainer>
      </div>
      <AppContainer className="py-10 sm:py-12">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
        <div className="mt-8 overflow-hidden rounded-xl border border-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0"
            >
              <div className="size-10 shrink-0 animate-pulse rounded-md bg-muted" />
              <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
              <div className="h-8 w-24 shrink-0 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </AppContainer>
    </>
  );
}
