import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

// Body for PATCH /cart/items/:lineId — exact shape of Frontend/lib/api/types.ts
// UpdateCartItemRequestDto. quantity <= 0 removes the line (the service treats
// 0 like the mock does); negative values are rejected like the mock's 400.
export class UpdateCartItemRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity?: number;
}
