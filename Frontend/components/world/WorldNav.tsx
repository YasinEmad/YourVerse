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
    <header className="sticky top-0 z-sticky flex items-center justify-between gap-6 border-b border-world-border bg-[color:color-mix(in_srgb,var(--world-bg)_88%,transparent)] px-6 py-4 backdrop-blur">
      <Link
        href={`/${slug}`}
        className="font-world-heading text-world-text no-underline tracking-[0.02em] font-bold"
      >
        {name.en}
      </Link>
      <nav aria-label="World navigation">
        <ul className="m-0 flex list-none gap-6 p-0">
          {nav.map((item) => (
            <li key={`${item.href}-${item.label.en}`}>
              <Link
                href={item.href}
                className="text-world-text-muted no-underline transition-colors duration-150 hover:text-world-text"
              >
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
