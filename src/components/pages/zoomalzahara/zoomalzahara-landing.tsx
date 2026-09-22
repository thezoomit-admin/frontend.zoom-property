import Image from "@/components/common/image";
import { AppContainer } from "@/components/common/app-container";
import { Heading } from "@/components/common/heading";
import { Icon } from "@/components/common/icon";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { ImageFrame } from "@/components/media/image-frame";
import { Reveal } from "@/components/motion/reveal";
import { landingCardClass, landingTitleClass } from "@/components/pages/zoomalzahara/landing-card";
import { ZoomAlZaharaLeadForm } from "@/components/pages/zoomalzahara/lead-form";
import { ProjectElevations } from "@/components/pages/zoomalzahara/project-elevations";
import { ProjectFilms } from "@/components/pages/zoomalzahara/project-films";
import { ProjectGallery } from "@/components/pages/zoomalzahara/project-gallery";
import { ProjectResidence } from "@/components/pages/zoomalzahara/project-residence";
import { ProjectReviews } from "@/components/pages/zoomalzahara/project-reviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ZOOM_AL_ZAHARA_ABOUT,
  ZOOM_AL_ZAHARA_ABOUT_ICONS,
  ZOOM_AL_ZAHARA_AMENITY_ICONS,
  ZOOM_AL_ZAHARA_HERO,
  ZOOM_AL_ZAHARA_MAP_EMBED,
  ZOOM_AL_ZAHARA_PHONES,
  ZOOM_AL_ZAHARA_STAT_ICONS,
} from "@/data/zoomalzahara";
import type { Dictionary } from "@/i18n/dictionaries";
import { telHref, whatsappHref } from "@/lib/contact";

export function ZoomAlZaharaLanding({
  dict,
  phone,
  whatsapp,
}: {
  dict: Dictionary["zoomalzahara"];
  phone: string;
  whatsapp: string;
}) {
  return (
    <div className="bg-background">
      <Hero dict={dict} phone={phone} whatsapp={whatsapp} />
      <About dict={dict.about} />
      <ProjectResidence dict={dict.residences} />
      <Elevation dict={dict.elevation} />
      <Films dict={dict.video} />
      <Lifestyle amenities={dict.amenities} gallery={dict.gallery} />
      <Place location={dict.location} process={dict.process} />
      <LandingCta dict={dict.ctaBand} phone={phone} whatsapp={whatsapp} />
      <Close
        faq={dict.faq}
        enquire={dict.enquire}
        projectName={dict.hero.title}
        phone={phone}
        phoneAlt={ZOOM_AL_ZAHARA_PHONES.secondary}
        whatsapp={whatsapp}
      />
      <Reviews dict={dict.reviews} />
    </div>
  );
}

