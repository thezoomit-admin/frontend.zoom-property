"use client";

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

const PROVIDERS = [
  { value: "youtube", label: "YouTube Video / Reel" },
  { value: "facebook", label: "Facebook Video / Reel" },
] as const;

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
        title="Video Items (YouTube & Facebook)"
        description="Add YouTube or Facebook video/reel links. Thumbnails and player embeds are generated automatically."
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
          addLabel="Add YouTube or Facebook Video"
          renderItem={(item, _index, update) => {
            return (
              <div className="space-y-4">
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
                    <Label className="text-xs font-medium text-foreground">
                      Video URL Link (YouTube or Facebook)
                    </Label>
                    <Input
                      value={item.url ?? ""}
                      maxLength={500}
                      placeholder="e.g., https://www.youtube.com/watch?v=... or https://www.facebook.com/watch/..."
                      onChange={(e) => {
                        const url = e.target.value;
                        const autoProvider = /facebook\.com|fb\.watch|fb\.com/i.test(url)
                          ? "facebook"
                          : "youtube";
                        update({ ...item, url, provider: autoProvider });
                      }}
                      className="h-9.5 text-xs sm:text-sm bg-background transition-all duration-150 rounded-lg shadow-2xs focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-foreground">Platform</Label>
                    <Select
                      value={item.provider ?? "youtube"}
                      onValueChange={(v) =>
                        update({
                          ...item,
                          provider: v as "youtube" | "facebook",
                        })
                      }
                    >
                      <SelectTrigger className="h-9.5 w-full bg-background text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVIDERS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Live YouTube Preview Card */}
                {(() => {
                  const match = String(item.url || "").match(
                    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|v=)([A-Za-z0-9_-]{6,})/,
                  );
                  const ytId = match?.[1];
                  if (!ytId) return null;
                  return (
                    <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-2.5">
                      <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-900 shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                          alt="YouTube Preview"
                          className="size-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="flex size-5 items-center justify-center rounded-full bg-red-600 text-white shadow-xs">
                            <span className="translate-x-0.2 text-[10px]">▶</span>
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                            YouTube Live
                          </span>
                          <span className="text-[11px] font-mono text-muted-foreground font-medium">
                            ID: {ytId}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                          Auto-stream enabled from YouTube CDN.
                        </p>
                      </div>
                    </div>
                  );
                })()}

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
