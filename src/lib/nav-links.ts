/** One row of a navigation list, as the panel stores it. */
export interface NavLink {
  label: string;
  href: string;
}

/**
 * Nav items the desk has retired from the header but not deleted from the
 * panel's stored rows — dropped here instead, so re-adding one is a CMS edit
 * again rather than a code change.
 */
const RETIRED_NAV_PATHS = new Set([
  "properties",
  "projects",
  "areas",
  "landowners",
  "blog",
]);

/**
 * True when a chrome link points at a retired section.
 * Paths may be absolute (`/blog`) or locale-prefixed (`/bn/blog`).
 */
function isRetiredHref(href: string): boolean {
  const path = href.trim().split(/[?#]/)[0].replace(/\/+$/, "").toLowerCase();
  const segment = path.replace(/^\/(en|bn)(?=\/|$)/, "") || "/";
  return RETIRED_NAV_PATHS.has(segment.replace(/^\//, ""));
}

/**
 * The usable rows of a navigation list.
 *
 * `unknown` in, validated out. These rows are typed into a panel, so a row can
 * be half-filled \u2014 and removing row 3 of 6 leaves the stored indices with a
 * gap, which arrives here as a hole in the array. A menu renders a list of
 * links and should not have to know any of that.
 *
 * A row needs both halves: a label with no destination is text pretending to
 * be a link, and a destination with no label is invisible.
 * Retired sections (see `RETIRED_NAV_PATHS`) are dropped even if the panel
 * still has a row for one.
 */
export function navLinks(rows: unknown): NavLink[] {
  if (!Array.isArray(rows)) return [];

  return rows.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const { label, href } = row as Record<string, unknown>;
    if (typeof label !== "string" || !label.trim()) return [];
    if (typeof href !== "string" || !href.trim()) return [];
    if (isRetiredHref(href)) return [];
    return [{ label: label.trim(), href: href.trim() }];
  });
}

/** One cell of the contact dock: an icon, where it goes, and what it is called. */
export interface DockLink {
  icon: string;
  label: string;
  href: string;
}

/**
 * The dock's cells.
 *
 * Same validation as a nav list, plus the icon. `href` is written in full by
 * the desk \u2014 `tel:`, `mailto:`, a `wa.me` address \u2014 because the dock is a
 * strip of whatever channels the firm actually answers, not a fixed three.
 */
export function dockLinks(rows: unknown): DockLink[] {
  if (!Array.isArray(rows)) return [];

  return rows.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const { icon, label, href } = row as Record<string, unknown>;
    if (typeof href !== "string" || !href.trim()) return [];
    return [
      {
        href: href.trim(),
        icon:
          typeof icon === "string" && icon.trim() ? icon.trim() : "fa-solid fa-link",
        label: typeof label === "string" ? label.trim() : "",
      },
    ];
  });
}
