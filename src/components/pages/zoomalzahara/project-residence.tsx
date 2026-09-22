"use client";

import { useMemo, useState } from "react";

import { Icon, type IconName } from "@/components/common/icon";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { ImageFrame } from "@/components/media/image-frame";
import { Reveal } from "@/components/motion/reveal";
import { landingCardClass, landingTitleClass } from "@/components/pages/zoomalzahara/landing-card";
import { ThumbRail } from "@/components/pages/zoomalzahara/thumb-rail";
import {
  ImagePreview,
  PreviewTrigger,
} from "@/components/pages/zoomalzahara/image-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LandingView } from "@/server/features/project-landing";

const UNIT_ICONS: IconName[] = [
  "fa-solid fa-bed",
  "fa-solid fa-bath",
  "fa-solid fa-ruler-combined",
];
const HIGHLIGHT_ICONS: IconName[] = [
  "fa-solid fa-kitchen-set",
  "fa-solid fa-door-open",
  "fa-solid fa-window-maximize",
  "fa-solid fa-elevator",
  "fa-solid fa-building",
  "fa-solid fa-stairs",
];

export function ProjectResidence({
  dict,
}: {
  dict: LandingView["residences"];
}) {
  const unit = dict.unit;
  const shots = useMemo(
    () => dict.images.filter((shot) => shot.src),
    [dict.images],
  );
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const current = shots[active] ?? shots[0];
  const specs = [unit.beds, unit.baths, unit.size].filter(Boolean);

  return (
    <Section
      id="residences"
      spacing="sm"
      className="scroll-mt-24 border-y border-border bg-muted/30"
    >
      <div
        className={cn(
          "grid items-stretch gap-6 lg:gap-8",
          current ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-1",
        )}
      >
        {current ? (
          <Reveal className="flex h-full min-w-0 flex-col gap-3">
            {/*
              flex-1 stage fills leftover height beside the right card so there
              is no empty white gap under the thumbs. Image stays object-contain.
            */}
            <div className="relative min-h-72 flex-1 overflow-hidden rounded-lg bg-muted sm:min-h-80">
              <ImageFrame
                src={current.src}
                alt={current.alt}
                ratio="auto"
                rounded="lg"
                hover="zoom"
                overlay
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="absolute inset-0 size-full rounded-lg"
                imageClassName="object-contain object-center"
              />
              <PreviewTrigger
                label={dict.preview}
                onClick={() => setOpen(true)}
              />
              <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                <p className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(shots.length).padStart(2, "0")}
                </p>
                <p className="mt-1 font-heading text-sm font-bold text-white">
                  {current.alt}
                </p>
              </div>
            </div>
            {shots.length > 1 ? (
              <ThumbRail
                columns={4}
                desktop="none"
                className="mt-0 shrink-0"
                itemClassName="basis-[42%] sm:basis-[30%] lg:basis-[24%]"
              >
                {shots.map((shot, index) => (
                  <button
                    key={`${shot.src}-${index}`}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-pressed={index === active}
                    aria-label={shot.alt}
                    className={cn(
                      "block w-full cursor-pointer overflow-hidden rounded-lg border bg-muted",
                      index === active
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent hover:border-primary/40",
                    )}
                  >
                    <ImageFrame
                      src={shot.src}
                      alt={shot.alt}
                      ratio="4/3"
                      rounded="lg"
                      sizes="(min-width: 1024px) 12vw, 40vw"
                      imageClassName="object-cover object-center"
                    />
                  </button>
                ))}
              </ThumbRail>
            ) : null}
          </Reveal>
        ) : null}

        <div className="flex h-full flex-col">
          {dict.eyebrow || dict.title || dict.description ? (
            <SectionHeading
              eyebrow={dict.eyebrow || undefined}
              title={dict.title || dict.eyebrow}
              description={dict.description || undefined}
              titleClassName={landingTitleClass}
            />
          ) : null}
          <div className={`mt-6 flex flex-1 flex-col p-5 ${landingCardClass}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {unit.name ? (
                    <h3 className="font-heading text-lg font-extrabold text-foreground">
                      {unit.name}
                    </h3>
                  ) : null}
                  {dict.featured ? (
                    <Badge className="bg-primary text-primary-foreground">
                      {dict.featured}
                    </Badge>
                  ) : null}
                </div>
                {unit.note ? (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {unit.note}
                  </p>
                ) : null}
              </div>
              {unit.price ? (
                <p className="font-heading text-sm font-semibold text-primary">
                  {unit.price}
                </p>
              ) : null}
            </div>

            {specs.length ? (
              <ul className="mt-4 grid grid-cols-3 gap-2">
                {specs.map((spec, specIndex) => (
                  <li
                    key={`${spec}-${specIndex}`}
                    className="flex flex-col gap-1.5 rounded-lg bg-muted/70 px-3 py-2.5"
                  >
                    <Icon
                      name={UNIT_ICONS[specIndex] ?? "check"}
                      size="xs"
                      className="text-primary"
                    />
                    <span className="text-xs font-semibold leading-snug text-foreground">
                      {spec}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {dict.highlights.length ? (
              <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
                {dict.highlights.map((item, index) => (
                  <li
                    key={`${item.label}-${index}`}
                    className="flex items-center justify-between gap-3 px-3 py-2.5"
                  >
                    <span className="flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon
                          name={item.icon || HIGHLIGHT_ICONS[index] || "check"}
                          size="xs"
                        />
                      </span>
                      {item.label}
                    </span>
                    {item.value ? (
                      <span className="shrink-0 font-heading text-sm font-bold text-foreground">
                        {item.value}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}

            {dict.cta ? (
              <div className="mt-5">
                <Button asChild>
                  <a href="#enquire">
                    {dict.cta}
                    <Icon name="arrowRight" size="xs" />
                  </a>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {shots.length ? (
        <ImagePreview
          images={shots}
          index={active}
          open={open}
          onClose={() => setOpen(false)}
          onIndexChange={setActive}
          closeLabel={dict.close}
          ratio="auto"
          contain
        />
      ) : null}
    </Section>
  );
}
