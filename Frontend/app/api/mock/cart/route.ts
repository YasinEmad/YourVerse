import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_HEADER_NAME } from "@/lib/api/client";
import type { CartDto } from "@/lib/api/types";
import { getCart } from "./cart-repository";

export function GET(request: NextRequest): NextResponse<CartDto> {
  const sessionId = request.headers.get(SESSION_HEADER_NAME) ?? "";
  return NextResponse.json(getCart(sessionId));
}
