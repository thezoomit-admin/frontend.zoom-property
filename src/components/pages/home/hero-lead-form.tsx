"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Icon } from "@/components/common/icon";
import { trackMeta } from "@/components/analytics/meta-pixel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/server/features/inquiries/action";
import type { LeadAreaOption } from "@/server/features/areas/lead-options";
import { cn } from "@/lib/utils";

/** Client cooldown between submits (server also limits to 5/hour). */
const CLIENT_COOLDOWN_MS = 45_000;
const AREA_ANY = "any";
/** Joins an area and sub-area value into one combined option value. */
const AREA_SUB_SEP = ":::";

export type HeroLeadAreaOption = LeadAreaOption;

type CombinedAreaOption = {
  value: string;
  label: string;
  area: string;
  subArea: string;
};

/**
 * One select instead of two cascading ones: every sub-area becomes its own
 * option labelled "Area (Sub-area)", and an area with no sub-areas keeps a
 * single plain option. The lead still records both values — the combined
 * value just carries them together for the picker.
 */
function buildCombinedAreaOptions(areas: LeadAreaOption[]): CombinedAreaOption[] {
  return areas.flatMap((area) =>
    area.subAreas.length > 0
      ? area.subAreas.map((sub) => ({
          value: `${area.value}${AREA_SUB_SEP}${sub.value}`,
          label: `${area.label} (${sub.label})`,
          area: area.value,
          subArea: sub.value,
        }))
      : [{ value: area.value, label: area.label, area: area.value, subArea: "" }],
  );
}

export interface HeroLeadFormDict {
  title?: string;
  name: string;
  namePlaceholder: string;
  phone: string;
  email: string;
  area?: string;
  areaAny?: string;
  subArea?: string;
  subAreaAny?: string;
  subAreaPickArea?: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  privacy: string;
  successTitle: string;
  successBody: string;
}

/**
 * Home / site CTA lead form — name, phone, email, area → sub-area, message.
 */
