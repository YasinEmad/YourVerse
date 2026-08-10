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
        display: "var(--font-display, Georgia, serif)",
        "world-heading": "var(--world-font-heading)",
        "world-body": "var(--world-font-body)",
        "world-mono": "var(--world-font-mono)",
      },
      keyframes: {
        "portal-twinkle": {
          "0%, 100%": { opacity: "0.15" },
          "50%": { opacity: "0.65" },
        },
        "portal-rise": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "portal-twinkle": "portal-twinkle 8s ease-in-out infinite",
        "portal-rise": "portal-rise 0.6s ease both",
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
