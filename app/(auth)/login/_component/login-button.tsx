"use client";
import { authClient } from "@/lib/auth-client";

export default function LoginButton() {
  return (
    <button
      onClick={() => {
        return authClient.signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
        });
      }}
      style={{
        height: "48px",
        borderRadius: "12px",
        border: "1px solid var(--color-border)",
        background: "white",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      Continue with Google
    </button>
  );
}
