"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      closeButton
      className="toaster group"
      offset={24}
      mobileOffset={{ bottom: 80, right: 16 }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "var(--primary)",
          "--success-text": "var(--primary-foreground)",
          "--success-border": "var(--primary)",
          "--error-bg": "var(--destructive)",
          "--error-text": "#ffffff",
          "--error-border": "var(--destructive)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast !rounded-lg !border-0 !shadow-lg",
          success:
            "!bg-primary !text-primary-foreground !border-primary [&_[data-icon]]:!text-primary-foreground [&_[data-description]]:!text-primary-foreground/85",
          error:
            "!bg-destructive !text-white !border-destructive [&_[data-description]]:!text-white/85",
          closeButton:
            "!bg-primary-foreground !text-primary !border-primary-foreground/20 hover:!bg-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
