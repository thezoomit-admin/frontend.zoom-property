"use client";

import { LogOut, PencilLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEditor } from "@/hooks/use-editor";

/** The only visible sign an editor is signed in — everyone else never
 * renders this at all (`useEditor()` is false server-side, before any
 * client code runs). Doubles as the site's only logout affordance, since
 * there's deliberately no login/logout control in the normal public nav. */
export function EditorBar() {
  const { isEditor, isLiveEdit, logout } = useEditor();

  if (!isEditor || !isLiveEdit) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 text-sm shadow-lg backdrop-blur-sm">
      <PencilLine className="size-4 text-primary" />
      <span className="font-medium text-foreground">Editing this page</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={logout}
      >
        <LogOut className="size-3.5" />
        Log out
      </Button>
    </div>
  );
}
