"use server";

import { revalidateTag } from "next/cache";

import { baseApi, CACHE_TAGS } from "../../base-api";
import type { ApiEnvelope } from "../../base-api/types";
import { getSession } from "../auth/session";
import type { LandingSectionKey } from "./types";

/**
 * Saves one section of a project landing page.
 *
 * The backend's PATCH replaces the whole section subdocument — it is not a
 * deep merge (`$set[section] = body`) — so `sectionBody` must be the
 * complete current object for that section (every field the form loaded,
 * not just the ones the user touched), or the untouched fields disappear.
 * The section-field components are responsible for round-tripping the full
 * object; this action just sends whatever they hand it.
 *
 * Authorization is the backend's job, not this function's: `checkPermission
 * ("Projects","update")` is what actually decides whether the save is
 * allowed. A session that exists but lacks that permission gets a 403 here,
 * which becomes a plain error message in the modal — this code does not try
 * to predict that outcome in advance.
 */
export async function saveLandingSection(
  projectId: string,
  section: LandingSectionKey,
  sectionBody: Record<string, unknown>,
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  try {
    const res = await fetch(
      baseApi.url(`projects/${encodeURIComponent(projectId)}/landing/${encodeURIComponent(section)}`),
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(sectionBody),
        cache: "no-store",
      },
    );
    const json = (await res.json().catch(() => null)) as ApiEnvelope<unknown> | null;
    if (!res.ok || !json?.success) {
      return { success: false, error: json?.message || "Could not save this section" };
    }
  } catch {
    return { success: false, error: "Could not reach the server" };
  }

  // Same tag the public read is cached under — the landing page (and
  // anywhere else it's embedded) picks up the change on next request.
  revalidateTag(CACHE_TAGS.projects, { expire: 0 });
  return { success: true };
}

/**
 * Saves the "publishing" meta-section of a project landing page:
 * isActive, path, phone numbers, SEO meta, and nav labels.
 *
 * The backend accepts "publishing" as a valid PATCH section key
 * (see LANDING_PATCH_SECTIONS in the server module).
 */
export async function savePublishing(
  projectId: string,
  body: Record<string, unknown>,
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Your session has expired. Please sign in again." };
  }

  try {
    const res = await fetch(
      baseApi.url(`projects/${encodeURIComponent(projectId)}/landing/publishing`),
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );
    const json = (await res.json().catch(() => null)) as ApiEnvelope<unknown> | null;
    if (!res.ok || !json?.success) {
      return { success: false, error: json?.message || "Could not save publishing settings" };
    }
  } catch {
    return { success: false, error: "Could not reach the server" };
  }

  revalidateTag(CACHE_TAGS.projects, { expire: 0 });
  return { success: true };
}
