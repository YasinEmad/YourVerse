import { IsOptional, IsString } from "class-validator";

// Query for GET /products/:slug?world=
export class GetProductQueryDto {
  @IsOptional()
  @IsString()
  world?: string;
}
