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
import { LandingStickyCta } from "@/components/pages/zoomalzahara/landing-sticky-cta";
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
import { telHref, whatsappHref } from "@/lib/contact";
import { cn } from "@/lib/utils";
import type { LandingView } from "@/server/features/project-landing/types";

export function ZoomAlZaharaLanding({ landing }: { landing: LandingView }) {
  const show = (key: keyof LandingView["sections"]) => landing.sections[key];
  const sticky =
    landing.phone ||
    landing.whatsapp ||
    (show("enquire") && landing.cta.primary);

  return (
    <div className="bg-background pb-16 lg:pb-0">
      {show("hero") ? <Hero landing={landing} /> : null}
      {show("about") && hasAbout(landing) ? <About dict={landing.about} /> : null}
      {show("residences") && hasResidences(landing) ? (
        <ProjectResidence dict={landing.residences} />
      ) : null}
      {show("elevation") && landing.elevation.views.length ? (
        <Elevation dict={landing.elevation} />
      ) : null}
      {show("films") && landing.films.items.length ? (
        <Films dict={landing.films} />
      ) : null}
      {show("amenities") || show("gallery") ? (
        <Lifestyle
          amenities={show("amenities") ? landing.amenities : null}
          gallery={show("gallery") ? landing.gallery : null}
        />
      ) : null}
      {show("location") || show("process") ? (
        <Place
          location={show("location") ? landing.location : null}
          process={show("process") ? landing.process : null}
        />
      ) : null}
      {show("cta") && hasCta(landing) ? (
        <LandingCta
          dict={landing.cta}
          phone={landing.phone}
          whatsapp={landing.whatsapp}
        />
      ) : null}
      {show("reviews") && landing.reviews.items.length ? (
        <Reviews dict={landing.reviews} />
      ) : null}
      {show("faq") || show("enquire") ? (
        <Close
          faq={show("faq") ? landing.faq : null}
          enquire={show("enquire") ? landing.enquire : null}
          projectName={landing.projectName}
          source={landing.source}
          path={landing.path}
          phone={landing.phone}
          phoneAlt={landing.phoneAlt}
          whatsapp={landing.whatsapp}
        />
      ) : null}
      {sticky ? (
        <LandingStickyCta
          phone={landing.phone}
          whatsapp={landing.whatsapp}
          bookLabel={landing.cta.primary || landing.navEnquire}
          callLabel={landing.cta.call}
          whatsappLabel={landing.cta.whatsapp}
          showBook={show("enquire")}
        />
      ) : null}
    </div>
  );
}

function hasAbout(landing: LandingView) {
  const about = landing.about;
  return Boolean(
    about.title || about.body || about.image || about.points.length,
  );
}

function hasResidences(landing: LandingView) {
  const row = landing.residences;
  return Boolean(
    row.title ||
      row.unit.name ||
      row.images.length ||
      row.highlights.length,
  );
}

function hasCta(landing: LandingView) {
  const row = landing.cta;
  return Boolean(row.title || row.description || row.primary);
}

