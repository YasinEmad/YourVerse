"use client";

import { useState } from "react";
import Link from "next/link";
import { CartToggleButton } from "./CartToggleButton";
import { CartDrawer } from "./CartDrawer";

export function ShopHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="shop-header">
      <Link href="/" className="shop-header__brand">
        Multiverse Store
      </Link>
      <nav className="shop-header__nav" aria-label="Store navigation">
        <Link href="/cart" className="shop-header__link">
          Cart
        </Link>
      </nav>
      <CartToggleButton onClick={() => setDrawerOpen(true)} />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
