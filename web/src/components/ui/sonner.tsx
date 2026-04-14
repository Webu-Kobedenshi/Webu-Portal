"use client";

import { Toaster as SonnerToaster, type ToasterProps, toast } from "sonner";

export { toast };

export function Toaster(props: ToasterProps) {
  return <SonnerToaster position="top-right" richColors closeButton {...props} />;
}
