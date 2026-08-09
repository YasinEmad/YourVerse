import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { ProductListItemDto } from "../../catalog/dto/product-list-item.dto";
import { WorldSummaryDto } from "./world-summary.dto";

// Mirrors WorldDetailDto in Frontend/lib/api/types.ts exactly:
// { world: WorldSummaryDto, products: ProductViewModel[] }.
export class WorldDetailDto {
  @ValidateNested()
  @Type(() => WorldSummaryDto)
  world: WorldSummaryDto;

  @ValidateNested({ each: true })
  @Type(() => ProductListItemDto)
  products: ProductListItemDto[];
}
