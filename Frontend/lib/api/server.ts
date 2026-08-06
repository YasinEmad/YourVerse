import { cookies, headers } from "next/headers";
import { setBaseUrlResolver, setSessionIdResolver } from "./client";
import { SESSION_COOKIE_NAME } from "@/lib/cart/session-cookie";

setBaseUrlResolver(() => {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  const host = headers().get("host") ?? "localhost:3000";
  const protocol = headers().get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}/api/mock`;
});

setSessionIdResolver(() => cookies().get(SESSION_COOKIE_NAME)?.value ?? null);
