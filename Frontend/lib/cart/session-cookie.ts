export const SESSION_COOKIE_NAME = "yourverse-session";

const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${SESSION_COOKIE_MAX_AGE}; samesite=lax`;
}

function generateSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `sess-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function readSessionId(): string | null {
  return readCookie(SESSION_COOKIE_NAME);
}

export function writeSessionId(id: string): void {
  writeCookie(SESSION_COOKIE_NAME, id);
}

export function ensureSessionId(): string {
  const existing = readSessionId();
  if (existing) {
    return existing;
  }
  const next = generateSessionId();
  writeSessionId(next);
  return next;
}
