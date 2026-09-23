"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Heading } from "@/components/common/heading";
import { Icon } from "@/components/common/icon";
import Image from "@/components/common/image";
import { Text } from "@/components/common/text";
import { trackMeta } from "@/components/analytics/meta-pixel";
import { ProjectCard } from "@/components/pages/projects/project-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import type { Area } from "@/data/areas";
import type { Project } from "@/data/projects";
import type { Locale } from "@/i18n/config";
import { localeHref } from "@/i18n/href";
import { cn } from "@/lib/utils";
import { submitContactForm } from "@/server/features/inquiries/action";
import type { SubArea } from "@/server/features/sub-areas";
import Link from "next/link";

export interface AreaDetailCopy {
  eyebrow: string;
  subAreasTitle: string;
  subAreasLead: string;
  projectsHeading: string;
  projectsEmpty: string;
  projectCount: string;
  leadTitle: string;
  leadBody: string;
  leadSubmit: string;
  leadSubmitting: string;
  leadSuccess: string;
  backToAreas: string;
  close: string;
  colNo: string;
  colSubArea: string;
  colTagline: string;
  colProjects: string;
  colAction: string;
  viewProjects: string;
  name: string;
  namePlaceholder: string;
  phone: string;
  email: string;
  message: string;
  messagePlaceholder: string;
}

/**
 * Area detail: sub-area cards → lead modal → projects for that pocket.
 */
