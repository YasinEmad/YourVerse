import { ApiError, apiRequest } from "./client";
import type { LoginRequestDto, RegisterRequestDto, SessionDto, UserDto } from "./types";

export function getCurrentUser(): Promise<UserDto | null> {
  return apiRequest<UserDto>("/users/me").catch((error) => {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  });
}

export function login(input: LoginRequestDto): Promise<SessionDto> {
  return apiRequest<SessionDto>("/users/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function register(input: RegisterRequestDto): Promise<SessionDto> {
  return apiRequest<SessionDto>("/users/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logout(): Promise<void> {
  return apiRequest<{ ok: true }>("/users/logout", {
    method: "POST",
  }).then(() => undefined);
}
