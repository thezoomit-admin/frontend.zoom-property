"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/common/icon";
import { ProjectCard } from "./project-card";
import type { Project } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export type ProjectStageFilter = "Upcoming" | "Running" | "Completed";
const PAGE_SIZE = 6;

function stageFromParam(val?: string | null): ProjectStageFilter {
  if (!val) return "Running";
  const lower = val.toLowerCase();
  if (lower === "completed" || lower === "done" || lower === "complete") {
    return "Completed";
  }
  if (lower === "upcoming" || lower === "planning") return "Upcoming";
  if (
    lower === "running" ||
    lower === "processing" ||
    lower === "under construction" ||
    lower === "in progress"
  ) {
    return "Running";
  }
  return "Running";
}

export function InteractiveProjects({
  projects = [],
  locale = "en",
  initialStage,
  initialPage,
}: {
  projects: Project[];
  locale?: Locale;
  initialStage?: string;
  initialPage?: number;
}) {
  const pathname = usePathname();

  const [selectedStage, setSelectedStage] = useState<ProjectStageFilter>(() =>
    stageFromParam(initialStage),
  );
  const [page, setPage] = useState(
    initialPage && initialPage > 0 ? initialPage : 1,
  );

  const syncUrl = (stage: ProjectStageFilter, nextPage: number) => {
    const params = new URLSearchParams();
    params.set("stage", stage.toLowerCase());
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    // Client-only — no RSC refetch, no loading shell.
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  };

  const isBn = locale === "bn";

  const counts = useMemo(() => {
    return {
      Completed: projects.filter(
        (p) =>
          p.status?.toLowerCase() === "completed" ||
          p.status?.toLowerCase() === "done" ||
          p.status?.toLowerCase() === "complete",
      ).length,
      Upcoming: projects.filter(
        (p) =>
          p.status?.toLowerCase() === "upcoming" ||
          p.status?.toLowerCase() === "planning",
      ).length,
      Running: projects.filter(
        (p) =>
          p.status?.toLowerCase() === "running" ||
          p.status?.toLowerCase() === "processing" ||
          p.status?.toLowerCase() === "under construction" ||
          p.status?.toLowerCase() === "in progress",
      ).length,
    };
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const pStatus = (project.status || "").toLowerCase();
      if (
        selectedStage === "Completed" &&
        pStatus !== "completed" &&
        pStatus !== "done" &&
        pStatus !== "complete"
      ) {
        return false;
      }
      if (
        selectedStage === "Upcoming" &&
        pStatus !== "upcoming" &&
        pStatus !== "planning"
      ) {
        return false;
      }
      if (
        selectedStage === "Running" &&
        pStatus !== "running" &&
        pStatus !== "processing" &&
        pStatus !== "under construction" &&
        pStatus !== "in progress"
      ) {
        return false;
      }
      return true;
    });
  }, [projects, selectedStage]);

  const handleStageChange = (stage: ProjectStageFilter) => {
    setSelectedStage(stage);
    setPage(1);
    syncUrl(stage, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    syncUrl(selectedStage, newPage);
    window.scrollTo({ top: 380, behavior: "smooth" });
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
      id: "Upcoming",
      labelEn: "Upcoming",
      labelBn: "আসন্ন",
      count: counts.Upcoming,
      icon: "layers",
      activeColor: "bg-primary text-white",
    },
    {
      id: "Running",
      labelEn: "Running",
      labelBn: "চলমান",
      count: counts.Running,
      icon: "construction",
      activeColor: "bg-primary text-white",
    },
    {
      id: "Completed",
      labelEn: "Completed",
      labelBn: "সম্পন্ন",
      count: counts.Completed,
      icon: "check",
      activeColor: "bg-primary text-white",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border/80 bg-secondary-100/80 p-1.5 shadow-xs dark:bg-card">
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
      </div>

      <div className="flex items-center border-b border-border pb-3">
        <span className="text-xs font-medium text-muted-foreground sm:text-sm">
          {isBn
            ? `মোট ${filtered.length}টি প্রজেক্ট পাওয়া গেছে`
            : `Showing ${filtered.length} ${filtered.length === 1 ? "project" : "projects"}`}
        </span>
      </div>

      {paginated.length > 0 ? (
        // Plain grid, not <Stagger> — that reveal is gated on scrolling into
        // view, and a filter/page change mounts this without a scroll event,
        // so cards could get stuck at their pre-animation opacity: 0.
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginated.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </div>
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
              ? "এই স্ট্যাটাসে কোনো প্রজেক্ট নেই।"
              : "There are no projects in this status yet."}
          </p>
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
