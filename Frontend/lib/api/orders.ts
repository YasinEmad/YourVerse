import { ApiError, apiRequest } from "./client";
import type { CreateOrderRequestDto, OrderDto } from "./types";

export function createOrder(input: CreateOrderRequestDto): Promise<OrderDto> {
  return apiRequest<OrderDto>("/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getOrder(orderId: string): Promise<OrderDto | null> {
  return apiRequest<OrderDto>(`/orders/${encodeURIComponent(orderId)}`).catch((error) => {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  });
}
