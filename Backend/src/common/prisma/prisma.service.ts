import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { AppConfigService } from "../config/app-config.service";

type PrismaMiddlewareParams = Prisma.MiddlewareParams;

// Global Prisma client. On top of plain querying it observes every
// ProductWorldPresentation write and notifies registered listeners, so the
// catalog module can invalidate its Redis list cache the moment a
// presentation row changes — through any code path (this phase has no write
// endpoints, but later phases and ad-hoc Prisma scripts get invalidation for
// free).
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly pwpWriteListeners: Array<(worldIds: string[] | null) => void> = [];

  constructor(config: AppConfigService) {
    super({ datasourceUrl: config.databaseUrl });
    this.installWriteInvalidationMiddleware();
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  // worldIds: affected world ids; null means "unknown worlds — purge everything".
  onProductWorldPresentationWrite(listener: (worldIds: string[] | null) => void): () => void {
    this.pwpWriteListeners.push(listener);
    return () => {
      const index = this.pwpWriteListeners.indexOf(listener);
      if (index >= 0) this.pwpWriteListeners.splice(index, 1);
    };
  }

  private installWriteInvalidationMiddleware(): void {
    const writeActions = new Set([
      "create",
      "createMany",
      "update",
      "updateMany",
      "upsert",
      "delete",
      "deleteMany",
    ]);

    this.$use(async (params: PrismaMiddlewareParams, next) => {
      const result = await next(params);
      try {
        if (params.model !== "ProductWorldPresentation" || !writeActions.has(params.action)) {
          return result;
        }
        const worldIds = collectWorldIds(params.args, result);
        const unique = [...new Set(worldIds)];
        await this.emitPwpWrite(unique.length > 0 ? unique : null);
      } catch (error) {
        this.logger.warn(`ProductWorldPresentation invalidation failed: ${(error as Error).message}`);
      }
      return result;
    });
  }

  private async emitPwpWrite(worldIds: string[] | null): Promise<void> {
    await Promise.all(
      this.pwpWriteListeners.map(async (listener) => {
        try {
          await listener(worldIds);
        } catch (error) {
          this.logger.warn(`PWP write listener failed: ${(error as Error).message}`);
        }
      }),
    );
  }
}

function collectWorldIds(args: unknown, result: unknown): string[] {
  const ids: string[] = [];
  const push = (value: unknown): void => {
    if (typeof value === "string") ids.push(value);
  };

  const data = (args as { data?: unknown } | undefined)?.data;
  if (Array.isArray(data)) {
    for (const row of data) push((row as { worldId?: unknown })?.worldId);
  } else {
    push((data as { worldId?: unknown })?.worldId);
  }

  const where = (args as { where?: unknown } | undefined)?.where as
    | {
        worldId?: unknown;
        productId_worldId?: { worldId?: unknown };
        OR?: Array<{ worldId?: unknown; productId_worldId?: { worldId?: unknown } }>;
        AND?: { worldId?: unknown };
      }
    | undefined;
  push(where?.worldId);
  push(where?.productId_worldId?.worldId);
  push(where?.AND?.worldId);
  if (Array.isArray(where?.OR)) {
    for (const clause of where.OR) {
      push(clause?.worldId);
      push(clause?.productId_worldId?.worldId);
    }
  }

  push((result as { worldId?: unknown })?.worldId);
  return ids;
}
