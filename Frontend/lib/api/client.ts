import { readSessionId } from "@/lib/cart/session-cookie";

export const SESSION_HEADER_NAME = "x-session-id";

export type BaseUrlResolver = () => string;
export type SessionIdResolver = () => string | null;

let baseUrlResolver: BaseUrlResolver = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api/mock";

let sessionIdResolver: SessionIdResolver = readSessionId;

export function setBaseUrlResolver(resolver: BaseUrlResolver) {
  baseUrlResolver = resolver;
}

export function setSessionIdResolver(resolver: SessionIdResolver) {
  sessionIdResolver = resolver;
}

export function getBaseUrl(): string {
  return baseUrlResolver();
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const sessionId = sessionIdResolver();

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(sessionId ? { [SESSION_HEADER_NAME]: sessionId } : {}),
      ...init?.headers,
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof (body as { message?: unknown }).message === "string"
        ? (body as { message: string }).message
        : `API request failed (${response.status}) for ${path}`;
    throw new ApiError(response.status, message, body);
  }

  // 204 No Content (e.g. POST /users/logout) has no body to parse.
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
