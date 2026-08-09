import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

function toPositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : fallback;
}

function parseList(value: string | undefined, fallback: string[]): string[] {
  if (!value) return fallback;
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : fallback;
}

// Single source of truth for environment-driven configuration, read once at
// bootstrap. Services must inject AppConfigService instead of reading process.env.
@Injectable()
export class AppConfigService {
  readonly nodeEnv: string;
  readonly port: number;
  readonly databaseUrl: string;
  readonly redisUrl: string;
  readonly corsOrigins: string[];
  readonly cacheTtlSeconds: number;
  readonly sessionSigningSecret: string;
  readonly sessionTtlDays: number;
  readonly cartCacheTtlSeconds: number;
  readonly firebaseProjectId?: string;
  readonly firebaseServiceAccount?: string;

  constructor(configService: ConfigService) {
    this.nodeEnv = configService.get<string>("NODE_ENV") ?? "development";
    this.port = toPositiveInt(configService.get<string>("PORT"), 3001);
    this.databaseUrl = configService.getOrThrow<string>("DATABASE_URL");
    this.redisUrl = configService.getOrThrow<string>("REDIS_URL");
    this.corsOrigins = parseList(configService.get<string>("CORS_ORIGINS"), ["http://localhost:3000"]);
    this.cacheTtlSeconds = toPositiveInt(configService.get<string>("CACHE_TTL_SECONDS"), 30);
    this.sessionSigningSecret = configService.getOrThrow<string>("SESSION_SIGNING_SECRET");
    this.sessionTtlDays = toPositiveInt(configService.get<string>("SESSION_TTL_DAYS"), 30);
    this.cartCacheTtlSeconds = toPositiveInt(configService.get<string>("CART_CACHE_TTL_SECONDS"), 60);
    // Firebase Admin (Phase 4A). Optional: without credentials the SDK falls
    // back to GOOGLE_APPLICATION_CREDENTIALS / the GCE metadata server.
    this.firebaseProjectId = this.optionalString(configService.get<string>("FIREBASE_PROJECT_ID"));
    this.firebaseServiceAccount = this.optionalString(
      configService.get<string>("FIREBASE_SERVICE_ACCOUNT"),
    );
  }

  private optionalString(value: string | undefined): string | undefined {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  }
}
