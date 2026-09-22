"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icon } from "@/components/common/icon";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/i18n/href";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: "grid", en: "Home", bn: "হোম" },
  { href: "/properties", icon: "building", en: "Properties", bn: "প্রপার্টি" },
  { href: "/projects", icon: "construction", en: "Projects", bn: "প্রজেক্ট" },
  { href: "/areas", icon: "location", en: "Areas", bn: "এলাকা" },
  { href: "/contact", icon: "mail", en: "Contact", bn: "যোগাযোগ" },
] as const;

export function MobileBottomNav({
  locale,
  campaign,
}: {
  locale: Locale;
  campaign?: {
    path: string;
    items: { href: string; icon: string; label: string }[];
  };
}) {
  const pathname = usePathname();
  const campaignActive = Boolean(campaign && pathname.includes(campaign.path));
  const items = campaignActive
    ? campaign!.items
    : navItems.map((item) => ({
        href: localeHref(locale, item.href),
        icon: item.icon,
        label: locale === "bn" ? item.bn : item.en,
      }));

  return (
    <nav
      aria-label={locale === "bn" ? "মোবাইল নেভিগেশন" : "Mobile navigation"}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between">
        {items.map((item) => {
          const active = campaignActive
            ? false
            : item.href.endsWith("/") || item.href.split("/").filter(Boolean).length <= 1
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          const className = cn(
            "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium transition-colors",
            active ? "text-primary" : "text-muted-foreground hover:text-foreground",
          );

          const inner = (
            <>
              <span className={cn("flex size-8 items-center justify-center rounded-lg transition-colors", active && "bg-primary/10")}>
                <Icon name={item.icon} size="sm" />
              </span>
              <span className="truncate">{item.label}</span>
            </>
          );

          return campaignActive ? (
            <a key={item.href} href={item.href} className={className}>
              {inner}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={className}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
