import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: "var(--font-body)",
        heading: "var(--font-heading)",
        mono: "var(--font-mono)",
      },
      zIndex: {
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        drawer: "var(--z-drawer)",
        overlay: "var(--z-overlay)",
        toast: "var(--z-toast)",
      },
    },
  },
  plugins: [],
};

export default config;
