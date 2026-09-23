import type { Metadata } from "next";

import { Heading } from "@/components/common/heading";
import { Icon, type IconName } from "@/components/common/icon";
import { JsonLd } from "@/components/common/json-ld";
import { Section } from "@/components/common/section";
import { Text } from "@/components/common/text";
import { PageHeader } from "@/components/layout/page-header";
import { pageBanners } from "@/data/page-banners";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/pages/contact/contact-form";
import { FaqSection } from "@/components/pages/shared/faq-section";
import { areas } from "@/data/areas";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getBudgetOptions } from "@/server/features/budget-ranges/service";
import { localeAlternates } from "@/i18n/alternates";
import {
  mailHref,
  socialProfiles,
  telHref,
  whatsappHref,
} from "@/lib/contact";
import { faqSchema } from "@/lib/seo";

const DHAKA_OFFICE_MAP_URL = "https://www.google.com/maps/place/ZOOM+IT+Work+Station/@23.7453343,90.3469321,17z/data=!4m14!1m7!3m6!1s0x3755bf7ff7d6eb17:0x938638b4d434946!2sZOOM+IT+Work+Station!8m2!3d23.7453294!4d90.349507!16s%2Fg%2F11shnysnzk!3m5!1s0x3755bf7ff7d6eb17:0x938638b4d434946!8m2!3d23.7453294!4d90.349507!16s%2Fg%2F11shnysnzk?entry=ttu&g_ep=EgoyMDI2MDkwOC4wIKXMDSoASAFQAw%3D%3D";

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
    alternates: localeAlternates(locale, "/contact"),
  };
}

export default async function ContactPage() {
  const [dict, locale, faq] = await Promise.all([
    getDictionary(),
    getLocale(),
    faqSchema(),
  ]);
  const budgetOptions = await getBudgetOptions(locale);
  const c = dict.contact.channels;
  // The numbers, the addresses and the profile links all come from the
  // panel — the labels beside them always did. Nothing on this column is
  // typed into the code any more.
  const d = dict.contact.details;
  const socials = socialProfiles(dict.contact.social);

  // The enquiry form asks which area, and the answer has to be one of the areas
  // we actually cover — so the options are the same list the areas section and
  // `/areas` render, not a second copy that can drift.
  const areaOptions = areas.map((area) => ({
    value: area.id,
    label: locale === "bn" && area.nameBn ? area.nameBn : area.name,
  }));

  const channels: {
    icon: IconName;
    label: string;
    value: string;
    href: string;
    note: string;
  }[] = [
    {
      icon: "phone",
      label: c.call,
      value: d.phone,
      href: telHref(d.phone),
      note: c.callNote,
    },
    {
      icon: "whatsapp",
      label: c.whatsapp,
      value: d.whatsapp,
      href: whatsappHref(d.whatsapp),
      note: c.whatsappNote,
    },
    {
      icon: "mail",
      label: c.email,
      value: d.email,
      href: mailHref(d.email),
      note: c.emailNote,
    },
  ];

  return (
    <>
      <JsonLd schema={faq} />
      <PageHeader
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        description={dict.contact.description}
        image={dict.contact.backgroundImage || pageBanners.contact}
      />

      <Section className="bg-background">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                {channels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon name={channel.icon} size="md" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {channel.label}
                      </span>
                      <span className="break-all text-base font-semibold text-foreground group-hover:text-primary sm:whitespace-nowrap">
                        {channel.value}
                      </span>
                      <span className="text-xs text-muted-foreground">{channel.note}</span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-5">
                <Heading as="h2" size="h6">
                  {dict.contact.offices}
                </Heading>
                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{dict.contact.dhaka}</span>
                    <a
                      href={DHAKA_OFFICE_MAP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary"
                    >
                      {d.dhakaAddress}
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {dict.contact.chattogram}
                    </span>
                    <span>{d.chattogramAddress}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Icon name={social.icon} size="xs" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4">
              <Heading as="h2" size="h4">
                {dict.contact.formTitle}
              </Heading>
              <Text size="sm">{dict.contact.formLead}</Text>
              <ContactForm
                dict={dict.contact.form}
                areas={areaOptions}
                budgets={budgetOptions}
                source="contact-page"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Reveal>
        <section className="h-60 w-full overflow-hidden border-t border-border bg-muted sm:h-80 md:h-100 lg:h-112.5">
          <iframe
            src={(dict.contact as Record<string, unknown>).mapUrl as string || "https://www.google.com/maps?q=ZOOM+IT+Work+Station&output=embed"}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          />
        </section>
      </Reveal>

      <FaqSection />
    </>
  );
}
