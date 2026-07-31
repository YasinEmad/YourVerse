import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { MotionProfile } from "@/types/world-config";

export type WorldMotionComponent = ComponentType;

export const animationRegistry: Record<MotionProfile, WorldMotionComponent> = {
  terminal: dynamic(() => import("@/components/world/motion/TerminalMotion"), { ssr: false }),
  "neon-glitch": dynamic(() => import("@/components/world/motion/GlitchMotion"), { ssr: false }),
  ink: dynamic(() => import("@/components/world/motion/InkMotion"), { ssr: false }),
  stadium: dynamic(() => import("@/components/world/motion/StadiumMotion"), { ssr: false }),
  "rgb-pixel": dynamic(() => import("@/components/world/motion/PixelMotion"), { ssr: false }),
  marble: dynamic(() => import("@/components/world/motion/MarbleMotion"), { ssr: false }),
};
