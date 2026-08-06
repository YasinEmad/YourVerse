import { ApiError, apiRequest } from "./client";
import type { UserDto } from "./types";

export function getCurrentUser(): Promise<UserDto | null> {
  return apiRequest<UserDto>("/users/me").catch((error) => {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  });
}
