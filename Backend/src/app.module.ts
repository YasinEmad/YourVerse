import { Module } from "@nestjs/common";
import { CatalogModule } from "./catalog/catalog.module";
import { CommonModule } from "./common/common.module";
import { WorldsModule } from "./worlds/worlds.module";

@Module({
  imports: [CommonModule, WorldsModule, CatalogModule],
})
export class AppModule {}
