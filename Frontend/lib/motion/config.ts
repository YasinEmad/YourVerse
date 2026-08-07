export const LOW_MOTION_COOKIE = "low-motion";
export const LOW_MOTION_ATTRIBUTE = "data-low-motion";
export const LOW_MOTION_HEADER = "x-low-motion";

export function isLowMotionCookieValue(value: string | undefined | null): boolean {
  return value === "1";
}
