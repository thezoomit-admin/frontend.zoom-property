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
  const primary = ZOOM_AL_ZAHARA_PHONES.primary;

  const pill =
    "inline-flex h-8 items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2.5 text-xs font-semibold text-footer-foreground transition-colors hover:bg-white/20";

  return (
    <footer className="border-t border-footer-foreground/10 bg-footer pb-[env(safe-area-inset-bottom)] text-footer-foreground">
      <AppContainer className="py-5 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a href={home} className="flex min-w-0 items-center gap-3">
            <Logo variant="onDark" className="h-7 w-auto" />
            <span className="min-w-0">
              <span className="block font-heading text-sm font-extrabold">
                {copy.hero.title}
              </span>
              <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-footer-foreground/70">
                <Icon name="fa-location-dot" size="xs" />
                <span className="truncate">{copy.hero.location}</span>
              </span>
            </span>
          </a>

          <div className="flex flex-wrap gap-2">
            <a href={telHref(primary)} className={pill} aria-label={`${copy.enquire.phoneLabel} ${primary}`}>
              <Icon name="phone" size="xs" />
              {primary}
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
      </AppContainer>
    </footer>
  );
}
