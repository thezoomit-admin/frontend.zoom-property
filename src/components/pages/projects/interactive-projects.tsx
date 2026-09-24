"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/common/icon";
import { ProjectCard } from "./project-card";
import type { Project } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

export type ProjectStageFilter = "all" | "Completed" | "Planning" | "Processing";
const PAGE_SIZE = 6;

function stageFromParam(val?: string | null): ProjectStageFilter {
  if (!val) return "all";
  const lower = val.toLowerCase();
  if (lower === "completed" || lower === "done" || lower === "complete") {
    return "Completed";
  }
  if (lower === "planning") return "Planning";
  if (
    lower === "processing" ||
    lower === "under construction" ||
    lower === "in progress"
  ) {
    return "Processing";
  }
  return "all";
}

export function InteractiveProjects({
  projects = [],
  locale = "en",
  initialStage,
  initialSearch,
  initialPage,
}: {
  projects: Project[];
  locale?: Locale;
  initialStage?: string;
  initialSearch?: string;
  initialPage?: number;
}) {
  const pathname = usePathname();

  const [selectedStage, setSelectedStage] = useState<ProjectStageFilter>(() =>
    stageFromParam(initialStage),
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch ?? "");
  const [page, setPage] = useState(
    initialPage && initialPage > 0 ? initialPage : 1,
  );
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const syncUrl = (
    stage: ProjectStageFilter,
    search: string,
    nextPage: number,
  ) => {
    const params = new URLSearchParams();
    if (stage !== "all") params.set("stage", stage.toLowerCase());
    if (search.trim()) params.set("q", search.trim());
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    // Client-only — no RSC refetch, no loading shell.
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  };

  useEffect(() => {
    setPage(1);
    syncUrl(selectedStage, debouncedSearchQuery, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  const isBn = locale === "bn";

  const counts = useMemo(() => {
    return {
      all: projects.length,
      Completed: projects.filter(
        (p) =>
          p.status?.toLowerCase() === "completed" ||
          p.status?.toLowerCase() === "done" ||
          p.status?.toLowerCase() === "complete",
      ).length,
      Planning: projects.filter((p) => p.status?.toLowerCase() === "planning")
        .length,
      Processing: projects.filter(
        (p) =>
          p.status?.toLowerCase() === "processing" ||
          p.status?.toLowerCase() === "under construction" ||
          p.status?.toLowerCase() === "in progress",
      ).length,
    };
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      if (selectedStage !== "all") {
        const pStatus = (project.status || "").toLowerCase();
        if (
          selectedStage === "Completed" &&
          pStatus !== "completed" &&
          pStatus !== "done" &&
          pStatus !== "complete"
        ) {
          return false;
        }
        if (selectedStage === "Planning" && pStatus !== "planning") return false;
        if (
          selectedStage === "Processing" &&
          pStatus !== "processing" &&
          pStatus !== "under construction" &&
          pStatus !== "in progress"
        ) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const haystack =
          `${project.name} ${project.area} ${project.city} ${project.status}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [projects, selectedStage, searchQuery]);

  const handleStageChange = (stage: ProjectStageFilter) => {
    setSelectedStage(stage);
    setPage(1);
    syncUrl(stage, searchQuery, 1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    syncUrl(selectedStage, searchQuery, newPage);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStage("all");
    setPage(1);
    syncUrl("all", "", 1);
  };

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const stagesTabs: {
    id: ProjectStageFilter;
    labelEn: string;
    labelBn: string;
    count: number;
    icon: IconName;
    activeColor: string;
  }[] = [
    {
      id: "all",
      labelEn: "All Projects",
      labelBn: "সব প্রজেক্ট",
      count: counts.all,
      icon: "building",
      activeColor: "bg-primary text-primary-foreground",
    },
    {
      id: "Completed",
      labelEn: "Completed",
      labelBn: "সম্পন্ন",
      count: counts.Completed,
      icon: "check",
      activeColor: "bg-primary text-white",
    },
    {
      id: "Planning",
      labelEn: "Planning",
      labelBn: "পরিকল্পনাধীন",
      count: counts.Planning,
      icon: "layers",
      activeColor: "bg-primary text-white",
    },
    {
      id: "Processing",
      labelEn: "Under Construction",
      labelBn: "চলমান নির্মাণ",
      count: counts.Processing,
      icon: "construction",
      activeColor: "bg-primary text-white",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/80 bg-secondary-100/80 p-1.5 shadow-xs dark:bg-card">
          {stagesTabs.map((tab) => {
            const isActive = selectedStage === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleStageChange(tab.id)}
                className={cn(
                  "flex cursor-pointer select-none items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all sm:text-sm",
                  isActive
                    ? `${tab.activeColor} scale-[1.02] shadow-sm`
                    : "text-muted-foreground hover:bg-background/80 hover:text-foreground",
                )}
              >
                <Icon name={tab.icon} size="xs" />
                <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold transition-colors",
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={
              isBn
                ? "প্রজেক্টের নাম বা এলাকা খুঁজুন..."
                : "Search project or area..."
            }
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 pl-10 text-xs text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm"
          />
          <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground">
            <Icon name="search" size="xs" />
          </span>
          {searchQuery ? (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-medium text-muted-foreground sm:text-sm">
          {isBn
            ? `মোট ${filtered.length}টি প্রজেক্ট পাওয়া গেছে`
            : `Showing ${filtered.length} ${filtered.length === 1 ? "project" : "projects"}`}
        </span>
        {selectedStage !== "all" || searchQuery ? (
          <button
            type="button"
            onClick={resetFilters}
            className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            {isBn ? "ফিল্টার রিসেট করুন" : "Reset filters"}
          </button>
        ) : null}
      </div>

      {paginated.length > 0 ? (
        <Stagger
          key={`${selectedStage}-${page}-${searchQuery}`}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {paginated.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} locale={locale} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Icon name="construction" size="sm" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {isBn ? "কোনো প্রজেক্ট পাওয়া যায়নি" : "No projects found"}
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {isBn
              ? "নির্বাচিত স্ট্যাটাস বা সার্চের সাথে মিলে এমন কোনো প্রজেক্ট এই মুহূর্তে নেই।"
              : "No projects match the selected status filter or search query."}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary/90"
          >
            {isBn ? "সকল প্রজেক্ট দেখুন" : "View all projects"}
          </button>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            {isBn
              ? `পৃষ্ঠা ${page} / ${totalPages} (মোট ${filtered.length}টি)`
              : `Page ${page} of ${totalPages} (${filtered.length} total)`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground shadow-xs transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="arrowLeft" size="xs" />
              <span>{isBn ? "আগের" : "Previous"}</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePageChange(p)}
                className={cn(
                  "flex size-8 cursor-pointer items-center justify-center rounded-md text-xs font-bold shadow-xs transition",
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-foreground hover:border-primary",
                )}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground shadow-xs transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span>{isBn ? "পরের" : "Next"}</span>
              <Icon name="arrowRight" size="xs" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
