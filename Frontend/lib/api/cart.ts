import { apiRequest } from "./client";
import type {
  AddCartItemRequestDto,
  CartDto,
  UpdateCartItemRequestDto,
} from "./types";

export function getCart(): Promise<CartDto> {
  return apiRequest<CartDto>("/cart");
}

export function addCartItem(input: AddCartItemRequestDto): Promise<CartDto> {
  return apiRequest<CartDto>("/cart/items", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCartItem(lineId: string, quantity: number): Promise<CartDto> {
  const body: UpdateCartItemRequestDto = { quantity };
  return apiRequest<CartDto>(`/cart/items/${encodeURIComponent(lineId)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function removeCartItem(lineId: string): Promise<CartDto> {
  return apiRequest<CartDto>(`/cart/items/${encodeURIComponent(lineId)}`, {
    method: "DELETE",
  });
}
