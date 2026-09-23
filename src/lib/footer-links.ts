/** One row of a footer link column, as the panel stores it. */
export interface FooterLink {
  label: string;
  href: string;
}

function isPropertiesHref(href: string): boolean {
  const path = href.trim().split(/[?#]/)[0].replace(/\/+$/, "").toLowerCase();
  return (
    path === "/properties" ||
    path.endsWith("/properties") ||
    /^\/(en|bn)\/properties$/.test(path)
  );
}

/**
 * The usable rows of a footer column.
 *
 * `unknown` in, validated out. These rows are typed into a panel, so a row can
 * be half-filled — and removing row 3 of 5 leaves the stored indices with a
 * gap, which arrives here as a hole in the array. The footer renders a list of
 * links and should not have to know any of that.
 *
 * A row needs both halves to be a link: a label with no destination is text
 * pretending to be a link, and a destination with no label is invisible.
 * Properties catalogue links are dropped — retired from site chrome.
 */
export function footerLinks(rows: unknown): FooterLink[] {
  if (!Array.isArray(rows)) return [];

  return rows.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const { label, href } = row as Record<string, unknown>;
    if (typeof label !== "string" || !label.trim()) return [];
    if (typeof href !== "string" || !href.trim()) return [];
    if (isPropertiesHref(href)) return [];
    return [{ label: label.trim(), href: href.trim() }];
  });
}
