import type { IconName } from "@/components/common/icon";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteConfig = {
  name: "Zoom Property",
  tagline: "Ultra-Luxury Real Estate with Uncompromising Verification",
  description:
    "Bangladesh's definitive high-end property platform. Every residence RAJUK-cleared, construction milestones tracked live, zero hidden markups.",
  url: siteUrl,
  // The phone, the email and the office addresses are not here any more. They
  // are edited in the CMS and read from `dict.contact.details`, so the number
  // in the header, the footer, the dock and the contact page is always the one
  // number — a second copy in code is how those four fall out of step.
} as const;

/**
 * Header navigation. Four items, on purpose.
 *
 * Labels live in the dictionaries, not here — `key` indexes `dict.nav`. `href`
 * is locale-less; `localeHref()` normalizes legacy locale-prefixed paths.
 */
export const mainNav = [
  { key: "properties", href: "/properties" },
  { key: "projects", href: "/projects" },
  { key: "areas", href: "/areas" },
  { key: "landowners", href: "/landowners" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
] as const;

/**
 * The footer's link columns are content now, not a list here —
 * `dict.footer.exploreLinks` and `dict.footer.serviceLinks`, each row a label
 * and a path the desk types in the panel.
 */

/**
 * The social profiles live in the CMS as well — `dict.contact.social`, a list
 * the desk adds to and deletes from, each row an icon and a link.
 * `socialProfiles()` in `lib/contact` turns it into what the footer and the
 * contact page render.
 */

/**
 * Stat values. The labels live in `dict.content.stats` in the same order —
 * numbers are not translatable, the sentences around them are.
 */
export const stats = [
  { value: 4850, suffix: " Cr+", compact: true },
  { value: 13312, suffix: "+", compact: true },
  { value: 99.4, suffix: "%" },
  { value: 32 },
];

/**
 * Feature icons, in the order of `dict.content.features`. Same split: the
 * artwork stays here, the prose is translated.
 */
export const featureIcons: IconName[] = [
  "approved",
  "gallery",
  "construction",
  "clock",
  "users",
  "check",
];

export const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    alt: "Grand double-height living salon with lake view",
    width: 1600,
    height: 1067,
    caption: "The Grand Living Salon — Lake View Residence, Gulshan 2",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
    alt: "Master suite with warm nocturnal ambient lighting",
    width: 1600,
    height: 1067,
    caption: "Master Suite with Custom Walk-in Wardrobe — Sky Duplex, Banani",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
    alt: "Italian marble kitchen island",
    width: 1600,
    height: 1067,
    caption: "Culinary Suite with Imported Quartz Countertops — Dhanmondi 27",
  },
  {
    src: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=80",
    alt: "Spa-grade travertine bathroom",
    width: 1600,
    height: 1067,
    caption: "Ensuite Spa with Freestanding Soaking Tub — Baridhara Diplomatic",
  },
  {
    src: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80",
    alt: "Private villa facade at dusk",
    width: 1600,
    height: 1067,
    caption: "Courtyard Villa Estate at Dusk — Bashundhara Block I",
  },
  {
    src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
    alt: "Skyline penthouse terrace garden",
    width: 1600,
    height: 1067,
    caption: "Sky Lounge & Terrace Garden — The Quay, Gulshan 2",
  },
];

/** Financial institutions & regulatory accreditations */
export const partners = [
  "Standard Chartered Home Finance",
  "Eastern Bank PLC (EBL)",
  "The City Bank Priority",
  "HSBC Dual-Currency NRI",
  "RAJUK Registered Developer",
  "REHAB Member #1492",
  "BUET Seismic Certified",
  "Delta Brac Housing (DBH)",
];
