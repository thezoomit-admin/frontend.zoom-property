import { toLatinDigits } from "@/lib/format";

/**
 * Normalizes any phone string (Bangla/English digits, 11-digit local, +88/88 prefixed,
 * formatted with spaces/dashes, or full URLs) into a clean, WhatsApp-compatible format.
 */
export function normalizeWhatsappNumber(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();

  // If already a full URL or wa.me link
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("wa.me/")
  ) {
    if (trimmed.startsWith("wa.me/")) return `https://${trimmed}`;
    return trimmed;
  }

  // 1. Fold any Bengali digits (০-৯) to ASCII digits (0-9)
  const latin = toLatinDigits(trimmed);

  // 2. Extract only digits
  let digits = latin.replace(/\D/g, "");
  if (!digits) return "";

  // 3. Strip international dialing prefix "00" if present
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  // 4. Bangladesh numbers normalization:
  // - Already 13 digits starting with 880 (e.g. 8801711250406) -> valid
  if (digits.startsWith("880") && digits.length === 13) {
    return digits;
  }
  // - 12 digits starting with 88 followed by 1 (e.g. 881711250406 -> 8801711250406)
  if (digits.startsWith("88") && digits.length === 12 && digits.charAt(2) === "1") {
    return `880${digits.slice(2)}`;
  }
  // - 11 digits starting with 01 (e.g. 01711250406 -> 8801711250406)
  if (digits.length === 11 && digits.startsWith("01")) {
    return `88${digits}`;
  }
  // - 10 digits starting with 1 (e.g. 1711250406 -> 8801711250406)
  if (digits.length === 10 && digits.startsWith("1")) {
    return `880${digits}`;
  }

  return digits;
}

export function telHref(phone: string) {
  if (!phone) return "";
  const latin = toLatinDigits(phone);
  const hasPlus = latin.trim().startsWith("+");
  const digits = latin.replace(/\D/g, "");
  if (!digits) return "";
  return `tel:${hasPlus ? `+${digits}` : digits}`;
}

export function whatsappHref(phone: string, text?: string) {
  if (!phone) return "";
  const normalized = normalizeWhatsappNumber(phone);
  if (!normalized) return "";

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    if (text && !normalized.includes("text=")) {
      const sep = normalized.includes("?") ? "&" : "?";
      return `${normalized}${sep}text=${encodeURIComponent(text)}`;
    }
    return normalized;
  }

  const base = `https://wa.me/${normalized}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function mailHref(email: string) {
  return `mailto:${email.trim()}`;
}

/** One row of the panel's social list. Every field is optional at runtime. */
export interface SocialProfile {
  label: string;
  href: string;
  /** A Font Awesome class string, e.g. `fa-brands fa-facebook-f`. */
  icon: string;
}

/** A link with nothing to point at is not a link. */
const isUsable = (href: unknown): href is string =>
  typeof href === "string" && href.trim().length > 0;

/**
 * The social row's accessible name, when nobody typed one.
 *
 * The host is a better guess than the position in the list: "instagram.com"
 * tells a screen-reader user where the link goes, "Link 3" tells them nothing.
 * A malformed address falls back to the plain word.
 */
const nameFromHref = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "Social link";
  }
};

/**
 * The social icons, read straight from the CMS list.
 *
 * `unknown` in, validated out. These rows are typed into a panel — a row can
 * be half-filled, and removing row 3 of 6 leaves the stored indices with a gap
 * in them, so the array arrives with holes. Everything downstream renders a
 * list of links and should not have to know that.
 *
 * Order is the order of the list in the panel. The icon is a Font Awesome
 * class string, which `Icon` recognises and draws; a row with a link but no
 * icon gets the generic chain link rather than disappearing.
 */
export function socialProfiles(rows: unknown): SocialProfile[] {
  if (!Array.isArray(rows)) return [];

  return rows.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const { icon, label, href } = row as Record<string, unknown>;
    if (!isUsable(href)) return [];

    return [
      {
        href: href.trim(),
        icon:
          typeof icon === "string" && icon.trim()
            ? icon.trim()
            : "fa-solid fa-link",
        label:
          typeof label === "string" && label.trim()
            ? label.trim()
            : nameFromHref(href.trim()),
      },
    ];
  });
}
