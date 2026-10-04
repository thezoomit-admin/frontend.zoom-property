import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { ALL_CACHE_TAGS, resolveTag } from "@/server/base-api";

/**
 * On-demand revalidation, called by the panel after a save.
 *
 * The site's pages are cached, which is the point: a visitor gets HTML that is
 * already built, with no request to the API standing between them and the
 * page. The cost of that is staleness, and this route is what removes it —
 * when the desk publishes a listing, the API posts here and Next drops exactly
 * the cached responses that carried the matching tag. The next visitor gets
 * fresh HTML; nobody waits for a rebuild.
 *
 * A tag rather than a URL because one record appears in many places. Publish a
 * project and it changes the home page, the projects index, its own page and
 * the footer — nobody should have to enumerate that list, and a list like that
 * is wrong the moment a new section is added.
 *
 * Called as:
 *   POST /api/revalidate?secret=...&tag=projects
 *   POST /api/revalidate?secret=...            (no tag: refresh everything)
 *   POST /api/revalidate?secret=...&path=/properties/some-slug
 *
 * `secret` must match `REVALIDATE_SECRET`. Without one configured the route
 * refuses every request rather than defaulting to open — an unauthenticated
 * cache-buster is a free way to make a site rebuild continuously.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    console.warn("[revalidate] refused — REVALIDATE_SECRET is not set");
    return NextResponse.json(
      { revalidated: false, message: "Revalidation is not configured." },
      { status: 501 },
    );
  }

  const params = request.nextUrl.searchParams;
  let body: { secret?: string; tag?: string; tags?: string[]; path?: string } = {};
  try {
    // The panel sends its secret in the query string; accepting a JSON body too
    // costs nothing and keeps the secret out of access logs for callers that
    // would rather post it.
    body = (await request.json()) as typeof body;
  } catch {
    /* no body, or not JSON — the query string is the other way in */
  }

  const provided = params.get("secret") ?? body.secret;
  if (provided !== secret) {
    return NextResponse.json(
      { revalidated: false, message: "Bad secret." },
      { status: 401 },
    );
  }

  const requested = [
    params.get("tag"),
    ...params.getAll("tags"),
    body.tag,
    ...(body.tags ?? []),
  ].filter((t): t is string => Boolean(t));

  // Nothing named means "something changed and the caller did not say what",
  // which is the honest default for a ping that predates tagging.
  const tags = requested.length
    ? requested.map(resolveTag).filter((t): t is string => Boolean(t))
    : [...ALL_CACHE_TAGS];

  const unknown = requested.filter((t) => !resolveTag(t));
  // `{ expire: 0 }` is "stale now": Next 16 takes a cacheLife profile here,
  // and anything longer would leave the page the desk just edited serving
  // its old HTML for the rest of that window.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  // A slug or path is a bonus, not the mechanism: it refreshes one page
  // immediately even if that page's data was not tagged.
  const path = params.get("path") ?? body.path;
  const slug = params.get("slug");
  if (path) revalidatePath(path);
  if (slug) revalidatePath(`/[lang]/${slug}`, "page");

  return NextResponse.json({
    revalidated: true,
    tags,
    ...(unknown.length ? { ignored: unknown } : {}),
    ...(path ? { path } : {}),
    ...(slug ? { slug } : {}),
    at: new Date().toISOString(),
  });
}

/** A GET is handy for checking the route is deployed and configured. */
export function GET() {
  return NextResponse.json({
    ok: true,
    configured: Boolean(process.env.REVALIDATE_SECRET),
    tags: ALL_CACHE_TAGS,
  });
}
