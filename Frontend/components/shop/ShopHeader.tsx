"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/locale-provider";
import { CartToggleButton } from "./CartToggleButton";
import { CartDrawer } from "./CartDrawer";

export function ShopHeader() {
  const { t } = useI18n();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="shop-header">
      <Link href="/" className="shop-header__brand">
        Multiverse Store
      </Link>
      <nav className="shop-header__nav" aria-label={t("nav.storeNavigation")}>
        <Link href="/cart" className="shop-header__link">
          {t("nav.cart")}
        </Link>
        <Link href="/account" className="shop-header__link">
          {t("nav.account")}
        </Link>
      </nav>
      <CartToggleButton onClick={() => setDrawerOpen(true)} />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
