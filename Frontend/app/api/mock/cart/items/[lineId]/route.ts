import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_HEADER_NAME } from "@/lib/api/client";
import type { CartDto, UpdateCartItemRequestDto } from "@/lib/api/types";
import { MockCartError, removeCartItem, updateCartItem } from "../../cart-repository";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { lineId: string } },
): Promise<NextResponse<CartDto | { error: string }>> {
  const sessionId = request.headers.get(SESSION_HEADER_NAME);
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }

  let body: UpdateCartItemRequestDto;
  try {
    body = (await request.json()) as UpdateCartItemRequestDto;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const quantity = Math.floor(Number(body.quantity));
  if (!Number.isFinite(quantity) || quantity < 0) {
    return NextResponse.json({ error: "quantity must be a non-negative integer" }, { status: 400 });
  }

  try {
    return NextResponse.json(updateCartItem(sessionId, params.lineId, quantity));
  } catch (error) {
    if (error instanceof MockCartError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}

export function DELETE(
  request: NextRequest,
  { params }: { params: { lineId: string } },
): NextResponse<CartDto> {
  const sessionId = request.headers.get(SESSION_HEADER_NAME) ?? "";
  return NextResponse.json(removeCartItem(sessionId, params.lineId));
}
