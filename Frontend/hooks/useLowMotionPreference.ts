"use client";

import { useEffect, useState } from "react";
import { LOW_MOTION_COOKIE, LOW_MOTION_ATTRIBUTE } from "@/lib/motion/config";

export { LOW_MOTION_COOKIE } from "@/lib/motion/config";

export function getLowMotionPreference(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  const attribute = document.documentElement.getAttribute(LOW_MOTION_ATTRIBUTE);
  if (attribute === "true") {
    return true;
  }
  if (attribute === "false") {
    return false;
  }
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOW_MOTION_COOKIE}=`));
  return cookie?.endsWith("=1") ?? false;
}

export function useLowMotionPreference(): boolean {
  const [lowMotion, setLowMotion] = useState(false);

  useEffect(() => {
    setLowMotion(getLowMotionPreference());
  }, []);

  return lowMotion;
}
