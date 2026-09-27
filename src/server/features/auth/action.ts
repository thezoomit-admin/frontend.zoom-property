"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { login } from "./session";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  cookieOptions,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
} from "./cookies";

/** Only ever a same-origin path — an open redirect out of a login form is
 * exactly the kind of thing a `next` query param exists to be abused into. */
function safeNext(next: FormDataEntryValue | null, fallback: string): string {
  const value = typeof next === "string" ? next : "";
  return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const lang = String(formData.get("lang") || "en");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const outcome = await login(email, password);
  if (!outcome.success) {
    return { error: outcome.error };
  }

  const store = await cookies();
  store.set(ACCESS_COOKIE, outcome.result.token, {
    ...cookieOptions,
    maxAge: ACCESS_MAX_AGE,
  });
  store.set(REFRESH_COOKIE, outcome.result.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_MAX_AGE,
  });

  redirect(safeNext(formData.get("next"), `/${lang}`));
}

export async function logoutAction(lang: string) {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
  redirect(`/${lang}`);
}
