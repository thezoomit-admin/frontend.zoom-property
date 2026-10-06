"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Icon } from "@/components/common/icon";
import {
  HeroLeadForm,
  type HeroLeadFormDict,
} from "@/components/pages/home/hero-lead-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { LeadAreaOption } from "@/server/features/areas/lead-options";

/**
 * The button + leads-form modal at the foot of the shared contact CTA.
 *
 * Once the lead is filed the visitor is sent to `href` — the "CTA link" the
 * desk sets in the CMS. An absolute address (https://, wa.me, tel:) is a full
 * navigation; a site path goes through the router. Empty link: the modal just
 * closes and the form's own success toast is all they see.
 */
export function ContactCtaModal({
  label,
  title,
  description,
  href,
  leadDict,
  areas,
  buttonClassName,
}: {
  label: string;
  title: string;
  description: string;
  href: string;
  leadDict: HeroLeadFormDict;
  areas: LeadAreaOption[];
  buttonClassName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleSuccess() {
    setOpen(false);
    const target = href.trim();
    if (!target) return;
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) {
      window.location.href = target;
    } else {
      router.push(target.startsWith("/") ? target : `/${target}`);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClassName}
      >
        <Icon name="phone" size="xs" />
        {label}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto overscroll-contain sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <HeroLeadForm
            dict={leadDict}
            areas={areas}
            source="contact-cta"
            subject="Contact CTA enquiry"
            idPrefix="cta-lead"
            trackName="Contact CTA"
            formClassName="border-0 p-0 shadow-none sm:p-0"
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
