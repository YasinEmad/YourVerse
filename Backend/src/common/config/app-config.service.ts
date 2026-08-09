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

  constructor(configService: ConfigService) {
    this.nodeEnv = configService.get<string>("NODE_ENV") ?? "development";
    this.port = toPositiveInt(configService.get<string>("PORT"), 3001);
    this.databaseUrl = configService.getOrThrow<string>("DATABASE_URL");
    this.redisUrl = configService.getOrThrow<string>("REDIS_URL");
    this.corsOrigins = parseList(configService.get<string>("CORS_ORIGINS"), ["http://localhost:3000"]);
    this.cacheTtlSeconds = toPositiveInt(configService.get<string>("CACHE_TTL_SECONDS"), 30);
  }
}
