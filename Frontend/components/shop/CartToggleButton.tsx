"use client";

import { useCart } from "@/hooks/useCart";
import { useI18n } from "@/lib/i18n/locale-provider";

export function CartToggleButton({ onClick }: { onClick: () => void }) {
  const { t } = useI18n();
  const { cart } = useCart();
  const count = cart.itemCount;

  return (
    <button
      type="button"
      className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-world border border-world-border bg-transparent text-world-text transition-[border-color,color] duration-150 hover:border-world-primary hover:text-world-primary"
      aria-label={count > 0 ? t("a11y.cartItemCount", { count }) : t("a11y.openCart")}
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
      {count > 0 ? (
        <span className="absolute -top-[0.4rem] -end-[0.4rem] inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-world-primary px-1 text-xs font-bold text-world-bg">
          {count}
        </span>
      ) : null}
    </button>
  );
}
