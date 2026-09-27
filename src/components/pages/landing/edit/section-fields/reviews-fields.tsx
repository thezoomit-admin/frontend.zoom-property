"use client";

import { MessageSquareQuote, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { EditableList } from "../editable-list";
import { FormSectionCard, TextPair } from "../field-inputs";
import { ImageField } from "../image-field";
import { resolveMedia } from "../resolve-media";

export type ReviewsValue = NonNullable<ApiProjectLanding["reviews"]>;

export const emptyReviews: ReviewsValue = {
  eyebrow: "",
  eyebrowBn: "",
  title: "",
  titleBn: "",
  description: "",
  descriptionBn: "",
  play: "",
  playBn: "",
  close: "",
  closeBn: "",
  items: [],
};

export function ReviewsFields({
  value,
  setValue,
}: {
  value: ReviewsValue;
  setValue: (next: ReviewsValue) => void;
}) {
  return (
    <div className="space-y-6">
      {/* ── Section Header ───────────────────────────────────────────── */}
      <FormSectionCard
        title="Client Reviews & Testimonials Header"
        description="Section title, subtitle, and intro text for landowner or buyer reviews."
        icon={MessageSquareQuote}
      >
        <TextPair
          label="Reviews Eyebrow"
          description="Small tag above testimonials title"
          en={value.eyebrow ?? ""}
          bn={value.eyebrowBn ?? ""}
          onEnChange={(v) => setValue({ ...value, eyebrow: v })}
          onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
          placeholderEn="e.g., Words of Trust & Satisfaction"
          placeholderBn="যেমন: গ্রাহকদের আস্থা ও অভিজ্ঞতা"
          maxLength={50}
        />

        <TextPair
          label="Reviews Main Title"
          description="Main title of the reviews section"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., What Our Esteemed Landowners & Buyers Say"
          placeholderBn="যেমন: আমাদের সম্মানিত গ্রাহক ও জমির মালিকদের মতামত"
          maxLength={100}
        />

        <TextPair
          label="Reviews Description"
          description="Brief narrative explaining our commitment to timely delivery and satisfaction"
          en={value.description ?? ""}
          bn={value.descriptionBn ?? ""}
          onEnChange={(v) => setValue({ ...value, description: v })}
          onBnChange={(v) => setValue({ ...value, descriptionBn: v })}
          placeholderEn="e.g., Hear firsthand experiences from proud owners who entrusted us with their landmark properties..."
          placeholderBn="যেমন: সময়মতো হস্তান্তর এবং উন্নতমানের নির্মাণশৈলী নিয়ে গ্রাহকদের বাস্তব অভিজ্ঞতা..."
          multiline
          maxLength={300}
        />
      </FormSectionCard>

      {/* ── Testimonials List ─────────────────────────────────────────── */}
      <FormSectionCard
        title="Client Testimonials & Feedback Cards"
        description="Individual review cards with client profile picture, video poster, designation, and quote."
        icon={UserCheck}
      >
        <EditableList
          items={value.items ?? []}
          onChange={(items) => setValue({ ...value, items })}
          makeItem={() => ({
            name: "",
            nameBn: "",
            role: "",
            roleBn: "",
            quote: "",
            quoteBn: "",
            avatar: null,
            poster: null,
            videoUrl: "",
          })}
          addLabel="Add Client Review"
          renderItem={(item, _index, update) => {
            const avatar = resolveMedia(item.avatar);
            const poster = resolveMedia(item.poster);
            return (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 items-start p-3 rounded-lg border border-border/60 bg-muted/20">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      Client Profile Photo
                    </p>
                    <ImageField
                      previewUrl={avatar?.url}
                      onChange={(media) => update({ ...item, avatar: media.id })}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      Review Video Poster (Optional)
                    </p>
                    <ImageField
                      previewUrl={poster?.url}
                      onChange={(media) => update({ ...item, poster: media.id })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TextPair
                    label="Client Name"
                    description="Name of the person / landowner"
                    en={item.name ?? ""}
                    bn={item.nameBn ?? ""}
                    onEnChange={(v) => update({ ...item, name: v })}
                    onBnChange={(v) => update({ ...item, nameBn: v })}
                    placeholderEn="e.g., Dr. Anwar Hossain"
                    placeholderBn="যেমন: ড. আনোয়ার হোসেন"
                    maxLength={60}
                  />
                  <TextPair
                    label="Role / Designation"
                    description="E.g., Landowner, Apartment Owner"
                    en={item.role ?? ""}
                    bn={item.roleBn ?? ""}
                    onEnChange={(v) => update({ ...item, role: v })}
                    onBnChange={(v) => update({ ...item, roleBn: v })}
                    placeholderEn="e.g., Landowner, Dhanmondi Project"
                    placeholderBn="যেমন: জমির মালিক, ধানমন্ডি প্রজেক্ট"
                    maxLength={60}
                  />
                </div>

                <TextPair
                  label="Client Review Quote"
                  description="Their feedback or appreciation statement"
                  en={item.quote ?? ""}
                  bn={item.quoteBn ?? ""}
                  onEnChange={(v) => update({ ...item, quote: v })}
                  onBnChange={(v) => update({ ...item, quoteBn: v })}
                  placeholderEn="e.g., Zoom Property delivered beyond our expectations. The structural quality, transparency, and timely handover made the entire journey seamless..."
                  placeholderBn="যেমন: জুম প্রপার্টির সততা ও সময়মতো হস্তান্তরের প্রতিশ্রুতি আমাকে মুগ্ধ করেছে..."
                  multiline
                  maxLength={400}
                />

                <div className="space-y-1">
                  <Label className="text-xs font-medium">
                    Video Review URL (Optional YouTube / Vimeo link)
                  </Label>
                  <Input
                    value={item.videoUrl ?? ""}
                    maxLength={500}
                    placeholder="e.g., https://www.youtube.com/watch?v=..."
                    onChange={(e) => update({ ...item, videoUrl: e.target.value })}
                    className="h-9 text-xs sm:text-sm bg-background"
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
