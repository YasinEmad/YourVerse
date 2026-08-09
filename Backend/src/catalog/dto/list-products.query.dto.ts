import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

// Query for GET /products?worldSlug=&cursor=&limit=
// limit is validated as an integer but CLAMPED to 1-100 by the service
// (matching the mock's clamp semantics rather than rejecting).
export class ListProductsQueryDto {
  @IsOptional()
  @IsString()
  worldSlug?: string;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}
