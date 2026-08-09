"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ApiError } from "@/lib/api/client";
import { createSession, logout } from "@/lib/api/users";
import { getFirebaseAuth } from "@/lib/firebase/client";

// Client-side authentication boundary. Firebase is the identity provider;
// this module is the only place the frontend talks to it. The backend
// application session (httpOnly cookie) is established by exchanging the
// short-lived Firebase ID token via POST /users/session. No token, credential,
// or password is ever stored in browser storage, React state, or URLs — the ID
// token exists only for the duration of the exchange.

export async function loginWithEmail(email: string, password: string): Promise<void> {
  const auth = await getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await credential.user.getIdToken();
  await createSession(idToken);
}

export async function registerWithEmail(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  const auth = await getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() });
  }
  const idToken = await credential.user.getIdToken();
  await createSession(idToken);
}

// Ends both sides of the session: the backend clears its httpOnly cookie
// first, then Firebase signs out. The frontend never deletes the httpOnly
// cookie itself — that is the backend's job.
export async function endSession(): Promise<void> {
  await logout();
  await signOut(await getFirebaseAuth());
}

// Maps an authentication failure to localized copy. Firebase errors are
// detected by their stable `code` (e.g. "auth/invalid-credential") without
// importing the SDK into this path.
export function authErrorMessage(
  caught: unknown,
  t: (key: string) => string,
): string {
  if (
    typeof caught === "object" &&
    caught !== null &&
    "code" in caught &&
    typeof (caught as { code?: unknown }).code === "string"
  ) {
    const code = (caught as { code: string }).code;
    switch (code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return t("auth.invalidCredentials");
      case "auth/email-already-in-use":
        return t("auth.emailInUse");
      case "auth/weak-password":
        return t("auth.weakPassword");
      case "auth/too-many-requests":
        return t("auth.tooManyRequests");
      case "auth/invalid-email":
        return t("auth.invalidEmail");
      default:
        return t("auth.unexpectedError");
    }
  }
  if (caught instanceof ApiError) {
    return t("auth.sessionFailed");
  }
  return t("auth.unexpectedError");
}
