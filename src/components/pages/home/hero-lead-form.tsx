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
 * Home hero lead form — same card width as the old property calculator.
 * Kept compact so the hero title stays low in the viewport.
 */
export function HeroLeadForm({
  dict,
  title,
  className,
}: {
  dict: HeroLeadFormDict;
  title?: string;
  className?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!phone || phone.length < 8) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("phone", phone);
    formData.set("source", "home-hero");
    formData.set("subject", "Home page enquiry");
    formData.set("enquiry", "buy");

    const res = await submitContactForm(formData);

    if (res.success) {
      trackMeta("Lead", { content_name: "Home hero" });
      toast.success(dict.successTitle, { description: dict.successBody });
      form.reset();
      setPhone("");
    } else {
      toast.error(res.error || "Failed to submit enquiry");
    }

    setSubmitting(false);
  }

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={handleSubmit}
        className="relative z-20 flex w-full flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-2xl sm:gap-3.5 sm:p-6"
      >
        <span className="font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {title || dict.title || "Send an enquiry"}
        </span>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="hero-name" label={dict.name} required>
            <Input
              id="hero-name"
              name="name"
              required
              autoComplete="name"
              placeholder={dict.namePlaceholder}
              className="h-11"
            />
          </Field>

          <Field id="hero-phone" label={dict.phone} required>
            <PhoneNumberInput
              id="hero-phone"
              name="phone"
              value={phone}
              onChange={setPhone}
              required
              placeholder="01712-345678"
            />
          </Field>
        </div>

        <Field id="hero-email" label={dict.email}>
          <Input
            id="hero-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@domain.com"
            className="h-11"
          />
        </Field>

        <Field id="hero-message" label={dict.message}>
          <Textarea
            id="hero-message"
            name="message"
            placeholder={dict.messagePlaceholder}
            className="min-h-16 resize-none"
            rows={2}
          />
        </Field>

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="h-11 w-full font-semibold"
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
