import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

// Mirrors ProductViewModel in Frontend/types/product.ts exactly (via
// ProductListItemDto extends ProductViewModel in lib/api/types.ts).
export class ProductListItemDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  primaryMeta?: string;

  @IsOptional()
  @IsString()
  secondaryMeta?: string;

  @IsNumber()
  price: number;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  badge?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  accentColor?: string;

  @IsBoolean()
  available: boolean;
}
