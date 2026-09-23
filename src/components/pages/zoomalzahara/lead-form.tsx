"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Icon } from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { landingCardClass } from "@/components/pages/zoomalzahara/landing-card";
import { trackMeta } from "@/components/analytics/meta-pixel";
import { submitContactForm } from "@/server/features/inquiries/action";

interface LeadFormDict {
  name: string;
  namePlaceholder: string;
  phone: string;
  email: string;
  plan?: string;
  planAny?: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  privacy: string;
  successTitle: string;
  successBody: string;
}

export function ZoomAlZaharaLeadForm({
  dict,
  projectName,
  source,
  path,
  variant = "default",
}: {
  dict: LeadFormDict;
  projectName: string;
  source: string;
  path: string;
  variant?: "default" | "compact";
}) {
  const compact = variant === "compact";
  const id = compact ? "azh" : "az";
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
    const note = String(formData.get("message") ?? "").trim();
    const planLine = `Plan: ${projectName}`;
    formData.set("budget", projectName);
    formData.set("message", note ? `${planLine}\n${note}` : planLine);
    formData.set("source", source);
    formData.set("subject", `${projectName} viewing`);
    formData.set("enquiry", "buy");

    const res = await submitContactForm(formData);

    if (res.success) {
      trackMeta("Lead", {
        content_name: projectName,
        content_ids: [path],
      });
      toast.success(dict.successTitle, { description: dict.successBody });
      form.reset();
      setPhone("");
    } else {
      toast.error(res.error || "Failed to submit request");
    }

    setSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact
          ? "flex flex-col gap-3.5"
          : `flex flex-col gap-4 p-4 sm:p-5 ${landingCardClass}`
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <Field id={`${id}-name`} label={dict.name} required>
          <Input
            id={`${id}-name`}
            name="name"
            required
            autoComplete="name"
            placeholder={dict.namePlaceholder}
          />
        </Field>
        <Field id={`${id}-phone`} label={dict.phone} required>
          <PhoneNumberInput
            id={`${id}-phone`}
            name="phone"
            value={phone}
            onChange={setPhone}
            required
            placeholder="01712-345678"
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <Field id={`${id}-email`} label={dict.email}>
          <Input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@domain.com"
          />
        </Field>
        <Field id={`${id}-plan`} label={dict.plan || "Plan"}>
          <div className="relative">
            <Input
              id={`${id}-plan`}
              name="budget"
              value={projectName}
              readOnly
              tabIndex={-1}
              className="cursor-pointer bg-muted/40 pr-10 font-medium text-foreground"
            />
            <Icon
              name="building"
              size="sm"
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-primary"
            />
          </div>
        </Field>
      </div>

      <Field id={`${id}-message`} label={dict.message}>
        <Textarea
          id={`${id}-message`}
          name="message"
          placeholder={dict.messagePlaceholder}
          className={compact ? "min-h-20" : undefined}
        />
      </Field>

      <Button type="submit" disabled={submitting} className="h-10 w-full">
        {submitting ? dict.submitting : dict.submit}
        <Icon name="arrowRight" size="xs" />
      </Button>

      <p className="text-xs text-muted-foreground">{dict.privacy}</p>
    </form>
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
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
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
