import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  inMemoryPersistence,
  setPersistence,
  type Auth,
} from "firebase/auth";
import { firebaseConfig } from "./config";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

// Initializes the Firebase app exactly once. Subsequent calls return the same
// instance, so the SDK is never double-initialized across client renders.
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

// Returns the Firebase Auth instance for the app. Persistence is pinned to
// inMemoryPersistence: Firebase's auth state stays in memory and no token is
// ever written to browser storage — the application session is the backend's
// httpOnly cookie (frontend-architecture.md §9).
export async function getFirebaseAuth(): Promise<Auth> {
  if (!auth) {
    const next = getAuth(getFirebaseApp());
    await setPersistence(next, inMemoryPersistence);
    auth = next;
  }
  return auth;
}
