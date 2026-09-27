"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

import { useEditor } from "@/hooks/use-editor";
import { cn } from "@/lib/utils";

export function FooterLiveSwitch() {
  const [mounted, setMounted] = useState(false);
  const { isEditor, isLiveEdit, toggleLiveEdit, openLoginModal, logout } = useEditor();

  useEffect(() => {
    setMounted(true);
  }, []);

  const active = mounted && isLiveEdit;
  const loggedIn = mounted && isEditor;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={loggedIn ? toggleLiveEdit : openLoginModal}
        className={cn(
          "group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 text-xs font-medium cursor-pointer shadow-xs select-none",
          active
            ? "bg-primary/20 border-primary text-white shadow-[0_0_12px_rgba(75,128,45,0.4)]"
            : "bg-footer-foreground/10 border-footer-foreground/20 text-footer-foreground/80 hover:border-primary/50 hover:text-white"
        )}
        title={
          loggedIn
            ? active
              ? "Live CMS Edit Mode is ON. Click to turn OFF."
              : "Live CMS Edit Mode is OFF. Click to turn ON."
            : "Click to login and enable Live CMS Edit Mode."
        }
      >
        <span className="text-[11px] font-semibold tracking-wide uppercase">
          {active ? "Live CMS Active" : "Live CMS"}
        </span>

        {/* Switch Track */}
        <div
          className={cn(
            "relative w-7 h-4 rounded-full transition-colors duration-200 ease-in-out p-0.5",
            active ? "bg-primary" : "bg-footer-foreground/20"
          )}
        >
          {/* Switch Thumb */}
          <div
            className={cn(
              "size-3 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out",
              active ? "translate-x-3" : "translate-x-0"
            )}
          />
        </div>
      </button>

      {loggedIn && (
        <button
          type="button"
          onClick={logout}
          className="size-7 flex items-center justify-center rounded-full bg-footer-foreground/10 text-footer-foreground/70 hover:bg-destructive hover:text-white transition-colors cursor-pointer"
          title="Sign Out of CMS"
        >
          <LogOut className="size-3.5" />
        </button>
      )}
    </div>
  );
}
