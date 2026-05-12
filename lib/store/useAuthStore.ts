import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

type AuthStore = {
  user: User | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  setLoading: (value: boolean) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: true,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),

      clearUser: () =>
        set({
          user: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
