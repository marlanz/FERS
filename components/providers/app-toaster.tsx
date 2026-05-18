"use client";

import { Toaster } from "@/components/ui/sonner";

/** Client-only toast host — mount once in a layout, not on every page. */
export function AppToaster() {
  return <Toaster richColors closeButton position="bottom-right" />;
}
