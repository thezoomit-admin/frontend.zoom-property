"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormSectionCard, TextPair } from "../field-inputs";

export interface PublishingValue {
  path?: string;
  isActive?: boolean;
  facebookUrl?: string;
  phonePrimary?: string;
  phoneSecondary?: string;
  whatsapp?: string;
  metaTitle?: string;
  metaTitleBn?: string;
  metaDescription?: string;
  metaDescriptionBn?: string;
  navEnquire?: string;
  navEnquireBn?: string;
}

export const emptyPublishing: PublishingValue = {
  path: "",
  isActive: true,
  facebookUrl: "",
  phonePrimary: "",
  phoneSecondary: "",
  whatsapp: "",
  metaTitle: "",
  metaTitleBn: "",
  metaDescription: "",
  metaDescriptionBn: "",
  navEnquire: "Book Viewing",
  navEnquireBn: "বুক করুন",
};

export function PublishingFields({
  value,
  setValue,
}: {
  value: PublishingValue;
  setValue: (next: PublishingValue) => void;
}) {
  return (
    <div className="space-y-6">
      {/* ── Publishing Status & Public URL ────────────────────────────── */}
      <FormSectionCard
        title="Publishing Status & Public URL"
        description="Configure public landing page path and publication status."
      >
        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold text-foreground">
              Landing Page Active Status
            </Label>
            <p className="text-xs text-muted-foreground">
              {value.isActive ?? true
                ? "This landing page is currently LIVE and publicly accessible."
                : "This landing page is currently INACTIVE (hidden from public)."}
            </p>
          </div>
          <Switch
            checked={value.isActive ?? true}
            onCheckedChange={(checked) =>
              setValue({ ...value, isActive: checked })
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">
            Landing Page Slug / Path (Required)
          </Label>
          <div className="flex items-center rounded-lg border border-input bg-background px-3 shadow-2xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <span className="text-xs font-mono text-muted-foreground">/p/</span>
            <Input
              value={value.path ?? ""}
              maxLength={80}
              placeholder="e.g., zoom-al-zahra"
              onChange={(e) =>
                setValue({
                  ...value,
                  path: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]/g, "-")
                    .replace(/-+/g, "-"),
                })
              }
              className="border-0 shadow-none focus-visible:ring-0 text-xs sm:text-sm font-mono h-9"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Only lowercase letters, numbers, and hyphens (e.g., zoom-al-zahra).
          </p>
        </div>
      </FormSectionCard>

      {/* ── Contact & Social Numbers ──────────────────────────────────── */}
      <FormSectionCard
        title="Desk Phone Numbers & WhatsApp"
        description="Direct contact lines displayed in header, sticky bar, and desk sections."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-medium text-foreground">
              Primary Phone Number
            </Label>
            <Input
              value={value.phonePrimary ?? ""}
              maxLength={20}
              placeholder="e.g., +8801711250406"
              onChange={(e) =>
                setValue({ ...value, phonePrimary: e.target.value })
              }
              className="h-9 text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium text-foreground">
              Secondary / Alternative Phone
            </Label>
            <Input
              value={value.phoneSecondary ?? ""}
              maxLength={20}
              placeholder="e.g., +8801711250407"
              onChange={(e) =>
                setValue({ ...value, phoneSecondary: e.target.value })
              }
              className="h-9 text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium text-foreground">
              WhatsApp Contact Number
            </Label>
            <Input
              value={value.whatsapp ?? ""}
              maxLength={20}
              placeholder="e.g., +8801711250406"
              onChange={(e) => setValue({ ...value, whatsapp: e.target.value })}
              className="h-9 text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-medium text-foreground">
              Facebook Project Page URL
            </Label>
            <Input
              value={value.facebookUrl ?? ""}
              maxLength={250}
              placeholder="e.g., https://facebook.com/..."
              onChange={(e) =>
                setValue({ ...value, facebookUrl: e.target.value })
              }
              className="h-9 text-xs sm:text-sm"
            />
          </div>
        </div>
      </FormSectionCard>

      {/* ── Header & Navigation CTA ──────────────────────────────────── */}
      <FormSectionCard
        title="Header Navigation & CTA Button"
        description="Action button label in top navigation and sticky floating bar."
      >
        <TextPair
          label="Header CTA Button Text"
          description="Directs visitors to the enquiry/booking form"
          en={value.navEnquire ?? ""}
          bn={value.navEnquireBn ?? ""}
          onEnChange={(v) => setValue({ ...value, navEnquire: v })}
          onBnChange={(v) => setValue({ ...value, navEnquireBn: v })}
          placeholderEn="e.g., Book Viewing / Enquire Now"
          placeholderBn="যেমন: বুক করুন / যোগাযোগ করুন"
          maxLength={30}
        />
      </FormSectionCard>

      {/* ── SEO Meta Tags ────────────────────────────────────────────── */}
      <FormSectionCard
        title="SEO & Social Meta Tags"
        description="Search engine title and summary when shared on Google, Facebook, WhatsApp, etc."
      >
        <TextPair
          label="Meta Title (Browser Tab & SEO Title)"
          description="Keep concise for optimal search ranking (50-60 characters recommended)"
          en={value.metaTitle ?? ""}
          bn={value.metaTitleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, metaTitle: v })}
          onBnChange={(v) => setValue({ ...value, metaTitleBn: v })}
          placeholderEn="e.g., Zoom Al Zahra - Luxury Living in Mohammadpur"
          placeholderBn="যেমন: জুম আল জাহরা - মোহাম্মদপুরে আধুনিক আবাসন"
          maxLength={70}
        />

        <TextPair
          label="Meta Description (Search & Social Summary)"
          description="Short summary shown in search results and social cards"
          en={value.metaDescription ?? ""}
          bn={value.metaDescriptionBn ?? ""}
          onEnChange={(v) => setValue({ ...value, metaDescription: v })}
          onBnChange={(v) => setValue({ ...value, metaDescriptionBn: v })}
          placeholderEn="e.g., Discover luxury flats with modern amenities and scenic lake views..."
          placeholderBn="যেমন: লেকভিউ ও আধুনিক সুযোগ-সুবিধা সহ বিলাসবহুল ফ্ল্যাট বুকিং চলছে..."
          multiline
          maxLength={200}
        />
      </FormSectionCard>
    </div>
  );
}
