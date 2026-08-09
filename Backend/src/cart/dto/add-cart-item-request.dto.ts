import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

// Body for POST /cart/items — exact shape of Frontend/lib/api/types.ts
// AddCartItemRequestDto. quantity is clamped to >= 1 by the service (forgiving,
// like the mock), not rejected.
export class AddCartItemRequestDto {
  @IsString()
  productSlug!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number;
}
