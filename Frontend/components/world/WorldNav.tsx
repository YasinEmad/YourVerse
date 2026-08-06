"use client";

import { useState } from "react";
import Link from "next/link";
import { useWorldConfig } from "@/hooks/useWorldConfig";
import { CartToggleButton } from "@/components/shop/CartToggleButton";
import { CartDrawer } from "@/components/shop/CartDrawer";

export function WorldNav() {
  const { slug, name, nav } = useWorldConfig();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="world-nav">
      <Link href={`/${slug}`} className="world-nav__brand">
        {name.en}
      </Link>
      <nav aria-label="World navigation">
        <ul className="world-nav__list">
          {nav.map((item) => (
            <li key={`${item.href}-${item.label.en}`}>
              <Link href={item.href} className="world-nav__link">
                {item.label.en}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <CartToggleButton onClick={() => setDrawerOpen(true)} />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
