"use client";

import { createContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { WorldConfig } from "@/types/world-config";
import { applyWorldTheme } from "@/lib/theme/applyWorldTheme";

export const WorldConfigContext = createContext<WorldConfig | null>(null);

export function WorldProvider({
  config,
  children,
}: {
  config: WorldConfig;
  children: ReactNode;
}) {
  const themeVars = useMemo(() => applyWorldTheme(config.theme), [config.theme]);

  return (
    <WorldConfigContext.Provider value={config}>
      <div
        data-world={config.slug}
        style={themeVars}
        className="min-h-dvh bg-world-bg font-world-body text-world-text [color-scheme:var(--world-color-scheme)]"
      >
        {children}
      </div>
    </WorldConfigContext.Provider>
  );
}
