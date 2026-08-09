import type { ProductViewModel } from "@/types/product";

export interface LocalizedTextDto {
  en: string;
  ar: string;
}

export interface WorldSummaryDto {
  slug: string;
  name: LocalizedTextDto;
  tagline: LocalizedTextDto;
  isActive: boolean;
}

export interface WorldDetailDto {
  world: WorldSummaryDto;
  products: ProductViewModel[];
}

export interface ProductListItemDto extends ProductViewModel {}

export interface ProductDetailDto extends ProductViewModel {}

export interface ProductListResponseDto {
  items: ProductListItemDto[];
  nextCursor: string | null;
}

export type OrderStatus = "PENDING" | "PAID" | "COMPLETED" | "CANCELLED" | "REFUNDED";

export interface CartItemDto {
  id: string;
  productSlug: string;
  title: string;
  unitPrice: number;
  currency: string;
  quantity: number;
  imageUrl?: string;
}

export interface CartDto {
  id: string;
  sessionId: string;
  items: CartItemDto[];
  subtotal: number;
  currency: string;
  itemCount: number;
}

export interface AddCartItemRequestDto {
  productSlug: string;
  quantity: number;
}

export interface UpdateCartItemRequestDto {
  quantity: number;
}

export interface AddressDto {
  fullName: string;
  email: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
}

// TODO(follow-up, Phase 2 simplification): the backend is COD-only and its
// OrderDto deliberately DROPS paymentMethodId (backend-architecture.md §4/§9).
// The fields flagged below are retained to keep the frontend compiling during
// cutover but should be removed alongside the payment-method UI simplification
// (see components/shop/payment-methods.tsx). OrderStatus also needs to match
// the backend enum (PENDING | PAID | FULFILLED | CANCELLED) once the backend
// starts writing more than PENDING.
export interface CreateOrderRequestDto {
  cartId: string;
  shippingAddress: AddressDto;
  paymentMethodId: string; // TODO(follow-up): removed with the COD-only simplification
}

export interface OrderItemDto {
  id: string;
  productSlug: string;
  title: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

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
  paymentMethodId: string; // TODO(follow-up): removed with the COD-only simplification
  shippingAddress: AddressDto;
  createdAt: string;
}

export interface UserDto {
  id: string;
  email: string;
  name?: string;
  favoriteWorld?: string;
  loyaltyPoints: number;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface SessionDto {
  user: UserDto;
}

export interface OrderListResponseDto {
  items: OrderDto[];
}
