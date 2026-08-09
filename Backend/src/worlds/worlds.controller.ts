import { Controller, Get, Param } from "@nestjs/common";
import { Public } from "../common/auth/public.decorator";
import { WorldDetailDto } from "./dto/world-detail.dto";
import { WorldSummaryDto } from "./dto/world-summary.dto";
import { WorldsService } from "./worlds.service";

@Controller("worlds")
export class WorldsController {
  constructor(private readonly worldsService: WorldsService) {}

  @Get()
  @Public()
  list(): Promise<WorldSummaryDto[]> {
    return this.worldsService.list();
  }

  @Get(":slug")
  @Public()
  detail(@Param("slug") slug: string): Promise<WorldDetailDto> {
    return this.worldsService.detail(slug);
  }
}
