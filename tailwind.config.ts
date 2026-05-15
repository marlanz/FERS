// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "rgb(233, 34, 39)",
      },
    },
  },

  plugins: [],
};

export default config;
