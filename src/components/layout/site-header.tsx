"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";

import { AppContainer } from "@/components/common/app-container";
import { Icon } from "@/components/common/icon";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/data/site";
import type { NavLink } from "@/lib/nav-links";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/i18n/href";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { telHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

/**
 * Only the strings the bar itself prints.
 *
 * Named one by one rather than `Record<string, string>`: the menu is a list of
 * its own now, and a loose index signature made the whole `nav` block
 * unassignable the moment one of its entries stopped being a string.
 */
type NavDict = {
  contact: string;
  bookViewing: string;
  openMenu: string;
  language: string;
};

/**
 * Sticky header.
 *
 * Two visual states. Over the home page's photographic hero it is transparent
 * and its contents are forced to the white treatment; everywhere else — and as
 * soon as you scroll — it sits on the background token and uses normal
 * foreground colours. Without that split the light theme puts near-black text
 * on a dark photograph.
 *
 * Strings arrive as a prop because this is a Client Component and cannot call
 * `getDictionary()` itself. The desk number comes down the same way, so the
 * call button here shows whatever the CMS holds rather than a second copy.
 */
export function SiteHeader({
  locale,
  dict,
  phone,
  menu,
  campaign,
}: {
  locale: Locale;
  dict: NavDict;
  phone: string;
  /** The menu itself, edited in the panel. Empty and no bar is drawn. */
  menu: NavLink[];
  /** In-page nav used on a campaign landing (e.g. Zoom Al Zahara). */
  campaign?: {
    path: string;
    links: NavLink[];
    ctaLabel: string;
    ctaHref: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const { direction, scrolledPast } = useScrollDirection();
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const lenis = useLenis();

  /**
   * Hidden only while scrolling down *and* past the pin distance, so a small
   * flick near the top never pulls the navigation away.
   */
  const hidden = direction === "down" && scrolledPast;

  /**
   * Pause smooth scrolling while the mobile sheet is open.
   *
   * Radix locks the page with `overflow: hidden`, but Lenis drives the scroll
   * position itself via `window.scrollTo`, so that lock does nothing to it —
   * the page kept scrolling behind an open menu. Lenis has to be told
   * separately.
   */
  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
    // Leave scrolling enabled if the header unmounts while the sheet is open.
    return () => lenis.start();
  }, [open, lenis]);

  const campaignActive = Boolean(campaign && pathname.includes(campaign.path));
  const home = localeHref(locale, campaignActive ? campaign!.path : "/");
  const navItems = campaignActive ? campaign!.links : menu;
  const ctaHref = campaignActive ? campaign!.ctaHref : localeHref(locale, "/contact");
  const ctaLabel = campaignActive ? campaign!.ctaLabel : dict.bookViewing;
  const hideOnScroll = campaignActive ? false : hidden;

  return (
    <motion.header
      initial={false}
      animate={{ y: hideOnScroll ? "-100%" : "0%" }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : hideOnScroll
            ? { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }
            : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }
      }
      style={{ willChange: "transform" }}
      /* Solid white in every state, including over the home page's hero
         image. A translucent bar took its colour from whatever photograph
         happened to be behind it, so the wordmark and the nav changed contrast
         as the hero rotated. White is the one ground the brand logo is drawn
         for. */
      className="fixed inset-x-0 top-0 z-40 border-b border-border/80 bg-background shadow-xs"
    >

      {/* 54 / 70 rather than the 64 / 80 it used to be: ten pixels off both,
          which the logo and the controls had to spare. Nothing offsets against
          these numbers — the hero and the page banners clear the bar with
          their own generous top padding — so this is a safe trim. */}
      <AppContainer className="relative flex h-[54px] items-center justify-between gap-4 sm:h-[70px]">
        {/* `flex items-center`, not just `shrink-0`: the lockup is an
            inline-flex box, so in a plain anchor it sat on the text baseline
            and the line box reserved descender space under it — which pushed
            the logo a couple of pixels above the true centre of the bar.
            Making the link a flex box takes it off the baseline entirely. */}
        <Link
          href={home}
          aria-label={siteConfig.name}
          className="flex shrink-0 items-center"
        >
          <Logo
            priority
            variant="auto"
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex">
          {navItems.map((item) => {
            const href = campaignActive ? item.href : localeHref(locale, item.href);
            const active =
              !campaignActive && (pathname === href || pathname.startsWith(`${href}/`));
            const className = cn(
              "relative flex items-center justify-center rounded-lg px-3.5 py-2 text-sm transition-all duration-200",
              active
                ? "bg-primary/[0.08] font-semibold text-primary"
                : "font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            );
            return campaignActive ? (
              <a key={`${item.href}-${item.label}`} href={href} className={className}>
                <span>{item.label}</span>
              </a>
            ) : (
              <Link key={`${item.href}-${item.label}`} href={href} className={className}>
                <span>{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-primary shadow-xs"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          {/* whitespace-nowrap keeps the number on one line at every width. */}
          <a
            href={telHref(phone)}
            className="hidden items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted xl:flex"
          >
            <Icon name="phone" size="xs" />
            {phone}
          </a>

          <LanguageSwitcher
            locale={locale}
            label={dict.language}
            onDark={false}
          />

          <Button size="lg" className="ml-1 hidden font-medium sm:inline-flex" asChild>
            {campaignActive ? (
              <a href={ctaHref}>{ctaLabel}</a>
            ) : (
              <Link href={ctaHref}>{ctaLabel}</Link>
            )}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label={dict.openMenu}
                className="lg:hidden"
              >
                <Icon name="menu" size="sm" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-6">
              <SheetHeader className="border-b border-border pb-4 text-left">
                <SheetTitle>
                  <Logo className="h-8 w-auto" />
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 py-4">
                {navItems.map((item) => {
                  const href = campaignActive ? item.href : localeHref(locale, item.href);
                  const active =
                    !campaignActive && (pathname === href || pathname.startsWith(`${href}/`));
                  const className = cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition-all",
                    active
                      ? "bg-primary/[0.08] font-semibold text-primary border-l-4 border-primary pl-3"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium",
                  );
                  return campaignActive ? (
                    <a
                      key={`${item.href}-${item.label}`}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={className}
                    >
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      key={`${item.href}-${item.label}`}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={className}
                    >
                      <span>{item.label}</span>
                      {active && <span className="size-1.5 rounded-full bg-primary" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex flex-col gap-3 border-t border-border pt-4">
                  <a
                    href={telHref(phone)}
                    className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-border py-2.5 text-sm font-medium text-foreground"
                  >
                    <Icon name="phone" size="xs" />
                    {phone}
                  </a>
                <Button size="lg" className="w-full" style={{ height: "42px" }} asChild>
                  {campaignActive ? (
                    <a href={ctaHref} onClick={() => setOpen(false)}>
                      {ctaLabel}
                    </a>
                  ) : (
                    <Link href={ctaHref} onClick={() => setOpen(false)}>
                      {ctaLabel}
                    </Link>
                  )}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </AppContainer>
    </motion.header>
  );
}
