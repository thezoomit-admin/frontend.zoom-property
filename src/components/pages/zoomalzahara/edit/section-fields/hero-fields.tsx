"use client";

import { BarChart3, Image as ImageIcon, MousePointerClick, Type, X } from "lucide-react";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { FormSectionCard, IconInputField, TextPair } from "../field-inputs";
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
    <div className="space-y-6">
      {/* ── Background Media Card ────────────────────────────────────── */}
      <FormSectionCard
        title="Hero Background Media"
        description="High-resolution banner photos that display as the fullscreen background on the hero section."
        icon={ImageIcon}
      >
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground">
            Slider Photos (Select and order hero background images)
          </p>
          <div className="flex flex-wrap gap-3 p-3 rounded-lg border border-border/60 bg-muted/20">
            {images.map((img, index) => {
              const resolved = resolveMedia(img);
              return (
                <div key={index} className="relative group">
                  <ImageField
                    previewUrl={resolved?.url}
                    onChange={(media) => {
                      const next = images.slice();
                      next[index] = media.id;
                      setValue({ ...value, images: next });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = images.filter((_, i) => i !== index);
                      setValue({ ...value, images: next });
                    }}
                    className="absolute -top-2 -right-2 size-5.5 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer z-10 border border-white"
                    title="Remove image"
                    aria-label="Remove image"
                  >
                    <X className="size-3.5 text-white stroke-[2.5]" />
                  </button>
                </div>
              );
            })}
            <ImageField
              onChange={(media) =>
                setValue({ ...value, images: [...images, media.id] })
              }
            />
          </div>
        </div>
      </FormSectionCard>

      {/* ── Headings & Story Card ────────────────────────────────────── */}
      <FormSectionCard
        title="Hero Content & Headings"
        description="Main headline, subtitles, and introductory description visible above the fold."
        icon={Type}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextPair
            label="Top Badge"
            description="Small highlighted chip above title"
            en={value.badge ?? ""}
            bn={value.badgeBn ?? ""}
            onEnChange={(v) => setValue({ ...value, badge: v })}
            onBnChange={(v) => setValue({ ...value, badgeBn: v })}
            placeholderEn="e.g., Exclusive Waterfront Landmark"
            placeholderBn="যেমন: এক্সক্লুসিভ ওয়াটারফ্রন্ট প্রজেক্ট"
            maxLength={30}
          />
          <TextPair
            label="Handover Timeline"
            description="Completion / delivery schedule note"
            en={value.handover ?? ""}
            bn={value.handoverBn ?? ""}
            onEnChange={(v) => setValue({ ...value, handover: v })}
            onBnChange={(v) => setValue({ ...value, handoverBn: v })}
            placeholderEn="e.g., Ready by December 2026"
            placeholderBn="যেমন: হস্তান্তর: ডিসেম্বর ২০২৬"
            maxLength={60}
          />
        </div>

        <TextPair
          label="Eyebrow Subtitle"
          description="Category tag displayed directly above main title"
          en={value.eyebrow ?? ""}
          bn={value.eyebrowBn ?? ""}
          onEnChange={(v) => setValue({ ...value, eyebrow: v })}
          onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
          placeholderEn="e.g., A New Standard of Luxury Living"
          placeholderBn="যেমন: বিলাসবহুল জীবনযাত্রার অনন্য ঠিকানা"
          maxLength={50}
        />

        <TextPair
          label="Main Hero Title"
          description="Large prominent heading of the landing page"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., Zoom Al Zahara"
          placeholderBn="যেমন: জুম আল জাহারা"
          maxLength={100}
        />

        <TextPair
          label="Lead Paragraph"
          description="Main introductory description shown below title"
          en={value.lead ?? ""}
          bn={value.leadBn ?? ""}
          onEnChange={(v) => setValue({ ...value, lead: v })}
          onBnChange={(v) => setValue({ ...value, leadBn: v })}
          placeholderEn="e.g., Discover unprecedented architectural elegance nestled in the heart of the prestigious neighborhood..."
          placeholderBn="যেমন: আধুনিক স্থাপত্যশৈলী এবং সবুজে ঘেরা মনোরম পরিবেশে আপনার স্বপ্নের আবাস..."
          multiline
          maxLength={300}
        />

        <TextPair
          label="Location Address"
          description="Project address / neighborhood badge"
          en={value.location ?? ""}
          bn={value.locationBn ?? ""}
          onEnChange={(v) => setValue({ ...value, location: v })}
          onBnChange={(v) => setValue({ ...value, locationBn: v })}
          placeholderEn="e.g., Plot 14, Road 27, Block A, Dhanmondi, Dhaka"
          placeholderBn="যেমন: প্লট ১৪, রোড ২৭, ব্লক এ, ধানমন্ডি, ঢাকা"
          maxLength={100}
        />
      </FormSectionCard>

      {/* ── Call to Action Buttons Card ───────────────────────────────── */}
      <FormSectionCard
        title="Call to Action (CTA) Buttons"
        description="Button labels triggering inquiries, brochures, or booking tours."
        icon={MousePointerClick}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextPair
            label="Primary Action Button"
            description="Main filled button label"
            en={value.ctaPrimary ?? ""}
            bn={value.ctaPrimaryBn ?? ""}
            onEnChange={(v) => setValue({ ...value, ctaPrimary: v })}
            onBnChange={(v) => setValue({ ...value, ctaPrimaryBn: v })}
            placeholderEn="e.g., Explore Residences"
            placeholderBn="যেমন: অ্যাপার্টমেন্ট দেখুন"
            maxLength={30}
          />
          <TextPair
            label="Secondary Action Button"
            description="Outline button label"
            en={value.ctaSecondary ?? ""}
            bn={value.ctaSecondaryBn ?? ""}
            onEnChange={(v) => setValue({ ...value, ctaSecondary: v })}
            onBnChange={(v) => setValue({ ...value, ctaSecondaryBn: v })}
            placeholderEn="e.g., Schedule a Private Tour"
            placeholderBn="যেমন: ভিজিট বুক করুন"
            maxLength={30}
          />
        </div>
      </FormSectionCard>

      {/* ── Key Highlights & Statistics Card ─────────────────────────── */}
      <FormSectionCard
        title="Key Highlights / Stats Row"
        description="Quick metrics shown at the bottom of the hero (e.g. 3,200 sqft, 12 Floors, G+14)."
        icon={BarChart3}
      >
        <EditableList
          items={value.stats ?? []}
          onChange={(stats) => setValue({ ...value, stats })}
          makeItem={() => ({ value: "", valueBn: "", label: "", labelBn: "", icon: "" })}
          addLabel="Add New Metric / Highlight"
          renderItem={(stat, _index, update) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextPair
                label="Number / Metric Value"
                description="Big bold number (e.g., 3,500 sqft, G+14)"
                en={stat.value ?? ""}
                bn={stat.valueBn ?? ""}
                onEnChange={(v) => update({ ...stat, value: v })}
                onBnChange={(v) => update({ ...stat, valueBn: v })}
                placeholderEn="e.g., 3,200 sq.ft"
                placeholderBn="যেমন: ৩,২০০ বর্গফুট"
                maxLength={20}
              />
              <TextPair
                label="Metric Label / Caption"
                description="Short label under the number (e.g., Unit Size, Total Units)"
                en={stat.label ?? ""}
                bn={stat.labelBn ?? ""}
                onEnChange={(v) => update({ ...stat, label: v })}
                onBnChange={(v) => update({ ...stat, labelBn: v })}
                placeholderEn="e.g., Luxury Apartment Size"
                placeholderBn="যেমন: অ্যাপার্টমেন্ট সাইজ"
                maxLength={40}
              />
              <div className="md:col-span-2">
                <IconInputField
                  label="Stat Icon (আইকন)"
                  description="FontAwesome class or name (e.g., fa-solid fa-building, star, sparkles)"
                  value={stat.icon ?? ""}
                  onChange={(icon) => update({ ...stat, icon })}
                  placeholder="e.g., fa-solid fa-building or star, bed, bath..."
                />
              </div>
            </div>
          )}
        />
      </FormSectionCard>
    </div>
  );
}
