// Firebase client configuration. These values are public identifiers of the
// Firebase web app — they are safe to ship to the browser. NEVER add Firebase
// Admin (service-account) credentials here: FIREBASE_PRIVATE_KEY,
// FIREBASE_CLIENT_EMAIL, and friends belong to the backend only.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};
