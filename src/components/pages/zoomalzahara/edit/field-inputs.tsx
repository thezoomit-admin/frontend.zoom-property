"use client";

import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { translateToBangla } from "@/lib/translate";

/**
 * One label, an English input and its Bangla pair beside it with auto-translate capability.
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
  const [translating, setTranslating] = useState(false);
  const Field = multiline ? Textarea : Input;
  const near = (value: string) => value.length >= maxLength * 0.9;

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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">{label}</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleTranslate}
            disabled={translating || !en.trim()}
            className="h-6 px-1.5 text-[11px] text-primary hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1 font-normal"
            title="Translate English to Bangla (বাংলা করুন)"
          >
            {translating ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Languages className="size-3.5" />
            )}
            <span>{translating ? "রূপান্তর হচ্ছে..." : "বাংলা করুন"}</span>
          </Button>
        </div>

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
