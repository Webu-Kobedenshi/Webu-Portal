"use client";

import { showErrorToast, showInfoToast, showSuccessToast } from "@/components/atoms/toast";
import { useEffect, useRef } from "react";

type ToastOnMountVariant = "error" | "success" | "info";

type ToastOnMountProps = {
  variant?: ToastOnMountVariant;
  message?: string | null;
};

export function ToastOnMount({ variant = "info", message }: ToastOnMountProps) {
  const shownMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (!message) {
      return;
    }

    if (shownMessageRef.current === message) {
      return;
    }

    if (variant === "error") {
      showErrorToast(message);
    } else if (variant === "success") {
      showSuccessToast(message);
    } else {
      showInfoToast(message);
    }

    shownMessageRef.current = message;
  }, [message, variant]);

  return null;
}
