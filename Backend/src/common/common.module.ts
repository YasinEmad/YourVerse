import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppConfigService } from "./config/app-config.service";
import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { PrismaService } from "./prisma/prisma.service";
import { RedisService } from "./redis/redis.service";

// Global cross-cutting infrastructure. Anything in common/ is available to every
// module without an explicit import.
@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [AppConfigService, PrismaService, RedisService, AllExceptionsFilter],
  exports: [AppConfigService, PrismaService, RedisService],
})
export class CommonModule {}
