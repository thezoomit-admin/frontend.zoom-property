"use client";

import { useContext } from "react";

import { EditorContext } from "@/components/providers/editor-provider";

export function useEditor() {
  return useContext(EditorContext);
}
