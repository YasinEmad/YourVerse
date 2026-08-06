import type { CSSProperties } from "react";
import type { WorldTheme } from "@/types/world-config";

const RADIUS_VALUES: Record<WorldTheme["radius"], string> = {
  sharp: "0px",
  soft: "8px",
  round: "16px",
};

function isLightColor(hex: string): boolean {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return true;
  }
  const toLinear = (value: number) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  };
  const r = toLinear(parseInt(normalized.slice(0, 2), 16));
  const g = toLinear(parseInt(normalized.slice(2, 4), 16));
  const b = toLinear(parseInt(normalized.slice(4, 6), 16));
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45;
}

export type WorldThemeVars = CSSProperties & {
  [key: `--world-${string}`]: string;
};

/**
 * Maps a world theme to CSS custom properties.
 *
 * NOTE on light/dark detection: the `--world-color-scheme` property is derived
 * purely from the configured background palette's luminance (`isLightColor`).
 * It is an internal palette classification, NOT a user-facing light/dark mode
 * toggle. It exists so browser-rendered chrome (scrollbars, form controls,
 * `color-scheme`) matches each world's background. A user-controlled dark/light
 * mode is intentionally out of scope for the WorldConfig schema (v1).
 */
export function applyWorldTheme(theme: WorldTheme): WorldThemeVars {
  return {
    "--world-bg": theme.colors.bg,
    "--world-bg-alt": theme.colors.bgAlt,
    "--world-surface": theme.colors.surface,
    "--world-primary": theme.colors.primary,
    "--world-accent": theme.colors.accent,
    "--world-border": theme.colors.border,
    "--world-text": theme.textColor,
    "--world-text-muted": theme.textMutedColor,
    "--world-font-heading": theme.fonts.heading,
    "--world-font-body": theme.fonts.body,
    "--world-font-mono": theme.fonts.mono ?? theme.fonts.body,
    "--world-radius": RADIUS_VALUES[theme.radius],
    "--world-color-scheme": isLightColor(theme.colors.bg) ? "light" : "dark",
  } as WorldThemeVars;
}
