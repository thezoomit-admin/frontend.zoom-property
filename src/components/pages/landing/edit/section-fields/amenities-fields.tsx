"use client";

import { MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { FormSectionCard, IconInputField, TextPair } from "../field-inputs";

export type AmenitiesValue = NonNullable<ApiProjectLanding["amenities"]>;

export const emptyAmenities: AmenitiesValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "",
  description: "", descriptionBn: "", items: [],
};

export function AmenitiesFields({
  value,
  setValue,
}: {
  value: AmenitiesValue;
  setValue: (next: AmenitiesValue) => void;
}) {
  return (
    <div className="space-y-6">
      <FormSectionCard
        title="Neighborhood & Amenities Overview"
        description="Headlines and description highlighting connectivity and nearby conveniences."
        icon={MapPin}
      >
        <TextPair
          label="Section Eyebrow"
          description="Category chip above the neighborhood heading"
          en={value.eyebrow ?? ""}
          bn={value.eyebrowBn ?? ""}
          onEnChange={(v) => setValue({ ...value, eyebrow: v })}
          onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
          placeholderEn="e.g., Prime Neighborhood & Connectivity"
          placeholderBn="যেমন: চমৎকার যোগাযোগ ও পারিপার্শ্বিক সুবিধা"
          maxLength={50}
        />
        <TextPair
          label="Section Title"
          description="Main title of the amenities section"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., Everything Within Arm's Reach"
          placeholderBn="যেমন: হাতের নাগালেই সব সুযোগ-সুবিধা"
          maxLength={100}
        />
        <TextPair
          label="Section Description"
          description="Overview of the strategic location advantages"
          en={value.description ?? ""}
          bn={value.descriptionBn ?? ""}
          onEnChange={(v) => setValue({ ...value, description: v })}
          onBnChange={(v) => setValue({ ...value, descriptionBn: v })}
          placeholderEn="e.g., Strategically positioned minutes away from top tier educational institutions, luxury shopping, and healthcare."
          placeholderBn="যেমন: সেরা শিক্ষা প্রতিষ্ঠান, আধুনিক হাসপাতাল এবং শপিং সেন্টারের অতি নিকটে অবস্থিত।"
          multiline
          maxLength={400}
        />
      </FormSectionCard>

      <FormSectionCard
        title="Nearby Places & Landmark Points"
        description="Key destinations with custom icons, travel distance, and map links."
        icon={Navigation}
      >
        <EditableList
          items={value.items ?? []}
          onChange={(items) => setValue({ ...value, items })}
          makeItem={() => ({ title: "", titleBn: "", body: "", bodyBn: "", icon: "", mapUrl: "", distance: "", distanceBn: "" })}
          addLabel="Add Nearby Place / Landmark"
          renderItem={(item, _index, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextPair
                  label="Place / Landmark Name"
                  description="E.g., United Hospital, Scholastica School"
                  en={item.title ?? ""}
                  bn={item.titleBn ?? ""}
                  onEnChange={(v) => update({ ...item, title: v })}
                  onBnChange={(v) => update({ ...item, titleBn: v })}
                  placeholderEn="e.g., International School Dhaka"
                  placeholderBn="যেমন: ইন্টারন্যাশনাল স্কুল ঢাকা"
                  maxLength={60}
                />
                <TextPair
                  label="Distance / Travel Time"
                  description="E.g., 5 Mins, 1.2 KM"
                  en={item.distance ?? ""}
                  bn={item.distanceBn ?? ""}
                  onEnChange={(v) => update({ ...item, distance: v })}
                  onBnChange={(v) => update({ ...item, distanceBn: v })}
                  placeholderEn="e.g., 5 mins drive"
                  placeholderBn="যেমন: ৫ মিনিট দূরত্ব"
                  maxLength={30}
                />
              </div>

              <TextPair
                label="Location Note / Detail"
                description="Brief note about the facility"
                en={item.body ?? ""}
                bn={item.bodyBn ?? ""}
                onEnChange={(v) => update({ ...item, body: v })}
                onBnChange={(v) => update({ ...item, bodyBn: v })}
                placeholderEn="e.g., World-class Cambridge curriculum institution"
                placeholderBn="যেমন: আন্তর্জাতিক মানের শিক্ষা প্রতিষ্ঠান"
                maxLength={150}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <IconInputField
                  label="Place Icon (আইকন)"
                  description="FontAwesome class or name"
                  value={item.icon ?? ""}
                  onChange={(icon) => update({ ...item, icon })}
                  placeholder="e.g., fa-solid fa-school, fa-solid fa-hospital..."
                />
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Google Maps URL</Label>
                  <p className="text-[11px] text-muted-foreground">Optional link for direct directions</p>
                  <Input
                    placeholder="https://maps.google.com/..."
                    value={item.mapUrl ?? ""}
                    maxLength={500}
                    onChange={(e) => update({ ...item, mapUrl: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        />
      </FormSectionCard>
    </div>
  );
}
