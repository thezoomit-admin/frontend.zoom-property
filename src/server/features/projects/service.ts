import "server-only";

import { projects as fallback, type Project } from "@/data/projects";

import { CACHE_TAGS, createResource, type QueryParams } from "../../base-api";
import { toProject } from "./mapper";
import type { ApiProject, ApiProjectDetail } from "./types";

const projects = createResource<ApiProject, Project>({
  path: "projects/public",
  tag: CACHE_TAGS.projects,
  map: toProject,
  fallback,
  sort: "order",
  slugOf: (p) => p.slug,
});

/** The developments picked for the home page. */
export async function getHomeProjects(limit = 6): Promise<Project[]> {
  const picked = await projects.query({ isHome: true, limit, sort: "order" });
  return picked ?? fallback.slice(0, limit);
}

export interface ProjectFilters {
  stage?: string;
  searchTerm?: string;
  q?: string;
  page?: number | string;
  limit?: number | string;
  area?: string;
  subArea?: string;
  city?: string;
  isFooter?: boolean;
  sort?: string;
}

/** Every live development, for `/projects`. */
export const getProjects = (params?: number | ProjectFilters) => {
  if (typeof params === "number") {
    return projects.list({ limit: params });
  }
  return projects.list(params as QueryParams);
};

/**
 * One development and the listings inside it.
 *
 * Its own read rather than `bySlug`: this endpoint answers with the project
 * *and* the units on the market inside it, so the envelope is unwrapped by
 * hand. A development switched off in the panel is not found rather than
 * rendered empty, so `/projects/[slug]` can 404 properly.
 */
export async function getProjectBySlug(
  slug: string,
): Promise<{ project: Project; listingSlugs: string[] } | null> {
  const res = await projects.raw<ApiProjectDetail>(
    `projects/public/${encodeURIComponent(slug)}`,
  );

  if (res?.data?.project) {
    return {
      project: projects.map(res.data.project),
      listingSlugs: (res.data.listings ?? []).map((l) => l.slug).filter(Boolean),
    };
  }

  const local = fallback.find((p) => p.slug === slug);
  return local ? { project: local, listingSlugs: [] } : null;
}
