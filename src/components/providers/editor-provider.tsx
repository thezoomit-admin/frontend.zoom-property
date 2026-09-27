"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { LoginModal } from "@/components/auth/login-modal";

export interface EditorState {
  isEditor: boolean;
  projectId: string | null;
  isLiveEdit: boolean;
  setLiveEdit: (active: boolean) => void;
  toggleLiveEdit: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  logout: () => Promise<void>;
}

export const EditorContext = createContext<EditorState>({
  isEditor: false,
  projectId: null,
  isLiveEdit: false,
  setLiveEdit: () => {},
  toggleLiveEdit: () => {},
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  logout: async () => {},
});

const LIVE_EDIT_STORAGE_KEY = "zp_live_cms_active";

export function EditorProvider({
  isEditor: isEditorProp,
  projectId = null,
  children,
}: {
  isEditor?: boolean;
  projectId?: string | null;
  children: ReactNode;
}) {
  const parent = useContext(EditorContext);
  const isEditor = isEditorProp ?? parent?.isEditor ?? false;

  const [isLiveEdit, setIsLiveEditState] = useState<boolean>(() => {
    if (typeof window !== "undefined" && isEditor) {
      const stored = localStorage.getItem(LIVE_EDIT_STORAGE_KEY);
      return stored === null ? true : stored === "true";
    }
    return false;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Sync state if isEditor status changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isEditor) {
        const stored = localStorage.getItem(LIVE_EDIT_STORAGE_KEY);
        const next = stored === null ? true : stored === "true";
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLiveEditState((prev) => (prev !== next ? next : prev));
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLiveEditState((prev) => (prev !== false ? false : prev));
      }
    }
  }, [isEditor]);

  // Sync across tabs
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === LIVE_EDIT_STORAGE_KEY && isEditor) {
        setIsLiveEditState(e.newValue !== "false");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isEditor]);

  const setLiveEdit = useCallback(
    (active: boolean) => {
      if (!isEditor && active) {
        setIsLoginModalOpen(true);
        return;
      }
      setIsLiveEditState(active);
      localStorage.setItem(LIVE_EDIT_STORAGE_KEY, active ? "true" : "false");
      if (active) {
        toast.success("Live CMS Edit Mode Enabled");
      } else {
        toast.info("Live CMS Edit Mode Disabled");
      }
    },
    [isEditor]
  );

  const toggleLiveEdit = useCallback(() => {
    if (!isEditor) {
      setIsLoginModalOpen(true);
      return;
    }
    setLiveEdit(!isLiveEdit);
  }, [isEditor, isLiveEdit, setLiveEdit]);

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLiveEditState(false);
      localStorage.removeItem(LIVE_EDIT_STORAGE_KEY);
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch {
      toast.error("Failed to log out");
    }
  }, []);

  // If nested inside an already active EditorProvider, delegate state to parent and enrich projectId
  if (parent && parent.isEditor) {
    return (
      <EditorContext.Provider
        value={{
          ...parent,
          projectId: projectId || parent.projectId,
        }}
      >
        {children}
      </EditorContext.Provider>
    );
  }

  return (
    <EditorContext.Provider
      value={{
        isEditor,
        projectId,
        isLiveEdit: isEditor && isLiveEdit,
        setLiveEdit,
        toggleLiveEdit,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        logout,
      }}
    >
      {children}
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        onSuccess={() => {
          localStorage.setItem(LIVE_EDIT_STORAGE_KEY, "true");
          setIsLiveEditState(true);
        }}
      />
    </EditorContext.Provider>
  );
}