function Hero({ landing }: { landing: LandingView }) {
  const hero = landing.hero;
  const enquire = landing.enquire;
  const showForm = landing.sections.enquire;

  if (
    !hero.image &&
    !hero.title &&
    !hero.lead &&
    !hero.stats.length &&
    !showForm
  ) {
    return null;
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#1b2318]">
      {hero.image ? (
        <Image
          src={hero.image}
          alt={hero.title}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-[center_68%]"
        />
      ) : null}
      <div className="absolute inset-0 bg-linear-to-r from-black/62 via-black/38 to-black/12" />
      <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-black/20" />

      <AppContainer className="relative z-10 pb-8 pt-16 sm:pt-20 lg:pb-10">
        <div
          className={cn(
            "grid items-center gap-6 lg:gap-8",
            showForm
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(28rem,calc(38rem-50px))]"
              : "lg:grid-cols-1",
          )}
        >
          <Reveal className="flex flex-col gap-4 text-white sm:gap-5">
            {hero.badge || hero.handover ? (
              <div className="flex flex-wrap items-center gap-2">
                {hero.badge ? (
                  <Badge className="border border-white/20 bg-white/10 text-white backdrop-blur-md">
                    {hero.badge}
                  </Badge>
                ) : null}
                {hero.handover ? (
                  <Badge className="border border-white/20 bg-white/10 text-white backdrop-blur-md">
                    {hero.handover}
                  </Badge>
                ) : null}
              </div>
            ) : null}
            {hero.eyebrow ? (
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 sm:text-xs">
                {hero.eyebrow}
              </p>
            ) : null}
            {hero.title ? (
              <Heading as="h1" size="h1" className="!font-extrabold text-white">
                {hero.title}
              </Heading>
            ) : null}
            {hero.lead ? (
              <p className="max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-base sm:leading-7">
                {hero.lead}
              </p>
            ) : null}
            {hero.location ? (
              <p className="flex items-center gap-2 text-sm font-medium text-white/85">
                <Icon name="fa-location-dot" size="xs" />
                {hero.location}
              </p>
            ) : null}
            {hero.ctaPrimary || hero.ctaSecondary ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {hero.ctaPrimary ? (
                  <Button asChild className="h-10 px-5">
                    <a href="#enquire">
                      {hero.ctaPrimary}
                      <Icon name="arrowRight" size="xs" />
                    </a>
                  </Button>
                ) : null}
                {hero.ctaSecondary ? (
                  <Button
                    asChild
                    variant="outline"
                    className="h-10 border-white/40 bg-white/10 px-5 text-white hover:bg-white/20 hover:text-white"
                  >
                    <a href="#residences">{hero.ctaSecondary}</a>
                  </Button>
                ) : null}
              </div>
            ) : null}
            <ContactPills
              phone={landing.phone}
              phoneAlt={landing.phoneAlt}
              whatsapp={landing.whatsapp}
              phoneLabel={enquire.phoneLabel}
              whatsappLabel={enquire.whatsappLabel}
              tone="onDark"
            />
          </Reveal>

          {showForm ? (
            <Reveal
              delay={0.08}
              className="hidden w-full rounded-lg border border-white/20 bg-white p-5 shadow-2xl lg:block lg:p-7"
            >
              {enquire.title ? (
                <p className="font-heading text-lg font-extrabold text-foreground">
                  {enquire.title}
                </p>
              ) : null}
              {enquire.description ? (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {enquire.description}
                </p>
              ) : null}
              <div className="mt-5">
                <ZoomAlZaharaLeadForm
                  dict={enquire.form}
                  projectName={landing.projectName}
                  source={landing.source}
                  path={landing.path}
                  variant="compact"
                />
              </div>
            </Reveal>
          ) : null}
        </div>
      </AppContainer>

      {hero.stats.length ? (
        <div className="relative z-10 border-t border-white/10 bg-black/35 backdrop-blur-md">
          <AppContainer>
            <ul className="grid grid-cols-2 lg:grid-cols-4">
              {hero.stats.map((stat, index) => (
                <li
                  key={`${stat.label}-${index}`}
                  className={`flex items-center gap-2.5 px-3 py-3 sm:gap-3.5 sm:px-6 sm:py-5 ${
                    index > 0 ? "lg:border-l lg:border-white/15" : ""
                  } ${index % 2 === 1 ? "border-l border-white/15" : ""} ${
                    index > 1 ? "border-t border-white/15 lg:border-t-0" : ""
                  }`}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white sm:size-10 sm:rounded-lg">
                    <Icon name={stat.icon || "check"} size="sm" />
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
      ) : null}
    </section>
  );
}

function About({ dict }: { dict: LandingView["about"] }) {
  return (
    <Section id="about" spacing="sm" className="scroll-mt-24">
      <div
        className={cn(
          "grid items-stretch gap-6 lg:gap-8",
          dict.image ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-1",
        )}
      >
        <div className="flex flex-col">
          {dict.eyebrow || dict.title || dict.body ? (
            <SectionHeading
              eyebrow={dict.eyebrow || undefined}
              title={dict.title || dict.eyebrow}
              description={dict.body || undefined}
              titleClassName={landingTitleClass}
            />
          ) : null}
          {dict.points.length ? (
            <ul className="mt-6 grid flex-1 gap-3">
              {dict.points.map((point, index) => (
                <li
                  key={`${point.title}-${index}`}
                  className={`flex gap-3 p-4 ${landingCardClass}`}
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon
                      name={point.icon || "fa-solid fa-check"}
                      size="xs"
                    />
                  </span>
                  <div>
                    {point.title ? (
                      <h3 className="font-heading text-sm font-extrabold text-foreground sm:text-base">
                        {point.title}
                      </h3>
                    ) : null}
                    {point.body ? (
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {point.body}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {dict.image ? (
          <Reveal delay={0.08} className="min-h-80 lg:min-h-full">
            <ImageFrame
              src={dict.image}
              alt={dict.title}
              ratio="auto"
              rounded="lg"
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="h-full min-h-80 lg:min-h-128"
              imageClassName="object-cover object-center"
            />
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}

function Elevation({ dict }: { dict: LandingView["elevation"] }) {
  return (
    <Section id="elevation" spacing="sm" className="scroll-mt-24">
      {dict.eyebrow || dict.title || dict.description ? (
        <SectionHeading
          eyebrow={dict.eyebrow || undefined}
          title={dict.title || dict.eyebrow}
          description={dict.description || undefined}
          titleClassName={landingTitleClass}
        />
      ) : null}
      <ProjectElevations
        views={dict.views}
        previewLabel={dict.preview}
        closeLabel={dict.close}
      />
    </Section>
  );
}

function Films({ dict }: { dict: LandingView["films"] }) {
  return (
    <Section
      id="video"
      spacing="sm"
      className="scroll-mt-24 border-y border-border bg-muted/30"
    >
      {dict.eyebrow || dict.title || dict.description ? (
        <SectionHeading
          eyebrow={dict.eyebrow || undefined}
          title={dict.title || dict.eyebrow}
          description={dict.description || undefined}
          titleClassName={landingTitleClass}
        />
      ) : null}
      <ProjectFilms films={dict.items} playLabel={dict.play} />
    </Section>
  );
}

function Reviews({ dict }: { dict: LandingView["reviews"] }) {
  return (
    <Section
      id="reviews"
      spacing="sm"
      className="scroll-mt-24 border-y border-border bg-muted/30"
    >
      {dict.eyebrow || dict.title || dict.description ? (
        <SectionHeading
          eyebrow={dict.eyebrow || undefined}
          title={dict.title || dict.eyebrow}
          description={dict.description || undefined}
          titleClassName={landingTitleClass}
        />
      ) : null}
      <ProjectReviews
        items={dict.items}
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
  amenities: LandingView["amenities"] | null;
  gallery: LandingView["gallery"] | null;
}) {
  const showAmenities = Boolean(amenities?.items.length);
  const showGallery = Boolean(gallery?.shots.length);
  if (!showAmenities && !showGallery) return null;

  return (
    <Section id="lifestyle" spacing="sm" className="scroll-mt-24">
      {showAmenities && amenities ? (
        <>
          {amenities.eyebrow || amenities.title || amenities.description ? (
            <SectionHeading
              eyebrow={amenities.eyebrow || undefined}
              title={amenities.title || amenities.eyebrow}
              description={amenities.description || undefined}
              titleClassName={landingTitleClass}
            />
          ) : null}
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {amenities.items.map((item, index) => (
              <li
                key={`${item.title}-${index}`}
                className={`flex h-full gap-3 p-4 ${landingCardClass}`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon name={item.icon || "check"} size="sm" />
                </span>
                <div>
                  {item.title ? (
                    <h3 className="font-heading text-sm font-extrabold text-foreground">
                      {item.title}
                    </h3>
                  ) : null}
                  {item.body ? (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {item.body}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {showGallery && gallery ? (
        <div className={showAmenities ? "mt-10" : undefined}>
          {gallery.eyebrow || gallery.title ? (
            <SectionHeading
              eyebrow={gallery.eyebrow || undefined}
              title={gallery.title || gallery.eyebrow}
              titleClassName={landingTitleClass}
            />
          ) : null}
          <ProjectGallery
            shots={gallery.shots}
            openLabel={gallery.open}
            closeLabel={gallery.close}
          />
        </div>
      ) : null}
    </Section>
  );
}

function Place({
  location,
  process,
}: {
  location: LandingView["location"] | null;
  process: LandingView["process"] | null;
}) {
  const showLocation = Boolean(
    location &&
      (location.title ||
        location.description ||
        location.mapEmbedUrl ||
        location.facts.length),
  );
  const showProcess = Boolean(process?.steps.length);
  if (!showLocation && !showProcess) return null;

  return (
    <Section
      id="place"
      spacing="sm"
      className="scroll-mt-24 border-y border-border bg-muted/30"
    >
      <div
        className={cn(
          "grid gap-6 lg:gap-6",
          showLocation ? "lg:grid-cols-12" : "lg:grid-cols-1",
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-5",
            showLocation ? "lg:col-span-5" : "lg:col-span-12",
          )}
        >
          {showLocation && location ? (
            <>
              {location.eyebrow || location.title || location.description ? (
                <SectionHeading
                  eyebrow={location.eyebrow || undefined}
                  title={location.title || location.eyebrow}
                  description={location.description || undefined}
                  titleClassName={landingTitleClass}
                />
              ) : null}
              {location.facts.length ? (
                <dl className="grid grid-cols-2 gap-3">
                  {location.facts.map((fact, index) => (
                    <div
                      key={`${fact.label}-${index}`}
                      className={`p-4 ${landingCardClass}`}
                    >
                      <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        <Icon
                          name="fa-solid fa-clock"
                          size="xs"
                          className="text-primary"
                        />
                        {fact.label}
                      </dt>
                      <dd className="mt-1 font-heading text-sm font-bold text-foreground">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </>
          ) : null}
          {showProcess && process ? (
            <div>
              {process.eyebrow ? (
                <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  {process.eyebrow}
                </p>
              ) : null}
              {process.title ? (
                <h3 className="mt-2 font-heading text-lg font-extrabold text-foreground">
                  {process.title}
                </h3>
              ) : null}
              <ol className="mt-4 grid gap-3">
                {process.steps.map((step, index) => (
                  <li
                    key={`${step.title}-${index}`}
                    className={`grid grid-cols-[auto_1fr] gap-3 p-3.5 ${landingCardClass}`}
                  >
                    <span className="font-heading text-xs font-bold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      {step.title ? (
                        <p className="font-heading text-sm font-extrabold text-foreground">
                          {step.title}
                        </p>
                      ) : null}
                      {step.body ? (
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {step.body}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
        {showLocation && location?.mapEmbedUrl ? (
          <div
            className={cn(
              "flex min-h-80 flex-col overflow-hidden sm:min-h-96 lg:col-span-7 lg:min-h-full",
              "ring-1 ring-primary/25",
              landingCardClass,
            )}
          >
            <div className="flex items-center gap-2.5 border-b border-primary/15 bg-linear-to-r from-primary/12 via-card to-card px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
              <span className="relative flex size-9 shrink-0 items-center justify-center sm:size-10">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-primary/25 ring-4 ring-primary/15"
                />
                <span className="relative flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 sm:size-10">
                  <Icon name="fa-solid fa-location-dot" size="sm" />
                </span>
              </span>
              <div className="min-w-0 flex-1">
                {location.eyebrow ? (
                  <p className="font-heading text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                    {location.eyebrow}
                  </p>
                ) : null}
                {location.title ? (
                  <p className="truncate font-heading text-sm font-extrabold text-foreground">
                    {location.title}
                  </p>
                ) : null}
              </div>
              {location.mapLinkUrl ? (
                <Button asChild variant="outline" size="sm" className="shrink-0">
                  <a
                    href={location.mapLinkUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={location.mapOpen}
                  >
                    <span className="hidden sm:inline">{location.mapOpen}</span>
                    <Icon name="arrowUpRight" size="xs" />
                  </a>
                </Button>
              ) : null}
            </div>
            <div className="relative min-h-80 flex-1 overflow-hidden sm:min-h-96 lg:min-h-160">
              <iframe
                src={location.mapEmbedUrl}
                title={location.title}
                width="100%"
                height="100%"
                allowFullScreen
                data-lenis-prevent
                className="absolute inset-0 size-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-primary/20"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-linear-to-b from-primary/10 to-transparent"
              />
              {location.mapHint ? (
                <div className="pointer-events-none absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
                  <p className="inline-flex max-w-full items-center gap-2 rounded-lg border border-white/25 bg-background/90 px-3 py-2 text-xs font-semibold text-foreground shadow-lg shadow-black/10 backdrop-blur-md">
                    <Icon
                      name="fa-solid fa-location-dot"
                      size="xs"
                      className="shrink-0 text-primary"
                    />
                    <span className="truncate">{location.mapHint}</span>
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </Section>
  );
}

function Close({
  faq,
  enquire,
  projectName,
  source,
  path,
  phone,
  phoneAlt,
  whatsapp,
}: {
  faq: LandingView["faq"] | null;
  enquire: LandingView["enquire"] | null;
  projectName: string;
  source: string;
  path: string;
  phone: string;
  phoneAlt: string;
  whatsapp: string;
}) {
  const showFaq = Boolean(faq?.items.length);
  const showEnquire = Boolean(enquire);

  return (
    <Section id="enquire" spacing="sm" className="scroll-mt-24">
      <div
        className={cn(
          "grid items-start gap-6 lg:gap-8",
          showFaq && showEnquire
            ? "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
            : "lg:grid-cols-1",
        )}
      >
        {showFaq && faq ? (
          <div id="faq" className="min-w-0 scroll-mt-24">
            {faq.eyebrow || faq.title || faq.description ? (
              <SectionHeading
                eyebrow={faq.eyebrow || undefined}
                title={faq.title || faq.eyebrow}
                description={faq.description || undefined}
                titleClassName={landingTitleClass}
              />
            ) : null}
            <Accordion type="single" collapsible className="mt-6 w-full">
              {faq.items.map((item, index) => (
                <AccordionItem
                  key={`${item.question}-${index}`}
                  value={item.question || String(index)}
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
        ) : null}

        {showEnquire && enquire ? (
          <aside className="order-first min-w-0 self-start lg:sticky lg:top-28 lg:order-none">
            {enquire.eyebrow || enquire.title || enquire.description ? (
              <SectionHeading
                eyebrow={enquire.eyebrow || undefined}
                title={enquire.title || enquire.eyebrow}
                description={enquire.description || undefined}
                titleClassName={landingTitleClass}
              />
            ) : null}
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
              <ZoomAlZaharaLeadForm
                dict={enquire.form}
                projectName={projectName}
                source={source}
                path={path}
              />
            </div>
          </aside>
        ) : null}
      </div>
    </Section>
  );
}

function LandingCta({
  dict,
  phone,
  whatsapp,
}: {
  dict: LandingView["cta"];
  phone: string;
  whatsapp: string;
}) {
  return (
    <Section spacing="sm">
      <div className="flex flex-col gap-4 rounded-lg bg-primary px-5 py-5 text-primary-foreground shadow-md sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-6">
        <div className="min-w-0 max-w-xl">
          {dict.eyebrow ? (
            <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-primary-foreground/75">
              {dict.eyebrow}
            </p>
          ) : null}
          {dict.title ? (
            <h2 className="mt-1 font-heading text-xl font-extrabold leading-snug text-balance sm:text-2xl">
              {dict.title}
            </h2>
          ) : null}
          {dict.description ? (
            <p className="mt-1 text-sm leading-relaxed text-primary-foreground/80">
              {dict.description}
            </p>
          ) : null}
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
          {dict.primary ? (
            <Button
              asChild
              className="h-10 w-full bg-primary-foreground px-4 text-primary hover:bg-primary-foreground/90 sm:h-9 sm:w-auto"
            >
              <a href="#enquire">
                {dict.primary}
                <Icon name="arrowRight" size="xs" />
              </a>
            </Button>
          ) : null}
          {phone ? (
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
          ) : null}
          {whatsapp ? (
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
          ) : null}
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

  if (!phone && !phoneAlt && !whatsapp) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {phone ? (
        <a href={telHref(phone)} className={pill} aria-label={`${phoneLabel} ${phone}`}>
          <Icon name="phone" size="xs" className={onDark ? "text-white" : "text-primary"} />
          <span className="truncate">{phone}</span>
        </a>
      ) : null}
      {phoneAlt ? (
        <a
          href={telHref(phoneAlt)}
          className={pill}
          aria-label={`${phoneLabel} ${phoneAlt}`}
        >
          <Icon name="phone" size="xs" className={onDark ? "text-white" : "text-primary"} />
          <span className="truncate">{phoneAlt}</span>
        </a>
      ) : null}
      {whatsapp ? (
        <a
          href={whatsappHref(whatsapp)}
          className={pill}
          aria-label={`${whatsappLabel} ${whatsapp}`}
        >
          <Icon name="whatsapp" size="xs" className={onDark ? "text-white" : "text-primary"} />
          <span className="truncate">{whatsappLabel}</span>
        </a>
      ) : null}
    </div>
  );
}
