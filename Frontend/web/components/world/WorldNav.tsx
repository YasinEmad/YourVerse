"use client";

import Link from "next/link";
import { useWorldConfig } from "@/hooks/useWorldConfig";

export function WorldNav() {
  const { slug, name, nav } = useWorldConfig();

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
    </header>
  );
}
