import Link from "next/link";
import { headers } from "next/headers";

import { Icon } from "@/components/common/icon";
import { AppContainer } from "@/components/common/app-container";
import { Logo } from "@/components/layout/logo";
import { Text } from "@/components/common/text";
import { LandingFooter } from "@/components/pages/zoomalzahara/landing-footer";
import { getProjects } from "@/server/features/projects";
import { getLandingChrome } from "@/server/features/project-landing";
import { matchLanding } from "@/lib/landing";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeHref } from "@/i18n/href";
import { footerLinks } from "@/lib/footer-links";
import { mailHref, socialProfiles, telHref } from "@/lib/contact";
import { PATHNAME_HEADER } from "@/lib/not-found";

/**
 * Footer.
 *
 * Sits on `--footer`, the guideline's charcoal secondary rather than the
 * primary green, so the page closes off rather than just repeating the button
 * colour. It is also the ground the guideline shows its reversed logo on. Nothing here
 * uses the foreground / muted-foreground tokens — those resolve to near-black
 * in the light palette and would be unreadable — so text is `footer-foreground`
 * at full strength (8.3:1 on the charcoal; the 60% it used to be measured
 * 4.21:1 and failed AA), and the logo uses the white lockup. Links hover to the
 * guideline's light green, since white-on-white would leave them with no hover
 * state at all.
 *
 * Three columns rather than four, and no newsletter form — it was asking for an
 * email before the visitor had a reason to give one, and it squeezed the
 * contact details into a cramped column.
 */
export async function SiteFooter() {
  const pathname = (await headers()).get(PATHNAME_HEADER) ?? "";
  const locale = await getLocale();
  const chrome = matchLanding(pathname, await getLandingChrome(locale));
  if (chrome) {
    return <LandingFooter chrome={chrome} />;
  }

  // The project column is whatever is published, not a list typed in here:
  // a footer that still advertises a delivered project is worse than one with
  // a shorter column. Four, because that is what the column has room for.
  const [dict, projects] = await Promise.all([
    getDictionary(),
    getProjects({ isFooter: true, limit: 6, sort: "order" }),
  ]);
  const footerProjects = projects
    .filter((project) => project.isFooter !== false)
    .slice(0, 6);
  const t = dict.footer;
  /**
   * The two link columns.
   *
   * The list lives in the database rather than in the site's dictionary, and
   * that is deliberate: an empty box in the panel means "unchanged", so a
   * built-in default can be renamed but never removed. Owning the list makes
   * the remove button in the panel do what it says.
   *
   * `footerLinks` drops half-filled rows and the gap a removed row leaves, so
   * a column is whatever survives. A column with nothing in it is not drawn.
   */
  const columns = [
    { heading: t.explore, links: footerLinks(t.exploreLinks) },
    { heading: t.services, links: footerLinks(t.serviceLinks) },
  ].filter((column) => column.links.length);
  // Same source as the contact page: one edit in the panel moves the
  // number in both places, which is the only way a phone number on two
  // pages stays the same phone number.
  const d = dict.contact.details;
  const socials = socialProfiles(dict.contact.social);

  return (
    <footer className="border-t border-footer-foreground/10 bg-footer pb-[calc(4.5rem+env(safe-area-inset-bottom))] text-footer-foreground lg:pb-0">
      <AppContainer className="py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="flex max-w-md flex-col gap-5">
            <Link href={localeHref(locale, "/")} aria-label={t.companyName}>
              {/* White lockup — the navy one would vanish into the background. */}
              <Logo variant="onDark" className="h-9 w-auto" />
            </Link>

            <Text
              size="sm"
              className="max-w-sm leading-relaxed text-footer-foreground/75"
            >
              {dict.meta.description}
            </Text>

            {/* Contact rows. Each icon sits in a small brand-green tile so
                the three ways to reach the desk read as one clear block —
                the icons are the anchor, not a faded decoration. */}
            <div className="flex flex-col gap-3 border-t border-footer-foreground/10 pt-5">
              <a
                href={telHref(d.phone)}
                className="group flex w-fit items-center gap-3 whitespace-nowrap text-sm text-footer-foreground transition-colors hover:text-brand-green-light"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-[0_4px_10px_-4px_rgba(75,128,45,0.6)] transition-colors group-hover:bg-brand-green">
                  <Icon name={t.phoneIcon} size="sm" />
                </span>
                {d.phone}
              </a>
              <a
                href={mailHref(d.email)}
                className="group flex w-fit items-center gap-3 break-all text-sm text-footer-foreground transition-colors hover:text-brand-green-light"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-[0_4px_10px_-4px_rgba(75,128,45,0.6)] transition-colors group-hover:bg-brand-green">
                  <Icon name={t.emailIcon} size="sm" />
                </span>
                {d.email}
              </a>
              <span className="flex items-start gap-3 text-sm text-footer-foreground/90">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-[0_4px_10px_-4px_rgba(75,128,45,0.6)]">
                  <Icon name={t.addressIcon} size="sm" />
                </span>
                <span className="pt-2">{d.dhakaAddress}</span>
              </span>
            </div>

            {/* Social row. Same tile language as the contact icons above —
                filled, rounded, white glyph — so the whole block reads as
                one set. Resting tile is a quiet white wash on the charcoal;
                hover fills it primary and lifts it a touch. */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex size-10 items-center justify-center rounded-lg bg-footer-foreground/10 text-footer-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-[0_6px_14px_-6px_rgba(75,128,45,0.6)]"
                >
                  <Icon name={social.icon} size="sm" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} className="flex flex-col gap-4">
              <h3 className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-footer-foreground">
                {column.heading}
              </h3>
              <div className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <Link
                    key={`${link.href}-${link.label}`}
                    href={localeHref(locale, link.href)}
                    className="text-sm text-footer-foreground/75 transition-colors hover:text-brand-green-light"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          ))}

          {/* Projects get their own column rather than a link to the index:
              there are three of them, they are what the company is actually
              building, and the fourth column was empty without them. */}
          <nav className="flex flex-col gap-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-footer-foreground">
              {dict.nav.projects}
            </h3>
            <div className="flex flex-col gap-2.5">
              {footerProjects.map((project) => (
                <Link
                  key={project.id}
                  href={localeHref(locale, `/projects/${project.slug}`)}
                  className="text-sm text-footer-foreground/75 transition-colors hover:text-brand-green-light"
                >
                  {locale === "bn" && project.nameBn ? project.nameBn : project.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </AppContainer>

      {/* Slim bottom bar: one line of small print, so it gets a hairline rule
          and just enough padding to clear the text — not another section. */}
      <div className="border-t border-footer-foreground/10">
        <AppContainer className="flex flex-col items-center justify-between gap-3 py-4 text-footer-foreground/60 sm:flex-row">
          <Text size="xs" tone="inverse" className="text-footer-foreground/60">
            © {new Date().getFullYear()} {t.companyName} {t.rights}
          </Text>
          {/* The legal pages sit in the bottom bar rather than a nav column:
              they are read once, on purpose, by someone looking for them. */}
          <div className="flex items-center gap-4">
            <Link
              href={localeHref(locale, "/terms")}
              className="text-xs text-footer-foreground/60 transition-colors hover:text-brand-green-light"
            >
              {t.terms}
            </Link>
            <Link
              href={localeHref(locale, "/privacy")}
              className="text-xs text-footer-foreground/60 transition-colors hover:text-brand-green-light"
            >
              {t.privacy}
            </Link>
          </div>
        </AppContainer>
      </div>
    </footer>
  );
}
