"use client";

import { useState, type ReactNode } from "react";
import { Info, Languages, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { translateToBangla } from "@/lib/translate";

/**
 * Card container to group related inputs with a title, icon, and explanation.
 */
export function FormSectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4",
        className
      )}
    >
      <div className="flex items-start justify-between border-b border-border/60 pb-3">
        <div className="space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/**
 * Bilingual TextPair with clear English & Bangla input labels, field usage hints,
 * character count, and one-click Google translate to Bangla.
 */
export function TextPair({
  label,
  description,
  hint,
  en,
  bn,
  onEnChange,
  onBnChange,
  multiline,
  maxLength,
  placeholderEn,
  placeholderBn,
}: {
  label: string;
  description?: string;
  hint?: string;
  en: string;
  bn: string;
  onEnChange: (value: string) => void;
  onBnChange: (value: string) => void;
  multiline?: boolean;
  maxLength: number;
  placeholderEn?: string;
  placeholderBn?: string;
}) {
  const [translating, setTranslating] = useState(false);
  const Field = multiline ? Textarea : Input;
  const near = (value: string) => value.length >= maxLength * 0.9;

  const usageHint = description || hint;

  const handleTranslate = async () => {
    if (!en || !en.trim()) {
      toast.info("অনুবাদের জন্য আগে ইংরেজিতে লিখুন");
      return;
    }

    setTranslating(true);
    try {
      const translated = await translateToBangla(en);
      if (translated) {
        onBnChange(translated.slice(0, maxLength));
        toast.success("বাংলায় রূপান্তর করা হয়েছে!");
      }
    } catch {
      toast.error("অনুবাদ করতে সমস্যা হয়েছে");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg border border-border/40 bg-muted/20 p-3 sm:p-3.5 transition-colors hover:border-border">
      {/* Top Header: Label, Usage Hint, Auto-translate, Character Counter */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Label className="text-xs font-semibold text-foreground">{label}</Label>
            {usageHint && (
              <span className="flex items-center text-[11px] text-muted-foreground font-normal">
                ({usageHint})
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTranslate}
            disabled={translating || !en.trim()}
            className="group h-7 px-2.5 text-[11px] font-bold text-primary border-primary/40 bg-primary/10 hover:bg-primary hover:text-white hover:border-primary transition-all duration-150 flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-40"
            title="Auto-translate English text to Bangla (বাংলা করুন)"
          >
            {translating ? (
              <Loader2 className="size-3.5 animate-spin text-current shrink-0" />
            ) : (
              <Languages className="size-3.5 text-current shrink-0 transition-colors" />
            )}
            <span className="text-current">{translating ? "রূপান্তর হচ্ছে..." : "বাংলা করুন"}</span>
          </Button>

          <span className="text-[10px] tabular-nums text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {Math.max(en.length, bn.length)}/{maxLength}
          </span>
        </div>
      </div>

      {/* Two Column Grid for English and Bangla */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-blue-500" />
              English
            </span>
          </div>
          <Field
            value={en}
            maxLength={maxLength}
            onChange={(e) => onEnChange(e.target.value.slice(0, maxLength))}
            placeholder={placeholderEn || `Enter ${label.toLowerCase()} in English...`}
            className={cn(
              "text-xs sm:text-sm bg-background transition-all duration-150 rounded-lg shadow-2xs focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
              multiline ? "min-h-[80px]" : "h-9.5",
              near(en) && "border-amber-500 focus-visible:ring-amber-500/40"
            )}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
            <span className="font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              বাংলা (Bengali)
            </span>
          </div>
          <Field
            value={bn}
            maxLength={maxLength}
            onChange={(e) => onBnChange(e.target.value.slice(0, maxLength))}
            placeholder={placeholderBn || `বাংলায় ${label.toLowerCase()} লিখুন...`}
            className={cn(
              "text-xs sm:text-sm bg-background transition-all duration-150 rounded-lg shadow-2xs focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
              multiline ? "min-h-[80px]" : "h-9.5",
              near(bn) && "border-amber-500 focus-visible:ring-amber-500/40"
            )}
          />
        </div>
      </div>
    </div>
  );
}

import { Icon } from "@/components/common/icon";

export function IconInputField({
  label = "Icon (আইকন)",
  description = "FontAwesome class (e.g., fa-solid fa-building) or keyword",
  value,
  onChange,
  placeholder = "e.g., fa-solid fa-building or check, star, car...",
}: {
  label?: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5 rounded-lg border border-border/40 bg-muted/20 p-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-foreground">{label}</Label>
        {description && (
          <span className="text-[11px] text-muted-foreground font-normal">
            {description}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex size-9.5 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary shadow-xs">
          <Icon name={value || "check"} size="sm" />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-9.5 text-xs sm:text-sm bg-background"
        />
      </div>
    </div>
  );
}
