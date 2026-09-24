"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/common/icon";
import { PropertyCard } from "./property-card";
import { areas as fallbackAreas, type Area } from "@/data/areas";
import type { Locale } from "@/i18n/config";
import { properties as fallbackProperties, type Property, type Purpose } from "@/data/properties";
import { formatBdt } from "@/lib/format";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type CategoryTab = "all" | "sale" | "rent" | "penthouse" | "ready" | "commercial";
/** Cards per page when the caller does not say. */
const DEFAULT_PAGE_SIZE = 12;

export interface ListingFilters {
  purpose?: Purpose;
  area?: string;
  q?: string;
  type?: string;
  min?: number;
  max?: number;
}

function normalizeTerm(str: string) {
  return str.replace(/-/g, " ").toLowerCase().trim();
}

export function InteractiveListings({
  locale = "en",
  filters,
  clearHref,
  properties = fallbackProperties,
  areas = fallbackAreas,
  types,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  locale?: Locale;
  filters?: ListingFilters;
  clearHref?: string;
  properties?: Property[];
  areas?: Area[];
  types?: { value: string; label: string }[];
  /** How many cards a page holds. The page that owns the list decides. */
  pageSize?: number;
} = {}) {
  // Guarded rather than trusted: a zero or a negative would divide the list
  // into an infinite number of pages and hang the render.
  const perPage = Math.max(1, Math.floor(pageSize) || DEFAULT_PAGE_SIZE);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const selectedArea = searchParams.get("listArea") ?? filters?.area ?? "all";
  const activeCategory = (searchParams.get("listCat") as CategoryTab) ?? "all";
  
  const initialSearch = searchParams.get("listQ") ?? "";
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const updateUrl = (area: string, cat: string, q: string, p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (area !== "all" && area !== filters?.area) params.set("listArea", area);
    else params.delete("listArea");

    if (cat !== "all") params.set("listCat", cat);
    else params.delete("listCat");

    if (q.trim()) params.set("listQ", q.trim());
    else params.delete("listQ");

    if (p > 1) params.set("page", String(p));
    else params.delete("page");

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Sync debounce to URL
  useEffect(() => {
    if (debouncedSearchQuery !== (searchParams.get("listQ") ?? "")) {
      updateUrl(selectedArea, activeCategory, debouncedSearchQuery, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  const isBn = locale === "bn";

  // Compute dynamic area list with property counts
  const areaOptions = useMemo(() => {
    const list: { id: string; name: string; nameBn?: string; count: number }[] = [];

    // Map through configured areas
    for (const area of areas) {
      const term = normalizeTerm(area.id);
      const nameTerm = normalizeTerm(area.name);
      const count = properties.filter((p) => {
        const propArea = normalizeTerm(p.area);
        const propCity = normalizeTerm(p.city);
        return propArea.includes(term) || propArea.includes(nameTerm) || propCity.includes(term);
      }).length;

      if (count > 0 || list.length < 8) {
        list.push({
          id: area.id,
          name: area.name,
          nameBn: area.nameBn,
          count,
        });
      }
    }

    return list;
  }, [areas, properties]);

  // Combined search and query-string filters
  const searched = useMemo(() => {
    return properties.filter((property) => {
      // Calculator / Query-string filters
      if (filters?.purpose && property.purpose !== filters.purpose) return false;
      if (filters?.type && property.type !== filters.type) return false;
      if (filters?.min !== undefined && property.price < filters.min) return false;
      if (filters?.max !== undefined && property.price > filters.max) return false;

      // Query param search
      if (filters?.q) {
        const queryTerm = filters.q.toLowerCase().trim();
        const haystack = `${property.title} ${property.area} ${property.city}`.toLowerCase();
        if (!haystack.includes(queryTerm)) return false;
      }

      // Inline search box
      if (debouncedSearchQuery.trim()) {
        const search = debouncedSearchQuery.toLowerCase().trim();
        const haystack = `${property.title} ${property.area} ${property.city} ${property.type}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }

      // Dynamic Area selection
      if (selectedArea !== "all") {
        const selectedAreaObj = areas.find((a) => a.id === selectedArea);
        const term = normalizeTerm(selectedArea);
        const nameTerm = selectedAreaObj ? normalizeTerm(selectedAreaObj.name) : term;
        const propArea = normalizeTerm(property.area);
        const propCity = normalizeTerm(property.city);

        if (!propArea.includes(term) && !propArea.includes(nameTerm) && !propCity.includes(term)) {
          return false;
        }
      }

      // Category / Type filter
      if (activeCategory === "sale") {
        if (property.purpose !== "sale") return false;
      } else if (activeCategory === "rent") {
        if (property.purpose !== "rent") return false;
      } else if (activeCategory === "penthouse") {
        if (property.type !== "duplex" && !property.title.toLowerCase().includes("penthouse")) return false;
      } else if (activeCategory === "ready") {
        const handover = (property.handover || "").toLowerCase();
        if (!handover.includes("ready") && !handover.includes("available")) return false;
      } else if (activeCategory === "commercial") {
        if (property.type !== "commercial") return false;
      }

      return true;
    });
  }, [properties, filters, debouncedSearchQuery, selectedArea, activeCategory, areas]);

  const activeChips = useMemo(() => {
    if (!filters) return [];

    const chips: string[] = [];
    if (filters.area) {
      chips.push(
        areas.find((area) => area.id === filters.area)?.name ?? filters.area,
      );
    }
    if (filters.q) chips.push(`“${filters.q}”`);
    if (filters.type) {
      chips.push(
        types?.find((type) => type.value === filters.type)?.label ??
          filters.type,
      );
    }
    if (filters.min !== undefined || filters.max !== undefined) {
      chips.push(
        `${formatBdt(filters.min ?? 0)} – ${filters.max !== undefined ? formatBdt(filters.max) : "∞"}`,
      );
    }
    if (filters.purpose) {
      chips.push(filters.purpose === "rent" ? (isBn ? "ভাড়া" : "For rent") : (isBn ? "বিক্রয়" : "For sale"));
    }

    return chips;
  }, [filters, areas, isBn, types]);

  useEffect(() => {
    if (activeChips.length === 0) {
      if (selectedArea !== "all" || activeCategory !== "all" || searchQuery !== "" || page !== 1) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchQuery("");
        updateUrl("all", "all", "", 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChips.length]);

  const totalPages = Math.max(1, Math.ceil(searched.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedProperties = useMemo(
    () => searched.slice((currentPage - 1) * perPage, currentPage * perPage),
    [currentPage, perPage, searched],
  );
  const pageStart = searched.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const pageEnd = Math.min(currentPage * perPage, searched.length);

  const handleAreaChange = (areaId: string) => {
    updateUrl(areaId, activeCategory, searchQuery, 1);
  };

  const handleCategoryChange = (cat: CategoryTab) => {
    updateUrl(selectedArea, cat, searchQuery, 1);
  };

  const handleMobileApply = (area: string, category: CategoryTab, query: string) => {
    setSearchQuery(query);
    updateUrl(area, category, query, 1);
    setIsMobileFiltersOpen(false);
  };

  const hasMobileFilters =
    selectedArea !== "all" || activeCategory !== "all" || searchQuery.trim().length > 0;

  const goToPage = (nextPage: number) => {
    const p = Math.max(1, Math.min(nextPage, totalPages));
    updateUrl(selectedArea, activeCategory, searchQuery, p);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const CATEGORY_TABS: { id: CategoryTab; labelEn: string; labelBn: string }[] = [
    { id: "all", labelEn: "All Types", labelBn: "সকল ক্যাটাগরি" },
    { id: "sale", labelEn: "For Sale", labelBn: "বিক্রয়ের জন্য" },
    { id: "rent", labelEn: "For Rent", labelBn: "ভাড়ার জন্য" },
    { id: "ready", labelEn: "Ready to Move", labelBn: "রেডি ফ্ল্যাট" },
    { id: "penthouse", labelEn: "Penthouse & Duplex", labelBn: "পেন্টহাউজ ও ডুপ্লেক্স" },
    { id: "commercial", labelEn: "Commercial", labelBn: "বাণিজ্যিক" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* What arrived from the property calculator */}
      {activeChips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
          <span className="text-sm font-semibold text-foreground">
            {isBn ? "আপনার সার্চ:" : "Your search:"}
          </span>

          {activeChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-primary/25 bg-card px-3 py-1 text-xs font-medium text-primary"
            >
              {chip}
            </span>
          ))}

          {clearHref ? (
            <Link
              href={clearHref}
              onClick={() => {
                setSearchQuery("");
                updateUrl("all", "all", "", 1);
              }}
              className="ml-auto text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
            >
              {isBn ? "ক্লিয়ার করুন" : "Clear"}
            </Link>
          ) : null}
        </div>
      ) : null}

      {/* Mobile: filters live in a bottom drawer so the listing grid stays clear. */}
      <div className="-mt-3 md:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-border bg-card text-primary shadow-xs transition-colors hover:border-primary/40 hover:bg-primary/5"
            aria-label={isBn ? "ফিল্টার খুলুন" : "Open filters"}
          >
            <Icon name="filter" size="sm" />
          </button>
          {hasMobileFilters ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                updateUrl("all", "all", "", 1);
              }}
              className="h-10 rounded-lg border border-border bg-card px-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              {isBn ? "ক্লিয়ার" : "Clear"}
            </button>
          ) : null}
        </div>

        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl px-4 pb-6">
            <SheetHeader className="px-0 pb-4">
              <SheetTitle>{isBn ? "প্রপার্টি ফিল্টার" : "Filter properties"}</SheetTitle>
              <SheetDescription>
                {isBn ? "আপনার পছন্দ অনুযায়ী প্রপার্টি খুঁজুন" : "Find properties that match your needs"}
              </SheetDescription>
            </SheetHeader>
            <MobileFilters
              key={`${selectedArea}-${activeCategory}-${searchQuery}`}
              isBn={isBn}
              areas={areaOptions}
              propertiesCount={properties.length}
              selectedArea={selectedArea}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              categories={CATEGORY_TABS}
              onApply={handleMobileApply}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: filters stay visible above the listings. */}
      <div className="hidden flex-col gap-5 rounded-2xl border border-border bg-card/60 p-4 sm:p-6 backdrop-blur-sm shadow-xs md:flex">
        {/* Top: Area-wise Filter Bar */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Icon name="location" size="xs" />
              {isBn ? "এলাকা অনুযায়ী ফিল্টার (Area Filter)" : "Filter by Area"}
            </span>
            <span className="text-xs text-muted-foreground">
              {searched.length} {isBn ? "টি প্রপার্টি উপলব্ধ" : "properties found"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleAreaChange("all")}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer",
                selectedArea === "all"
                  ? "border-primary bg-primary text-primary-foreground font-semibold shadow-sm scale-105"
                  : "border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground hover:bg-primary/5",
              )}
            >
              <span>{isBn ? "সব এলাকা" : "All Areas"}</span>
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                selectedArea === "all" ? "bg-primary-foreground/25 text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {properties.length}
              </span>
            </button>

            {areaOptions.map((area) => {
              const isSelected = selectedArea === area.id;
              const label = isBn && area.nameBn ? area.nameBn : area.name;

              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => handleAreaChange(area.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground font-semibold shadow-sm scale-105"
                      : "border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground hover:bg-primary/5",
                  )}
                >
                  <span>{label}</span>
                  {area.count > 0 && (
                    <span className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      isSelected ? "bg-primary-foreground/25 text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {area.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border/60" />

        {/* Bottom: Category Tabs & Search input */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORY_TABS.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer",
                    isActive
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border/60 bg-card text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/40",
                  )}
                >
                  {isBn ? cat.labelBn : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-55">
            <input
              type="text"
              placeholder={isBn ? "প্রপার্টি বা কিওয়ার্ড খুঁজুন..." : "Search properties..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <Icon name="search" size="xs" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            {searchQuery && (
               <button
                 type="button"
                 onClick={() => setSearchQuery("")}
                 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
               >
                 ✕
               </button>
            )}
          </div>
        </div>
      </div>

      {/* Property Count Info */}
      <div className="flex items-center justify-between gap-4 text-xs sm:text-sm text-muted-foreground">
        <span>
          {isBn
            ? `${searched.length}টির মধ্যে ${pageStart}-${pageEnd} দেখানো হচ্ছে`
            : `Showing ${pageStart}-${pageEnd} of ${searched.length} properties`}
        </span>
        <span className="hidden sm:inline">
          {isBn ? `প্রতি পাতায় ${perPage}টি` : `${perPage} per page`}
        </span>
      </div>

      {searched.length === 0 ? (
        <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <Icon name="search" size="sm" className="text-muted-foreground" />
          </div>
          <h3 className="mb-1 font-heading text-lg font-semibold text-foreground">
            {isBn ? "কোনো প্রপার্টি পাওয়া যায়নি" : "No properties found"}
          </h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            {isBn
              ? "আপনার সার্চের সাথে মিলে এমন কোনো প্রপার্টি পাওয়া যায়নি। দয়া করে ফিল্টারগুলো পরিবর্তন করে আবার চেষ্টা করুন।"
              : "We couldn't find any properties matching your criteria. Try adjusting your filters or search term."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              updateUrl("all", "all", "", 1);
              if (clearHref) router.push(clearHref);
            }}
            className="mt-4 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {isBn ? "সব ফিল্টার রিসেট করুন" : "Reset all filters"}
          </button>
        </div>
      ) : (
        <Stagger key={`${selectedArea}-${activeCategory}-${currentPage}-${debouncedSearchQuery}-${activeChips.length}`} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedProperties.map((property) => (
            <StaggerItem key={property.id}>
              <PropertyCard property={property} locale={locale} />
            </StaggerItem>
          ))}
        </Stagger>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav aria-label="Property pagination" className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
          >
            <Icon name="chevronLeft" size="xs" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => goToPage(pageNumber)}
              aria-current={pageNumber === currentPage ? "page" : undefined}
              className={cn(
                "flex size-9 items-center justify-center rounded-full border text-sm font-semibold transition-all cursor-pointer",
                pageNumber === currentPage
                  ? "border-primary bg-primary text-primary-foreground shadow-xs scale-105"
                  : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
              )}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
          >
            <Icon name="chevronRight" size="xs" />
          </button>
        </nav>
      )}
    </div>
  );
}

function MobileFilters({
  isBn,
  areas,
  propertiesCount,
  selectedArea,
  activeCategory,
  searchQuery,
  categories,
  onApply,
}: {
  isBn: boolean;
  areas: { id: string; name: string; nameBn?: string; count: number }[];
  propertiesCount: number;
  selectedArea: string;
  activeCategory: CategoryTab;
  searchQuery: string;
  categories: { id: CategoryTab; labelEn: string; labelBn: string }[];
  onApply: (area: string, category: CategoryTab, query: string) => void;
}) {
  const [draftArea, setDraftArea] = useState(selectedArea);
  const [draftCategory, setDraftCategory] = useState(activeCategory);
  const [draftQuery, setDraftQuery] = useState(searchQuery);

  return (
    <div className="flex flex-col gap-6">
      <label className="relative block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-primary">{isBn ? "খুঁজুন" : "Search"}</span>
        <Icon name="search" size="xs" className="pointer-events-none absolute bottom-3 left-3 text-muted-foreground" />
        <input
          type="search"
          value={draftQuery}
          onChange={(event) => setDraftQuery(event.target.value)}
          placeholder={isBn ? "প্রপার্টি বা কিওয়ার্ড খুঁজুন..." : "Search properties..."}
          className="h-10 w-full rounded-lg border border-border bg-background py-2 pr-3 pl-9 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <MobileFilterGroup title={isBn ? "এলাকা অনুযায়ী" : "By area"} icon="location">
        <MobileFilterChip active={draftArea === "all"} onClick={() => setDraftArea("all")} label={isBn ? "সব এলাকা" : "All areas"} count={propertiesCount} />
        {areas.map((area) => (
          <MobileFilterChip key={area.id} active={draftArea === area.id} onClick={() => setDraftArea(area.id)} label={isBn && area.nameBn ? area.nameBn : area.name} count={area.count} />
        ))}
      </MobileFilterGroup>

      <MobileFilterGroup title={isBn ? "ক্যাটাগরি" : "Property type"} icon="layers">
        {categories.map((category) => (
          <MobileFilterChip key={category.id} active={draftCategory === category.id} onClick={() => setDraftCategory(category.id)} label={isBn ? category.labelBn : category.labelEn} />
        ))}
      </MobileFilterGroup>

      <button
        type="button"
        onClick={() => onApply(draftArea, draftCategory, draftQuery)}
        className="h-11 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {isBn ? "ফিল্টার প্রয়োগ করুন" : "Apply filters"}
      </button>
    </div>
  );
}

function MobileFilterGroup({ title, icon, children }: { title: string; icon: "location" | "layers"; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
        <Icon name={icon} size="xs" />
        {title}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function MobileFilterChip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground")}
    >
      {label}
      {count !== undefined && count > 0 ? <span className={cn("rounded-full px-1.5 py-0.5 text-[10px]", active ? "bg-primary-foreground/20" : "bg-muted")}>{count}</span> : null}
    </button>
  );
}
