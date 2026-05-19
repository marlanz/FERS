import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarStore = {
  collapsed: boolean;
  hydrated: boolean;
  darkMode: boolean;

  setHydrated: (value: boolean) => void;
  setCollapsed: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
};

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      collapsed: false,
      hydrated: false,
      darkMode: false,

      setHydrated: (value) => set({ hydrated: value }),

      setCollapsed: (value) => set({ collapsed: value }),

      setDarkMode: (value) => set({ darkMode: value }),
    }),
    {
      name: "sidebar-storage",

      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
