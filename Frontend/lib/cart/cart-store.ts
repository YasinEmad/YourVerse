import { addCartItem, getCart, removeCartItem, updateCartItem } from "@/lib/api/cart";
import type { CartDto, CartItemDto } from "@/lib/api/types";
import { ensureSessionId } from "@/lib/cart/session-cookie";
import { computeOrderTotals } from "@/lib/orders/order-totals";

export type CartStoreStatus = "idle" | "loading" | "ready" | "error";

export interface AddToCartInput {
  productSlug: string;
  quantity?: number;
}

/**
 * Public surface of the cart store. Consuming components only talk to this
 * interface (via useCart) — if the backing implementation moves to Zustand or
 * anything else, this contract does not change.
 */
export interface CartStore {
  get: () => CartDto;
  getServerSnapshot: () => CartDto;
  getStatus: () => CartStoreStatus;
  getServerStatus: () => CartStoreStatus;
  subscribe: (listener: () => void) => () => void;
  addItem: (input: AddToCartInput) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
  hydrate: () => Promise<void>;
  reset: () => void;
}

const EMPTY_CART: CartDto = {
  id: "",
  sessionId: "",
  items: [],
  subtotal: 0,
  currency: "USD",
  itemCount: 0,
};

function recomputeCart(cart: CartDto): CartDto {
  const totals = computeOrderTotals(cart.items);
  return {
    ...cart,
    subtotal: totals.subtotal,
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

function createCartStore(): CartStore {
  let snapshot: CartDto = EMPTY_CART;
  let lastConfirmed: CartDto = EMPTY_CART;
  let status: CartStoreStatus = "idle";
  let sessionId: string | null = null;
  let hydratePromise: Promise<void> | null = null;
  let refreshInFlight: Promise<CartDto> | null = null;
  const listeners = new Set<() => void>();

  const notify = () => {
    for (const listener of [...listeners]) {
      listener();
    }
  };

  const setSnapshot = (next: CartDto) => {
    snapshot = next;
    notify();
  };

  const setStatus = (next: CartStoreStatus) => {
    if (status !== next) {
      status = next;
      notify();
    }
  };

  const getSessionId = (): string => {
    if (!sessionId) {
      sessionId = ensureSessionId();
    }
    return sessionId;
  };

  const refresh = async (): Promise<void> => {
    if (refreshInFlight) {
      try {
        await refreshInFlight;
      } finally {
        return;
      }
    }
    setStatus("loading");
    const request = getCart().then(
      (cart) => {
        snapshot = cart;
        lastConfirmed = cart;
        status = "ready";
        refreshInFlight = null;
        notify();
        return cart;
      },
      (error: unknown) => {
        status = "error";
        refreshInFlight = null;
        notify();
        throw error;
      },
    );
    refreshInFlight = request;
    await request;
  };

  const hydrate = (): Promise<void> => {
    if (hydratePromise) {
      return hydratePromise;
    }
    if (status === "ready") {
      return Promise.resolve();
    }
    hydratePromise = refresh()
      .catch(() => undefined)
      .finally(() => {
        hydratePromise = null;
      });
    return hydratePromise;
  };

  const addItem = async (input: AddToCartInput): Promise<void> => {
    const quantity = Math.max(1, Math.floor(input.quantity ?? 1));
    getSessionId();
    setStatus("loading");
    try {
      const cart = await addCartItem({ productSlug: input.productSlug, quantity });
      snapshot = cart;
      lastConfirmed = cart;
      status = "ready";
      notify();
    } catch (error) {
      status = "error";
      notify();
      throw error;
    }
  };

  const updateItem = async (lineId: string, quantity: number): Promise<void> => {
    const next = Math.max(0, Math.floor(quantity));
    const optimistic = recomputeCart({
      ...snapshot,
      items: snapshot.items
        .map((item) => (item.id === lineId ? { ...item, quantity: next } : item))
        .filter((item) => item.quantity > 0),
    });
    setSnapshot(optimistic);
    try {
      const cart = await updateCartItem(lineId, next);
      snapshot = cart;
      lastConfirmed = cart;
      status = "ready";
      notify();
    } catch (error) {
      snapshot = lastConfirmed;
      status = "error";
      notify();
      throw error;
    }
  };

  const removeItem = async (lineId: string): Promise<void> => {
    const optimistic = recomputeCart({
      ...snapshot,
      items: snapshot.items.filter((item) => item.id !== lineId),
    });
    setSnapshot(optimistic);
    try {
      const cart = await removeCartItem(lineId);
      snapshot = cart;
      lastConfirmed = cart;
      status = "ready";
      notify();
    } catch (error) {
      snapshot = lastConfirmed;
      status = "error";
      notify();
      throw error;
    }
  };

  const clear = async (): Promise<void> => {
    await Promise.all(snapshot.items.map((item) => removeCartItem(item.id)));
    await refresh();
  };

  const reset = () => {
    snapshot = EMPTY_CART;
    lastConfirmed = EMPTY_CART;
    status = "idle";
    sessionId = null;
    hydratePromise = null;
    refreshInFlight = null;
    notify();
  };

  return {
    get: () => snapshot,
    getServerSnapshot: () => EMPTY_CART,
    getStatus: () => status,
    getServerStatus: () => "idle",
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    addItem,
    updateItem,
    removeItem,
    clear,
    refresh,
    hydrate,
    reset,
  };
}

export const cartStore: CartStore = createCartStore();

export function toLineTotal(item: CartItemDto): number {
  return item.unitPrice * item.quantity;
}
