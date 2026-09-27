"use client";

import { CheckCircle2, Image as ImageIcon, Sparkles } from "lucide-react";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { FormSectionCard, IconInputField, TextPair } from "../field-inputs";
import { ImageField } from "../image-field";
import { resolveMedia } from "../resolve-media";

export type AboutValue = NonNullable<ApiProjectLanding["about"]>;

export const emptyAbout: AboutValue = {
  image: null,
  eyebrow: "",
  eyebrowBn: "",
  title: "",
  titleBn: "",
  body: "",
  bodyBn: "",
  points: [],
};

export function AboutFields({
  value,
  setValue,
}: {
  value: AboutValue;
  setValue: (next: AboutValue) => void;
}) {
  const image = resolveMedia(value.image);

  return (
    <div className="space-y-6">
      {/* ── Story Content & Image ────────────────────────────────────── */}
      <FormSectionCard
        title="About Project Overview & Featured Photo"
        description="Main narrative and prominent architectural picture introducing the project."
        icon={Sparkles}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Featured About Section Photo
            </label>
            <p className="text-[11px] text-muted-foreground">
              Displays prominently alongside the project story text.
            </p>
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 inline-block">
              <ImageField
                previewUrl={image?.url}
                onChange={(media) => setValue({ ...value, image: media.id })}
              />
            </div>
          </div>

          <TextPair
            label="Section Eyebrow Tag"
            description="Small badge above the about heading"
            en={value.eyebrow ?? ""}
            bn={value.eyebrowBn ?? ""}
            onEnChange={(v) => setValue({ ...value, eyebrow: v })}
            onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
            placeholderEn="e.g., The Vision & Philosophy"
            placeholderBn="যেমন: প্রকল্পের ভিশন ও অনুপ্রেরণা"
            maxLength={50}
          />

          <TextPair
            label="About Section Heading"
            description="Main title of the about / overview section"
            en={value.title ?? ""}
            bn={value.titleBn ?? ""}
            onEnChange={(v) => setValue({ ...value, title: v })}
            onBnChange={(v) => setValue({ ...value, titleBn: v })}
            placeholderEn="e.g., Crafted for the Connoisseurs of Fine Living"
            placeholderBn="যেমন: নান্দনিক স্থাপত্য এবং আধুনিক জীবনের মেলবন্ধন"
            maxLength={100}
          />

          <TextPair
            label="Detailed Project Story (Body Text)"
            description="Comprehensive description describing the design, lifestyle, and uniqueness"
            en={value.body ?? ""}
            bn={value.bodyBn ?? ""}
            onEnChange={(v) => setValue({ ...value, body: v })}
            onBnChange={(v) => setValue({ ...value, bodyBn: v })}
            placeholderEn="e.g., Designed by award-winning architects, this iconic landmark integrates sustainable green living with contemporary grandeur..."
            placeholderBn="যেমন: আন্তর্জাতিক মানের স্থাপত্যবিদদের দক্ষতায় তৈরি, যেখানে রয়েছে সর্বোচ্চ আধুনিক সুযোগ-সুবিধা এবং নিরাপদ পরিবেশ..."
            multiline
            maxLength={500}
          />
        </div>
      </FormSectionCard>

      {/* ── Key Highlights / Feature Bullet Points ────────────────────── */}
      <FormSectionCard
        title="Project Highlights & Distinct Features"
        description="Bullet points or cards highlighting top selling propositions (e.g., 100% South Facing, Double Glazed Glass)."
        icon={CheckCircle2}
      >
        <EditableList
          items={value.points ?? []}
          onChange={(points) => setValue({ ...value, points })}
          makeItem={() => ({ title: "", titleBn: "", body: "", bodyBn: "", icon: "" })}
          addLabel="Add Feature / Highlight Point"
          renderItem={(item, _index, update) => (
            <div className="space-y-3">
              <TextPair
                label="Feature Title"
                description="Bold feature heading (e.g., 3-Side Open, Smart Home Ready)"
                en={item.title ?? ""}
                bn={item.titleBn ?? ""}
                onEnChange={(v) => update({ ...item, title: v })}
                onBnChange={(v) => update({ ...item, titleBn: v })}
                placeholderEn="e.g., 100% South Facing Units"
                placeholderBn="যেমন: ১০০% দক্ষিণমুখী অ্যাপার্টমেন্ট"
                maxLength={80}
              />
              <TextPair
                label="Feature Description"
                description="Detailed explanation of the highlight"
                en={item.body ?? ""}
                bn={item.bodyBn ?? ""}
                onEnChange={(v) => update({ ...item, body: v })}
                onBnChange={(v) => update({ ...item, bodyBn: v })}
                placeholderEn="e.g., Maximizes natural cross ventilation and uninterrupted daylight throughout all seasons."
                placeholderBn="যেমন: সারাদিন পর্যাপ্ত আলো-বাতাস এবং মনোরম ভিউ নিশ্চিত করতে বিশেষ নকশা।"
                multiline
                maxLength={200}
              />
              <IconInputField
                label="Feature Icon (আইকন)"
                description="FontAwesome class or name"
                value={item.icon ?? ""}
                onChange={(icon) => update({ ...item, icon })}
                placeholder="e.g., fa-solid fa-gem or sparkles, check..."
              />
            </div>
          )}
        />
      </FormSectionCard>
    </div>
  );
}
