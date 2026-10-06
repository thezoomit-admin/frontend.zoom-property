import { AppContainer } from "@/components/common/app-container";
import { ContactCtaModal } from "@/components/common/contact-cta-modal";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getLeadAreaOptions } from "@/server/features/areas";

export async function ContactCta({
  tone = "primary",
  noBackground = false,
  className = "",
}: {
  tone?: "primary" | "surface";
  noBackground?: boolean;
  className?: string;
}) {
  const locale = await getLocale();
  const [dict, areaOptions] = await Promise.all([
    getDictionary(),
    getLeadAreaOptions(locale, 60),
  ]);
  const cta = dict.cta;
  const f = dict.contact.form;

  const isSurface = tone === "surface";

  return (
    <section
      className={`pt-0 pb-8 sm:pb-12 lg:pb-16 ${className}`}
    >
      <AppContainer>
        <div
          className={
            isSurface
              ? `flex flex-col items-center gap-6 rounded-lg border border-primary/20 ${noBackground ? "bg-primary/5" : "bg-card"} px-5 py-7 text-center text-foreground sm:rounded-2xl sm:px-10 sm:py-10`
              : "flex flex-col items-center gap-6 rounded-lg border border-white/20 bg-primary px-5 py-7 text-center text-primary-foreground sm:rounded-2xl sm:px-10 sm:py-10"
          }
        >
          <div className="flex flex-col items-center">
            <h2 className="max-w-lg font-heading text-3xl font-bold leading-tight sm:text-4xl">
              {cta.title}
            </h2>
            <p
              className={
                isSurface
                  ? "mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
                  : "mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base"
              }
            >
              {cta.description}
            </p>
          </div>
          <ContactCtaModal
            label={cta.contact}
            title={cta.modalTitle}
            description={cta.modalDescription}
            href={cta.link}
            areas={areaOptions}
            leadDict={{
              name: f.name,
              namePlaceholder: f.namePlaceholder,
              phone: f.phone,
              email: f.email,
              location: locale === "bn" ? "ঠিকানা/শহর" : "Address/City",
              locationPlaceholder: f.locationPlaceholder,
              area: f.area,
              areaAny: f.areaAny,
              subArea: f.subArea,
              subAreaAny: f.subAreaAny,
              subAreaPickArea: f.subAreaPickArea,
              message: locale === "bn" ? "নোট" : "Notes",
              messagePlaceholder: f.messagePlaceholder,
              submit: locale === "bn" ? "জমা দিন" : "Submit",
              submitting: f.submitting,
              privacy: f.privacy,
              successTitle: f.successTitle,
              successBody: f.successBody,
            }}
            buttonClassName={
              isSurface
                ? "inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-heading text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 sm:w-auto"
                : "inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-foreground px-5 py-3 font-heading text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5 sm:w-auto"
            }
          />
        </div>
      </AppContainer>
    </section>
  );
}
