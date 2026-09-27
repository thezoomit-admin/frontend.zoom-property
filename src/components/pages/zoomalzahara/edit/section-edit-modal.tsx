"use client";

import { useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
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
 * a submitting state, and the save call itself. Owns none of the
 * section-specific fields — `children` is a render function so each section
 * keeps its own form next to its own data shape instead of this file
 * growing a branch per section.
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
    toast.success("Saved");
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
        className="custom-scrollbar max-h-[85vh] max-w-lg overflow-y-auto sm:max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">{children(value, setValue)}</div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
