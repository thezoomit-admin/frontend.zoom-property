"use client";

import { Film, Video } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { FormSectionCard, TextPair } from "../field-inputs";
import { ImageField } from "../image-field";
import { resolveMedia } from "../resolve-media";

export type FilmsValue = NonNullable<ApiProjectLanding["films"]>;

export const emptyFilms: FilmsValue = {
  eyebrow: "",
  eyebrowBn: "",
  title: "",
  titleBn: "",
  description: "",
  descriptionBn: "",
  play: "",
  playBn: "",
  items: [],
};

const PROVIDERS = ["youtube", "facebook", "vimeo"] as const;

export function FilmsFields({
  value,
  setValue,
}: {
  value: FilmsValue;
  setValue: (next: FilmsValue) => void;
}) {
  return (
    <div className="space-y-6">
      {/* ── Section Header ───────────────────────────────────────────── */}
      <FormSectionCard
        title="Project Films & Video Section Header"
        description="Introduction narrative and headline for documentary / walkthrough videos."
        icon={Film}
      >
        <TextPair
          label="Films Eyebrow"
          description="Small badge above video title"
          en={value.eyebrow ?? ""}
          bn={value.eyebrowBn ?? ""}
          onEnChange={(v) => setValue({ ...value, eyebrow: v })}
          onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
          placeholderEn="e.g., Cinematic Experience"
          placeholderBn="যেমন: সিনেমাটিক ভিডিও ট্যুর"
          maxLength={50}
        />

        <TextPair
          label="Films Main Title"
          description="Heading of the video showcase section"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., The Vision in Motion: Watch Our Project Film"
          placeholderBn="যেমন: প্রকল্পের পূর্ণাঙ্গ ভিডিও ডকুমেন্টারি"
          maxLength={100}
        />

        <TextPair
          label="Films Description"
          description="Brief narrative encouraging visitors to watch the showcase"
          en={value.description ?? ""}
          bn={value.descriptionBn ?? ""}
          onEnChange={(v) => setValue({ ...value, description: v })}
          onBnChange={(v) => setValue({ ...value, descriptionBn: v })}
          placeholderEn="e.g., Take an immersive journey through the architecture, landscaping, and master plan..."
          placeholderBn="যেমন: প্রকল্পের নির্মাণশৈলী এবং আধুনিক সুযোগ-সুবিধার ভিডিও চিত্র..."
          multiline
          maxLength={400}
        />
      </FormSectionCard>

      {/* ── Video Items List ─────────────────────────────────────────── */}
      <FormSectionCard
        title="Video Items & Media Sources"
        description="Video links (YouTube, Facebook, Vimeo), custom poster thumbnails, and titles."
        icon={Video}
      >
        <EditableList
          items={value.items ?? []}
          onChange={(items) => setValue({ ...value, items })}
          makeItem={() => ({
            title: "",
            titleBn: "",
            caption: "",
            captionBn: "",
            url: "",
            poster: null,
            provider: "youtube" as const,
          })}
          addLabel="Add Video Item"
          renderItem={(item, _index, update) => {
            const poster = resolveMedia(item.poster);
            return (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="space-y-1 shrink-0">
                    <label className="text-[11px] font-semibold text-muted-foreground">
                      Custom Video Poster / Thumbnail
                    </label>
                    <ImageField
                      previewUrl={poster?.url}
                      onChange={(media) => update({ ...item, poster: media.id })}
                    />
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    <TextPair
                      label="Video Title"
                      description="Displayed on video card / banner"
                      en={item.title ?? ""}
                      bn={item.titleBn ?? ""}
                      onEnChange={(v) => update({ ...item, title: v })}
                      onBnChange={(v) => update({ ...item, titleBn: v })}
                      placeholderEn="e.g., Official Project Walkthrough"
                      placeholderBn="যেমন: অফিশিয়াল প্রজেক্ট ওয়াকথ্রু"
                      maxLength={100}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-xs font-medium">Video URL Link</Label>
                        <Input
                          value={item.url ?? ""}
                          maxLength={500}
                          placeholder="e.g., https://www.youtube.com/watch?v=..."
                          onChange={(e) => update({ ...item, url: e.target.value })}
                          className="h-9 text-xs sm:text-sm bg-background"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-medium">Platform</Label>
                        <Select
                          value={item.provider ?? "youtube"}
                          onValueChange={(v) =>
                            update({
                              ...item,
                              provider: v as (typeof PROVIDERS)[number],
                            })
                          }
                        >
                          <SelectTrigger className="h-9 w-full bg-background text-xs capitalize">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PROVIDERS.map((p) => (
                              <SelectItem key={p} value={p} className="capitalize">
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <TextPair
                  label="Video Subtitle / Caption"
                  description="Short descriptive snippet under video"
                  en={item.caption ?? ""}
                  bn={item.captionBn ?? ""}
                  onEnChange={(v) => update({ ...item, caption: v })}
                  onBnChange={(v) => update({ ...item, captionBn: v })}
                  placeholderEn="e.g., An in-depth overview of the site construction & architectural concept"
                  placeholderBn="যেমন: স্থাপত্য ভাবনা এবং নির্মাণকাজের বর্তমান অগ্রগতির চিত্র"
                  maxLength={150}
                />
              </div>
            );
          }}
        />
      </FormSectionCard>
    </div>
  );
}
