import type { Metadata } from "next";

import { LoginForm } from "@/components/pages/login/login-form";
import type { Locale } from "@/i18n/config";

/** Never linked from nav/header — reachable only by typing the URL. Kept out
 * of search results and link-following the same way. */
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ lang }, { next }] = await Promise.all([params, searchParams]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/30 px-4">
      <LoginForm lang={lang} next={next} />
    </div>
  );
}
