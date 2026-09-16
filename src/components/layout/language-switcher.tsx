"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/common/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_TAGS,
  localizePath,
  type Locale,
} from "@/i18n/config";
import { cn } from "@/lib/utils";

const LOCALE_FLAGS: Record<Locale, string> = {
  bn: "🇧🇩",
  en: "🇬🇧",
};

/**
 * Language switcher.
 *
 * Real `<Link>`s, not a router.push — each language is a distinct URL, so the
 * menu items should be crawlable and middle-clickable. `localizePath` swaps only
 * the locale segment, so switching keeps you on the page you were reading
 * instead of dumping you on the home page.
 *
 * `hrefLang` on each item tells crawlers what they point at, matching the
 * hreflang set the layout emits.
 */
export function LanguageSwitcher({
  locale,
  label,
  onDark = false,
}: {
  locale: Locale;
  label: string;
  onDark?: boolean;
}) {
  const pathname = usePathname();

  return (
    // `modal={false}`: a language menu is not a modal. Left on the default,
    // Radix locks body scroll while it is open, which removes the scrollbar —
    // the page then gets ~8px wider and the fixed header visibly jumps. It also
    // has no business trapping focus or blocking the page behind it.
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={label}
        className={cn(
          "flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors",
          onDark
            ? "text-white/85 hover:bg-white/10 hover:text-white"
            : "text-foreground hover:bg-muted",
        )}
      >
        <span aria-hidden="true" className="text-base leading-none">
          {LOCALE_FLAGS[locale]}
        </span>
        <span className="hidden sm:inline">{LOCALE_LABELS[locale].native}</span>
        <Icon name="chevronDown" size="xs" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
        {LOCALES.map((code) => (
          <DropdownMenuItem key={code} asChild>
            <Link
              href={localizePath(pathname, code)}
              hrefLang={LOCALE_TAGS[code]}
              lang={LOCALE_TAGS[code]}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3",
                code === locale && "font-semibold",
              )}
            >
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="text-base leading-none">
                  {LOCALE_FLAGS[code]}
                </span>
                {LOCALE_LABELS[code].native}
              </span>
              {code === locale ? <Icon name="check" size="xs" /> : null}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
