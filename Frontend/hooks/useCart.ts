"use client";

import { useEffect, useSyncExternalStore } from "react";
import { cartStore } from "@/lib/cart/cart-store";
import type { CartStoreStatus } from "@/lib/cart/cart-store";
import type { AddToCartInput } from "@/lib/cart/cart-store";
import type { CartDto } from "@/lib/api/types";

export interface UseCart {
  cart: CartDto;
  status: CartStoreStatus;
  addItem: (input: AddToCartInput) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useCart(): UseCart {
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.getServerSnapshot);
  const status = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getStatus,
    cartStore.getServerStatus,
  );

  useEffect(() => {
    void cartStore.hydrate();
  }, []);

  return {
    cart,
    status,
    addItem: cartStore.addItem,
    updateItem: cartStore.updateItem,
    removeItem: cartStore.removeItem,
    refresh: cartStore.refresh,
  };
}
