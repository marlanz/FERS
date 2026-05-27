"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { redirect, usePathname } from "next/navigation";
import { useRouter } from "next/router";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();

  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [session, isPending, setUser, setLoading]);

  return children;
}
