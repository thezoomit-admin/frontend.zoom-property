"use client";

import { BedDouble, Home, Image as ImageIcon, Sparkles, Tag } from "lucide-react";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { FormSectionCard, TextPair } from "../field-inputs";
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
    name: "",
    nameBn: "",
    beds: "",
    bedsBn: "",
    baths: "",
    bathsBn: "",
    size: "",
    sizeBn: "",
    price: "",
    priceBn: "",
    note: "",
    noteBn: "",
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
    <div className="space-y-6">
      {/* ── Residences Header & Intro ─────────────────────────────────── */}
      <FormSectionCard
        title="Residences Section Header"
        description="Section title, category badge, and overview text for residential units."
        icon={Home}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextPair
            label="Section Eyebrow"
            description="Small tag above residence heading"
            en={value.eyebrow ?? ""}
            bn={value.eyebrowBn ?? ""}
            onEnChange={(v) => setValue({ ...value, eyebrow: v })}
            onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
            placeholderEn="e.g., Signature Living Spaces"
            placeholderBn="যেমন: অভিজাত অ্যাপার্টমেন্টসমূহ"
            maxLength={50}
          />
          <TextPair
            label="Featured Unit Badge"
            description="Highlight tag for the top apartment"
            en={value.featured ?? ""}
            bn={value.featuredBn ?? ""}
            onEnChange={(v) => setValue({ ...value, featured: v })}
            onBnChange={(v) => setValue({ ...value, featuredBn: v })}
            placeholderEn="e.g., Premium 4-Bed Penthouse"
            placeholderBn="যেমন: প্রিমিয়াম ৪-বেড পেন্টহাউজ"
            maxLength={30}
          />
        </div>

        <TextPair
          label="Residences Main Title"
          description="Main title of the floor plans / residences section"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., Curated Floor Plans & Signature Residences"
          placeholderBn="যেমন: আধুনিক ফ্লোর প্ল্যান ও এক্সক্লুসিভ ফ্ল্যাটসমূহ"
          maxLength={100}
        />

        <TextPair
          label="Residences Section Description"
          description="Detailed paragraph introducing the layouts, space efficiency, and finishes"
          en={value.description ?? ""}
          bn={value.descriptionBn ?? ""}
          onEnChange={(v) => setValue({ ...value, description: v })}
          onBnChange={(v) => setValue({ ...value, descriptionBn: v })}
          placeholderEn="e.g., Every residence is thoughtfully engineered with vast living spaces, private balconies, and luxury fittings..."
          placeholderBn="যেমন: প্রতিটি অ্যাপার্টমেন্টে রয়েছে খোলামেলা স্পেস, আধুনিক ইন্টেরিয়র এবং প্রিমিয়াম ফিটিংস..."
          multiline
          maxLength={400}
        />
      </FormSectionCard>

      {/* ── Featured Unit Specification Card ─────────────────────────── */}
      <FormSectionCard
        title="Featured Apartment / Unit Details"
        description="Key specifications of the featured model unit (beds, baths, size, price, note)."
        icon={BedDouble}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextPair
            label="Unit Type / Name"
            description="E.g., Type A (Duplex Penthouse)"
            en={unit.name ?? ""}
            bn={unit.nameBn ?? ""}
            onEnChange={(v) => setValue({ ...value, unit: { ...unit, name: v } })}
            onBnChange={(v) => setValue({ ...value, unit: { ...unit, nameBn: v } })}
            placeholderEn="e.g., Type A - Sky Villa"
            placeholderBn="যেমন: টাইপ এ - স্কাই ভিলা"
            maxLength={60}
          />
          <TextPair
            label="Size / Area"
            description="Square footage of the unit"
            en={unit.size ?? ""}
            bn={unit.sizeBn ?? ""}
            onEnChange={(v) => setValue({ ...value, unit: { ...unit, size: v } })}
            onBnChange={(v) => setValue({ ...value, unit: { ...unit, sizeBn: v } })}
            placeholderEn="e.g., 3,450 sq.ft (Approx.)"
            placeholderBn="যেমন: ৩,৪৫০ বর্গফুট"
            maxLength={30}
          />
          <TextPair
            label="Bedrooms"
            description="Number of bedrooms"
            en={unit.beds ?? ""}
            bn={unit.bedsBn ?? ""}
            onEnChange={(v) => setValue({ ...value, unit: { ...unit, beds: v } })}
            onBnChange={(v) => setValue({ ...value, unit: { ...unit, bedsBn: v } })}
            placeholderEn="e.g., 4 Beds + Maid's Room"
            placeholderBn="যেমন: ৪ বেড + কাজের লোক রুম"
            maxLength={20}
          />
          <TextPair
            label="Bathrooms"
            description="Number of bathrooms"
            en={unit.baths ?? ""}
            bn={unit.bathsBn ?? ""}
            onEnChange={(v) => setValue({ ...value, unit: { ...unit, baths: v } })}
            onBnChange={(v) => setValue({ ...value, unit: { ...unit, bathsBn: v } })}
            placeholderEn="e.g., 5 Baths (4 Attached)"
            placeholderBn="যেমন: ৫ বাথ (৪ এটাচড)"
            maxLength={20}
          />
          <TextPair
            label="Price / Payment Plan Note"
            description="Pricing guideline or payment terms"
            en={unit.price ?? ""}
            bn={unit.priceBn ?? ""}
            onEnChange={(v) => setValue({ ...value, unit: { ...unit, price: v } })}
            onBnChange={(v) => setValue({ ...value, unit: { ...unit, priceBn: v } })}
            placeholderEn="e.g., Price on Request / Flexible Installments"
            placeholderBn="যেমন: আলোচনা সাপেক্ষে / সহজ কিস্তি"
            maxLength={40}
          />
          <TextPair
            label="Special Features Note"
            description="Additional amenities or unit perks"
            en={unit.note ?? ""}
            bn={unit.noteBn ?? ""}
            onEnChange={(v) => setValue({ ...value, unit: { ...unit, note: v } })}
            onBnChange={(v) => setValue({ ...value, unit: { ...unit, noteBn: v } })}
            placeholderEn="e.g., Includes 2 Dedicated Basements Parking Slots & Panoramic Balcony"
            placeholderBn="যেমন: ২টি কার পার্কিং ও বিশাল ব্যালকনি অন্তর্ভুক্ত"
            maxLength={150}
          />
        </div>
      </FormSectionCard>

      {/* ── Residence Gallery Photos ──────────────────────────────────── */}
      <FormSectionCard
        title="Apartment / Interior Photos"
        description="Interior layout photos, living room, master bedroom, and modern kitchen views."
        icon={ImageIcon}
      >
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground">
            Interior Photo Gallery
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
                    className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center shadow hover:scale-110 transition-transform"
                    title="Remove image"
                  >
                    ✕
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

      {/* ── Residence Highlights List ─────────────────────────────────── */}
      <FormSectionCard
        title="Residence Highlights & Amenities"
        description="Quick badges showing specific unit advantages (e.g., Balconies, Ceiling Height, Flooring)."
        icon={Sparkles}
      >
        <EditableList
          items={value.highlights ?? []}
          onChange={(highlights) => setValue({ ...value, highlights })}
          makeItem={() => ({ label: "", labelBn: "", value: "", valueBn: "", icon: "" })}
          addLabel="Add Residence Highlight"
          renderItem={(item, _index, update) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextPair
                label="Amenity / Feature Name"
                description="E.g., Balconies, Floor Finish, Smart Lock"
                en={item.label ?? ""}
                bn={item.labelBn ?? ""}
                onEnChange={(v) => update({ ...item, label: v })}
                onBnChange={(v) => update({ ...item, labelBn: v })}
                placeholderEn="e.g., Private Verandas"
                placeholderBn="যেমন: সুবিশাল ব্যালকনি"
                maxLength={50}
              />
              <TextPair
                label="Feature Specification / Value"
                description="E.g., 3 Spacious Balconies, Italian Marble"
                en={item.value ?? ""}
                bn={item.valueBn ?? ""}
                onEnChange={(v) => update({ ...item, value: v })}
                onBnChange={(v) => update({ ...item, valueBn: v })}
                placeholderEn="e.g., 3 Open Air Balconies"
                placeholderBn="যেমন: ৩টি খোলামেলা বারান্দা"
                maxLength={40}
              />
            </div>
          )}
        />
      </FormSectionCard>
    </div>
  );
}
