import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { ProductListItemDto } from "./product-list-item.dto";

// Mirrors ProductListResponseDto in Frontend/lib/api/types.ts exactly.
export class ProductListResponseDto {
  @ValidateNested({ each: true })
  @Type(() => ProductListItemDto)
  items: ProductListItemDto[];

  nextCursor: string | null;
}
