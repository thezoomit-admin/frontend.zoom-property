"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Icon } from "@/components/common/icon";
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
import { cn } from "@/lib/utils";

const ENQUIRY_VALUES = ["buy", "rent", "sell", "landowner", "nrb"] as const;
const AREA_ANY = "any";

/** Client cooldown between submits (server also limits to 5/hour). */
const CLIENT_COOLDOWN_MS = 45_000;

export interface AreaOption {
  value: string;
  label: string;
}

export interface BudgetOption {
  value: string;
  label: string;
}

interface FormDict {
  name: string;
  namePlaceholder: string;
  phone: string;
  email: string;
  enquiry: string;
  area: string;
  areaAny: string;
  budget: string;
  budgetOptions?: Record<string, string>;
  message: string;
  messagePlaceholder: string;
  submit: string;
  submitting: string;
  privacy: string;
  successTitle: string;
  successBody: string;
  options: Record<(typeof ENQUIRY_VALUES)[number], string>;
}

export function ContactForm({
  dict,
  areas,
  budgets = [],
  source = "Contact Page",
  className,
}: {
  dict: FormDict;
  areas: AreaOption[];
  budgets?: BudgetOption[];
  source?: string;
  className?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState("");
  const [lastSubmitAt, setLastSubmitAt] = useState(0);

  const budgetOptions =
    budgets.length > 0
      ? budgets
      : Object.entries(dict.budgetOptions || {}).map(([value, label]) => ({
          value,
          label,
        }));

  const defaultBudget =
    budgetOptions.find((b) => b.value === "any")?.value ||
    budgetOptions[0]?.value ||
    "any";

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
    if (!formData.get("subject")) {
      formData.set("subject", "Website Enquiry");
    }

    const res = await submitContactForm(formData);

    if (res.success) {
      setLastSubmitAt(Date.now());
      toast.success(dict.successTitle, { description: dict.successBody });
      form.reset();
      setPhone("");
    } else {
      const msg = res.error || "Failed to submit message";
      const rateLimited =
        /too many|wait an hour|rate|try again/i.test(msg);
      toast.error(
        rateLimited
          ? "Too many enquiries from this device. Please wait about an hour and try again."
          : msg,
      );
    }

    setSubmitting(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-xs sm:p-8",
        className,
      )}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="lead-name" label={dict.name} required>
          <Input
            id="lead-name"
            name="name"
            required
            autoComplete="name"
            placeholder={dict.namePlaceholder}
          />
        </Field>

        <Field id="lead-phone" label={dict.phone} required>
          <PhoneNumberInput
            id="lead-phone"
            name="phone"
            value={phone}
            onChange={setPhone}
            required
            placeholder="01712-345678"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="lead-email" label={dict.email}>
          <Input
            id="lead-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@domain.com"
          />
        </Field>

        <Field id="lead-enquiry" label={dict.enquiry}>
          <Select name="enquiry" defaultValue="buy">
            <SelectTrigger id="lead-enquiry" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENQUIRY_VALUES.map((value) => (
                <SelectItem key={value} value={value}>
                  {dict.options[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="lead-area" label={dict.area}>
          <Select name="area" defaultValue={AREA_ANY}>
            <SelectTrigger id="lead-area" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AREA_ANY}>{dict.areaAny}</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area.value} value={area.value}>
                  {area.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field id="lead-budget" label={dict.budget}>
          <Select name="budget" defaultValue={defaultBudget}>
            <SelectTrigger id="lead-budget" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {budgetOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field id="lead-message" label={dict.message}>
        <Textarea
          id="lead-message"
          name="message"
          placeholder={dict.messagePlaceholder}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full bg-primary sm:w-fit sm:px-8"
      >
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
