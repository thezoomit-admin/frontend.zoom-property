"use client";

import { useState, type ReactNode } from "react";
import { Edit3, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { saveLandingSection } from "@/server/features/project-landing/edit-action";
import type { LandingSectionKey } from "@/server/features/project-landing/types";

/**
 * The shared shell every section's editor sits inside: title, Save/Cancel,
 * a submitting state, and the save call itself.
 * Spacious modal with visual grouping, guidance, and responsive controls.
 */
export function SectionEditModal<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  title,
  projectId,
  section,
  initialValue,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  projectId: string;
  section: LandingSectionKey;
  initialValue: T;
  children: (value: T, setValue: (next: T) => void) => ReactNode;
}) {
  const [value, setValue] = useState<T>(initialValue);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const result = await saveLandingSection(projectId, section, value);
    setSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success(`${title} section updated successfully`);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setValue(initialValue); // discard edits on cancel
        onOpenChange(next);
      }}
    >
      <DialogContent
        data-lenis-prevent
        className="w-[94vw] max-w-4xl lg:max-w-5xl h-[95vh] max-h-[95vh] flex flex-col p-0 overflow-hidden shadow-2xl rounded-xl border border-border"
      >
        {/* ── Modal Header ───────────────────────────────────────────── */}
        <DialogHeader className="px-6 py-4 border-b border-border/80 bg-background shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Edit3 className="size-4.5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
                  Edit {title} Section
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update content, bilingual text (English & Bangla), and photos for this section
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* ── Modal Form Body ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-muted/10">
          <div className="space-y-6 max-w-4xl mx-auto">
            {children(value, setValue)}
          </div>
        </div>

        {/* ── Modal Footer ───────────────────────────────────────────── */}
        <DialogFooter className="m-0 px-6 py-4 pb-5 border-t border-border/80 bg-background shrink-0 flex items-center justify-between sm:justify-between rounded-b-xl">
          <p className="text-xs text-muted-foreground hidden sm:block">
            Changes will be saved and reflected on the live landing page.
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={saving}
              className="h-9 px-4 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-9 px-5 font-medium shadow-xs"
            >
              {saving ? (
                <Loader2 className="size-4 animate-spin mr-1.5" />
              ) : (
                <Save className="size-4 mr-1.5" />
              )}
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
