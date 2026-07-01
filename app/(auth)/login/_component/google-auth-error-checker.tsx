"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { isGoogleOAuthErrorReferrer } from "@/lib/utils";

export default function GoogleAuthErrorChecker() {
  useEffect(() => {
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    if (isGoogleOAuthErrorReferrer(referrer)) {
      toast.error("You're not authorized to login with this account.");
    }
  }, []);

  return null;
}
