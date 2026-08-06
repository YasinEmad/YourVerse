"use client";

import { useEffect, useState } from "react";

export const LOW_MOTION_COOKIE = "low-motion";

export function getLowMotionPreference(): boolean {
  if (typeof document === "undefined") {
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
