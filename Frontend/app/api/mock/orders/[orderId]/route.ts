import { NextResponse } from "next/server";
import type { OrderDto } from "@/lib/api/types";
import { getOrder } from "../order-repository";

export function GET(
  _request: Request,
  { params }: { params: { orderId: string } },
): NextResponse<OrderDto | { error: string }> {
  const order = getOrder(params.orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}
