import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_HEADER_NAME } from "@/lib/api/client";
import type { CreateOrderRequestDto, OrderDto, OrderListResponseDto } from "@/lib/api/types";
import { createOrder, getOrdersForSession, MockOrderError } from "./order-repository";

export function GET(
  request: NextRequest,
): NextResponse<OrderListResponseDto | { error: string }> {
  const sessionId = request.headers.get(SESSION_HEADER_NAME);
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }
  return NextResponse.json({ items: getOrdersForSession(sessionId) });
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<OrderDto | { error: string }>> {
  const sessionId = request.headers.get(SESSION_HEADER_NAME);
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }

  let body: CreateOrderRequestDto;
  try {
    body = (await request.json()) as CreateOrderRequestDto;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Phase 2 (COD-only): no payment method is accepted or validated — every
  // order is Cash on Delivery, mirroring the backend (backend-architecture.md §4).
  const required: Array<keyof CreateOrderRequestDto["shippingAddress"]> = [
    "fullName",
    "email",
    "line1",
    "city",
    "country",
  ];
  for (const key of required) {
    if (!body.shippingAddress[key]) {
      return NextResponse.json({ error: `shippingAddress.${key} is required` }, { status: 400 });
    }
  }

  try {
    const order = createOrder({
      sessionId,
      cartId: body.cartId,
      shippingAddress: body.shippingAddress,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof MockOrderError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}
