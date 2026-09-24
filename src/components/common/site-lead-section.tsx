import { AppContainer } from "@/components/common/app-container";
import { Heading } from "@/components/common/heading";
import { Icon, type IconName } from "@/components/common/icon";
import { Text } from "@/components/common/text";
import { Reveal } from "@/components/motion/reveal";
import { HeroLeadForm } from "@/components/pages/home/hero-lead-form";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { getLeadAreaOptions } from "@/server/features/areas";
import {
  mailHref,
  socialProfiles,
  telHref,
  whatsappHref,
} from "@/lib/contact";

const DHAKA_OFFICE_MAP_URL =
  "https://www.google.com/maps/place/ZOOM+IT+Work+Station/@23.7453343,90.3469321,17z";

const DEFAULT_MAP_EMBED =
  "https://www.google.com/maps?q=ZOOM+IT+Work+Station&output=embed";

/**
 * Site-wide lead: left channels · middle form · right map.
 * Form stays mid-width so the block doesn't stretch too wide.
 */
export async function SiteLeadSection({
  source = "site-lead",
}: {
  source?: string;
}) {
  const locale = await getLocale();
  const [dict, areaOptions] = await Promise.all([
    getDictionary(),
    getLeadAreaOptions(locale, 60),
  ]);

  const c = dict.contact.channels;
  const d = dict.contact.details;
  const socials = socialProfiles(dict.contact.social);
  const f = dict.contact.form;
  const mapEmbed =
    (dict.contact as Record<string, unknown>).mapUrl as string ||
    DEFAULT_MAP_EMBED;

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
    <section
      id="enquire"
      className="relative overflow-hidden border-t border-primary/15 bg-primary/5 py-10 sm:py-14 lg:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-primary/10 to-transparent"
      />
      <AppContainer className="relative">
        <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,17rem)_minmax(0,22rem)_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[minmax(0,18rem)_minmax(0,24rem)_minmax(0,1fr)] xl:gap-8">
          {/* Left — contact channels */}
          <Reveal>
            <div className="flex h-full flex-col gap-3">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  className="group flex items-start gap-3 rounded-xl border border-border/80 bg-card p-3.5 shadow-xs transition-colors hover:border-primary/40"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon name={channel.icon} size="sm" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {channel.label}
                    </span>
                    <span className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                      {channel.value}
                    </span>
                    <span className="line-clamp-1 text-[11px] text-muted-foreground">
                      {channel.note}
                    </span>
                  </span>
                </a>
              ))}

              <div className="mt-auto flex flex-col gap-2.5 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
                <Heading as="h2" size="h6">
                  {dict.contact.offices}
                </Heading>
                <div className="flex flex-col gap-2.5 text-xs leading-relaxed text-muted-foreground">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {dict.contact.dhaka}
                    </span>
                    <a
                      href={DHAKA_OFFICE_MAP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-primary/30 underline-offset-2 transition-colors hover:text-primary"
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

                {socials.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.label}
                        className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <Icon name={social.icon} size="xs" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </Reveal>

          {/* Middle — lead form */}
          <Reveal delay={0.06}>
            <div className="flex h-full flex-col gap-3">
              <div>
                <Heading as="h2" size="h5">
                  {dict.contact.formTitle}
                </Heading>
                <Text size="xs" className="mt-1 text-muted-foreground">
                  {dict.contact.formLead}
                </Text>
              </div>
              <HeroLeadForm
                dict={{
                  name: f.name,
                  namePlaceholder: f.namePlaceholder,
                  phone: f.phone,
                  email: f.email,
                  area: f.area,
                  areaAny: f.areaAny,
                  subArea: f.subArea,
                  subAreaAny: f.subAreaAny,
                  subAreaPickArea: f.subAreaPickArea,
                  message: f.message,
                  messagePlaceholder: f.messagePlaceholder,
                  submit: f.submit,
                  submitting: f.submitting,
                  privacy: f.privacy,
                  successTitle: f.successTitle,
                  successBody: f.successBody,
                }}
                areas={areaOptions}
                source={source}
                subject="Website lead enquiry"
                idPrefix="site-lead"
                trackName="Site lead"
                formClassName="h-full shadow-sm sm:p-5"
              />
            </div>
          </Reveal>

          {/* Right — map */}
          <Reveal delay={0.1}>
            <div className="flex h-full min-h-72 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs lg:min-h-0">
              <iframe
                src={mapEmbed}
                title="Office location"
                className="h-full min-h-72 w-full flex-1 lg:min-h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </AppContainer>
    </section>
  );
}
