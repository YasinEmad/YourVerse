"use client";

import { useContext } from "react";
import { WorldConfigContext } from "@/components/world/WorldProvider";
import type { WorldConfig } from "@/types/world-config";

export function useWorldConfig(): WorldConfig {
  const config = useContext(WorldConfigContext);
  if (!config) {
    throw new Error("useWorldConfig must be used within a WorldProvider");
  }
  return config;
}
