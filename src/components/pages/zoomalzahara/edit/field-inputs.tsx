"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * One label, an English input and its Bangla pair beside it — the shape
 * every bilingual field in these forms shares.
 *
 * `maxLength` is required, not optional with a silent fallback: every call
 * site names a limit that fits where the field actually renders (a badge
 * pill, a heading, a paragraph) — the whole point of capping input here is
 * that the landing page's design is never something a save can overflow or
 * wrap into.
 */
export function TextPair({
  label,
  en,
  bn,
  onEnChange,
  onBnChange,
  multiline,
  maxLength,
}: {
  label: string;
  en: string;
  bn: string;
  onEnChange: (value: string) => void;
  onBnChange: (value: string) => void;
  multiline?: boolean;
  maxLength: number;
}) {
  const Field = multiline ? Textarea : Input;
  const near = (value: string) => value.length >= maxLength * 0.9;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label>{label}</Label>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          {Math.max(en.length, bn.length)}/{maxLength}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Field
          value={en}
          maxLength={maxLength}
          onChange={(e) => onEnChange(e.target.value.slice(0, maxLength))}
          placeholder={`${label} (English)`}
          className={cn(near(en) && "border-amber-500 focus-visible:ring-amber-500/40")}
        />
        <Field
          value={bn}
          maxLength={maxLength}
          onChange={(e) => onBnChange(e.target.value.slice(0, maxLength))}
          placeholder={`${label} (বাংলা)`}
          className={cn(near(bn) && "border-amber-500 focus-visible:ring-amber-500/40")}
        />
      </div>
    </div>
  );
}
