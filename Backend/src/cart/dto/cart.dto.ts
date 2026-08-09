import { CartItemDto } from "./cart-item.dto";

// CartDto — exact shape of Frontend/lib/api/types.ts CartDto.
// subtotal is the sum of line totals (major units), matching the mock's
// computeOrderTotals().subtotal; itemCount is the sum of quantities.
export interface CartDto {
  id: string;
  sessionId: string;
  items: CartItemDto[];
  subtotal: number;
  currency: string;
  itemCount: number;
}
