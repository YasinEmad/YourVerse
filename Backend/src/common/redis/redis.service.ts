import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Redis } from "ioredis";
import { AppConfigService } from "../config/app-config.service";

// Best-effort Redis cache layer. Redis being down never fails a request: get()
// returns null, set()/del() no-op. enableOfflineQueue: false means commands
// issued while disconnected reject immediately instead of hanging.
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(config: AppConfigService) {
    this.client = new Redis(config.redisUrl, {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
    });
    this.client.on("error", (error) => {
      this.logger.warn(`Redis error: ${error.message}`);
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.logger.warn(`Redis connect failed — cache is best-effort: ${(error as Error).message}`);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.debug(`Redis get failed: ${(error as Error).message}`);
      return null;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return (await this.client.exists(key)) === 1;
    } catch (error) {
      this.logger.debug(`Redis exists failed: ${(error as Error).message}`);
      return false;
    }
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    try {
      await this.client.set(key, value, "EX", ttlSeconds);
    } catch (error) {
      this.logger.debug(`Redis set failed: ${(error as Error).message}`);
    }
  }

  async del(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    try {
      await this.client.del(...keys);
    } catch (error) {
      this.logger.debug(`Redis del failed: ${(error as Error).message}`);
    }
  }

  // Deletes every key matching a glob pattern via SCAN (safe for large key sets).
  async delByPattern(pattern: string): Promise<void> {
    try {
      const keys: string[] = [];
      const stream = this.client.scanStream({ match: pattern, count: 200 });
      for await (const batch of stream) {
        if (Array.isArray(batch) && batch.length > 0) keys.push(...batch);
      }
      await this.del(keys);
    } catch (error) {
      this.logger.debug(`Redis delByPattern failed: ${(error as Error).message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.client.disconnect();
  }
}
