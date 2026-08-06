"use client";

import { useCart } from "@/hooks/useCart";

export function CartToggleButton({ onClick }: { onClick: () => void }) {
  const { cart } = useCart();
  const count = cart.itemCount;

  return (
    <button
      type="button"
      className="shop-cart-button"
      aria-label={`Open cart${count > 0 ? `, ${count} items` : ""}`}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
        <path
          d="M3 4h2l1.5 11a2 2 0 0 0 2 1.7h7.6a2 2 0 0 0 2-1.7L19.5 9H6"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="9" cy="20" r="1.4" fill="currentColor" />
        <circle cx="16" cy="20" r="1.4" fill="currentColor" />
      </svg>
      {count > 0 ? <span className="shop-cart-button__count">{count}</span> : null}
    </button>
  );
}
