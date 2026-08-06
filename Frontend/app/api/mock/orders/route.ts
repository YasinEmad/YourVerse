import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_HEADER_NAME } from "@/lib/api/client";
import type { CreateOrderRequestDto, OrderDto } from "@/lib/api/types";
import { KNOWN_PAYMENT_METHOD_IDS } from "@/components/shop/payment-methods";
import { createOrder, MockOrderError } from "./order-repository";

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

  if (!KNOWN_PAYMENT_METHOD_IDS.includes(body.paymentMethodId)) {
    return NextResponse.json({ error: "Unknown payment method" }, { status: 400 });
  }
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
      paymentMethodId: body.paymentMethodId,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof MockOrderError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}
