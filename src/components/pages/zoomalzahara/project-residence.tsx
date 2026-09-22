"use client";

import { useMemo, useState } from "react";

import { Icon, type IconName } from "@/components/common/icon";
import { Section } from "@/components/common/section";
import { SectionHeading } from "@/components/common/section-heading";
import { ImageFrame } from "@/components/media/image-frame";
import { Reveal } from "@/components/motion/reveal";
import {
  ImagePreview,
  PreviewTrigger,
} from "@/components/pages/zoomalzahara/image-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ZOOM_AL_ZAHARA_GALLERY,
  ZOOM_AL_ZAHARA_RESIDENCE,
} from "@/data/zoomalzahara";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

const UNIT_ICONS: IconName[] = ["bed", "bath", "area"];
const HIGHLIGHT_ICONS: IconName[] = [
  "kitchen",
  "split",
  "balcony",
  "lift",
  "building",
  "stairs",
];

export function ProjectResidence({
  dict,
}: {
  dict: Dictionary["zoomalzahara"]["residences"];
}) {
  const unit = dict.units[0];
  const shots = useMemo(
    () => [
      { src: ZOOM_AL_ZAHARA_RESIDENCE, alt: unit.name },
      ...ZOOM_AL_ZAHARA_GALLERY.slice(0, 3).map((shot) => ({
        src: shot.src,
        alt: shot.alt,
      })),
    ],
    [unit.name],
  );
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const current = shots[active] ?? shots[0];

  return (
    <Section
      id="residences"
      spacing="sm"
      className="scroll-mt-24 border-y border-border bg-muted/30"
    >
      <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <Reveal className="flex min-h-80 flex-col gap-3">
          <div className="relative min-h-80 flex-1 overflow-hidden rounded-lg">
            <ImageFrame
              src={current.src}
              alt={current.alt}
              ratio="auto"
              rounded="lg"
              hover="zoom"
              overlay
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="h-full min-h-80 lg:min-h-128"
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
          <ul className="grid grid-cols-4 gap-2">
            {shots.map((shot, index) => (
              <li key={shot.src}>
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={index === active}
                  aria-label={shot.alt}
                  className={cn(
                    "block w-full cursor-pointer overflow-hidden rounded-lg border",
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
                    sizes="12vw"
                  />
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="flex flex-col">
          <SectionHeading
            eyebrow={dict.eyebrow}
            title={dict.title}
            description={dict.description}
            titleClassName="lg:whitespace-normal"
          />
          <div className="mt-6 flex flex-1 flex-col rounded-lg border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {unit.name}
                  </h3>
                  <Badge className="bg-primary text-primary-foreground">
                    {dict.featured}
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {unit.note}
                </p>
              </div>
              <p className="font-heading text-sm font-semibold text-primary">
                {unit.price}
              </p>
            </div>

            <ul className="mt-4 grid grid-cols-3 gap-2">
              {[unit.beds, unit.baths, unit.size].map((spec, specIndex) => (
                <li
                  key={spec}
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

            <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
              {dict.highlights.map((item, index) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-3 px-3 py-2.5"
                >
                  <span className="flex min-w-0 items-center gap-2.5 text-sm text-muted-foreground">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon
                        name={HIGHLIGHT_ICONS[index] ?? "check"}
                        size="xs"
                      />
                    </span>
                    {item.label}
                  </span>
                  <span className="shrink-0 font-heading text-sm font-bold text-foreground">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <Button asChild>
                <a href="#enquire">
                  {dict.cta}
                  <Icon name="arrowRight" size="xs" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ImagePreview
        images={shots}
        index={active}
        open={open}
        onClose={() => setOpen(false)}
        onIndexChange={setActive}
        closeLabel={dict.close}
      />
    </Section>
  );
}
