"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Icon } from "@/components/common/icon";
import { trackMeta } from "@/components/analytics/meta-pixel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/server/features/inquiries/action";
import { cn } from "@/lib/utils";

/** Client cooldown between submits (server also limits to 5/hour). */
const CLIENT_COOLDOWN_MS = 45_000;

export interface HeroLeadFormDict {
  title?: string;
  name: string;
  namePlaceholder: string;
  phone: string;
  email: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  privacy: string;
  successTitle: string;
  successBody: string;
}

/**
 * Simple lead form — same fields as the home hero:
 * name, phone, email, question/message.
 */
export function HeroLeadForm({
  dict,
  title,
  source = "home-hero",
  subject = "Home page enquiry",
  idPrefix = "hero",
  className,
  formClassName,
  trackName = "Home hero",
}: {
  dict: HeroLeadFormDict;
  title?: string;
  source?: string;
  subject?: string;
  idPrefix?: string;
  className?: string;
  formClassName?: string;
  trackName?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [lastSubmitAt, setLastSubmitAt] = useState(0);

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

    const res = await submitContactForm(formData);

    if (res.success) {
      setLastSubmitAt(Date.now());
      trackMeta("Lead", { content_name: trackName });
      toast.success(dict.successTitle, { description: dict.successBody });
      form.reset();
      setPhone("");
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

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative z-20 flex w-full flex-col gap-3.5 rounded-2xl border border-border bg-card p-5 shadow-xs sm:gap-4 sm:p-6",
          formClassName,
        )}
      >
        {(title || dict.title) && (
          <span className="font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
            {title || dict.title}
          </span>
        )}

        <Field id={`${idPrefix}-name`} label={dict.name} required>
          <Input
            id={`${idPrefix}-name`}
            name="name"
            required
            autoComplete="name"
            placeholder={dict.namePlaceholder}
            className="h-11"
          />
        </Field>

        <Field id={`${idPrefix}-phone`} label={dict.phone} required>
          <PhoneNumberInput
            id={`${idPrefix}-phone`}
            name="phone"
            value={phone}
            onChange={setPhone}
            required
            placeholder="01712-345678"
          />
        </Field>

        <Field id={`${idPrefix}-email`} label={dict.email}>
          <Input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@domain.com"
            className="h-11"
          />
        </Field>

        <Field id={`${idPrefix}-message`} label={dict.message}>
          <Textarea
            id={`${idPrefix}-message`}
            name="message"
            placeholder={dict.messagePlaceholder}
            className="min-h-24 resize-none"
            rows={3}
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

        <p className="text-[11px] leading-snug text-muted-foreground">
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
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-foreground">
        {label}
        {required ? (
          <span aria-hidden className="text-destructive">
            *
          </span>
        ) : null}
      </Label>
      {children}
    </div>
  );
}
