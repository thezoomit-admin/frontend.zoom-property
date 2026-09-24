"use server";

import { getProjects } from "./service";
import type { Project } from "@/data/projects";

/** Load projects for one sub-area after the lead gate unlocks. */
export async function fetchProjectsForSubArea(
  subAreaRefId: string,
): Promise<Project[]> {
  if (!subAreaRefId?.trim()) return [];
  return getProjects({
    subArea: subAreaRefId.trim(),
    limit: 60,
    sort: "order",
  });
}
