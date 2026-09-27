import { AppContainer } from "@/components/common/app-container";
import { Heading } from "@/components/common/heading";
import { Icon } from "@/components/common/icon";
import { RichText } from "@/components/common/rich-text";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { ImageFrame } from "@/components/media/image-frame";
import { Reveal } from "@/components/motion/reveal";
import { HeroBackdrop } from "@/components/pages/home/hero-backdrop";
import { landingCardClass, landingTitleClass } from "@/components/pages/landing/landing-card";
import { ProjectLeadForm } from "@/components/pages/landing/lead-form";
import { LandingStickyCta } from "@/components/pages/landing/landing-sticky-cta";
import { ProjectElevations } from "@/components/pages/landing/project-elevations";
import { ProjectFilms } from "@/components/pages/landing/project-films";
import { ProjectGallery } from "@/components/pages/landing/project-gallery";
import { ProjectResidence } from "@/components/pages/landing/project-residence";
import { ProjectReviews } from "@/components/pages/landing/project-reviews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { telHref, whatsappHref } from "@/lib/contact";
import { resolveAmenityMaps } from "@/lib/maps-distance";
import { cn } from "@/lib/utils";
import type { ApiProjectLanding, LandingView } from "@/server/features/project-landing/types";
import { SectionEditControl } from "@/components/pages/landing/edit/section-edit-control";
import { HiddenSectionNotice } from "@/components/pages/landing/edit/hidden-section-notice";
import { AboutFields, emptyAbout } from "@/components/pages/landing/edit/section-fields/about-fields";
import { GalleryFields, emptyGallery } from "@/components/pages/landing/edit/section-fields/gallery-fields";
import { FaqFields, emptyFaq } from "@/components/pages/landing/edit/section-fields/faq-fields";
import { EditorBar } from "@/components/pages/landing/edit/editor-bar";
import { HeroFields, emptyHero } from "@/components/pages/landing/edit/section-fields/hero-fields";
import { ResidencesFields, emptyResidences } from "@/components/pages/landing/edit/section-fields/residences-fields";
import { ElevationFields, emptyElevation } from "@/components/pages/landing/edit/section-fields/elevation-fields";
import { FilmsFields, emptyFilms } from "@/components/pages/landing/edit/section-fields/films-fields";
import { AmenitiesFields, emptyAmenities } from "@/components/pages/landing/edit/section-fields/amenities-fields";
import { LocationFields, emptyLocation } from "@/components/pages/landing/edit/section-fields/location-fields";
import { ProcessFields, emptyProcess } from "@/components/pages/landing/edit/section-fields/process-fields";
import { CtaFields, emptyCta } from "@/components/pages/landing/edit/section-fields/cta-fields";
import { ReviewsFields, emptyReviews } from "@/components/pages/landing/edit/section-fields/reviews-fields";
import { EnquireFields, emptyEnquire } from "@/components/pages/landing/edit/section-fields/enquire-fields";
import { CustomFields, emptyCustom } from "@/components/pages/landing/edit/section-fields/custom-fields";

