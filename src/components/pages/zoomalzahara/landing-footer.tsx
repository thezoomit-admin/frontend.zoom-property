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
    { href: "#elevation", label: copy.nav.elevation },
    { href: "#video", label: copy.nav.video },
    { href: "#place", label: copy.nav.place },
    { href: "#enquire", label: copy.nav.enquire },
  ];

  return (
    <footer className="border-t border-footer-foreground/10 bg-footer pb-[calc(4.5rem+env(safe-area-inset-bottom))] text-footer-foreground lg:pb-0">
      <AppContainer className="py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-4">
            <a href={home} aria-label={copy.hero.title} className="w-fit">
              <Logo variant="onDark" className="h-9 w-auto" />
            </a>
            <p className="font-heading text-lg font-bold">{copy.hero.title}</p>
            <p className="max-w-md text-sm leading-relaxed text-footer-foreground/75">
              {copy.hero.location}
            </p>
            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap sm:gap-3">
              <a
                href={telHref(primary)}
                className="inline-flex items-center gap-2 text-sm hover:text-brand-green-light"
              >
                <Icon name="phone" size="xs" />
                {primary}
              </a>
              <a
                href={telHref(secondary)}
                className="inline-flex items-center gap-2 text-sm hover:text-brand-green-light"
              >
                <Icon name="phone" size="xs" />
                {secondary}
              </a>
              <a
                href={whatsappHref(primary)}
                className="inline-flex items-center gap-2 text-sm hover:text-brand-green-light"
              >
                <Icon name="whatsapp" size="xs" />
                {copy.enquire.whatsappLabel}
              </a>
              <a
                href={ZOOM_AL_ZAHARA_FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm hover:text-brand-green-light"
              >
                <Icon name="facebook" size="xs" />
                Facebook
              </a>
            </div>
          </div>

          <nav aria-label={copy.hero.title} className="grid grid-cols-2 gap-x-6 gap-y-2.5 self-end">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-footer-foreground/75 transition-colors hover:text-brand-green-light"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </AppContainer>

      <div className="border-t border-footer-foreground/10">
        <AppContainer className="py-4">
          <p className="text-xs text-footer-foreground/60">
            © {year} {copy.hero.title}
          </p>
        </AppContainer>
      </div>
    </footer>
  );
}
