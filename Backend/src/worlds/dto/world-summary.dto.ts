import { Type } from "class-transformer";
import { IsBoolean, IsString, ValidateNested } from "class-validator";
import { LocalizedTextDto } from "./localized-text.dto";

// Mirrors WorldSummaryDto in Frontend/lib/api/types.ts exactly.
export class WorldSummaryDto {
  @IsString()
  slug: string;

  @ValidateNested()
  @Type(() => LocalizedTextDto)
  name: LocalizedTextDto;

  @ValidateNested()
  @Type(() => LocalizedTextDto)
  tagline: LocalizedTextDto;

  @IsBoolean()
  isActive: boolean;
}
