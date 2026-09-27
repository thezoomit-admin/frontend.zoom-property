"use client";

import { Globe, LogOut, PencilLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEditor } from "@/hooks/use-editor";
import { PublishingEditButton } from "./publishing-edit-button";
import type { PublishingValue } from "./section-fields/publishing-fields";

/** The only visible sign an editor is signed in — everyone else never
 * renders this at all (`useEditor()` is false server-side, before any
 * client code runs). Doubles as the site's only logout affordance, since
 * there's deliberately no login/logout control in the normal public nav.
 *
 * When `publishing` is supplied the bar also renders a "Publishing" button
 * that opens the full publishing settings modal. */
export function EditorBar({ publishing }: { publishing?: PublishingValue }) {
  const { isEditor, isLiveEdit, logout } = useEditor();

  if (!isEditor || !isLiveEdit) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-background/95 px-3 py-1.5 text-sm shadow-lg backdrop-blur-sm">
      <PencilLine className="size-4 text-primary shrink-0" />
      <span className="font-medium text-foreground whitespace-nowrap hidden sm:inline">Editing this page</span>

      {publishing && <PublishingEditButton initial={publishing} />}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={logout}
        className="gap-1 text-xs h-7 px-2.5 rounded-full"
      >
        <LogOut className="size-3.5" />
        <span className="hidden sm:inline">Log out</span>
      </Button>
    </div>
  );
}
