"use client";

import { useMemo, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Heading } from "@/components/common/heading";
import type { Insight } from "@/data/insights";
import { LOCALE_TAGS, type Locale } from "@/i18n/config";
import { Reveal } from "@/components/motion/reveal";
import { BlogCategoryFilter } from "./blog-category-filter";
import { BlogGridCard } from "./blog-grid-card";
import { BlogPagination } from "./blog-pagination";

interface BlogFeedProps {
  insights: Insight[];
  backendCategories: string[];
  totalPages: number;
  locale: Locale;
  t: {
    all: string;
    categories: Record<string, string>;
    readMore: string;
    minRead: string;
    searchPlaceholder: string;
    categoriesPrev: string;
    categoriesNext: string;
    noResults: string;
    resetFilter: string;
    prevPage: string;
    nextPage: string;
    pageLabel: string;
    pageOf: string;
    article: { by: string };
  };
}

/** Articles per page — three rows of the three-up grid. */
const PER_PAGE = 9;

export function BlogFeed({ insights, backendCategories, totalPages, locale, t }: BlogFeedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;

  const gridTop = useRef<HTMLDivElement>(null);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [locale],
  );

  const formatDate = (dateStr: string) => {
    try {
      return dateFormatter.format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const categories = useMemo(() => {
    return [
      { id: "All", label: t.all },
      ...(backendCategories?.map(c => ({ id: c, label: t.categories[c] ?? c })) || [])
    ];
  }, [t, backendCategories]);

  const updateFilters = (params: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "" || (key === "category" && value === "All")) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    router.push(`${pathname}?${nextParams.toString()}`, { scroll: false });
  };

  const selectCategory = (categoryId: string) => {
    updateFilters({ category: categoryId, page: "1" });
  };

  const search = (query: string) => {
    updateFilters({ search: query, page: "1" });
  };

  const reset = () => {
    router.push(pathname, { scroll: false });
  };

  const goToPage = (next: number) => {
    updateFilters({ page: next.toString() });
    gridTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isFiltered = activeCategory !== "All" || searchQuery.trim() !== "";

  return (
    <div ref={gridTop} className="flex flex-col gap-10 sm:gap-12 scroll-mt-28">
      <Reveal>
        <BlogCategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={selectCategory}
          searchQuery={searchQuery}
          onSearchChange={search}
          searchPlaceholder={t.searchPlaceholder}
          scrollPrevLabel={t.categoriesPrev}
          scrollNextLabel={t.categoriesNext}
        />
      </Reveal>

      {/* Only once a filter is doing something: the default view goes straight
          from the pills into the grid. */}
      {isFiltered ? (
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/60 pb-5">
          <Heading as="h2" size="h4" className="font-heading font-bold">
            {activeCategory !== "All"
              ? (t.categories[activeCategory] ?? activeCategory)
              : t.all}
          </Heading>

          <button
            type="button"
            onClick={reset}
            className="cursor-pointer font-heading text-xs font-semibold tracking-wider text-primary uppercase hover:underline"
          >
            {t.resetFilter}
          </button>
        </div>
      ) : null}

      {insights.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">{t.noResults}</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
          {insights.map((post) => (
            <BlogGridCard
              key={post.id}
              insight={post}
              locale={locale}
              formattedDate={formatDate(post.date)}
              readMoreLabel={t.readMore}
              byLabel={t.article.by}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <BlogPagination
          current={Math.min(page, totalPages)}
          total={totalPages}
          onSelect={goToPage}
          labels={{
            prev: t.prevPage,
            next: t.nextPage,
            page: t.pageLabel,
            pageOf: t.pageOf,
          }}
        />
      )}
    </div>
  );
}
