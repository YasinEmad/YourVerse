export const DEFAULT_LIMIT = 50;
export const MIN_LIMIT = 1;
export const MAX_LIMIT = 100;

// Mirrors the mock's clamp: absent/invalid -> 50, then clamped to [1, 100].
export function clampLimit(value: number | undefined | null): number {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return DEFAULT_LIMIT;
  }
  return Math.min(Math.max(Math.trunc(value), MIN_LIMIT), MAX_LIMIT);
}
