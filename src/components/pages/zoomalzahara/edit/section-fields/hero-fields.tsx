"use client";

import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { TextPair } from "../field-inputs";
import { ImageField } from "../image-field";
import { resolveMedia } from "../resolve-media";

export type HeroValue = NonNullable<ApiProjectLanding["hero"]>;

export const emptyHero: HeroValue = {
  image: null,
  images: [],
  badge: "",
  badgeBn: "",
  handover: "",
  handoverBn: "",
  eyebrow: "",
  eyebrowBn: "",
  title: "",
  titleBn: "",
  lead: "",
  leadBn: "",
  location: "",
  locationBn: "",
  ctaPrimary: "",
  ctaPrimaryBn: "",
  ctaSecondary: "",
  ctaSecondaryBn: "",
  stats: [],
};

export function HeroFields({
  value,
  setValue,
}: {
  value: HeroValue;
  setValue: (next: HeroValue) => void;
}) {
  const images = value.images ?? [];

  return (
    <>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">
          Background photos
        </p>
        <div className="flex flex-wrap gap-3">
          {images.map((img, index) => {
            const resolved = resolveMedia(img);
            return (
              <ImageField
                key={index}
                previewUrl={resolved?.url}
                onChange={(media) => {
                  const next = images.slice();
                  next[index] = media.id;
                  setValue({ ...value, images: next });
                }}
              />
            );
          })}
          <ImageField
            onChange={(media) =>
              setValue({ ...value, images: [...images, media.id] })
            }
          />
        </div>
      </div>

      <TextPair
        label="Badge"
        en={value.badge ?? ""}
        bn={value.badgeBn ?? ""}
        onEnChange={(v) => setValue({ ...value, badge: v })}
        onBnChange={(v) => setValue({ ...value, badgeBn: v })}
        maxLength={30}
      />
      <TextPair
        label="Handover note"
        en={value.handover ?? ""}
        bn={value.handoverBn ?? ""}
        onEnChange={(v) => setValue({ ...value, handover: v })}
        onBnChange={(v) => setValue({ ...value, handoverBn: v })}
        maxLength={60}
      />
      <TextPair
        label="Eyebrow"
        en={value.eyebrow ?? ""}
        bn={value.eyebrowBn ?? ""}
        onEnChange={(v) => setValue({ ...value, eyebrow: v })}
        onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
        maxLength={50}
      />
      <TextPair
        label="Title"
        en={value.title ?? ""}
        bn={value.titleBn ?? ""}
        onEnChange={(v) => setValue({ ...value, title: v })}
        onBnChange={(v) => setValue({ ...value, titleBn: v })}
        maxLength={100}
      />
      <TextPair
        label="Lead paragraph"
        en={value.lead ?? ""}
        bn={value.leadBn ?? ""}
        onEnChange={(v) => setValue({ ...value, lead: v })}
        onBnChange={(v) => setValue({ ...value, leadBn: v })}
        multiline
        maxLength={300}
      />
      <TextPair
        label="Location"
        en={value.location ?? ""}
        bn={value.locationBn ?? ""}
        onEnChange={(v) => setValue({ ...value, location: v })}
        onBnChange={(v) => setValue({ ...value, locationBn: v })}
        maxLength={100}
      />
      <TextPair
        label="Primary button"
        en={value.ctaPrimary ?? ""}
        bn={value.ctaPrimaryBn ?? ""}
        onEnChange={(v) => setValue({ ...value, ctaPrimary: v })}
        onBnChange={(v) => setValue({ ...value, ctaPrimaryBn: v })}
        maxLength={30}
      />
      <TextPair
        label="Secondary button"
        en={value.ctaSecondary ?? ""}
        bn={value.ctaSecondaryBn ?? ""}
        onEnChange={(v) => setValue({ ...value, ctaSecondary: v })}
        onBnChange={(v) => setValue({ ...value, ctaSecondaryBn: v })}
        maxLength={30}
      />

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Stats row</p>
        <EditableList
          items={value.stats ?? []}
          onChange={(stats) => setValue({ ...value, stats })}
          makeItem={() => ({ value: "", valueBn: "", label: "", labelBn: "", icon: "" })}
          addLabel="Add stat"
          renderItem={(stat, _index, update) => (
            <div className="grid grid-cols-2 gap-2">
              <TextPair
                label="Value"
                en={stat.value ?? ""}
                bn={stat.valueBn ?? ""}
                onEnChange={(v) => update({ ...stat, value: v })}
                onBnChange={(v) => update({ ...stat, valueBn: v })}
                maxLength={20}
              />
              <TextPair
                label="Label"
                en={stat.label ?? ""}
                bn={stat.labelBn ?? ""}
                onEnChange={(v) => update({ ...stat, label: v })}
                onBnChange={(v) => update({ ...stat, labelBn: v })}
                maxLength={40}
              />
            </div>
          )}
        />
      </div>
    </>
  );
}