export function AreaDetailView({
  area,
  subAreas,
  projectsBySubArea,
  locale,
  copy,
}: {
  area: Area;
  subAreas: SubArea[];
  /** Preloaded projects keyed by sub-area refId. */
  projectsBySubArea: Record<string, Project[]>;
  locale: Locale;
  copy: AreaDetailCopy;
}) {
  const isBn = locale === "bn";
  const areaName = isBn && area.nameBn ? area.nameBn : area.name;
  const areaNote = isBn && area.note ? area.note : area.note;

  const [active, setActive] = useState<SubArea | null>(null);
  const [unlockedId, setUnlockedId] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const unlockedProjects = useMemo(() => {
    if (!unlockedId) return [];
    return projectsBySubArea[unlockedId] || [];
  }, [unlockedId, projectsBySubArea]);

  const unlockedSub = subAreas.find((s) => s.refId === unlockedId);

  async function handleLeadSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active) return;
    if (!phone || phone.length < 8) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("phone", phone);
    formData.set("area", area.name);
    formData.set("subArea", active.name);
    formData.set("source", `area-${area.id}/${active.id}`);
    formData.set("subject", `${area.name} / ${active.name} enquiry`);
    formData.set("enquiry", "buy");
    formData.set("createLead", "1");
    if (!String(formData.get("message") || "").trim()) {
      formData.set("message", copy.leadBody);
    }
    const email = String(formData.get("email") || "").trim();
    if (!email) {
      formData.set("email", "lead@zoompropertyltd.com");
    }

    const res = await submitContactForm(formData);
    if (res.success) {
      trackMeta("Lead", { content_name: `Area ${area.name} / ${active.name}` });
      toast.success(copy.leadSuccess);
      setUnlockedId(active.refId);
      setActive(null);
      setPhone("");
      form.reset();
    } else {
      toast.error(res.error || "Failed to submit");
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 max-w-2xl">
          <p className="font-heading text-xs font-bold tracking-[0.14em] text-primary uppercase">
            {copy.eyebrow}
          </p>
          <Heading as="h1" size="h2" className="mt-2">
            {areaName}
          </Heading>
          {area.tagline || area.taglineBn ? (
            <Text size="lead" className="mt-3 text-muted-foreground">
              {isBn && area.taglineBn ? area.taglineBn : area.tagline}
            </Text>
          ) : null}
          {areaNote ? (
            <Text size="sm" className="mt-3 text-muted-foreground">
              {isBn ? area.note || areaNote : area.note || areaNote}
            </Text>
          ) : null}
        </div>
        <Button asChild variant="outline" className="w-fit">
          <Link href={localeHref(locale, "/areas")}>
            <Icon name="arrowLeft" size="xs" />
            {copy.backToAreas}
          </Link>
        </Button>
      </div>

      <section>
        <Heading as="h2" size="h4">
          {copy.subAreasTitle}
        </Heading>
        <Text size="sm" className="mt-2 max-w-2xl text-muted-foreground">
          {copy.subAreasLead}
        </Text>

        {subAreas.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">
            {copy.projectsEmpty}
          </p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="w-14 px-4 py-3 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
                      {copy.colNo}
                    </th>
                    <th className="px-4 py-3 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
                      {copy.colSubArea}
                    </th>
                    <th className="hidden px-4 py-3 font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase md:table-cell">
                      {copy.colTagline}
                    </th>
                    <th className="w-28 px-4 py-3 text-center font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
                      {copy.colProjects}
                    </th>
                    <th className="w-40 px-4 py-3 text-right font-heading text-xs font-bold tracking-wider text-muted-foreground uppercase">
                      {copy.colAction}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subAreas.map((sub, index) => {
                    const name = isBn && sub.nameBn ? sub.nameBn : sub.name;
                    const tagline =
                      isBn && sub.taglineBn ? sub.taglineBn : sub.tagline;
                    const selected = unlockedId === sub.refId;
                    return (
                      <tr
                        key={sub.refId}
                        className={cn(
                          "border-b border-border last:border-b-0 transition-colors",
                          selected ? "bg-primary/5" : "hover:bg-muted/40",
                        )}
                      >
                        <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="relative block size-8 shrink-0 overflow-hidden rounded border border-border bg-muted">
                              {sub.image ? (
                                <Image
                                  src={sub.image}
                                  alt=""
                                  width={32}
                                  height={32}
                                  sizes="32px"
                                  className="size-8 object-cover"
                                />
                              ) : (
                                <span className="absolute inset-0 grid place-items-center text-muted-foreground">
                                  <Icon name="location" size="xs" />
                                </span>
                              )}
                            </span>
                            <span className="min-w-0">
                              <span className="block font-heading text-sm font-bold text-foreground">
                                {name}
                              </span>
                              {tagline ? (
                                <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground md:hidden">
                                  {tagline}
                                </span>
                              ) : null}
                            </span>
                          </div>
                        </td>
                        <td className="hidden max-w-xs px-4 py-2.5 text-muted-foreground md:table-cell">
                          <span className="line-clamp-2">{tagline || "—"}</span>
                        </td>
                        <td className="px-4 py-2.5 text-center tabular-nums font-medium text-foreground">
                          {sub.projectCount ?? 0}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant={selected ? "default" : "outline"}
                            className="h-8 gap-1 text-xs"
                            onClick={() => {
                              if (unlockedId === sub.refId) {
                                document
                                  .getElementById("area-projects")
                                  ?.scrollIntoView({ behavior: "smooth" });
                                return;
                              }
                              setActive(sub);
                            }}
                          >
                            {copy.viewProjects}
                            <Icon name="arrowRight" size="xs" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {unlockedId ? (
        <section id="area-projects" className="scroll-mt-24">
          <Heading as="h2" size="h4">
            {copy.projectsHeading}
            {unlockedSub ? (
              <span className="font-normal text-muted-foreground">
                {" "}
                ·{" "}
                {isBn && unlockedSub.nameBn
                  ? unlockedSub.nameBn
                  : unlockedSub.name}
              </span>
            ) : null}
          </Heading>
          {unlockedProjects.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {copy.projectsEmpty}
            </p>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {unlockedProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}

      <Dialog
        open={Boolean(active)}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{copy.leadTitle}</DialogTitle>
            <DialogDescription>{copy.leadBody}</DialogDescription>
          </DialogHeader>
          {active ? (
            <p className="rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
              {areaName}
              {" · "}
              {isBn && active.nameBn ? active.nameBn : active.name}
            </p>
          ) : null}
          <form onSubmit={handleLeadSubmit} className="mt-2 flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="area-lead-name" className="text-xs">
                {copy.name}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="area-lead-name"
                name="name"
                required
                autoComplete="name"
                placeholder={copy.namePlaceholder}
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="area-lead-phone" className="text-xs">
                {copy.phone}
                <span className="text-destructive">*</span>
              </Label>
              <PhoneNumberInput
                id="area-lead-phone"
                name="phone"
                value={phone}
                onChange={setPhone}
                required
                placeholder="01712-345678"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="area-lead-email" className="text-xs">
                {copy.email}
              </Label>
              <Input
                id="area-lead-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@domain.com"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="area-lead-message" className="text-xs">
                {copy.message}
              </Label>
              <Textarea
                id="area-lead-message"
                name="message"
                placeholder={copy.messagePlaceholder}
                className="min-h-20 resize-none"
                rows={2}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="h-11 w-full bg-primary font-semibold"
            >
              {submitting ? copy.leadSubmitting : copy.leadSubmit}
              <Icon name="arrowRight" size="xs" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
