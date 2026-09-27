import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";

import { baseApi } from "../../base-api";
import type { ApiEnvelope } from "../../base-api/types";
import type { LoginResult, Session, SessionUser } from "./types";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./cookies";

export { ACCESS_COOKIE, REFRESH_COOKIE, cookieOptions } from "./cookies";

/** A private, per-user read — must never enter the shared Data Cache the way
 * `baseApi`'s public reads do (that's keyed by URL, not by who's asking). */
async function authedFetch<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<ApiEnvelope<T> | null> {
  try {
    const res = await fetch(baseApi.url(path), {
      ...init,
      cache: "no-store",
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ApiEnvelope<T>;
    return json?.success ? json : null;
  } catch {
    return null;
  }
}

/** Exchanges the refresh cookie for a new access token. Read-only — does not
 * write the cookie itself, since that can only happen from a Server Action
 * or Route Handler, not an arbitrary Server Component render. */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = (await cookies()).get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;

  const res = await authedFetch<{ accessToken: string }>(
    "auth/refresh-token",
    refreshToken,
    { method: "POST" },
  );
  return res?.data?.accessToken ?? null;
}

/**
 * Is this request logged in, and as whom.
 *
 * `cache()`-wrapped so a render pass that touches this more than once (the
 * editor provider, then a page component) still asks the backend exactly
 * once. No cookie is the overwhelmingly common case — that path costs
 * nothing, not even a function call worth noticing.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  let activeToken = token;
  let res = await authedFetch<SessionUser>("user/me", activeToken);

  if (!res) {
    // Expired or otherwise rejected — try once with a freshly minted token
    // for this render. Persisting the refreshed cookie is a separate step
    // (see /api/auth/refresh), not something a render can do mid-flight.
    const refreshed = await refreshAccessToken();
    if (!refreshed) return null;
    activeToken = refreshed;
    res = await authedFetch<SessionUser>("user/me", activeToken);
    if (!res) return null;
  }

  return { user: res.data, token: activeToken };
});

export async function login(
  email: string,
  password: string,
): Promise<{ success: true; result: LoginResult } | { success: false; error: string }> {
  try {
    const res = await fetch(baseApi.url("auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => null)) as ApiEnvelope<LoginResult> | null;
    if (!res.ok || !json?.success || !json.data) {
      return { success: false, error: json?.message || "Invalid email or password" };
    }
    return { success: true, result: json.data };
  } catch {
    return { success: false, error: "Could not reach the server" };
  }
}
