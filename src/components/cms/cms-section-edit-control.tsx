"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEditor } from "@/hooks/use-editor";
import { cmsSectionById, type CmsSection } from "@/lib/cms-schema";
import { CmsSectionEditModal } from "./cms-section-edit-modal";
import { cn } from "@/lib/utils";

interface CmsSectionEditControlProps {
  pageId: string;
  sectionId: string;
  label?: string;
  className?: string;
  position?: string;
  variant?: "floating" | "inline" | "button";
}

export function CmsSectionEditControl({
  pageId,
  sectionId,
  label,
  className,
  position = "top-4 right-4",
  variant = "floating",
}: CmsSectionEditControlProps) {
  const { isLiveEdit, isEditor } = useEditor();
  const [open, setOpen] = useState(false);

  // Hidden unless live edit mode is turned ON by authenticated admin/editor
  if (!isLiveEdit || !isEditor) return null;

  const found = cmsSectionById(pageId, sectionId);
  const section: CmsSection = found?.section || {
    id: sectionId,
    label: label || sectionId,
    fields: [],
  };

  const buttonText = label || section.label;

  return (
    <>
      {variant === "floating" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className={cn(
            `absolute ${position} z-30 font-medium text-xs bg-background/95 backdrop-blur-md shadow-lg border-primary/40 text-foreground hover:bg-primary hover:text-white transition-all duration-200 group flex items-center gap-1.5 rounded-full px-3.5 h-8.5 ring-2 ring-primary/20 hover:ring-primary/40 cursor-pointer`,
            className
          )}
          aria-label={`Edit ${buttonText}`}
        >
          <Pencil className="size-3.5 text-primary group-hover:text-white transition-colors" />
          <span>Edit {buttonText}</span>
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className={cn(
            "font-medium text-xs bg-background/95 backdrop-blur-md shadow-xs border-primary/30 text-foreground hover:bg-primary hover:text-white transition-all duration-150 flex items-center gap-1.5 rounded-lg px-3 h-8 cursor-pointer",
            className
          )}
          aria-label={`Edit ${buttonText}`}
        >
          <Pencil className="size-3.5 text-primary group-hover:text-white transition-colors" />
          <span>Edit {buttonText}</span>
        </Button>
      )}

      {open && (
        <CmsSectionEditModal
          open={open}
          onOpenChange={setOpen}
          pageId={pageId}
          section={section}
        />
      )}
    </>
  );
}
