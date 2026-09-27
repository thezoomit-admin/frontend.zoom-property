"use client";

import { Megaphone, PhoneCall } from "lucide-react";
import type { ApiProjectLanding } from "@/server/features/project-landing/types";
import { FormSectionCard, TextPair } from "../field-inputs";

export type CtaValue = NonNullable<ApiProjectLanding["cta"]>;

export const emptyCta: CtaValue = {
  eyebrow: "", eyebrowBn: "", title: "", titleBn: "",
  description: "", descriptionBn: "", primary: "", primaryBn: "",
  call: "", callBn: "", whatsapp: "", whatsappBn: "",
};

export function CtaFields({
  value,
  setValue,
}: {
  value: CtaValue;
  setValue: (next: CtaValue) => void;
}) {
  return (
    <div className="space-y-6">
      <FormSectionCard
        title="Call to Action Banner Header"
        description="The headline and message urging prospective buyers to get in touch."
        icon={Megaphone}
      >
        <TextPair
          label="Section Eyebrow"
          description="Badge tag above CTA title"
          en={value.eyebrow ?? ""}
          bn={value.eyebrowBn ?? ""}
          onEnChange={(v) => setValue({ ...value, eyebrow: v })}
          onBnChange={(v) => setValue({ ...value, eyebrowBn: v })}
          placeholderEn="e.g., Don't Miss This Rare Opportunity"
          placeholderBn="যেমন: আপনার স্বপ্নের ঠিকানা"
          maxLength={50}
        />
        <TextPair
          label="Main Headline"
          description="Large call to action title"
          en={value.title ?? ""}
          bn={value.titleBn ?? ""}
          onEnChange={(v) => setValue({ ...value, title: v })}
          onBnChange={(v) => setValue({ ...value, titleBn: v })}
          placeholderEn="e.g., Own Your Signature Home Today"
          placeholderBn="যেমন: আজই বুক করুন আপনার প্রিয় ইউনিট"
          maxLength={100}
        />
        <TextPair
          label="Banner Description"
          description="Supporting incentive text"
          en={value.description ?? ""}
          bn={value.descriptionBn ?? ""}
          onEnChange={(v) => setValue({ ...value, description: v })}
          onBnChange={(v) => setValue({ ...value, descriptionBn: v })}
          placeholderEn="e.g., Limited units available. Connect with our advisors for floor plans, custom payment schedules, and private appointments."
          placeholderBn="যেমন: সীমিত সংখ্যক ইউনিট অবশিষ্ট রয়েছে। বিস্তারিত জানতে সরাসরি আমাদের প্রতিনিধিদের সাথে যোগাযোগ করুন।"
          multiline
          maxLength={300}
        />
      </FormSectionCard>

      <FormSectionCard
        title="Action Button Text"
        description="Labels for primary inquiry and direct call / WhatsApp buttons."
        icon={PhoneCall}
      >
        <TextPair
          label="Primary Button Label"
          description="Main highlighted button text"
          en={value.primary ?? ""}
          bn={value.primaryBn ?? ""}
          onEnChange={(v) => setValue({ ...value, primary: v })}
          onBnChange={(v) => setValue({ ...value, primaryBn: v })}
          placeholderEn="e.g., Enquire Now"
          placeholderBn="যেমন: এখনই যোগাযোগ করুন"
          maxLength={30}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TextPair
            label="Direct Call Button Label"
            description="Text shown next to phone icon"
            en={value.call ?? ""}
            bn={value.callBn ?? ""}
            onEnChange={(v) => setValue({ ...value, call: v })}
            onBnChange={(v) => setValue({ ...value, callBn: v })}
            placeholderEn="e.g., Call Us Direct"
            placeholderBn="যেমন: সরাসরি কল করুন"
            maxLength={30}
          />
          <TextPair
            label="WhatsApp Button Label"
            description="Text shown next to WhatsApp icon"
            en={value.whatsapp ?? ""}
            bn={value.whatsappBn ?? ""}
            onEnChange={(v) => setValue({ ...value, whatsapp: v })}
            onBnChange={(v) => setValue({ ...value, whatsappBn: v })}
            placeholderEn="e.g., Chat on WhatsApp"
            placeholderBn="যেমন: হোয়াটসঅ্যাপে কথা বলুন"
            maxLength={30}
          />
        </div>
      </FormSectionCard>
    </div>
  );
}
