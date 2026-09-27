"use client";

import { createContext, type ReactNode } from "react";

export interface EditorState {
  isEditor: boolean;
  /** The project's Mongo id — what the save action PATCHes against. `null`
   * whenever `isEditor` is false, so a stray render can't accidentally save
   * against a stale id. */
  projectId: string | null;
}

export const EditorContext = createContext<EditorState>({
  isEditor: false,
  projectId: null,
});

/**
 * Distributes a trust decision this component does not make.
 *
 * `isEditor` is computed server-side (`getSession()`) by whoever renders
 * this — a boolean carries no secret, so handing it to a Client Component is
 * safe, but the decision itself never happens here. The section tree below
 * is Server Components and can't call `useContext`, but any Client
 * Component nested inside them (the edit button) still resolves this
 * context correctly — React threads context through the render tree, not
 * around Server Component boundaries.
 */
export function EditorProvider({
  isEditor,
  projectId,
  children,
}: EditorState & { children: ReactNode }) {
  return (
    <EditorContext.Provider value={{ isEditor, projectId }}>
      {children}
    </EditorContext.Provider>
  );
}
