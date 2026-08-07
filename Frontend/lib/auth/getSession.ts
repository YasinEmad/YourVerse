import "@/lib/api/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/users";
import type { UserDto } from "@/lib/api/types";

export type Session = { user: UserDto } | null;

/**
 * Frontend boundary to the future Backend authentication system.
 *
 * This helper only knows "is there an authenticated user or not". It performs
 * no authentication business logic of its own: no password validation, token
 * generation, session creation, or JWT handling. When the Backend ships its
 * real endpoints, only this file (and lib/api/users.ts) needs to connect to
 * them — protected pages and account components stay unchanged.
 */
export async function getSession(): Promise<Session> {
  const user = await getCurrentUser();
  return user ? { user } : null;
}

export async function requireSession(): Promise<{ user: UserDto }> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}
