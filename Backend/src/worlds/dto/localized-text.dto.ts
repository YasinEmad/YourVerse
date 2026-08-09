import { IsString } from "class-validator";

// Mirrors LocalizedTextDto in Frontend/lib/api/types.ts exactly.
export class LocalizedTextDto {
  @IsString()
  en: string;

  @IsString()
  ar: string;
}
