import { NextResponse } from "next/server";

export const AUTH_NOT_AVAILABLE_MESSAGE = "Authentication is not available yet";

export function authNotAvailableResponse(): NextResponse<{ error: string }> {
  return NextResponse.json({ error: AUTH_NOT_AVAILABLE_MESSAGE }, { status: 501 });
}
