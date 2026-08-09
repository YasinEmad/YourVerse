import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "var(--base-bg)",
          text: "var(--base-text)",
        },
        world: {
          bg: "var(--world-bg)",
          "bg-alt": "var(--world-bg-alt)",
          surface: "var(--world-surface)",
          primary: "var(--world-primary)",
          accent: "var(--world-accent)",
          border: "var(--world-border)",
          text: "var(--world-text)",
          "text-muted": "var(--world-text-muted)",
        },
        portal: {
          void: "#0a0a12",
          "void-deep": "#050507",
          ink: "#edeae2",
          muted: "#8d8b9a",
          hair: "rgba(237, 234, 226, 0.14)",
          accent: "#b9a9ff",
          "accent-dim": "rgba(185, 169, 255, 0.35)",
        },
      },
      fontFamily: {
        body: "var(--font-body)",
        heading: "var(--font-heading)",
        mono: "var(--font-mono)",
        display: ["Georgia", "serif"],
        "world-heading": "var(--world-font-heading)",
        "world-body": "var(--world-font-body)",
        "world-mono": "var(--world-font-mono)",
      },
      borderRadius: {
        world: "var(--world-radius)",
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
