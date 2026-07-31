"use client";

import { useWorldConfig } from "@/hooks/useWorldConfig";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLowMotionPreference } from "@/hooks/useLowMotionPreference";
import { animationRegistry } from "@/lib/theme/animation-registry";

export function WorldMotion() {
  const { theme } = useWorldConfig();
  const reducedMotion = useReducedMotion();
  const lowMotion = useLowMotionPreference();

  if (reducedMotion || lowMotion) {
    return null;
  }

  const MotionComponent = animationRegistry[theme.motionProfile];
  return <MotionComponent />;
}
