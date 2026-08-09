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
    <header className="sticky top-0 z-sticky flex items-center gap-6 border-b border-world-border bg-[color:color-mix(in_srgb,var(--world-bg)_88%,transparent)] px-6 py-4 backdrop-blur">
      <Link
        href="/"
        className="font-heading text-world-text no-underline me-auto font-bold tracking-[0.02em]"
      >
        Multiverse Store
      </Link>
      <nav className="flex items-center gap-6" aria-label={t("nav.storeNavigation")}>
        <Link
          href="/cart"
          className="text-world-text-muted no-underline transition-colors duration-150 hover:text-world-text"
        >
          {t("nav.cart")}
        </Link>
        <Link
          href="/account"
          className="text-world-text-muted no-underline transition-colors duration-150 hover:text-world-text"
        >
          {t("nav.account")}
        </Link>
      </nav>
      <CartToggleButton onClick={() => setDrawerOpen(true)} />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
