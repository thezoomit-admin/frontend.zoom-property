"use client";

import { useState } from "react";
import { Loader2, Lock, LogIn, Mail, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/logo";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LoginModal({ open, onOpenChange, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        setError(json?.error || "Invalid login credentials. Please try again.");
        return;
      }

      toast.success("Logged in successfully! Live CMS is active.");
      onOpenChange(false);
      if (onSuccess) onSuccess();
      window.location.reload();
    } catch {
      setError("Network error. Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        className="w-[92vw] max-w-md p-6 sm:p-8 rounded-xl bg-background border border-border shadow-2xl"
      >
        <DialogHeader className="flex flex-col items-center text-center space-y-3 pb-2">
          <div className="flex items-center justify-center p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Logo variant="auto" className="h-8 w-auto" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Admin & CMS Login
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Enter your credentials to enable frontend live content management.
            </p>
          </div>
        </DialogHeader>

        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            <ShieldAlert className="size-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zoomproperty.com.bd"
                required
                className="pl-9.5 h-10 text-xs sm:text-sm bg-background"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pl-9.5 h-10 text-xs sm:text-sm bg-background"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 font-medium text-xs sm:text-sm bg-primary text-white hover:bg-primary/90 shadow-md cursor-pointer transition-all"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <LogIn className="size-4 mr-2" />
            )}
            {loading ? "Signing In..." : "Sign In & Enable Live CMS"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
