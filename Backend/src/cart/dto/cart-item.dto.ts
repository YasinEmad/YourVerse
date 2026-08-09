// CartItemDto — exact shape of Frontend/lib/api/types.ts CartItemDto.
// title/unitPrice/currency are a LIVE projection of the product row (the cart
// line stores only productId + quantity); there is no price snapshot on
// CartItem, matching §4. imageUrl is omitted when the base product has none.
export interface CartItemDto {
  id: string;
  productSlug: string;
  title: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  imageUrl?: string;
}
