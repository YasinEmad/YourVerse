import type { OrderStatus } from "@prisma/client";
import { AddressDto } from "./create-order-request.dto";

// OrderDto — the frontend's Frontend/lib/api/types.ts OrderDto MINUS
// paymentMethodId, which this phase deliberately removes (COD is implicit; see
// schema.prisma). All money fields are serialized to MAJOR units (dollars),
// matching how CartDto serializes prices and how the mock's orders route
// returned them, so the frontend renders the numbers directly.
export interface OrderDto {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItemDto[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: AddressDto;
  createdAt: string;
}

export interface OrderItemDto {
  id: string;
  productSlug: string;
  title: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderListResponseDto {
  items: OrderDto[];
}
