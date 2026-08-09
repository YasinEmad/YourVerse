import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ShopHeader } from "@/components/shop/ShopHeader";

export const metadata: Metadata = {
  title: {
    default: "Store",
    template: "%s | Multiverse Store",
  },
};

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shop-root min-h-dvh bg-world-bg font-body text-world-text">
      <ShopHeader />
      <main id="main-content" className="min-h-[calc(100dvh-4.5rem)]">{children}</main>
    </div>
  );
}
