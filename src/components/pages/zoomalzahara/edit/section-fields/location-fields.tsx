"use client";

import { Info, Map, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { FormSectionCard, TextPair } from "../field-inputs";

export type LocationValue = NonNullable<ApiProjectLanding["location"]>;

export const emptyLocation: LocationValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "",
  description: "", descriptionBn: "", mapOpen: "", mapOpenBn: "",
  mapHint: "", mapHintBn: "", mapEmbedUrl: "", mapLinkUrl: "", facts: [],
};

export function LocationFields({
  value,
  setValue,
}: {
  value: LocationValue;
  setValue: (next: LocationValue) => void;
}) {
  return (
    <div className="space-y-6">
      <FormSectionCard
        title="Location & Neighborhood Heading"
        description="Headings and overview detailing location prestige and geographic advantages."
        icon={MapPin}
      >
        <TextPair
          label="Section Eyebrow"
          description="Badge tag above location title"
          en={value.eyebrow ?? ""}
          bn={value.eyebrowBn ?? ""}
          onEnChange={(v) => setValue({ ...value, eyebrow: v })}
          onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
          placeholderEn="e.g., Strategic Urban Hub"
          placeholderBn="যেমন: যোগাযোগের অন্যতম কেন্দ্র"
          maxLength={50}
        />
        <TextPair
          label="Location Main Title"
          description="Large title of the location section"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., Prime Neighborhood, Unmatched Connectivity"
          placeholderBn="যেমন: অভিজাত এলাকা ও চমৎকার যোগাযোগ"
          maxLength={100}
        />
        <TextPair
          label="Location Story / Description"
          description="Narrative describing accessibility, surroundings, and ambiance"
          en={value.description ?? ""}
          bn={value.descriptionBn ?? ""}
          onEnChange={(v) => setValue({ ...value, description: v })}
          onBnChange={(v) => setValue({ ...value, descriptionBn: v })}
          placeholderEn="e.g., Perfectly situated close to diplomatic zones, elite dining, and lush green parks."
          placeholderBn="যেমন: কূটনৈতিক এলাকা, মনোরম পার্ক এবং প্রিমিয়াম শপিংমলের সন্নিকটে অবস্থিত।"
          multiline
          maxLength={400}
        />
      </FormSectionCard>

      <FormSectionCard
        title="Interactive Map Configuration"
        description="Google Maps iframe embed source and navigation destination links."
        icon={Map}
      >
        <TextPair
          label="Map Hint / Directions Badge"
          description="Short note under the map"
          en={value.mapHint ?? ""}
          bn={value.mapHintBn ?? ""}
          onEnChange={(v) => setValue({ ...value, mapHint: v })}
          onBnChange={(v) => setValue({ ...value, mapHintBn: v })}
          placeholderEn="e.g., 2 Mins walk from Dhanmondi Lake"
          placeholderBn="যেমন: ধানমন্ডি লেক থেকে মাত্র ২ মিনিটের হাঁটা পথ"
          maxLength={100}
        />
        <div className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Google Map Embed URL (iframe src)</Label>
            <p className="text-[11px] text-muted-foreground">The src attribute from Google Maps Share ➔ Embed map</p>
            <Input
              placeholder="https://www.google.com/maps/embed?..."
              value={value.mapEmbedUrl ?? ""}
              maxLength={1000}
              onChange={(e) => setValue({ ...value, mapEmbedUrl: e.target.value })}
              className="h-9 text-sm font-mono text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">"Open in Google Maps" Direct Link</Label>
            <p className="text-[11px] text-muted-foreground">Direct URL opening navigation on mobile</p>
            <Input
              placeholder="https://maps.app.goo.gl/..."
              value={value.mapLinkUrl ?? ""}
              maxLength={1000}
              onChange={(e) => setValue({ ...value, mapLinkUrl: e.target.value })}
              className="h-9 text-sm"
            />
          </div>
        </div>
      </FormSectionCard>

      <FormSectionCard
        title="Location Facts & Commute Times"
        description="Quick statistics highlighting proximity (e.g. Airport: 20 Mins, Express Highway: 5 Mins)."
        icon={Info}
      >
        <EditableList
          items={value.facts ?? []}
          onChange={(facts) => setValue({ ...value, facts })}
          makeItem={() => ({ label: "", labelBn: "", value: "", valueBn: "" })}
          addLabel="Add Location Fact / Proximity"
          renderItem={(item, _index, update) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextPair
                label="Fact Label"
                description="E.g., International Airport, Metro Station"
                en={item.label ?? ""}
                bn={item.labelBn ?? ""}
                onEnChange={(v) => update({ ...item, label: v })}
                onBnChange={(v) => update({ ...item, labelBn: v })}
                placeholderEn="e.g., Hazrat Shahjalal Intl Airport"
                placeholderBn="যেমন: হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর"
                maxLength={40}
              />
              <TextPair
                label="Fact Value / Time"
                description="E.g., 20 Mins Drive, 500 Meters"
                en={item.value ?? ""}
                bn={item.valueBn ?? ""}
                onEnChange={(v) => update({ ...item, value: v })}
                onBnChange={(v) => update({ ...item, valueBn: v })}
                placeholderEn="e.g., 20 Mins via Elevated Expressway"
                placeholderBn="যেমন: ২০ মিনিট (এক্সপ্রেসওয়ে দিয়ে)"
                maxLength={40}
              />
            </div>
          )}
        />
      </FormSectionCard>
    </div>
  );
}
