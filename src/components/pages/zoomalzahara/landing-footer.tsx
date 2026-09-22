import { AppContainer } from "@/components/common/app-container";
import { Icon } from "@/components/common/icon";
import { Logo } from "@/components/layout/logo";
import {
  ZOOM_AL_ZAHARA_FACEBOOK,
  ZOOM_AL_ZAHARA_PATH,
  ZOOM_AL_ZAHARA_PHONES,
} from "@/data/zoomalzahara";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { localeHref } from "@/i18n/href";
import { telHref, whatsappHref } from "@/lib/contact";

export async function LandingFooter() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const copy = dict.zoomalzahara;
  const home = localeHref(locale, ZOOM_AL_ZAHARA_PATH);
  const year = new Date().getFullYear();
  const primary = ZOOM_AL_ZAHARA_PHONES.primary;
  const secondary = ZOOM_AL_ZAHARA_PHONES.secondary;

  const links = [
    { href: "#about", label: copy.nav.about },
    { href: "#residences", label: copy.nav.residences },
    { href: "#video", label: copy.nav.video },
    { href: "#place", label: copy.nav.place },
    { href: "#enquire", label: copy.nav.enquire },
  ];

  const pill =
    "inline-flex h-8 items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2.5 text-xs font-semibold text-footer-foreground transition-colors hover:bg-white/20";

  return (
    <footer className="border-t border-footer-foreground/10 bg-footer pb-[env(safe-area-inset-bottom)] text-footer-foreground">
      <AppContainer className="py-5 sm:py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <a href={home} className="flex min-w-0 items-center gap-3">
            <Logo variant="onDark" className="h-7 w-auto" />
            <span className="min-w-0">
              <span className="block font-heading text-sm font-bold">
                {copy.hero.title}
              </span>
              <span className="block truncate text-xs text-footer-foreground/70">
                {copy.hero.location}
              </span>
            </span>
          </a>

          <nav
            aria-label={copy.hero.title}
            className="flex flex-wrap items-center gap-x-4 gap-y-1"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-semibold text-footer-foreground/75 transition-colors hover:text-brand-green-light"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-wrap gap-2">
            <a href={telHref(primary)} className={pill} aria-label={`${copy.enquire.phoneLabel} ${primary}`}>
              <Icon name="phone" size="xs" />
              {primary}
            </a>
            <a href={telHref(secondary)} className={pill} aria-label={`${copy.enquire.phoneLabel} ${secondary}`}>
              <Icon name="phone" size="xs" />
              {secondary}
            </a>
            <a
              href={whatsappHref(primary)}
              className={pill}
              aria-label={`${copy.enquire.whatsappLabel} ${primary}`}
            >
              <Icon name="whatsapp" size="xs" />
              {copy.enquire.whatsappLabel}
            </a>
            <a
              href={ZOOM_AL_ZAHARA_FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className={pill}
            >
              <Icon name="facebook" size="xs" />
              Facebook
            </a>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-footer-foreground/60">
          © {year} {copy.hero.title}
        </p>
      </AppContainer>
    </footer>
  );
}
