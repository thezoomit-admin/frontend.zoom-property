"use client";

import { Building2, Layers } from "lucide-react";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { FormSectionCard, TextPair } from "../field-inputs";
import { ImageField } from "../image-field";
import { resolveMedia } from "../resolve-media";

export type ElevationValue = NonNullable<ApiProjectLanding["elevation"]>;

export const emptyElevation: ElevationValue = {
  eyebrow: "",
  eyebrowBn: "",
  title: "",
  titleBn: "",
  description: "",
  descriptionBn: "",
  preview: "",
  previewBn: "",
  close: "",
  closeBn: "",
  views: [],
};

export function ElevationFields({
  value,
  setValue,
}: {
  value: ElevationValue;
  setValue: (next: ElevationValue) => void;
}) {
  return (
    <div className="space-y-6">
      {/* ── Architectural Overview Card ──────────────────────────────── */}
      <FormSectionCard
        title="Elevation & Architectural Narrative"
        description="Section header, architectural introduction, and lightbox button labels."
        icon={Building2}
      >
        <TextPair
          label="Section Eyebrow"
          description="Small tag above the elevation title"
          en={value.eyebrow ?? ""}
          bn={value.eyebrowBn ?? ""}
          onEnChange={(v) => setValue({ ...value, eyebrow: v })}
          onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
          placeholderEn="e.g., Masterpiece of Modern Design"
          placeholderBn="যেমন: আধুনিক স্থাপত্যের অনন্য নিদর্শন"
          maxLength={50}
        />

        <TextPair
          label="Main Elevation Title"
          description="Main heading of the architectural elevation section"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., Majestic Elevation & Structural Symphony"
          placeholderBn="যেমন: নান্দনিক ইলিভেশন ও আধুনিক নির্মাণশৈলী"
          maxLength={100}
        />

        <TextPair
          label="Elevation Story / Description"
          description="Detailed paragraph explaining facade, materials, and architectural aesthetics"
          en={value.description ?? ""}
          bn={value.descriptionBn ?? ""}
          onEnChange={(v) => setValue({ ...value, description: v })}
          onBnChange={(v) => setValue({ ...value, descriptionBn: v })}
          placeholderEn="e.g., The exterior facade features sleek aerodynamic lines, tinted thermal glass, and lush vertical gardens..."
          placeholderBn="যেমন: আন্তর্জাতিক মানের বাহ্যিক নকশা, উন্নতমানের টেম্পার্ড গ্লাস এবং মনোরম ল্যান্ডস্কেপিং..."
          multiline
          maxLength={400}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextPair
            label="Preview Button Text"
            description="Button opening the elevation lightbox"
            en={value.preview ?? ""}
            bn={value.previewBn ?? ""}
            onEnChange={(v) => setValue({ ...value, preview: v })}
            onBnChange={(v) => setValue({ ...value, previewBn: v })}
            placeholderEn="e.g., View 3D Architectural Elevation"
            placeholderBn="যেমন: ৩ডি ইলিভেশন দেখুন"
            maxLength={50}
          />
          <TextPair
            label="Close Lightbox Label"
            description="Button closing the elevation preview"
            en={value.close ?? ""}
            bn={value.closeBn ?? ""}
            onEnChange={(v) => setValue({ ...value, close: v })}
            onBnChange={(v) => setValue({ ...value, closeBn: v })}
            placeholderEn="e.g., Close View"
            placeholderBn="যেমন: বন্ধ করুন"
            maxLength={30}
          />
        </div>
      </FormSectionCard>

      {/* ── Elevation Views & Renders ─────────────────────────────────── */}
      <FormSectionCard
        title="Architectural Views & 3D Renders"
        description="Individual facade angles, perspective renders, and daytime/nighttime elevation views."
        icon={Layers}
      >
        <EditableList
          items={value.views ?? []}
          onChange={(views) => setValue({ ...value, views })}
          makeItem={() => ({ label: "", labelBn: "", hint: "", hintBn: "", image: null })}
          addLabel="Add Architectural Elevation View"
          renderItem={(view, _index, update) => {
            const image = resolveMedia(view.image);
            return (
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="space-y-1 shrink-0">
                  <label className="text-[11px] font-semibold text-muted-foreground">
                    Elevation Image
                  </label>
                  <ImageField
                    previewUrl={image?.url}
                    onChange={(media) => update({ ...view, image: media.id })}
                  />
                </div>
                <div className="flex-1 w-full space-y-3">
                  <TextPair
                    label="View Angle / Title"
                    description="E.g. Front Elevation, North Corner View"
                    en={view.label ?? ""}
                    bn={view.labelBn ?? ""}
                    onEnChange={(v) => update({ ...view, label: v })}
                    onBnChange={(v) => update({ ...view, labelBn: v })}
                    placeholderEn="e.g., Front Facade (South View)"
                    placeholderBn="যেমন: দক্ষিণমুখী প্রধান ইলিভেশন"
                    maxLength={60}
                  />
                  <TextPair
                    label="Sub-caption / Hint"
                    description="Short detail (e.g. 40ft Wide Road Frontage)"
                    en={view.hint ?? ""}
                    bn={view.hintBn ?? ""}
                    onEnChange={(v) => update({ ...view, hint: v })}
                    onBnChange={(v) => update({ ...view, hintBn: v })}
                    placeholderEn="e.g., Premium curtain wall glass facade with landscaped entry"
                    placeholderBn="যেমন: আধুনিক কার্টেন ওয়াল গ্লাস ও সুসজ্জিত প্রবেশদ্বার"
                    maxLength={100}
                  />
                </div>
              </div>
            );
          }}
        />
      </FormSectionCard>
    </div>
  );
}
