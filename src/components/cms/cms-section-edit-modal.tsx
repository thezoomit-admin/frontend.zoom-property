"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ImageIcon,
  Languages,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { translateToBangla, translateToEnglish } from "@/lib/translate";
import {
  cmsStorageKey,
  type CmsField,
  type CmsSection,
} from "@/lib/cms-schema";
import { IconInputField, TextPair } from "../pages/landing/edit/field-inputs";
import { ImageField } from "../pages/landing/edit/image-field";
import { MediaPicker, type PickedMedia } from "../pages/landing/edit/media-picker";
import { RichTextEditorPair } from "./rich-text-editor";

interface CmsContentDoc {
  key: string;
  value?: unknown;
  imageUrl?: string;
  group?: string;
}

interface CmsSectionEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageId: string;
  section: CmsSection;
}

type FormFieldValue = string | string[];

export function CmsSectionEditModal({
  open,
  onOpenChange,
  pageId,
  section,
}: CmsSectionEditModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translatingDirection, setTranslatingDirection] = useState<"bn" | "en" | null>(null);
  const [stored, setStored] = useState<Record<string, CmsContentDoc>>({});
  const [formValues, setFormValues] = useState<Record<string, FormFieldValue>>({});
  const [multiplePickerField, setMultiplePickerField] = useState<string | null>(null);

  const repeatable = section.repeatable;
  const [repeatableIndices, setRepeatableIndices] = useState<number[]>([]);

  // Fetch current stored values when modal opens
  useEffect(() => {
    if (!open) return;
    let isMounted = true;

    fetch(`/api/cms?group=${encodeURIComponent(pageId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const storedDocs: Record<string, CmsContentDoc> = data?.data || {};
        setStored(storedDocs);

        // Derive repeatable indices
        let nextIndices: number[] = [];
        if (repeatable) {
          const prefix = `${repeatable.itemPrefix}.`;
          const found = new Set<number>();
          for (const k of Object.keys(storedDocs)) {
            if (k.startsWith(prefix)) {
              const rest = k.slice(prefix.length);
              const match = rest.match(/^(\d+)\./);
              if (match) found.add(parseInt(match[1], 10));
            }
          }
          if (found.size > 0) {
            nextIndices = Array.from(found).sort((a, b) => a - b);
          } else {
            const initCount = repeatable.initialCount ?? repeatable.defaultItems?.length ?? 1;
            nextIndices = Array.from({ length: initCount }, (_, i) => i);
          }
          setRepeatableIndices(nextIndices);
        }

        // Build initial values for all base and dynamic fields
        const initial: Record<string, FormFieldValue> = {};
        const allFields: CmsField[] = [...section.fields];
        if (repeatable) {
          for (const idx of nextIndices) {
            const defaultItem = repeatable.defaultItems?.[idx];
            for (const itemField of repeatable.itemFields) {
              const key = `${repeatable.itemPrefix}.${idx}.${itemField.suffix}`;
              const defEn = defaultItem?.[`${itemField.suffix}En`] || itemField.defaultEn || "";
              const defBn = defaultItem?.[`${itemField.suffix}Bn`] || itemField.defaultBn || defEn || "";
              allFields.push({
                key,
                label: `${repeatable.itemName} ${idx + 1}: ${itemField.label}`,
                type: itemField.type,
                en: defEn,
                bn: defBn,
              });
            }
          }
        }

        for (const field of allFields) {
          const enKey = cmsStorageKey(field.key, "en");
          const bnKey = cmsStorageKey(field.key, "bn");

          const docEn = storedDocs[enKey];
          const docBn = storedDocs[bnKey];

          const valEn = (docEn?.value as FormFieldValue) ?? docEn?.imageUrl ?? "";
          const valBn = (docBn?.value as FormFieldValue) ?? docBn?.imageUrl ?? "";

          initial[`${field.key}|en`] = valEn !== undefined && valEn !== null && valEn !== "" ? valEn : field.en;
          initial[`${field.key}|bn`] = valBn !== undefined && valBn !== null && valBn !== "" ? valBn : field.bn;
        }

        setFormValues(initial);
      })
      .catch(() => {
        toast.error("Failed to load current section content");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [open, pageId, repeatable, section.fields]);

  // Derive all active effective fields
  const allEffectiveFields = useMemo(() => {
    if (!repeatable) return section.fields;
    const dynamicFields: CmsField[] = [];
    for (const idx of repeatableIndices) {
      const defaultItem = repeatable.defaultItems?.[idx];
      for (const itemField of repeatable.itemFields) {
        const key = `${repeatable.itemPrefix}.${idx}.${itemField.suffix}`;
        const defEn =
          defaultItem?.[`${itemField.suffix}En`] ||
          itemField.defaultEn ||
          "";
        const defBn =
          defaultItem?.[`${itemField.suffix}Bn`] ||
          itemField.defaultBn ||
          defEn ||
          "";
        dynamicFields.push({
          key,
          label: `${repeatable.itemName} ${idx + 1}: ${itemField.label}`,
          type: itemField.type,
          en: defEn,
          bn: defBn,
          hint: itemField.hint,
          maxLength: itemField.maxLength,
        });
      }
    }
    return [...section.fields, ...dynamicFields];
  }, [section.fields, repeatable, repeatableIndices]);

  const setFieldValue = (key: string, val: FormFieldValue) => {
    setFormValues((prev) => ({ ...prev, [key]: val }));
  };

  const getFieldValue = (key: string): string => {
    const val = formValues[key];
    if (typeof val === "string") return val;
    return "";
  };

  const getArrayFieldValue = (key: string): string[] => {
    const val = formValues[key];
    if (Array.isArray(val)) return val;
    if (typeof val === "string" && val.trim()) return [val];
    return [];
  };

  // Fill defaults action
  const handleFillDefaults = () => {
    const nextValues: Record<string, FormFieldValue> = { ...formValues };
    let count = 0;
    for (const field of allEffectiveFields) {
      if (field.type === "images") {
        nextValues[`${field.key}|en`] = field.en === "[]" ? [] : [field.en];
        nextValues[`${field.key}|bn`] = field.bn === "[]" ? [] : [field.bn];
        count++;
      } else if (field.type === "image" || field.type === "url" || field.type === "icon") {
        nextValues[`${field.key}|en`] = field.en;
        nextValues[`${field.key}|bn`] = field.en;
        count++;
      } else {
        nextValues[`${field.key}|en`] = field.en;
        nextValues[`${field.key}|bn`] = field.bn;
        count += 2;
      }
    }
    setFormValues(nextValues);
    toast.success(`Default template content loaded into ${count} fields`);
  };

  // Translate all EN -> BN action
  const handleTranslateAllEnToBn = async () => {
    setTranslatingDirection("bn");
    let count = 0;
    const nextValues = { ...formValues };

    try {
      for (const field of allEffectiveFields) {
        if (["image", "images", "url", "icon", "richtext"].includes(field.type)) continue;
        const enVal = (nextValues[`${field.key}|en`] || field.en || "").toString().trim();
        if (enVal) {
          const bnText = await translateToBangla(enVal);
          if (bnText) {
            nextValues[`${field.key}|bn`] = field.maxLength
              ? bnText.slice(0, field.maxLength)
              : bnText;
            count++;
          }
        }
      }
      setFormValues(nextValues);
      if (count > 0) {
        toast.success(`${count} fields translated to Bangla (বাংলা) successfully`);
      } else {
        toast.info("No English text found to translate");
      }
    } catch {
      toast.error("Failed to auto-translate fields to Bangla");
    } finally {
      setTranslatingDirection(null);
    }
  };

  // Translate all BN -> EN action
  const handleTranslateAllBnToEn = async () => {
    setTranslatingDirection("en");
    let count = 0;
    const nextValues = { ...formValues };

    try {
      for (const field of allEffectiveFields) {
        if (["image", "images", "url", "icon", "richtext"].includes(field.type)) continue;
        const bnVal = (nextValues[`${field.key}|bn`] || field.bn || "").toString().trim();
        if (bnVal) {
          const enText = await translateToEnglish(bnVal);
          if (enText) {
            nextValues[`${field.key}|en`] = field.maxLength
              ? enText.slice(0, field.maxLength)
              : enText;
            count++;
          }
        }
      }
      setFormValues(nextValues);
      if (count > 0) {
        toast.success(`${count} fields translated to English successfully`);
      } else {
        toast.info("No Bangla text found to translate");
      }
    } catch {
      toast.error("Failed to auto-translate fields to English");
    } finally {
      setTranslatingDirection(null);
    }
  };

  // Repeatable Add / Remove
  const handleAddItem = () => {
    if (!repeatable) return;
    if (repeatable.maxItems && repeatableIndices.length >= repeatable.maxItems) {
      toast.error(`Maximum limit of ${repeatable.maxItems} items reached`);
      return;
    }
    const nextIdx = repeatableIndices.length > 0 ? Math.max(...repeatableIndices) + 1 : 0;
    const defaultItem = repeatable.defaultItems?.[nextIdx];
    const newVals: Record<string, FormFieldValue> = {};

    for (const itemField of repeatable.itemFields) {
      const key = `${repeatable.itemPrefix}.${nextIdx}.${itemField.suffix}`;
      const defEn = defaultItem?.[`${itemField.suffix}En`] || itemField.defaultEn || "";
      const defBn = defaultItem?.[`${itemField.suffix}Bn`] || itemField.defaultBn || defEn || "";
      newVals[`${key}|en`] = defEn;
      newVals[`${key}|bn`] = defBn;
    }

    setFormValues((prev) => ({ ...prev, ...newVals }));
    setRepeatableIndices((prev) => [...prev, nextIdx]);
    toast.success(`${repeatable.itemName} #${nextIdx + 1} added`);
  };

  const handleRemoveItem = (idxToRemove: number) => {
    if (!repeatable) return;
    setRepeatableIndices((prev) => prev.filter((i) => i !== idxToRemove));
    toast.info(`${repeatable.itemName} #${idxToRemove + 1} removed`);
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    const contents: Array<{ key: string; value: string | string[]; group: string; type: "text" }> = [];
    const clear: string[] = [];

    for (const field of allEffectiveFields) {
      if (field.type === "images") {
        const rawVal = formValues[`${field.key}|en`];
        const nextList = Array.isArray(rawVal)
          ? rawVal
          : typeof rawVal === "string" && rawVal.trim()
          ? [rawVal]
          : [];

        for (const lang of ["en", "bn"] as const) {
          const key = cmsStorageKey(field.key, lang);
          if (nextList.length > 0) {
            contents.push({ key, value: nextList, group: pageId, type: "text" });
          } else {
            clear.push(key);
          }
        }
        continue;
      }

      if (field.type === "image" || field.type === "url" || field.type === "icon") {
        const rawVal = (formValues[`${field.key}|en`] ?? "").toString().trim();
        for (const lang of ["en", "bn"] as const) {
          const key = cmsStorageKey(field.key, lang);
          if (rawVal) {
            contents.push({ key, value: rawVal, group: pageId, type: "text" });
          } else {
            clear.push(key);
          }
        }
        continue;
      }

      for (const lang of ["en", "bn"] as const) {
        const key = cmsStorageKey(field.key, lang);
        const raw = (formValues[`${field.key}|${lang}`] ?? "").toString().trim();
        if (raw) {
          contents.push({ key, value: raw, group: pageId, type: "text" });
        } else {
          clear.push(key);
        }
      }
    }

    // Clear removed repeatable item keys
    if (repeatable) {
      const prefix = `${repeatable.itemPrefix}.`;
      for (const storedKey of Object.keys(stored)) {
        if (storedKey.startsWith(prefix)) {
          const rest = storedKey.slice(prefix.length);
          const match = rest.match(/^(\d+)\./);
          if (match) {
            const idx = parseInt(match[1], 10);
            if (!repeatableIndices.includes(idx)) {
              clear.push(storedKey);
            }
          }
        }
      }
    }

    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents, clear }),
      });

      const resJson = await res.json().catch(() => null);
      if (!res.ok || !resJson?.success) {
        toast.error(resJson?.error || "Failed to save CMS section");
        return;
      }

      toast.success(`${section.label} updated successfully!`);
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Network error while saving changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          data-lenis-prevent
          className="w-[96vw] sm:w-[94vw] max-w-6xl sm:max-w-6xl md:max-w-6xl lg:max-w-7xl h-[97vh] max-h-[97vh] flex flex-col p-0 overflow-hidden shadow-2xl rounded-lg border border-border bg-background"
        >
          {/* ── Modal Header ───────────────────────────────────────────── */}
          <DialogHeader className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/80 bg-background/95 backdrop-blur-sm shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
                  <span>Edit {section.label}</span>
                  <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    Live CMS
                  </span>
                </DialogTitle>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                  {section.description || "Manage bilingual content, images, and visual elements in exact page sequence"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleFillDefaults}
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                  title="Load default text and sample photos into the form"
                >
                  <RotateCcw className="size-3.5" />
                  <span className="hidden sm:inline">Fill Defaults</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTranslateAllEnToBn}
                  disabled={translatingDirection !== null}
                  className="group h-8 px-2.5 sm:px-3 text-xs font-bold text-emerald-700 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  title="Auto-translate all English fields into Bengali (EN → BN)"
                >
                  {translatingDirection === "bn" ? (
                    <Loader2 className="size-3.5 animate-spin text-current" />
                  ) : (
                    <Languages className="size-3.5 text-current" />
                  )}
                  <span>{translatingDirection === "bn" ? "Translating..." : "বাংলা করুন (All EN→BN)"}</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTranslateAllBnToEn}
                  disabled={translatingDirection !== null}
                  className="group h-8 px-2.5 sm:px-3 text-xs font-bold text-blue-700 dark:text-blue-400 border-blue-500/40 bg-blue-500/10 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  title="Auto-translate all Bengali fields into English (BN → EN)"
                >
                  {translatingDirection === "en" ? (
                    <Loader2 className="size-3.5 animate-spin text-current" />
                  ) : (
                    <Languages className="size-3.5 text-current" />
                  )}
                  <span>{translatingDirection === "en" ? "Translating..." : "English (All BN→EN)"}</span>
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* ── Modal Body ─────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-5 md:p-6 bg-muted/10 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Loading section content...</p>
              </div>
            ) : (
              <div className="space-y-6 w-full max-w-full">
                {/* Standard Top-Down Fields */}
                <div className="space-y-4">
                  {section.fields.map((field) => {
                    if (field.type === "richtext") {
                      return (
                        <RichTextEditorPair
                          key={field.key}
                          label={field.label}
                          description={field.hint}
                          en={getFieldValue(`${field.key}|en`)}
                          bn={getFieldValue(`${field.key}|bn`)}
                          onEnChange={(v) => {
                            setFieldValue(`${field.key}|en`, v);
                          }}
                          onBnChange={(v) => {
                            setFieldValue(`${field.key}|bn`, v);
                          }}
                        />
                      );
                    }

                    if (field.type === "images") {
                      const currentImgs: string[] = getArrayFieldValue(`${field.key}|en`);

                      return (
                        <div
                          key={field.key}
                          className="space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3 sm:p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-xs font-semibold text-foreground">
                                {field.label}
                              </Label>
                              {field.hint && (
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {field.hint}
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setMultiplePickerField(field.key)}
                              className="h-8 px-3 text-xs flex items-center gap-1.5"
                            >
                              <Plus className="size-3.5" />
                              <span>Add Photos</span>
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-3 pt-1">
                            {currentImgs.map((imgUrl, idx) => (
                              <div
                                key={idx}
                                className="group relative size-24 shrink-0 rounded-lg overflow-hidden border border-border bg-muted shadow-2xs"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={imgUrl}
                                  alt=""
                                  className="size-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = currentImgs.filter((_, i) => i !== idx);
                                    setFieldValue(`${field.key}|en`, next);
                                    setFieldValue(`${field.key}|bn`, next);
                                  }}
                                  className="absolute top-1 right-1 size-6 rounded-full bg-black/70 hover:bg-destructive text-white flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </div>
                            ))}
                            {currentImgs.length === 0 && (
                              <div
                                onClick={() => setMultiplePickerField(field.key)}
                                className="h-24 w-40 rounded-lg border border-dashed border-border/80 flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer bg-background/50"
                              >
                                <ImageIcon className="size-6 mb-1" />
                                <span className="text-[11px] font-medium">Select Images</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    if (field.type === "image") {
                      return (
                        <div
                          key={field.key}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 p-3 sm:p-4"
                        >
                          <div className="space-y-1 max-w-lg">
                            <Label className="text-xs font-semibold text-foreground">
                              {field.label}
                            </Label>
                            {field.hint && (
                              <p className="text-[11px] text-muted-foreground">
                                {field.hint}
                              </p>
                            )}
                            <div className="text-[11px] font-mono text-muted-foreground break-all truncate max-w-md pt-0.5">
                              {getFieldValue(`${field.key}|en`) || "No image selected"}
                            </div>
                          </div>
                          <ImageField
                            previewUrl={getFieldValue(`${field.key}|en`)}
                            value={getFieldValue(`${field.key}|en`)}
                            onChange={(media) => {
                              setFieldValue(`${field.key}|en`, media.url);
                              setFieldValue(`${field.key}|bn`, media.url);
                            }}
                          />
                        </div>
                      );
                    }

                    if (field.type === "icon") {
                      return (
                        <IconInputField
                          key={field.key}
                          label={field.label}
                          description={field.hint}
                          value={getFieldValue(`${field.key}|en`)}
                          onChange={(v) => {
                            setFieldValue(`${field.key}|en`, v);
                            setFieldValue(`${field.key}|bn`, v);
                          }}
                        />
                      );
                    }

                    if (field.type === "url") {
                      return (
                        <div
                          key={field.key}
                          className="space-y-1.5 rounded-lg border border-border/60 bg-muted/20 p-3 sm:p-4"
                        >
                          <Label className="text-xs font-semibold text-foreground">
                            {field.label}
                          </Label>
                          {field.hint && (
                            <p className="text-[11px] text-muted-foreground">{field.hint}</p>
                          )}
                          <Input
                            value={getFieldValue(`${field.key}|en`)}
                            onChange={(e) => {
                              setFieldValue(`${field.key}|en`, e.target.value);
                              setFieldValue(`${field.key}|bn`, e.target.value);
                            }}
                            placeholder="https://... or /projects"
                            className="h-9.5 text-xs sm:text-sm bg-background"
                          />
                        </div>
                      );
                    }

                    return (
                      <TextPair
                        key={field.key}
                        label={field.label}
                        hint={field.hint}
                        en={getFieldValue(`${field.key}|en`)}
                        bn={getFieldValue(`${field.key}|bn`)}
                        onEnChange={(v) => setFieldValue(`${field.key}|en`, v)}
                        onBnChange={(v) => setFieldValue(`${field.key}|bn`, v)}
                        multiline={field.type === "textarea"}
                        maxLength={field.maxLength || (field.type === "textarea" ? 500 : 120)}
                      />
                    );
                  })}
                </div>

                {/* Repeatable List Section (e.g., Figures, Checks, FAQs, Clauses) */}
                {repeatable && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {repeatable.itemName} List Items
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Add, reorder or edit list items for this section
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddItem}
                        disabled={
                          !!repeatable.maxItems &&
                          repeatableIndices.length >= repeatable.maxItems
                        }
                        className="h-8 px-3 text-xs flex items-center gap-1.5"
                      >
                        <Plus className="size-3.5" />
                        <span>{repeatable.addButtonText || `Add ${repeatable.itemName}`}</span>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {repeatableIndices.map((idx, position) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-border/80 bg-card p-4 space-y-4 shadow-2xs relative"
                        >
                          <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                            <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                              <span className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                {position + 1}
                              </span>
                              {repeatable.itemName} #{position + 1}
                            </span>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(idx)}
                              className="h-7 px-2 text-destructive hover:bg-destructive/10 text-xs flex items-center gap-1"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Remove</span>
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {repeatable.itemFields.map((itemField) => {
                              const key = `${repeatable.itemPrefix}.${idx}.${itemField.suffix}`;
                              if (itemField.type === "icon") {
                                return (
                                  <IconInputField
                                    key={key}
                                    label={itemField.label}
                                    description={itemField.hint}
                                    value={getFieldValue(`${key}|en`)}
                                    onChange={(v) => {
                                      setFieldValue(`${key}|en`, v);
                                      setFieldValue(`${key}|bn`, v);
                                    }}
                                  />
                                );
                              }

                              return (
                                <TextPair
                                  key={key}
                                  label={itemField.label}
                                  hint={itemField.hint}
                                  en={getFieldValue(`${key}|en`)}
                                  bn={getFieldValue(`${key}|bn`)}
                                  onEnChange={(v) => setFieldValue(`${key}|en`, v)}
                                  onBnChange={(v) => setFieldValue(`${key}|bn`, v)}
                                  multiline={itemField.type === "textarea"}
                                  maxLength={itemField.maxLength || (itemField.type === "textarea" ? 500 : 120)}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Modal Footer ───────────────────────────────────────────── */}
          <DialogFooter className="m-0 px-4 sm:px-6 py-3 sm:py-4 pb-4 sm:pb-5 border-t border-border/80 bg-background/95 backdrop-blur-sm shrink-0 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 sm:gap-4 rounded-b-lg">
            <p className="text-[11px] sm:text-xs text-muted-foreground hidden sm:block">
              Changes will immediately update the live website upon saving.
            </p>
            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={saving}
                className="h-9 px-4 font-medium flex-1 sm:flex-initial"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={saving || loading}
                className="h-9 px-5 font-medium shadow-xs flex-1 sm:flex-initial bg-primary text-white hover:bg-primary/90"
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                ) : (
                  <Save className="size-4 mr-1.5" />
                )}
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Multiple Image Picker Modal */}
      {multiplePickerField && (
        <MediaPicker
          open={!!multiplePickerField}
          onOpenChange={(openNext) => {
            if (!openNext) setMultiplePickerField(null);
          }}
          selectionMode="multiple"
          initialSelected={getArrayFieldValue(`${multiplePickerField}|en`)}
          onSelect={(picked: PickedMedia) => {
            const current = getArrayFieldValue(`${multiplePickerField}|en`);
            if (!current.includes(picked.url)) {
              const next = [...current, picked.url];
              setFieldValue(`${multiplePickerField}|en`, next);
              setFieldValue(`${multiplePickerField}|bn`, next);
            }
          }}
        />
      )}
    </>
  );
}