function Hero({
  dict,
  phone,
  whatsapp,
}: {
  dict: Dictionary["zoomalzahara"];
  phone: string;
  whatsapp: string;
}) {
  const hero = dict.hero;

  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={ZOOM_AL_ZAHARA_HERO}
        alt={hero.title}
        fill
        priority
        quality={90}
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-[center_68%]"
      />
      <div className="absolute inset-0 bg-linear-to-r from-black/62 via-black/38 to-black/12" />
      <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-black/20" />

      <AppContainer className="relative z-10 pb-8 pt-16 sm:pt-20 lg:pb-10">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(28rem,calc(38rem-50px))] lg:gap-8">
          <Reveal className="flex flex-col gap-4 text-white sm:gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border border-white/20 bg-white/10 text-white backdrop-blur-md">
                {hero.badge}
              </Badge>
              <Badge className="border border-white/20 bg-white/10 text-white backdrop-blur-md">
                {hero.handover}
              </Badge>
            </div>
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 sm:text-xs">
              {hero.eyebrow}
            </p>
            <Heading
              as="h1"
              size="h1"
              className="!font-extrabold text-white"
            >
              {hero.title}
            </Heading>
            <p className="max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-base sm:leading-7">
              {hero.lead}
            </p>
            <p className="flex items-center gap-2 text-sm font-medium text-white/85">
              <Icon name="fa-location-dot" size="xs" />
              {hero.location}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button asChild className="h-10 px-5">
                <a href="#enquire">
                  {hero.ctaPrimary}
                  <Icon name="arrowRight" size="xs" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-10 border-white/40 bg-white/10 px-5 text-white hover:bg-white/20 hover:text-white"
              >
                <a href="#residences">{hero.ctaSecondary}</a>
              </Button>
            </div>
            <ContactPills
              phone={phone}
              phoneAlt={ZOOM_AL_ZAHARA_PHONES.secondary}
              whatsapp={whatsapp}
              phoneLabel={dict.enquire.phoneLabel}
              whatsappLabel={dict.enquire.whatsappLabel}
              tone="onDark"
            />
          </Reveal>

          <Reveal
            delay={0.08}
            className="hidden w-full rounded-lg border border-white/20 bg-white p-5 shadow-2xl lg:block lg:p-7"
          >
            <p className="font-heading text-lg font-extrabold text-foreground">
              {dict.enquire.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {dict.enquire.description}
            </p>
            <div className="mt-5">
              <ZoomAlZaharaLeadForm
                dict={dict.enquire.form}
                projectName={hero.title}
                variant="compact"
              />
            </div>
          </Reveal>
        </div>
      </AppContainer>

      <div className="relative z-10 border-t border-white/10 bg-black/35 backdrop-blur-md">
        <AppContainer>
          <ul className="grid grid-cols-2 lg:grid-cols-4">
            {dict.stats.map((stat, index) => (
              <li
                key={stat.label}
                className={`flex items-center gap-2.5 px-3 py-3 sm:gap-3.5 sm:px-6 sm:py-5 ${
                  index > 0 ? "lg:border-l lg:border-white/15" : ""
                } ${index % 2 === 1 ? "border-l border-white/15" : ""} ${
                  index > 1 ? "border-t border-white/15 lg:border-t-0" : ""
                }`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white sm:size-10 sm:rounded-lg">
                  <Icon
                    name={ZOOM_AL_ZAHARA_STAT_ICONS[index] ?? "check"}
                    size="sm"
                  />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/65">
                    {stat.label}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </AppContainer>
      </div>
    </section>
  );
}

function About({ dict }: { dict: Dictionary["zoomalzahara"]["about"] }) {
  return (
    <Section id="about" spacing="sm" className="scroll-mt-24">
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="flex flex-col">
          <SectionHeading
            eyebrow={dict.eyebrow}
            title={dict.title}
            description={dict.body}
            titleClassName={landingTitleClass}
          />
          <ul className="mt-6 grid flex-1 gap-3">
            {dict.points.map((point, index) => (
              <li
                key={point.title}
                className={`flex gap-3 p-4 ${landingCardClass}`}
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon
                    name={ZOOM_AL_ZAHARA_ABOUT_ICONS[index] ?? "fa-solid fa-check"}
                    size="xs"
                  />
                </span>
                <div>
                  <h3 className="font-heading text-sm font-extrabold text-foreground sm:text-base">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {point.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Reveal delay={0.08} className="min-h-80 lg:min-h-full">
          <ImageFrame
            src={ZOOM_AL_ZAHARA_ABOUT}
            alt={dict.title}
            ratio="auto"
            rounded="lg"
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="h-full min-h-80 lg:min-h-128"
            imageClassName="object-cover object-center"
          />
        </Reveal>
      </div>
    </Section>
  );
}

function Elevation({ dict }: { dict: Dictionary["zoomalzahara"]["elevation"] }) {
  return (
    <Section id="elevation" spacing="sm" className="scroll-mt-24">
      <SectionHeading
        eyebrow={dict.eyebrow}
        title={dict.title}
        description={dict.description}
        titleClassName={landingTitleClass}
      />
      <ProjectElevations
        views={dict.views}
        previewLabel={dict.preview}
        closeLabel={dict.close}
      />
    </Section>
  );
}

function Films({ dict }: { dict: Dictionary["zoomalzahara"]["video"] }) {
  return (
    <Section
      id="video"
      spacing="sm"
      className="scroll-mt-24 border-y border-border bg-muted/30"
    >
      <SectionHeading
        eyebrow={dict.eyebrow}
        title={dict.title}
        description={dict.description}
        titleClassName={landingTitleClass}
      />
      <ProjectFilms films={dict.films} />
    </Section>
  );
}

function Reviews({ dict }: { dict: Dictionary["zoomalzahara"]["reviews"] }) {
  return (
    <Section
      id="reviews"
      spacing="sm"
      className="scroll-mt-24 border-y border-border bg-muted/30"
    >
      <SectionHeading
        eyebrow={dict.eyebrow}
        title={dict.title}
        description={dict.description}
        titleClassName={landingTitleClass}
      />
      <ProjectReviews
        items={dict.items}
        videos={dict.videos}
        playLabel={dict.play}
        closeLabel={dict.close}
      />
    </Section>
  );
}

function Lifestyle({
  amenities,
  gallery,
}: {
  amenities: Dictionary["zoomalzahara"]["amenities"];
  gallery: Dictionary["zoomalzahara"]["gallery"];
}) {
  return (
    <Section id="lifestyle" spacing="sm" className="scroll-mt-24">
      <SectionHeading
        eyebrow={amenities.eyebrow}
        title={amenities.title}
        description={amenities.description}
        titleClassName={landingTitleClass}
      />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {amenities.items.map((item, index) => (
          <li
            key={item.title}
            className={`flex h-full gap-3 p-4 ${landingCardClass}`}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon name={ZOOM_AL_ZAHARA_AMENITY_ICONS[index] ?? "check"} size="sm" />
            </span>
            <div>
              <h3 className="font-heading text-sm font-extrabold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <SectionHeading
          eyebrow={gallery.eyebrow}
          title={gallery.title}
          titleClassName={landingTitleClass}
        />
        <ProjectGallery
          shots={gallery.shots}
          openLabel={gallery.open}
          closeLabel={gallery.close}
        />
      </div>
    </Section>
  );
}

function Place({
  location,
  process,
}: {
  location: Dictionary["zoomalzahara"]["location"];
  process: Dictionary["zoomalzahara"]["process"];
}) {
  return (
    <Section
      id="place"
      spacing="sm"
      className="scroll-mt-24 border-y border-border bg-muted/30"
    >
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-5 lg:col-span-5">
          <SectionHeading
            eyebrow={location.eyebrow}
            title={location.title}
            description={location.description}
            titleClassName={landingTitleClass}
          />
          <dl className="grid grid-cols-2 gap-3">
            {location.facts.map((fact) => (
              <div key={fact.label} className={`p-4 ${landingCardClass}`}>
                <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <Icon name="fa-solid fa-clock" size="xs" className="text-primary" />
                  {fact.label}
                </dt>
                <dd className="mt-1 font-heading text-sm font-bold text-foreground">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-primary">
              {process.eyebrow}
            </p>
            <h3 className="mt-2 font-heading text-lg font-extrabold text-foreground">
              {process.title}
            </h3>
            <ol className="mt-4 grid gap-3">
              {process.steps.map((step, index) => (
                <li
                  key={step.title}
                  className={`grid grid-cols-[auto_1fr] gap-3 p-3.5 ${landingCardClass}`}
                >
                  <span className="font-heading text-xs font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-heading text-sm font-extrabold text-foreground">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className={`min-h-64 overflow-hidden sm:min-h-88 lg:col-span-7 lg:min-h-full ${landingCardClass}`}>
          <iframe
            src={ZOOM_AL_ZAHARA_MAP_EMBED}
            title={location.title}
            width="100%"
            height="100%"
            className="h-full min-h-64 w-full sm:min-h-88 lg:min-h-160"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Section>
  );
}

function Close({
  faq,
  enquire,
  projectName,
  phone,
  phoneAlt,
  whatsapp,
}: {
  faq: Dictionary["zoomalzahara"]["faq"];
  enquire: Dictionary["zoomalzahara"]["enquire"];
  projectName: string;
  phone: string;
  phoneAlt: string;
  whatsapp: string;
}) {
  return (
    <Section id="enquire" spacing="sm" className="scroll-mt-24">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-8">
        <div id="faq" className="min-w-0 scroll-mt-24">
          <SectionHeading
            eyebrow={faq.eyebrow}
            title={faq.title}
            description={faq.description}
            titleClassName={landingTitleClass}
          />
          <Accordion type="single" collapsible className="mt-6 w-full">
            {faq.items.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={item.question}
                className={`${landingCardClass} mb-2 not-last:border-b-0 px-3 data-open:bg-muted/40 sm:px-4`}
              >
                <AccordionTrigger className="cursor-pointer items-start gap-3 py-4 text-left hover:text-primary hover:no-underline">
                  <span className="mt-0.5 font-heading text-[11px] font-bold tracking-wide text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-extrabold text-foreground">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="ps-9">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <aside className="order-first min-w-0 self-start lg:sticky lg:top-28 lg:order-none">
          <SectionHeading
            eyebrow={enquire.eyebrow}
            title={enquire.title}
            description={enquire.description}
            titleClassName={landingTitleClass}
          />
          <div className="mt-5">
            <ContactPills
              phone={phone}
              phoneAlt={phoneAlt}
              whatsapp={whatsapp}
              phoneLabel={enquire.phoneLabel}
              whatsappLabel={enquire.whatsappLabel}
            />
          </div>
          <div className="mt-4">
            <ZoomAlZaharaLeadForm dict={enquire.form} projectName={projectName} />
          </div>
        </aside>
      </div>
    </Section>
  );
}

function LandingCta({
  dict,
  phone,
  whatsapp,
}: {
  dict: Dictionary["zoomalzahara"]["ctaBand"];
  phone: string;
  whatsapp: string;
}) {
  return (
    <Section spacing="sm">
      <div className="flex flex-col gap-4 rounded-lg bg-primary px-5 py-5 text-primary-foreground shadow-md sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-6">
        <div className="min-w-0 max-w-xl">
          <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground/75">
            {dict.eyebrow}
          </p>
          <h2 className="mt-1 font-heading text-xl font-extrabold leading-snug text-balance sm:text-2xl">
            {dict.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-primary-foreground/80">
            {dict.description}
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          <Button
            asChild
            className="h-10 w-full bg-primary-foreground px-4 text-primary hover:bg-primary-foreground/90 sm:h-9 sm:w-auto"
          >
            <a href="#enquire">
              {dict.primary}
              <Icon name="arrowRight" size="xs" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-10 w-full border-white/40 bg-white/10 px-3 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground sm:h-9 sm:w-auto"
          >
            <a href={telHref(phone)}>
              <Icon name="phone" size="xs" />
              {dict.call}
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-10 w-full border-white/40 bg-white/10 px-3 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground sm:h-9 sm:w-auto"
          >
            <a href={whatsappHref(whatsapp)}>
              <Icon name="whatsapp" size="xs" />
              {dict.whatsapp}
            </a>
          </Button>
        </div>
      </div>
    </Section>
  );
}

function ContactPills({
  phone,
  phoneAlt,
  whatsapp,
  phoneLabel,
  whatsappLabel,
  tone = "default",
}: {
  phone: string;
  phoneAlt: string;
  whatsapp: string;
  phoneLabel: string;
  whatsappLabel: string;
  tone?: "default" | "onDark";
}) {
  const onDark = tone === "onDark";
  const pill = onDark
    ? "inline-flex h-8 items-center gap-1.5 rounded-md border border-white/25 bg-white/10 px-2.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
    : "inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-muted/50";

  return (
    <div className="flex flex-wrap gap-2">
      <a href={telHref(phone)} className={pill} aria-label={`${phoneLabel} ${phone}`}>
        <Icon name="phone" size="xs" className={onDark ? "text-white" : "text-primary"} />
        <span className="truncate">{phone}</span>
      </a>
      <a href={telHref(phoneAlt)} className={pill} aria-label={`${phoneLabel} ${phoneAlt}`}>
        <Icon name="phone" size="xs" className={onDark ? "text-white" : "text-primary"} />
        <span className="truncate">{phoneAlt}</span>
      </a>
      <a
        href={whatsappHref(whatsapp)}
        className={pill}
        aria-label={`${whatsappLabel} ${whatsapp}`}
      >
        <Icon name="whatsapp" size="xs" className={onDark ? "text-white" : "text-primary"} />
        <span className="truncate">{whatsappLabel}</span>
      </a>
    </div>
  );
}
