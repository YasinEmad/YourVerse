import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { Auth } from "firebase-admin/auth";
import { getAuth } from "firebase-admin/auth";
import { AppConfigService } from "../common/config/app-config.service";
import { createFirebaseAdmin } from "./firebase-admin";

// Result of verifying a Firebase ID token. `sub` is the stable Firebase UID
// that keys the application User row; everything else is denormalized metadata.
export interface VerifiedIdToken {
  uid: string;
  email?: string | null;
}

// Thin DI wrapper around the Firebase Admin Auth API. Initialization is lazy:
// the SDK is only touched on the first verifyIdToken call, so booting the
// application (and running the test suites) never requires Firebase
// credentials to be present. A missing/misconfigured credential surfaces as a
// clear error at the moment the first real token is verified, not at startup.
@Injectable()
export class FirebaseService {
  private auth: Auth | null = null;

  constructor(private readonly config: AppConfigService) {}

  async verifyIdToken(idToken: string): Promise<VerifiedIdToken> {
    try {
      const decoded = await this.getAuth().verifyIdToken(idToken);
      return { uid: decoded.uid, email: decoded.email ?? null };
    } catch {
      // Covers expired/revoked/invalid tokens AND a missing credential
      // configuration — either way the client has no valid session, so 401 is
      // the honest answer rather than a 500.
      throw new UnauthorizedException("Invalid or expired Firebase ID token");
    }
  }

  private getAuth(): Auth {
    if (!this.auth) {
      this.auth = getAuth(createFirebaseAdmin(this.config));
    }
    return this.auth;
  }
}
