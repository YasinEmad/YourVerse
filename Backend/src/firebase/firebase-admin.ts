import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import type { App, ServiceAccount } from "firebase-admin/app";
import { AppConfigService } from "../common/config/app-config.service";

// THE single place the Firebase Admin SDK is initialized (architecture §1 /
// Phase 4A rule: "Firebase initialization must exist in one place"). Nothing
// else may call initializeApp — controllers and services go through
// FirebaseService, which calls this factory.
//
// Credentials resolution order:
//   1. FIREBASE_SERVICE_ACCOUNT (the JSON service-account contents, via
//      AppConfigService) — explicit, self-contained, no filesystem coupling;
//   2. firebase-admin's applicationDefault() — GOOGLE_APPLICATION_CREDENTIALS
//      (file path) or the GCE/Cloud Run metadata server.
// The SDK is never initialized twice within a process: subsequent calls return
// the already-initialized app.
export function createFirebaseAdmin(config: AppConfigService): App {
  const existing = getApps()[0];
  if (existing) {
    return existing;
  }

  const credential = config.firebaseServiceAccount
    ? cert(JSON.parse(config.firebaseServiceAccount) as ServiceAccount)
    : applicationDefault();

  return initializeApp({
    credential,
    ...(config.firebaseProjectId ? { projectId: config.firebaseProjectId } : {}),
  });
}
