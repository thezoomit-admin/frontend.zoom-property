"use client";

import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { TextPair } from "../field-inputs";
import { ImageField } from "../image-field";
import { resolveMedia } from "../resolve-media";

export type ResidencesValue = NonNullable<ApiProjectLanding["residences"]>;

export const emptyResidences: ResidencesValue = {
  images: [],
  eyebrow: "",
  eyebrowBn: "",
  title: "",
  titleBn: "",
  description: "",
  descriptionBn: "",
  featured: "",
  featuredBn: "",
  cta: "",
  ctaBn: "",
  preview: "",
  previewBn: "",
  close: "",
  closeBn: "",
  unit: {
    name: "", nameBn: "", beds: "", bedsBn: "", baths: "", bathsBn: "",
    size: "", sizeBn: "", price: "", priceBn: "", note: "", noteBn: "",
  },
  highlights: [],
};

export function ResidencesFields({
  value,
  setValue,
}: {
  value: ResidencesValue;
  setValue: (next: ResidencesValue) => void;
}) {
  const images = value.images ?? [];
  const unit = value.unit ?? emptyResidences.unit!;

  return (
    <>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Unit photos</p>
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
        label="Description"
        en={value.description ?? ""}
        bn={value.descriptionBn ?? ""}
        onEnChange={(v) => setValue({ ...value, description: v })}
        onBnChange={(v) => setValue({ ...value, descriptionBn: v })}
        multiline
        maxLength={400}
      />
      <TextPair
        label="Featured badge"
        en={value.featured ?? ""}
        bn={value.featuredBn ?? ""}
        onEnChange={(v) => setValue({ ...value, featured: v })}
        onBnChange={(v) => setValue({ ...value, featuredBn: v })}
        maxLength={30}
      />

      <div className="space-y-2 rounded-lg border border-border p-3">
        <p className="text-sm font-medium text-foreground">Featured unit</p>
        <div className="grid grid-cols-2 gap-2">
          <TextPair label="Name" en={unit.name ?? ""} bn={unit.nameBn ?? ""}
            onEnChange={(v) => setValue({ ...value, unit: { ...unit, name: v } })}
            onBnChange={(v) => setValue({ ...value, unit: { ...unit, nameBn: v } })}
            maxLength={60} />
          <TextPair label="Price note" en={unit.price ?? ""} bn={unit.priceBn ?? ""}
            onEnChange={(v) => setValue({ ...value, unit: { ...unit, price: v } })}
            onBnChange={(v) => setValue({ ...value, unit: { ...unit, priceBn: v } })}
            maxLength={40} />
          <TextPair label="Beds" en={unit.beds ?? ""} bn={unit.bedsBn ?? ""}
            onEnChange={(v) => setValue({ ...value, unit: { ...unit, beds: v } })}
            onBnChange={(v) => setValue({ ...value, unit: { ...unit, bedsBn: v } })}
            maxLength={20} />
          <TextPair label="Baths" en={unit.baths ?? ""} bn={unit.bathsBn ?? ""}
            onEnChange={(v) => setValue({ ...value, unit: { ...unit, baths: v } })}
            onBnChange={(v) => setValue({ ...value, unit: { ...unit, bathsBn: v } })}
            maxLength={20} />
          <TextPair label="Size" en={unit.size ?? ""} bn={unit.sizeBn ?? ""}
            onEnChange={(v) => setValue({ ...value, unit: { ...unit, size: v } })}
            onBnChange={(v) => setValue({ ...value, unit: { ...unit, sizeBn: v } })}
            maxLength={30} />
        </div>
        <TextPair label="Note" en={unit.note ?? ""} bn={unit.noteBn ?? ""}
          onEnChange={(v) => setValue({ ...value, unit: { ...unit, note: v } })}
          onBnChange={(v) => setValue({ ...value, unit: { ...unit, noteBn: v } })}
          maxLength={150} />
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Highlights</p>
        <EditableList
          items={value.highlights ?? []}
          onChange={(highlights) => setValue({ ...value, highlights })}
          makeItem={() => ({ label: "", labelBn: "", value: "", valueBn: "", icon: "" })}
          addLabel="Add highlight"
          renderItem={(item, _index, update) => (
            <div className="grid grid-cols-2 gap-2">
              <TextPair label="Label" en={item.label ?? ""} bn={item.labelBn ?? ""}
                onEnChange={(v) => update({ ...item, label: v })}
                onBnChange={(v) => update({ ...item, labelBn: v })}
                maxLength={50} />
              <TextPair label="Value" en={item.value ?? ""} bn={item.valueBn ?? ""}
                onEnChange={(v) => update({ ...item, value: v })}
                onBnChange={(v) => update({ ...item, valueBn: v })}
                maxLength={40} />
            </div>
          )}
        />
      </div>
    </>
  );
}
