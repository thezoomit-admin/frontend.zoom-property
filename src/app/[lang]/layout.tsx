import type { Metadata, Viewport } from "next";

import { fontVariables } from "../fonts";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { JsonLd } from "@/components/common/json-ld";
import { ContactDock } from "@/components/layout/contact-dock";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CampaignMain } from "@/components/layout/campaign-main";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { ScrollToTop } from "@/components/motion/scroll-to-top";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/data/site";
import { LOCALES, LOCALE_TAGS } from "@/i18n/config";
import { localeAlternates } from "@/i18n/alternates";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { socialProfiles } from "@/lib/contact";
import { getLandingChrome } from "@/server/features/project-landing";
import { navLinks } from "@/lib/nav-links";
import { META_PIXEL_ID } from "@/lib/meta-pixel";
import { organizationSchema, websiteSchema } from "@/lib/seo";

import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary();

  return {
    title: {
      default: `${siteConfig.name} — ${dict.meta.tagline}`,
      template: `%s · ${siteConfig.name}`,
    },
    description: dict.meta.description,
    metadataBase: new URL(siteConfig.url),
    alternates: localeAlternates(locale, "/"),
    openGraph: {
      title: `${siteConfig.name} — ${dict.meta.tagline}`,
      description: dict.meta.description,
      url: `/${locale}`,
      siteName: siteConfig.name,
      locale: LOCALE_TAGS[locale].replace("-", "_"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} — ${dict.meta.tagline}`,
      description: dict.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

// `themeColor` belongs here, not in `metadata` — deprecated there since Next 14.
export const viewport: Viewport = {
  // Single value: the site is light-only, so there is no dark pair to declare.
  themeColor: "#ffffff",
};

/** Both locales are prerendered — no runtime locale work. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const [dict, campaigns] = await Promise.all([
    getDictionary(),
    getLandingChrome(locale),
  ]);
  const campaignHrefs = campaigns.map((row) => row.href);

  return (
    <html
      lang={LOCALE_TAGS[locale]}
      suppressHydrationWarning
      className={`${fontVariables} antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
              s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
              (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" alt="" />`,
          }}
        />
      </head>
      <body suppressHydrationWarning className="flex min-h-dvh flex-col bg-background text-foreground">
        <MetaPixel />
        {/* Site-wide entities. Page-level schemas reference these by @id. */}
        <JsonLd schema={organizationSchema(socialProfiles(dict.contact.social))} />
        <JsonLd schema={websiteSchema()} />
        <Providers>
          <ScrollProgress />
          <SiteHeader
            locale={locale}
            dict={dict.nav}
            phone={dict.contact.details.phone}
            menu={navLinks(dict.nav.menu)}
            campaigns={campaigns.map((row) => ({
              path: row.href,
              ctaLabel: row.ctaLabel,
              ctaHref: "#enquire",
              name: row.name,
              location: row.location,
              phone: row.phone,
            }))}
          />
          <CampaignMain campaignPaths={campaignHrefs}>{children}</CampaignMain>
          <SiteFooter />
          <MobileBottomNav locale={locale} campaignPaths={campaignHrefs} />
          <ContactDock />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
