import { AppContainer } from "@/components/common/app-container";
import { Icon } from "@/components/common/icon";
import { Logo } from "@/components/layout/logo";
import { localeHref } from "@/i18n/href";
import { getLocale } from "@/i18n/dictionaries";
import { telHref, whatsappHref } from "@/lib/contact";
import type { LandingChrome } from "@/server/features/project-landing/types";

export async function LandingFooter({ chrome }: { chrome: LandingChrome }) {
  const locale = await getLocale();
  const home = localeHref(locale, chrome.href);
  const primary = chrome.phone;

  const pill =
    "inline-flex h-8 items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2.5 text-xs font-semibold text-footer-foreground transition-colors hover:bg-white/20";

  return (
    <footer className="border-t border-footer-foreground/10 bg-footer pb-[calc(3.5rem+env(safe-area-inset-bottom))] text-footer-foreground lg:pb-[env(safe-area-inset-bottom)]">
      <AppContainer className="py-5 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a href={home} className="flex min-w-0 items-center gap-3">
            <Logo variant="onDark" className="h-7 w-auto" />
            <span className="min-w-0">
              {chrome.name ? (
                <span className="block font-heading text-sm font-extrabold">
                  {chrome.name}
                </span>
              ) : null}
              {chrome.location ? (
                <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-footer-foreground/70">
                  <Icon name="fa-location-dot" size="xs" />
                  <span className="truncate">{chrome.location}</span>
                </span>
              ) : null}
            </span>
          </a>

          <div className="flex flex-wrap gap-2">
            {primary ? (
              <a
                href={telHref(primary)}
                className={pill}
                aria-label={`${chrome.phoneLabel} ${primary}`}
              >
                <Icon name="phone" size="xs" />
                {primary}
              </a>
            ) : null}
            {chrome.whatsapp ? (
              <a
                href={whatsappHref(chrome.whatsapp)}
                className={pill}
                aria-label={`${chrome.whatsappLabel} ${chrome.whatsapp}`}
              >
                <Icon name="whatsapp" size="xs" />
                {chrome.whatsappLabel}
              </a>
            ) : null}
            {chrome.facebookUrl ? (
              <a
                href={chrome.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={pill}
              >
                <Icon name="facebook" size="xs" />
                Facebook
              </a>
            ) : null}
          </div>
        </div>
      </AppContainer>
    </footer>
  );
}
