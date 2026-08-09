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

// Phase 2 (COD-only): matches the backend's OrderStatus enum exactly
// (backend-architecture.md §4). The backend writes PENDING today; FULFILLED
// replaces the old frontend-only COMPLETED/REFUNDED values once fulfillment
// ships.
export type OrderStatus = "PENDING" | "PAID" | "FULFILLED" | "CANCELLED";

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

// Phase 2 (COD-only): the backend derives the cart from the resolved session,
// so cartId is retained for mock parity but no payment method is sent — every
// order is Cash on Delivery.
export interface CreateOrderRequestDto {
  cartId: string;
  shippingAddress: AddressDto;
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

// POST /users/session request body (Phase 4A). Firebase owns password
// authentication; the frontend only ever sends the short-lived Firebase ID
// token and the backend verifies it server-side. Passwords are never sent to
// the backend, and this request type is the only Firebase-adjacent value the
// API layer touches — responses (SessionDto/UserDto) carry no credentials.
export interface SessionRequestDto {
  idToken: string;
}

export interface SessionDto {
  user: UserDto;
}

export interface OrderListResponseDto {
  items: OrderDto[];
}
