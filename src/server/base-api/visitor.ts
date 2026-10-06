import "server-only";

import { headers } from "next/headers";

/**
 * Who the API should rate-limit: the visitor, not this server.
 *
 * Server actions call the API from the Next.js host, so without this every
 * visitor shares one IP and one bucket — five enquiries an hour for the whole
 * site. The visitor's address rides along in `X-Visitor-IP`, vouched for by
 * `X-Internal-Secret` (shared with the API's INTERNAL_API_SECRET); the API
 * ignores the IP header on any request without the secret, so a browser
 * cannot pick its own bucket.
 *
 * Request-time only: call it from a server action or route handler, never
 * from a cached read — `headers()` would make the page dynamic.
 */
// Same value as `internal_api_secret` in the API's config. `server-only`
// above keeps it out of the browser bundle.
const SECRET =
  "fbe014a9fa499c214efbd4502bf56c9e63bb716804377d807c6d42c6b7dd1541";

/** The proxy's view of the client: `x-real-ip`, else the first forwarded hop. */
function readVisitorIp(list: Headers): string | null {
  const real = list.get("x-real-ip")?.trim();
  if (real) return real;
  const forwarded = list.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || null;
}

/**
 * Secret only — for the site's own cached reads. Constant, so it never
 * changes a fetch's cache key, and the API exempts it from the per-IP
 * baseline limit (one bucket for every visitor's page render otherwise).
 */
export function internalHeaders(): Record<string, string> {
  return SECRET ? { "X-Internal-Secret": SECRET } : {};
}

export async function visitorHeaders(): Promise<Record<string, string>> {
  if (!SECRET) return {};
  const ip = readVisitorIp(await headers());
  return ip
    ? { "X-Internal-Secret": SECRET, "X-Visitor-IP": ip }
    : { "X-Internal-Secret": SECRET };
}
