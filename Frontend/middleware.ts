import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, LOCALE_COOKIE, locales } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/detect";
import { LOW_MOTION_COOKIE, LOW_MOTION_HEADER } from "@/lib/motion/config";

const LOCALE_HEADER = "x-locale";

export function middleware(request: NextRequest) {
  const locale = resolveLocale({
    cookie: request.cookies.get(LOCALE_COOKIE)?.value ?? null,
    acceptLanguage: request.headers.get("accept-language"),
    locales,
    defaultLocale,
  });

  const lowMotion = request.cookies.get(LOW_MOTION_COOKIE)?.value === "1";

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  requestHeaders.set(LOW_MOTION_HEADER, lowMotion ? "1" : "0");

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
