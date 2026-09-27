"use client";

import { BedDouble, Home, Image as ImageIcon, Sparkles, Tag, X } from "lucide-react";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { FormSectionCard, IconInputField, TextPair } from "../field-inputs";
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
      {/* ── 1. Residences Header & Intro ─────────────────────────────── */}
      <FormSectionCard
        title="Residences Section Header"
        description="Section title, category badge, and overview text for residential units."
        icon={Home}
      >
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

      {/* ── 2. Featured Unit Specification Card ───────────────────────── */}
      <FormSectionCard
        title="Featured Apartment / Unit Details"
        description="Key specifications of the featured model unit (Type name, layout note, price, beds, baths, size)."
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

        {/* Note / Layout details — directly below unit title on the live design */}
        <TextPair
          label="Apartment Layout & Features Note (বর্ণনা / ফিচার নোট)"
          description="Layout summary shown directly under apartment title (e.g. আলাদা ডাইনিং ও ড্রয়িং, কিচেন, ব্যালকনি)"
          en={unit.note ?? ""}
          bn={unit.noteBn ?? ""}
          onEnChange={(v) => setValue({ ...value, unit: { ...unit, note: v } })}
          onBnChange={(v) => setValue({ ...value, unit: { ...unit, noteBn: v } })}
          placeholderEn="e.g., Separate dining & drawing, modular kitchen, 3 wide balconies. Only 2 units per floor."
          placeholderBn="যেমন: আলাদা ডাইনিং ও ড্রয়িং, একটি কিচেন, তিন ব্যালকনি। প্রতি তলায় দুটি ইউনিট।"
          multiline
          maxLength={200}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            label="Action Button Label (CTA)"
            description="Button text at the bottom of residence card"
            en={value.cta ?? ""}
            bn={value.ctaBn ?? ""}
            onEnChange={(v) => setValue({ ...value, cta: v })}
            onBnChange={(v) => setValue({ ...value, ctaBn: v })}
            placeholderEn="e.g., Request Floor Plan & Pricing"
            placeholderBn="যেমন: ফ্লোর প্ল্যান ও মূল্য জানতে যোগাযোগ করুন"
            maxLength={40}
          />
        </div>

        {/* 3 Spec Boxes: Beds, Baths, Size */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs font-semibold text-foreground mb-2">
            Unit Key Specifications (বেডরুম, বাথরুম ও সাইজ বক্স)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <TextPair
              label="Bedrooms"
              description="E.g., 4 Beds"
              en={unit.beds ?? ""}
              bn={unit.bedsBn ?? ""}
              onEnChange={(v) => setValue({ ...value, unit: { ...unit, beds: v } })}
              onBnChange={(v) => setValue({ ...value, unit: { ...unit, bedsBn: v } })}
              placeholderEn="e.g., 4 Beds"
              placeholderBn="যেমন: ৪ বেড"
              maxLength={20}
            />
            <TextPair
              label="Bathrooms"
              description="E.g., 5 Baths"
              en={unit.baths ?? ""}
              bn={unit.bathsBn ?? ""}
              onEnChange={(v) => setValue({ ...value, unit: { ...unit, baths: v } })}
              onBnChange={(v) => setValue({ ...value, unit: { ...unit, bathsBn: v } })}
              placeholderEn="e.g., 5 Baths"
              placeholderBn="যেমন: ৫ বাথ"
              maxLength={20}
            />
            <TextPair
              label="Size / Area"
              description="E.g., 3,450 sq.ft"
              en={unit.size ?? ""}
              bn={unit.sizeBn ?? ""}
              onEnChange={(v) => setValue({ ...value, unit: { ...unit, size: v } })}
              onBnChange={(v) => setValue({ ...value, unit: { ...unit, sizeBn: v } })}
              placeholderEn="e.g., 3,450 sq.ft"
              placeholderBn="যেমন: ৩,৪৫০ বর্গফুট"
              maxLength={30}
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
              <div className="md:col-span-2">
                <IconInputField
                  label="Highlight Icon (আইকন)"
                  description="FontAwesome class or keyword (e.g., sparkles, check, fa-solid fa-gem)"
                  value={item.icon ?? ""}
                  onChange={(icon) => update({ ...item, icon })}
                  placeholder="e.g., sparkles, check, fa-solid fa-shield..."
                />
              </div>
            </div>
          )}
        />
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
    </div>
  );
}
