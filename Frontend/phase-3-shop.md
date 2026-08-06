# Phase 3 — Multiverse Store: Cart, Checkout & Confirmation

## Goal

A world-shared, world-neutral shop system: add-to-cart → checkout → confirmation, built on a typed API layer, a swappable cart store, and config-driven checkout/payment flows.

## Architecture Rules (enforced)

- Components never fetch directly — only `lib/api/*` does.
- The cart store sits behind a small interface plus `useCart()`.
- Checkout is a step-array-driven sequence, not a monolith.
- Payment methods are pluggable descriptors.
- Nothing in `components/shop/` may reference world identity, `useWorldConfig()`, or `config/worlds/`.
- Every cart/order mutation round-trips through the API layer.
- Checkout totals are re-derived server-side before confirmation.

## What Was Built

### 1. Typed API layer (`lib/api/`)

| File | Purpose |
| --- | --- |
| `client.ts` | Typed fetch wrapper; injects `x-session-id` header; `ApiError` carries `status` + `body`. `setBaseUrlResolver`/`setSessionIdResolver` for env config. |
| `server.ts` | Server-side resolvers (base URL + session cookie) — imported only in server code. |
| `types.ts` | DTOs: `Product`, `World`, `CartDto`, `CartItemDto`, `OrderDto`, `OrderItemDto`, `AddressDto`, `UserDto`. |
| `cart.ts` | `getCart` / `addCartItem` / `updateCartItem` / `removeCartItem`. |
| `orders.ts` | `createOrder` / `getOrder`. |
| `users.ts` | `getCurrentUser`. |

### 2. Cart store (`lib/cart/`, `hooks/useCart.ts`)

- `session-cookie.ts` — guest session management: `SESSION_COOKIE_NAME`, `ensureSessionId`, `readSessionId`, `writeSessionId` (30-day cookie `yourverse-session`).
- `cart-store.ts` — singleton `cartStore` behind the `CartStore` interface using `useSyncExternalStore` semantics. Optimistic updates that reconcile with server responses, rollback to `lastConfirmed` on failure. Statuses: `idle | loading | ready | error`.
- `hooks/useCart.ts` — the only public surface components use; hydrates on mount.
- Totals via shared `lib/orders/order-totals.ts` (`SHIPPING_FLAT_RATE = 5`, `TAX_RATE = 0.1`).

### 3. Checkout flow (`components/shop/`)

- `checkout-steps.tsx` — ordered step-config array `checkoutSteps`: shipping → payment → review.
- `CheckoutSteps.tsx` — stepper UI. `CheckoutForm.tsx` — thin wrapper handling step navigation + order submission (`createOrder` → `router.push('/checkout/confirmation/{id}')`).
- `steps/ShippingStep.tsx` — validates fullName/email/line1/city/country.
- `steps/PaymentStep.tsx` — validates per-method required fields; fields keyed `card.number`, `card.expiry`, `card.cvc`, `wallet.email`.
- `steps/ReviewStep.tsx` — summary before submit.
- `payment-methods.tsx` — pluggable descriptor list: `card` / `wallet` / `cod`, each with `requiredFields` + icon glyphs.
- `PaymentMethodSelect.tsx` — renders from the descriptor list.
- `payment-forms/CardForm.tsx`, `WalletForm.tsx`, `CodForm.tsx` — one file per method (adding a method = descriptor entry + one new file).
- `OrderSummary.tsx`, `CartLineItem.tsx`, `CartDrawer.tsx`, `CartToggleButton.tsx`, `ShopHeader.tsx`, `OrderConfirmation.tsx`.

### 4. Mock API (`app/api/mock/`)

- `cart/route.ts` (GET), `cart/items/route.ts` (POST), `cart/items/[lineId]/route.ts` (PATCH, DELETE).
- `orders/route.ts` (POST — validates known payment method + shipping fields; `orders/order-repository.ts` creates order, clears cart), `orders/[orderId]/route.ts` (GET).
- `users/me/route.ts` (returns 401).
- Repositories are in-memory, keyed by session id, backed by `globalThis` state so all route handlers share one store even when dev loads them as separate module instances.

### 5. Pages & wiring

- `app/(shop)/layout.tsx` — neutral shop layout; `.shop-root` hardcoded fallback CSS vars (no world config import).
- `cart/page.tsx` (client), `checkout/page.tsx` (server shell), `checkout/confirmation/[orderId]/page.tsx` (server-rendered; re-derives totals via `computeOrderTotals`).
- `components/world/ProductCard.tsx` uses `useCart().addItem`; `WorldNav.tsx` hosts `CartToggleButton` + `CartDrawer`. All 6 card layouts now accept/pass `onAddToCart`.
- Shop CSS added to `app/globals.css` (world-neutral; only ambient `--world-*` vars).

## Bug Found & Fixed

Smoke testing revealed the mock cart "lost" its line items between routes: PATCH `/cart/items/{lineId}` and order POST saw an empty cart even though GET/POST worked.

**Root cause:** Next.js dev loads route-handler modules as separate module instances, so the in-memory `Map` in `cart-repository.ts` wasn't shared.

**Fix:** moved the state behind `globalThis` (`__yourverseMockCartState`, `__yourverseMockOrderState`) so every route handler in the process shares one store.

## Verification

- `npx tsc --noEmit` — no errors.
- `npx vitest run` — 33/33 tests pass (6 files), including `lib/cart/cart-store.test.ts` (7 tests).
- `npm run build` — succeeds; all routes listed in output.
- Smoke test against `npm run dev`:
  - Empty cart GET → 200; add 2× `the-one-hoodie` + 1× `universe-cap` → correct lines/subtotal/itemCount.
  - PATCH quantity, DELETE line, cart persists across requests.
  - POST order → totals re-derived (subtotal 116 / shipping 5 / tax 11.6 / total 132.6), cart cleared, order retrievable by id.
  - Unknown payment method and empty-cart order rejected.
  - Confirmation page server-renders totals; unknown order → 404.
  - `/tech`, `/gaming`, `/poetry` render 200 with cart UI; no world-config imports leak into `components/shop/`.