export function ProjectLanding({
  landing,
  raw,
}: {
  landing: LandingView;
  /** The raw, bilingual document — only fetched (and only passed) when the
   * request is from a logged-in editor; every section-editing control reads
   * its own slice of it for the form's initial values. */
  raw?: ApiProjectLanding | null;
}) {
  const show = (key: keyof LandingView["sections"]) => landing.sections[key];
  const visibleOf = (key: keyof LandingView["sections"]) =>
    raw?.sections?.[key]?.visible ?? true;
  const sticky =
    landing.phone ||
    landing.whatsapp ||
    (show("enquire") && landing.cta.primary);

  return (
    <div className="bg-background">
      {show("hero") ? (
        <Hero landing={landing} raw={raw?.hero} />
      ) : (
        <HiddenSectionNotice section="hero" title="Hero" value={raw?.hero} empty={emptyHero} Fields={HeroFields} visible={visibleOf("hero")} />
      )}
      {show("about") && hasAbout(landing) ? (
        <About dict={landing.about} raw={raw?.about} visible={visibleOf("about")} />
      ) : (
        <HiddenSectionNotice section="about" title="About" value={raw?.about} empty={emptyAbout} Fields={AboutFields} visible={visibleOf("about")} />
      )}
      {show("residences") && hasResidences(landing) ? (
        <ProjectResidence
          dict={landing.residences}
          editControl={
            <SectionEditControl
              section="residences"
              title="Residences"
              value={raw?.residences}
              empty={emptyResidences}
              Fields={ResidencesFields}
              visible={visibleOf("residences")}
            />
          }
        />
      ) : (
        <HiddenSectionNotice
          section="residences"
          title="Residences"
          value={raw?.residences}
          empty={emptyResidences}
          Fields={ResidencesFields}
          visible={visibleOf("residences")}
        />
      )}
      {show("elevation") && landing.elevation.views.length ? (
        <Elevation dict={landing.elevation} raw={raw?.elevation} visible={visibleOf("elevation")} />
      ) : (
        <HiddenSectionNotice
          section="elevation"
          title="Elevation"
          value={raw?.elevation}
          empty={emptyElevation}
          Fields={ElevationFields}
          visible={visibleOf("elevation")}
        />
      )}
      {show("films") && landing.films.items.length ? (
        <Films dict={landing.films} raw={raw?.films} visible={visibleOf("films")} />
      ) : (
        <HiddenSectionNotice section="films" title="Films" value={raw?.films} empty={emptyFilms} Fields={FilmsFields} visible={visibleOf("films")} />
      )}
      {show("amenities") ||
      show("gallery") ||
      (visibleOf("amenities") && Boolean(raw?.amenities)) ||
      (visibleOf("gallery") && Boolean(raw?.gallery)) ? (
        <Lifestyle
          amenities={show("amenities") ? landing.amenities : null}
          amenitiesRaw={raw?.amenities}
          amenitiesVisible={visibleOf("amenities")}
          gallery={show("gallery") ? landing.gallery : null}
          galleryRaw={raw?.gallery}
          galleryVisible={visibleOf("gallery")}
          projectMapUrl={
            landing.location.mapLinkUrl || landing.location.mapEmbedUrl || ""
          }
          projectAddress={
            landing.location.mapHint ||
            landing.location.title ||
            landing.hero.location ||
            ""
          }
        />
      ) : null}
      {show("location") ||
      show("process") ||
      (visibleOf("location") && Boolean(raw?.location)) ||
      (visibleOf("process") && Boolean(raw?.process)) ? (
        <Place
          location={show("location") ? landing.location : null}
          locationRaw={raw?.location}
          locationVisible={visibleOf("location")}
          process={show("process") ? landing.process : null}
          processRaw={raw?.process}
          processVisible={visibleOf("process")}
        />
      ) : null}
      {show("cta") && hasCta(landing) ? (
        <LandingCta
          dict={landing.cta}
          raw={raw?.cta}
          phone={landing.phone}
          whatsapp={landing.whatsapp}
          visible={visibleOf("cta")}
        />
      ) : (
        <HiddenSectionNotice section="cta" title="Call to action" value={raw?.cta} empty={emptyCta} Fields={CtaFields} visible={visibleOf("cta")} />
      )}
      {show("reviews") && landing.reviews.items.length ? (
        <Reviews dict={landing.reviews} raw={raw?.reviews} visible={visibleOf("reviews")} />
      ) : (
        <HiddenSectionNotice
          section="reviews"
          title="Reviews"
          value={raw?.reviews}
          empty={emptyReviews}
          Fields={ReviewsFields}
          visible={visibleOf("reviews")}
        />
      )}
      {show("faq") ||
      show("enquire") ||
      (visibleOf("faq") && Boolean(raw?.faq)) ||
      (visibleOf("enquire") && Boolean(raw?.enquire)) ? (
        <Close
          faq={show("faq") ? landing.faq : null}
          faqRaw={raw?.faq}
          faqVisible={visibleOf("faq")}
          enquire={show("enquire") ? landing.enquire : null}
          enquireRaw={raw?.enquire}
          enquireVisible={visibleOf("enquire")}
          projectName={landing.projectName}
          source={landing.source}
          path={landing.path}
          phone={landing.phone}
          phoneAlt={landing.phoneAlt}
          whatsapp={landing.whatsapp}
        />
      ) : null}
      {show("custom") && hasCustom(landing) ? (
        <CustomContent dict={landing.custom} raw={raw?.custom} visible={visibleOf("custom")} />
      ) : (
        <HiddenSectionNotice
          section="custom"
          title="Custom Content"
          value={raw?.custom}
          empty={emptyCustom}
          Fields={CustomFields}
          visible={visibleOf("custom")}
        />
      )}
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
      <EditorBar
        publishing={raw ? {
          path: raw.path,
          isActive: raw.isActive,
          facebookUrl: raw.facebookUrl,
          phonePrimary: raw.phonePrimary,
          phoneSecondary: raw.phoneSecondary,
          whatsapp: raw.whatsapp,
          metaTitle: raw.metaTitle,
          metaTitleBn: raw.metaTitleBn,
          metaDescription: raw.metaDescription,
          metaDescriptionBn: raw.metaDescriptionBn,
          navEnquire: raw.navEnquire,
          navEnquireBn: raw.navEnquireBn,
        } : undefined}
      />
    </div>
  );
}

