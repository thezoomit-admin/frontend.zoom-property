/** Public path for a project campaign landing. */
export function landingHref(path: string) {
  const clean = String(path || "")
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
  if (!clean) return "/";
  if (clean === "zoomalzahara") return "/zoomalzahara";
  return `/p/${clean}`;
}

/** True when the current URL is this campaign landing. */
export function isLandingPath(pathname: string, pathOrHref: string) {
  const href = pathOrHref.startsWith("/") ? pathOrHref : landingHref(pathOrHref);
  if (!href || href === "/") return false;
  return pathname === href || pathname.includes(href);
}

export function matchLanding<T extends { href: string; path?: string }>(
  pathname: string,
  rows: T[],
) {
  return rows.find((row) => isLandingPath(pathname, row.href || row.path || ""));
}
