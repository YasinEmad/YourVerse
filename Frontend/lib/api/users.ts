import { ApiError, apiRequest } from "./client";
import type { SessionDto, SessionRequestDto, UserDto } from "./types";

export function getCurrentUser(): Promise<UserDto | null> {
  return apiRequest<UserDto>("/users/me").catch((error) => {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  });
}

// Exchanges a Firebase ID token for the backend's httpOnly application session
// cookie (POST /users/session). The backend verifies the token, creates the
// Postgres User on first login, merges the guest cart, and sets the cookie.
// The ID token is used transiently and never stored.
export function createSession(idToken: string): Promise<SessionDto> {
  return apiRequest<SessionDto>("/users/session", {
    method: "POST",
    body: JSON.stringify({ idToken } satisfies SessionRequestDto),
  });
}

// Ends the backend application session: POST /users/logout clears the httpOnly
// cookie. Firebase sign-out is orchestrated by the client auth boundary
// (lib/auth/client.ts), which owns the browser-side half of the logout.
export function logout(): Promise<void> {
  return apiRequest<void>("/users/logout", {
    method: "POST",
  });
}
