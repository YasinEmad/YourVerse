import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_HEADER_NAME } from "@/lib/api/client";
import type { AddCartItemRequestDto, CartDto } from "@/lib/api/types";
import { addCartItem, MockCartError } from "../cart-repository";

export async function POST(request: NextRequest): Promise<NextResponse<CartDto | { error: string }>> {
  const sessionId = request.headers.get(SESSION_HEADER_NAME);
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }

  let body: AddCartItemRequestDto;
  try {
    body = (await request.json()) as AddCartItemRequestDto;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const quantity = Math.max(1, Math.floor(Number(body.quantity) || 1));
  if (!body.productSlug) {
    return NextResponse.json({ error: "productSlug is required" }, { status: 400 });
  }

  try {
    const cart = addCartItem(sessionId, body.productSlug, quantity);
    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    if (error instanceof MockCartError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}
