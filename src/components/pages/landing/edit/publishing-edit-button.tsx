"use client";

import { useState } from "react";
import { Globe, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEditor } from "@/hooks/use-editor";
import { savePublishing } from "@/server/features/project-landing/edit-action";
import {
  PublishingFields,
  type PublishingValue,
} from "@/components/pages/landing/edit/section-fields/publishing-fields";

interface PublishingEditButtonProps {
  /** Raw values from the current landing document for prefilling the form. */
  initial: PublishingValue;
}

/**
 * Header-level "Publishing" button.
 *
 * Visible only when an authenticated editor has Live CMS active.
 * Opens a full-height dialog pre-filled with the current publishing
 * meta (path, status, phones, SEO) and saves via the `publishing`
 * PATCH section.
 */
export function PublishingEditButton({ initial }: PublishingEditButtonProps) {
  const { isEditor, isLiveEdit, projectId } = useEditor();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<PublishingValue>(initial);
  const [saving, setSaving] = useState(false);

  // Only render for authenticated editors with live edit on
  if (!isEditor || !isLiveEdit || !projectId) return null;

  const handleSave = async () => {
    setSaving(true);
    const result = await savePublishing(projectId, value as Record<string, unknown>);
    setSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Publishing settings saved — changes are now live.");
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-8 gap-1.5 rounded-full border-primary/40 bg-background/95 px-3 text-xs font-medium text-foreground shadow-md backdrop-blur-md ring-1 ring-primary/20 hover:bg-primary hover:text-white hover:ring-primary/40 transition-all duration-200 cursor-pointer"
        aria-label="Edit Publishing Settings"
      >
        <Globe className="size-3.5 text-primary group-hover:text-white transition-colors" />
        <span>Publishing</span>
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) setValue(initial); // discard on cancel
          setOpen(next);
        }}
      >
        <DialogContent
          data-lenis-prevent
          className="w-[96vw] sm:w-[94vw] max-w-6xl sm:max-w-6xl md:max-w-6xl lg:max-w-7xl h-[97vh] max-h-[97vh] flex flex-col p-0 overflow-hidden shadow-2xl rounded-lg border border-border bg-background"
        >
          {/* Header */}
          <DialogHeader className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/80 bg-background/95 backdrop-blur-sm shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                  Publishing Settings
                </DialogTitle>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                  Manage landing page status, contact numbers, SEO meta & navigation labels
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-5 md:p-6 bg-muted/10">
            <div className="space-y-4 w-full max-w-full">
              <PublishingFields value={value} setValue={setValue} />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="m-0 px-4 sm:px-6 py-3 sm:py-4 pb-4 sm:pb-5 border-t border-border/80 bg-background/95 backdrop-blur-sm shrink-0 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 sm:gap-4 rounded-b-lg">
            <p className="text-[11px] sm:text-xs text-muted-foreground hidden sm:block">
              Changes will be saved and reflected on the live landing page immediately.
            </p>
            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
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
                {saving ? "Saving..." : "Save Publishing"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
