"use client";

import { useState, type ReactNode } from "react";
import { Loader2, Save } from "lucide-react";
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
 * Full 97vh modal height with ultra-smooth responsiveness across all screen sizes.
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
        className="w-[96vw] sm:w-[94vw] max-w-6xl sm:max-w-6xl md:max-w-6xl lg:max-w-7xl h-[97vh] max-h-[97vh] flex flex-col p-0 overflow-hidden shadow-2xl rounded-lg border border-border bg-background"
      >
        {/* ── Modal Header ───────────────────────────────────────────── */}
        <DialogHeader className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/80 bg-background/95 backdrop-blur-sm shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                Edit {title} Section
              </DialogTitle>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                Update content, bilingual text (English & Bangla), and photos for this section
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── Modal Form Body ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-5 md:p-6 bg-muted/10">
          <div className="space-y-4 w-full max-w-full">
            {children(value, setValue)}
          </div>
        </div>

        {/* ── Modal Footer ───────────────────────────────────────────── */}
        <DialogFooter className="m-0 px-4 sm:px-6 py-3 sm:py-4 pb-4 sm:pb-5 border-t border-border/80 bg-background/95 backdrop-blur-sm shrink-0 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 sm:gap-4 rounded-b-lg">
          <p className="text-[11px] sm:text-xs text-muted-foreground hidden sm:block">
            Changes will be saved and reflected on the live landing page.
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
              disabled={saving}
              className="h-9 px-5 font-medium shadow-xs flex-1 sm:flex-initial"
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
  );
}
