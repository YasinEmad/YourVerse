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
    <div className="shop-root">
      <ShopHeader />
      <main className="shop-main">{children}</main>
    </div>
  );
}