export function HeroLeadForm({
  dict,
  title,
  areas = [],
  source = "home-hero",
  subject = "Home page enquiry",
  idPrefix = "hero",
  className,
  formClassName,
  trackName = "Home hero",
  variant = "default",
}: {
  dict: HeroLeadFormDict;
  title?: string;
  areas?: LeadAreaOption[];
  source?: string;
  subject?: string;
  idPrefix?: string;
  className?: string;
  formClassName?: string;
  trackName?: string;
  /** `glass` — frosted panel for the home hero veil. */
  variant?: "default" | "glass";
}) {
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [combinedArea, setCombinedArea] = useState(AREA_ANY);
  const [lastSubmitAt, setLastSubmitAt] = useState(0);
  const glass = variant === "glass";

  const combinedAreaOptions = useMemo(
    () => buildCombinedAreaOptions(areas),
    [areas],
  );
  const selectedCombined = useMemo(
    () => combinedAreaOptions.find((row) => row.value === combinedArea),
    [combinedAreaOptions, combinedArea],
  );
  const area = selectedCombined?.area ?? "";
  const subArea = selectedCombined?.subArea ?? "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!phone || phone.length < 8) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const now = Date.now();
    if (lastSubmitAt && now - lastSubmitAt < CLIENT_COOLDOWN_MS) {
      const wait = Math.ceil((CLIENT_COOLDOWN_MS - (now - lastSubmitAt)) / 1000);
      toast.error(`Please wait ${wait}s before sending another enquiry.`);
      return;
    }

    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("phone", phone);
    formData.set("source", source);
    formData.set("subject", subject);
    formData.set("enquiry", "buy");
    // Home + site CTA lead forms → Bond CRM lead (contact page does not).
    formData.set("createLead", "1");
    if (area) {
      formData.set("area", area);
    } else {
      formData.delete("area");
    }
    if (subArea) {
      formData.set("subArea", subArea);
    } else {
      formData.delete("subArea");
    }

    const res = await submitContactForm(formData);

    if (res.success) {
      setLastSubmitAt(Date.now());
      trackMeta("Lead", { content_name: trackName });
      toast.success(dict.successTitle, { description: dict.successBody });
      form.reset();
      setPhone("");
      setCombinedArea(AREA_ANY);
    } else {
      const msg = res.error || "Failed to submit enquiry";
      toast.error(
        /too many|wait an hour|rate|try again/i.test(msg)
          ? "Too many enquiries from this device. Please wait about an hour and try again."
          : msg,
      );
    }

    setSubmitting(false);
  }

  const fieldClass = glass
    ? "border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:border-white/40"
    : undefined;

  const selectTriggerClass = cn(
    "h-11 w-full",
    glass &&
      "border-white/20 bg-white/10 text-white [&_svg]:text-white/70 data-placeholder:text-white/40",
  );

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative z-20 flex w-full flex-col gap-3.5 rounded-2xl border p-5 sm:gap-4 sm:p-6",
          glass
            ? "border-white/15 bg-white/10 shadow-none backdrop-blur-md"
            : "border-border bg-card shadow-xs",
          formClassName,
        )}
      >
        {(title || dict.title) && (
          <span
            className={cn(
              "font-heading text-xs font-bold tracking-wider uppercase",
              glass ? "text-white/70" : "text-muted-foreground",
            )}
          >
            {title || dict.title}
          </span>
        )}

        <Field id={`${idPrefix}-name`} label={dict.name} required glass={glass}>
          <Input
            id={`${idPrefix}-name`}
            name="name"
            required
            autoComplete="name"
            placeholder={dict.namePlaceholder}
            className={cn("h-11", fieldClass)}
          />
        </Field>

        <Field id={`${idPrefix}-phone`} label={dict.phone} required glass={glass}>
          <PhoneNumberInput
            id={`${idPrefix}-phone`}
            name="phone"
            value={phone}
            onChange={setPhone}
            required
            placeholder="01712-345678"
            className={glass ? "PhoneNumberInput--glass" : undefined}
          />
        </Field>

        <Field id={`${idPrefix}-email`} label={dict.email} glass={glass}>
          <Input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@domain.com"
            className={cn("h-11", fieldClass)}
          />
        </Field>

        <Field
          id={`${idPrefix}-area`}
          label={dict.area || "Area"}
          glass={glass}
        >
          <Select value={combinedArea} onValueChange={setCombinedArea}>
            <SelectTrigger id={`${idPrefix}-area`} className={selectTriggerClass}>
              <SelectValue placeholder={dict.areaAny || "Select area"} />
            </SelectTrigger>
            <SelectContent className="max-h-[min(22rem,var(--radix-select-content-available-height))]">
              <SelectItem value={AREA_ANY}>
                {dict.areaAny || "Any area"}
              </SelectItem>
              {combinedAreaOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field id={`${idPrefix}-message`} label={dict.message} glass={glass}>
          <Textarea
            id={`${idPrefix}-message`}
            name="message"
            placeholder={dict.messagePlaceholder}
            className={cn("min-h-20 resize-none", fieldClass)}
            rows={2}
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="h-11 w-full bg-primary font-semibold"
        >
          {submitting ? dict.submitting : dict.submit}
          <Icon name="arrowRight" size="xs" />
        </Button>

        <p
          className={cn(
            "text-[11px] leading-snug",
            glass ? "text-white/55" : "text-muted-foreground",
          )}
        >
          {dict.privacy}
        </p>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  glass,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  glass?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label
        htmlFor={id}
        className={cn(
          "text-xs font-medium",
          glass ? "text-white/80" : "text-foreground",
        )}
      >
        {label}
        {required ? (
          <span aria-hidden className={glass ? "text-red-300" : "text-destructive"}>
            *
          </span>
        ) : null}
      </Label>
      {children}
    </div>
  );
}
