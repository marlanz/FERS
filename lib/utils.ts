import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isGoogleOAuthErrorReferrer(referrer: string | undefined) {
  return (
    typeof referrer === "string" &&
    referrer.startsWith(
      "https://accounts.google.com/signin/oauth/error?authError=",
    )
  );
}
