import { Type } from "class-transformer";
import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

// Shipping address — mirrors Frontend/lib/api/types.ts AddressDto. Required
// fields match the mock's POST /orders validation exactly (fullName, email,
// line1, city, country); everything else is optional. Email is presence-checked
// like the mock, not format-checked, to keep cutover behavior identical.
//
// NOTE: declared BEFORE CreateOrderRequestDto because emitDecoratorMetadata
// injects a `design:type: AddressDto` reference into the property decorator —
// a later declaration would be a runtime TDZ ReferenceError.
export class AddressDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  line1!: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsString()
  @IsNotEmpty()
  country!: string;
}

// Request body for POST /orders — intentionally minimal: the backend derives
// the cart from the resolved session (CartService), so cartId is not needed,
// and there is no payment method to choose (COD is implicit, see the schema
// note). Anything the current frontend still sends beyond this — cartId,
// paymentMethodId, or a hypothetical client total — is stripped by the global
// whitelist ValidationPipe and ignored.
export class CreateOrderRequestDto {
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress!: AddressDto;
}