function hasCustom(landing: LandingView) {
  const row = landing.custom;
  return Boolean(row?.title || row?.body || row?.eyebrow);
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

function Hero({
  landing,
  raw,
  visible,
}: {
  landing: LandingView;
  raw?: ApiProjectLanding["hero"];
  visible?: boolean;
}) {
  const hero = landing.hero;
  const enquire = landing.enquire;
  const showForm = landing.sections.enquire;
  const images =
    hero.images?.length > 0
      ? hero.images
      : hero.image
        ? [hero.image]
        : [];

  if (
    !images.length &&
    !hero.title &&
    !hero.lead &&
    !hero.stats.length &&
    !showForm
  ) {
    return raw ? (
      <HiddenSectionNotice
        section="hero"
        title="Hero"
        value={raw}
        empty={emptyHero}
        Fields={HeroFields}
        visible={visible}
      />
    ) : null;
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#1b2318] min-h-[520px] lg:min-h-[580px] flex flex-col justify-between">
      {images.length ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <HeroBackdrop images={images} className="absolute inset-0 size-full object-cover" />
        </div>
      ) : null}
      {/* Smooth soft gradient overlay on the left fading seamlessly towards the right photo */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 z-1 w-full lg:w-[56%] bg-gradient-to-r from-black/90 via-black/60 via-55% to-transparent pointer-events-none"
      />

      <AppContainer className="relative z-10 py-12 sm:py-16 lg:py-20 flex-1 flex flex-col justify-center">
        <SectionEditControl
          section="hero"
          title="Hero"
          value={raw}
          empty={emptyHero}
          Fields={HeroFields}
          position="top-2 right-4 sm:top-4 sm:right-6"
          visible={visible}
        />
        <div className="max-w-lg lg:max-w-xl">
          <Reveal className="flex flex-col gap-4 text-white sm:gap-5">
            {hero.title ? (
              <Heading
                as="h1"
                size="h1"
                tone="inverse"
                weight="bold"
                className="!font-extrabold [text-shadow:0_2px_18px_rgba(0,0,0,0.8)] text-3xl sm:text-4xl lg:text-5xl leading-tight"
              >
                {hero.title}
              </Heading>
            ) : null}
            {hero.lead ? (
              <p className="max-w-md text-[15px] leading-relaxed text-white/95 [text-shadow:0_1px_8px_rgba(0,0,0,0.8)] sm:text-base sm:leading-7">
                {hero.lead}
              </p>
            ) : null}
            {hero.location ? (
              <p className="flex items-center gap-2 text-sm font-semibold text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
                <Icon name="fa-location-dot" size="xs" className="text-brand-green-light shrink-0" />
                <span>{hero.location}</span>
              </p>
            ) : null}
            {hero.ctaPrimary ? (
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap pt-1">
                <Button asChild className="h-11 px-6 font-bold shadow-lg">
                  <a href="#enquire">
                    {hero.ctaPrimary}
                    <Icon name="arrowRight" size="xs" />
                  </a>
                </Button>
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
        </div>
      </AppContainer>

      {hero.stats.length ? (
        <div className="relative z-10 border-t border-primary/30 bg-primary mt-auto">
          <AppContainer>
            <ul className="grid grid-cols-2 lg:grid-cols-4">
              {hero.stats.map((stat, index) => (
                <li
                  key={`${stat.label}-${index}`}
                  className={`flex items-center gap-2.5 px-3 py-3 sm:gap-3.5 sm:px-6 sm:py-5 ${
                    index > 0 ? "lg:border-l lg:border-white/20" : ""
                  } ${index % 2 === 1 ? "border-l border-white/20" : ""} ${
                    index > 1 ? "border-t border-white/20 lg:border-t-0" : ""
                  }`}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/25 bg-primary-foreground/15 text-primary-foreground sm:size-10 sm:rounded-lg">
                    <Icon name={stat.icon || "check"} size="sm" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-xl font-extrabold tracking-tight text-primary-foreground sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-primary-foreground/85">
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

function About({
  dict,
  raw,
  visible,
}: {
  dict: LandingView["about"];
  raw?: ApiProjectLanding["about"];
  visible?: boolean;
}) {
  return (
    <Section id="about" spacing="sm" className="scroll-mt-24">
      <SectionEditControl
        section="about"
        title="About"
        value={raw}
        empty={emptyAbout}
        Fields={AboutFields}
        visible={visible}
      />
      <div
        className={cn(
          "grid items-stretch gap-6 lg:gap-8",
          dict.image ? "lg:grid-cols-[0.95fr_1.05fr]" : "lg:grid-cols-1",
        )}
      >
        <div className="flex min-w-0 flex-col">
          {dict.eyebrow || dict.title || dict.body ? (
            <SectionHeading
              eyebrow={dict.eyebrow || undefined}
              title={dict.title || dict.eyebrow}
              description={dict.body || undefined}
              titleClassName={landingTitleClass}
            />
          ) : null}
          {dict.points.length ? (
            <ul className="mt-6 grid gap-3">
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
          <Reveal delay={0.08} className="h-full min-w-0">
            {/*
              Stretch to the left column height so the flyer reads large.
              object-contain keeps the full composite (no squash / crop).
            */}
            <div className="relative h-full min-h-112 overflow-hidden rounded-lg bg-muted sm:min-h-128 lg:min-h-full">
              <ImageFrame
                src={dict.image}
                alt={dict.title}
                ratio="auto"
                rounded="lg"
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="absolute inset-0 size-full min-h-112 rounded-lg bg-transparent sm:min-h-128"
                imageClassName="!object-contain object-center p-1 sm:p-2"
              />
            </div>
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}

function Elevation({
  dict,
  raw,
  visible,
}: {
  dict: LandingView["elevation"];
  raw?: ApiProjectLanding["elevation"];
  visible?: boolean;
}) {
  return (
    <Section id="elevation" spacing="sm" className="scroll-mt-24">
      <SectionEditControl
        section="elevation"
        title="Elevation"
        value={raw}
        empty={emptyElevation}
        Fields={ElevationFields}
        visible={visible}
      />
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

function Films({
  dict,
  raw,
  visible,
}: {
  dict: LandingView["films"];
  raw?: ApiProjectLanding["films"];
  visible?: boolean;
}) {
  return (
    <Section
      id="video"
      spacing="sm"
      className="scroll-mt-24 border-y border-border bg-muted/30"
    >
      <SectionEditControl
        section="films"
        title="Films"
        value={raw}
        empty={emptyFilms}
        Fields={FilmsFields}
        visible={visible}
      />
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

function Reviews({
  dict,
  raw,
  visible,
}: {
  dict: LandingView["reviews"];
  raw?: ApiProjectLanding["reviews"];
  visible?: boolean;
}) {
  return (
    <Section
      id="reviews"
      spacing="sm"
      className="scroll-mt-24 border-y border-border bg-muted/30"
    >
      <SectionEditControl
        section="reviews"
        title="Reviews"
        value={raw}
        empty={emptyReviews}
        Fields={ReviewsFields}
        visible={visible}
      />
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
  amenitiesRaw,
  amenitiesVisible,
  gallery,
  galleryRaw,
  galleryVisible,
  projectMapUrl = "",
  projectAddress = "",
}: {
  amenities: LandingView["amenities"] | null;
  amenitiesRaw?: ApiProjectLanding["amenities"];
  amenitiesVisible?: boolean;
  gallery: LandingView["gallery"] | null;
  galleryRaw?: ApiProjectLanding["gallery"];
  galleryVisible?: boolean;
  projectMapUrl?: string;
  projectAddress?: string;
}) {
  const showAmenities = Boolean(amenities?.items.length);
  const showGallery = Boolean(gallery?.shots.length);
  // An editor still needs the section (and its edit button) to add the
  // first photo to a gallery that's currently empty — `raw` is only ever
  // passed for a logged-in editor's render, so its presence here doubles as
  // that signal without this Server Component needing `useEditor()` itself.
  if (!showAmenities && !showGallery && !galleryRaw && !amenitiesRaw) return null;

  return (
    <Section id="lifestyle" spacing="sm" className="scroll-mt-24">
      {amenities ? (
        <SectionEditControl
          section="amenities"
          title="Amenities"
          value={amenitiesRaw}
          empty={emptyAmenities}
          Fields={AmenitiesFields}
          visible={amenitiesVisible}
        />
      ) : (
        <HiddenSectionNotice
          section="amenities"
          title="Amenities"
          value={amenitiesRaw}
          empty={emptyAmenities}
          Fields={AmenitiesFields}
          visible={amenitiesVisible}
        />
      )}
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
            {amenities.items.map((item, index) => {
              const mapUrl = item.mapUrl?.trim() || "";
              // Pin only when admin pasted a Maps link.
              if (!mapUrl && !item.title && !item.body) return null;

              const bn = /[\u0980-\u09FF]/.test(item.title || item.body || "");
              const { href, distance } = mapUrl
                ? resolveAmenityMaps({
                    projectMapUrl,
                    projectAddress,
                    placeMapUrl: mapUrl,
                    placeName: item.title,
                    manualDistance: item.distance,
                    bn,
                  })
                : { href: "", distance: item.distance?.trim() || "" };

              return (
                <li
                  key={`${item.title}-${index}`}
                  className={cn(
                    `relative flex h-full gap-3 p-4 ${landingCardClass}`,
                    mapUrl && href && "pr-14",
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon name={item.icon || "check"} size="sm" />
                  </span>
                  <div className="min-w-0 flex-1">
                    {item.title ? (
                      <h3 className="font-heading text-sm font-extrabold text-foreground">
                        {item.title}
                      </h3>
                    ) : null}
                    {distance ? (
                      <p className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                        <Icon name="fa-solid fa-route" size="xs" />
                        {bn ? "প্রজেক্ট থেকে" : "From project"} {distance}
                      </p>
                    ) : null}
                    {item.body ? (
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {item.body}
                      </p>
                    ) : null}
                  </div>
                  {mapUrl && href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={
                        distance
                          ? `${item.title} — ${distance}`
                          : `${item.title || "Place"} on Google Maps`
                      }
                      title={
                        bn
                          ? "প্রজেক্ট থেকে দূরত্ব / রুট দেখুন"
                          : "See route from project"
                      }
                      className="absolute top-3.5 right-3.5 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 hover:bg-primary/90"
                    >
                      <Icon name="fa-solid fa-location-dot" size="sm" />
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      {(showGallery && gallery) || galleryRaw ? (
        <div className={cn("relative", showAmenities ? "mt-10 pt-2" : undefined)}>
          <SectionEditControl
            section="gallery"
            title="Gallery"
            value={galleryRaw}
            empty={emptyGallery}
            Fields={GalleryFields}
            position="top-0 right-0"
            visible={galleryVisible}
          />
          {gallery?.eyebrow || gallery?.title ? (
            <SectionHeading
              eyebrow={gallery?.eyebrow || undefined}
              title={gallery?.title || gallery?.eyebrow}
              titleClassName={landingTitleClass}
            />
          ) : null}
          {gallery?.shots ? (
            <ProjectGallery
              shots={gallery.shots}
              openLabel={gallery.open}
              closeLabel={gallery.close}
            />
          ) : null}
        </div>
      ) : null}
    </Section>
  );
}

function Place({
  location,
  locationRaw,
  locationVisible,
  process,
  processRaw,
  processVisible,
}: {
  location: LandingView["location"] | null;
  locationRaw?: ApiProjectLanding["location"];
  locationVisible?: boolean;
  process: LandingView["process"] | null;
  processRaw?: ApiProjectLanding["process"];
  processVisible?: boolean;
}) {
  const showLocation = Boolean(
    location &&
      (location.title ||
        location.description ||
        location.mapEmbedUrl ||
        location.facts.length),
  );
  const showProcess = Boolean(process?.steps.length);
  // Same empty-section allowance as Lifestyle: an editor needs the section
  // (and its buttons) present to add first content or re-enable it.
  if (!showLocation && !showProcess && !locationRaw && !processRaw) return null;

  return (
    <Section
      id="place"
      spacing="sm"
      className="scroll-mt-24 border-y border-border bg-muted/30"
    >
      {location ? (
        <SectionEditControl
          section="location"
          title="Location"
          value={locationRaw}
          empty={emptyLocation}
          Fields={LocationFields}
          visible={locationVisible}
        />
      ) : (
        <HiddenSectionNotice
          section="location"
          title="Location"
          value={locationRaw}
          empty={emptyLocation}
          Fields={LocationFields}
          visible={locationVisible}
        />
      )}
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
          {(showProcess && process) || processRaw ? (
            <div className="relative mt-2 pt-2">
              <SectionEditControl
                section="process"
                title="Process"
                value={processRaw}
                empty={emptyProcess}
                Fields={ProcessFields}
                position="top-0 right-0"
                visible={processVisible}
              />
              {process?.eyebrow ? (
                <p className="font-heading text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  {process.eyebrow}
                </p>
              ) : null}
              {process?.title ? (
                <h3 className="mt-2 font-heading text-lg font-extrabold text-foreground pr-10">
                  {process.title}
                </h3>
              ) : null}
              <ol className="mt-4 grid gap-3">
                {(process?.steps || []).map((step, index) => (
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
  faqRaw,
  faqVisible,
  enquire,
  enquireRaw,
  enquireVisible,
  projectName,
  source,
  path,
  phone,
  phoneAlt,
  whatsapp,
}: {
  faq: LandingView["faq"] | null;
  faqRaw?: ApiProjectLanding["faq"];
  faqVisible?: boolean;
  enquire: LandingView["enquire"] | null;
  enquireRaw?: ApiProjectLanding["enquire"];
  enquireVisible?: boolean;
  projectName: string;
  source: string;
  path: string;
  phone: string;
  phoneAlt: string;
  whatsapp: string;
}) {
  // Same empty-section allowance as Gallery: an editor needs the block (and
  // its button) present to add the very first question.
  const showFaq = Boolean(faq?.items.length) || Boolean(faqRaw);
  const showEnquire = Boolean(enquire) || Boolean(enquireRaw);

  return (
    <Section
      id="enquire"
      spacing="sm"
      className="scroll-mt-24 !pb-4 sm:!pb-6"
    >
      <div
        className={cn(
          "grid items-start gap-6 lg:gap-8",
          showFaq && showEnquire
            ? "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
            : "lg:grid-cols-1",
        )}
      >
        {showFaq && faq ? (
          <div id="faq" className="relative min-w-0 scroll-mt-24">
            <SectionEditControl
              section="faq"
              title="FAQ"
              value={faqRaw}
              empty={emptyFaq}
              Fields={FaqFields}
              visible={faqVisible}
            />
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
        ) : showFaq ? (
          <HiddenSectionNotice
            section="faq"
            title="FAQ"
            value={faqRaw}
            empty={emptyFaq}
            Fields={FaqFields}
            visible={faqVisible}
          />
        ) : null}

        {showEnquire && enquire ? (
          <aside className="relative order-first min-w-0 self-start lg:sticky lg:top-28 lg:order-none">
            <SectionEditControl
              section="enquire"
              title="Enquire"
              value={enquireRaw}
              empty={emptyEnquire}
              Fields={EnquireFields}
              visible={enquireVisible}
            />
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
              <ProjectLeadForm
                dict={enquire.form}
                projectName={projectName}
                source={source}
                path={path}
              />
            </div>
          </aside>
        ) : showEnquire ? (
          <HiddenSectionNotice
            section="enquire"
            title="Enquire"
            value={enquireRaw}
            empty={emptyEnquire}
            Fields={EnquireFields}
            visible={enquireVisible}
          />
        ) : null}
      </div>
    </Section>
  );
}

/** Free-form rich HTML band at the bottom of the landing (admin TinyMCE). */
function CustomContent({
  dict,
  raw,
  visible,
}: {
  dict: LandingView["custom"];
  raw?: ApiProjectLanding["custom"];
  visible?: boolean;
}) {
  return (
    <Section
      id="custom"
      spacing="none"
      className="scroll-mt-24 border-t border-border/60 bg-background pt-8 pb-8 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14"
    >
      <SectionEditControl
        section="custom"
        title="Custom"
        value={raw}
        empty={emptyCustom}
        Fields={CustomFields}
        visible={visible}
      />
      <div className="landing-custom">
        {dict.eyebrow || dict.title ? (
          <SectionHeading
            eyebrow={dict.eyebrow || undefined}
            title={dict.title || dict.eyebrow}
            titleClassName={landingTitleClass}
            className="landing-custom__header"
            animate={false}
          />
        ) : null}
        <RichText html={dict.body} className="landing-custom-richtext" />
      </div>
    </Section>
  );
}

function LandingCta({
  dict,
  raw,
  phone,
  whatsapp,
  visible,
}: {
  dict: LandingView["cta"];
  raw?: ApiProjectLanding["cta"];
  phone: string;
  whatsapp: string;
  visible?: boolean;
}) {
  return (
    <Section spacing="sm">
      <SectionEditControl
        section="cta"
        title="Call to action"
        value={raw}
        empty={emptyCta}
        Fields={CtaFields}
        visible={visible}
      />
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
              className="h-10 w-full border-white/50 bg-white/15 px-4 font-bold text-white backdrop-blur-sm hover:bg-white/25 hover:text-white sm:h-9 sm:w-auto shadow-sm"
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
              className="h-10 w-full bg-[#25D366] hover:bg-[#20bd5a] px-4 font-bold text-white shadow-md shadow-[#25D366]/30 hover:shadow-[0_0_18px_rgba(37,211,102,0.5)] sm:h-9 sm:w-auto transition-all"
            >
              <a
                href={whatsappHref(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
              >
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

  if (!phone && !phoneAlt && !whatsapp) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      {phone ? (
        <a
          href={telHref(phone)}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-xs font-bold transition-all duration-200 shadow-sm",
            onDark
              ? "border border-white/30 bg-white/15 text-white backdrop-blur-md hover:bg-white/25 hover:border-white/50 hover:scale-[1.02]"
              : "border border-primary/40 bg-primary/5 text-foreground hover:bg-primary/15 hover:border-primary hover:scale-[1.02]",
          )}
          aria-label={`${phoneLabel} ${phone}`}
        >
          <span
            className={cn(
              "flex size-5.5 items-center justify-center rounded-full shrink-0",
              onDark
                ? "bg-white/25 text-white"
                : "bg-primary text-white shadow-xs"
            )}
          >
            <Icon name="phone" size="xs" />
          </span>
          <span className="tracking-wide font-bold">{phone}</span>
        </a>
      ) : null}
      {phoneAlt ? (
        <a
          href={telHref(phoneAlt)}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-xs font-bold transition-all duration-200 shadow-sm",
            onDark
              ? "border border-white/30 bg-white/15 text-white backdrop-blur-md hover:bg-white/25 hover:border-white/50 hover:scale-[1.02]"
              : "border border-primary/40 bg-primary/5 text-foreground hover:bg-primary/15 hover:border-primary hover:scale-[1.02]",
          )}
          aria-label={`${phoneLabel} ${phoneAlt}`}
        >
          <span
            className={cn(
              "flex size-5.5 items-center justify-center rounded-full shrink-0",
              onDark
                ? "bg-white/25 text-white"
                : "bg-primary text-white shadow-xs"
            )}
          >
            <Icon name="phone" size="xs" />
          </span>
          <span className="tracking-wide font-bold">{phoneAlt}</span>
        </a>
      ) : null}
      {whatsapp ? (
        <a
          href={whatsappHref(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-xs font-bold transition-all duration-200 shadow-sm",
            onDark
              ? "border border-[#25D366]/60 bg-[#25D366]/30 text-white backdrop-blur-md hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[0_0_18px_rgba(37,211,102,0.45)] hover:scale-[1.03]"
              : "border border-[#25D366]/50 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white hover:border-[#25D366] hover:shadow-[0_0_14px_rgba(37,211,102,0.35)] hover:scale-[1.03]",
          )}
          aria-label={`${whatsappLabel} ${whatsapp}`}
        >
          <span className="flex size-5.5 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs shrink-0">
            <Icon name="whatsapp" size="xs" />
          </span>
          <span className="font-semibold">{whatsappLabel || "হোয়াটসঅ্যাপ"}</span>
        </a>
      ) : null}
    </div>
  );
}

export const ZoomAlZaharaLanding = ProjectLanding;
