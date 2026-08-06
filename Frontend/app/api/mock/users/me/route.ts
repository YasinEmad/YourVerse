import { NextResponse } from "next/server";

export function GET(): NextResponse<{ error: string }> {
  return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
}
