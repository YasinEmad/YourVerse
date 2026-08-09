# Yourverse — Frontend Architecture

This document describes the current state of the frontend application (`Frontend/`)
after Phases 1–4. It covers the tech stack, folder layout, every route and page,
the mock API surface, state management, i18n, theming, motion, the auth boundary,
styling, accessibility, and testing.

> This is a description of what exists today — not a plan for future work.

---

## 1. Tech Stack

| Concern            | Choice |
| ------------------ | ------ |
| Framework          | Next.js `14.2.15` (App Router) |
| UI library         | React `18.3.1` |
| Language           | TypeScript `5.5.4` (strict) |
| Styling            | Tailwind CSS `3.4.10` + CSS custom properties (design tokens) |
| Validation         | Zod `3.23.8` |
| Data fetching      | Native `fetch` via a thin API client wrapper |
| State (cart)       | Module-scoped store + `useSyncExternalStore` |
| Testing            | Vitest `2.1.1` |
| Package name       | `@yourverse/web` |

Key configuration files:

- `next.config.mjs` — `reactStrictMode: true`, ESLint ignored during builds.
- `tsconfig.json` — `strict: true`, path alias `@/*` → `./*`, `moduleResolution: bundler`.
- `tailwind.config.ts` — content scans `app/` and `components/`; exposes the
  font-family and z-index tokens as utilities.
- `postcss.config.mjs` — Tailwind + Autoprefixer.
- `vitest.config.ts` — alias `@` for tests; node environment; includes `**/*.test.{ts,tsx}`.
- `middleware.ts` — locale + low-motion header injection (see §8).

Scripts (`package.json`):

```bash
npm run dev          # next dev
npm run build        # next build (production)
npm start            # next start (serve production build)
npm test             # vitest run
npm run typecheck    # tsc --noEmit
```

---

## 2. Project Structure

```
Frontend/
├── app/                          # Next.js App Router (routes, layouts, pages, mock API)
│   ├── layout.tsx                # Root layout: lang/dir/data-low-motion, skip link, LocaleProvider
│   ├── globals.css               # Global styles: tokens import, base, components, utilities
│   ├── (world)/                  # Route group: per-world landing + product pages
│   │   └── [worldSlug]/
│   │       ├── layout.tsx        # Validates world config → WorldProvider
│   │       ├── page.tsx          # World landing (hero + product grid)
│   │       ├── loading.tsx       # Suspense shell
│   │       ├── not-found.tsx     # World 404
│   │       └── product/[productSlug]/
│   │           ├── page.tsx      # Product detail
│   │           └── loading.tsx   # Suspense shell
│   ├── (shop)/                   # Route group: shared store chrome + checkout + account
│   │   ├── layout.tsx            # ShopHeader + <main id="main-content">
│   │   ├── cart/page.tsx         # Full cart page
│   │   ├── checkout/page.tsx     # Checkout form
│   │   ├── checkout/confirmation/[orderId]/page.tsx  # Post-order confirmation
│   │   └── account/
│   │       ├── page.tsx          # Account overview (profile + loyalty + achievements preview)
│   │       ├── orders/page.tsx   # Order history (requireSession)
│   │       ├── orders/[orderId]/page.tsx  # Order detail (requireSession)
│   │       └── achievements/page.tsx      # Full achievements grid
│   ├── (auth)/                   # Route group: login/register
│   │   ├── layout.tsx            # <main id="main-content" class="auth-main">
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── api/mock/                 # Mock backend (in-memory, no persistence)
│       ├── worlds/               # GET list, GET by slug
│       ├── products/             # GET list (paginated, world-filterable), GET by slug
│       ├── cart/                 # GET cart, POST items, PATCH/DELETE item
│       ├── orders/               # POST create, GET list (session-scoped), GET by id
│       └── users/                # login/register/logout (501), me (401)
├── components/
│   ├── world/                    # World-scoped UI (landing, nav, cards, motion)
│   ├── shop/                     # Store chrome + checkout + cart UI
│   ├── account/                  # Order history, achievements, loyalty widgets
│   └── auth/                     # Login/Register forms
├── config/worlds/                # World configuration data + Zod schema
├── hooks/                        # React hooks (cart, world config, motion)
├── lib/
│   ├── api/                      # API client + typed service functions (boundary)
│   ├── auth/                     # Server-side session boundary
│   ├── cart/                     # Cart store + session cookie helpers
│   ├── catalog/                  # Mock product catalog data
│   ├── i18n/                     # Locale config, dictionaries, translation engine
│   ├── motion/                   # Low-motion constants
│   ├── orders/                   # Order totals calculation
│   ├── account/                  # Loyalty tiers + mock achievements
│   └── theme/                    # World theme → CSS variables; motion registry
├── styles/tokens.css             # Global design tokens (spacing, type scale, z-index)
├── types/                        # Domain types (world-config, product)
├── middleware.ts
└── *.config.*                    # tsconfig, tailwind, vitest, next, postcss
```

---

## 3. Routing Map

All routes are under `app/` and are **dynamically rendered** (`force-dynamic` or
implicitly dynamic through `headers()` in the root layout). There is no root
`/` page — the store entry point is a world route (`/poetry`, `/tech`, …).

| Route | Group | Component | Auth | Notes |
| --- | --- | --- | --- | --- |
| `/[worldSlug]` | `(world)` | `page.tsx` | — | Validates config, renders `WorldHero` + `ProductGrid` |
| `/[worldSlug]/product/[productSlug]` | `(world)` | `page.tsx` | — | `getProduct` → `notFound()` when missing |
| `/cart` | `(shop)` | `page.tsx` | — | Full cart with line items + summary |
| `/checkout` | `(shop)` | `page.tsx` | — | Multi-step checkout form |
| `/checkout/confirmation/[orderId]` | `(shop)` | `page.tsx` | — | Renders placed order |
| `/account` | `(shop)` | `page.tsx` | `requireSession()` | Profile, loyalty bar, achievement preview |
| `/account/orders` | `(shop)` | `page.tsx` | `requireSession()` | Order history via `getOrders()` |
| `/account/orders/[orderId]` | `(shop)` | `page.tsx` | `requireSession()` | Order detail; `notFound()` if missing |
| `/account/achievements` | `(shop)` | `page.tsx` | `requireSession()` | Full achievements grid |
| `/login` | `(auth)` | `page.tsx` | — | Renders `LoginForm` |
| `/register` | `(auth)` | `page.tsx` | — | Renders `RegisterForm` |

### Layouts

**Root `app/layout.tsx`** (async, server component)

- Reads the resolved locale and low-motion flag from request headers
  (`getLocaleFromHeaders`, `getLowMotionFromHeaders`).
- Renders `<html lang={locale} dir={dir} data-low-motion="true|false">` so the
  document direction and motion preference are correct **before hydration**.
- Renders the skip-to-content link (`#main-content`) with localized label and
  wraps children in the client `LocaleProvider`.

**`(world)/[worldSlug]/layout.tsx`**

- Looks up `getWorldConfig(slug)`; calls `notFound()` for unknown or inactive worlds.
- Wraps children in `WorldProvider` (injects theme CSS variables).

**`(shop)/layout.tsx`**

- Renders `.shop-root` + `ShopHeader` + `<main id="main-content">`.

**`(auth)/layout.tsx`**

- Renders `<main id="main-content" className="auth-main">`.

**404 behavior**

- Unknown world → world `not-found.tsx` (HTTP 404, rendered).
- Missing product → renders the nearest `not-found` boundary with `noindex`.
  Note: because the product page checks existence only after an awaited fetch,
  the response is streamed and the status may be 200 (documented Next.js 14
  behavior for streamed responses; `noindex` prevents SEO impact).

---

## 4. Mock Backend (`app/api/mock`)

The frontend ships an in-memory mock API so the store is fully usable without a
backend. It lives entirely under `app/api/mock/` and is excluded from the
middleware matcher. State is stored on `globalThis` (per server process; resets
on restart).

### Endpoints

**Worlds**

- `GET /api/mock/worlds` → `WorldSummaryDto[]` (active configs only).
- `GET /api/mock/worlds/:slug` → `{ world, products }` (`WorldDetailDto`); 404 if unknown.

**Products** (`lib/catalog/mock-catalog.ts` is the source of truth)

- `GET /api/mock/products?worldSlug=&cursor=&limit=` → `{ items, nextCursor }`.
  Cursor pagination; limit clamped to 1–100.
- `GET /api/mock/products/:slug?world=` → product view-model for that world;
  404 when unknown or not available in the given world.

**Cart** (requires `x-session-id` header; `cart-repository.ts`)

- `GET /api/mock/cart` → cart for session (created empty if missing).
- `POST /api/mock/cart/items` `{ productSlug, quantity }` → updated cart; merges
  into an existing line; 404 for unknown/unavailable product.
- `PATCH /api/mock/cart/items/:lineId` `{ quantity }` → updates qty; `quantity <= 0`
  removes the line.
- `DELETE /api/mock/cart/items/:lineId` → removes line.
- Missing `x-session-id` on item mutations → 400 `"Missing session"`.

**Orders** (`order-repository.ts`)

- `POST /api/mock/orders` `{ cartId, shippingAddress, paymentMethodId }` → creates a
  `PENDING` order from the session cart, clears the cart, returns the order (201).
  Validates payment method id and required address fields.
- `GET /api/mock/orders` → `{ items }` for the current session (400 without session).
- `GET /api/mock/orders/:id` → order; 404 if unknown.

**Users (auth placeholder)** — see §9.

All repositories compute totals via `lib/orders/order-totals.ts`
(flat shipping `$5`, 10% tax, totals rounded to cents).

---

## 5. API Client Layer (`lib/api`)

The client layer is the **integration boundary** the future Backend plugs into.

- `lib/api/client.ts` — `apiRequest<T>(path, init)`:
  - resolves base URL via `baseUrlResolver` (default `/api/mock`, overridable).
  - attaches the session id header (`x-session-id`) via `sessionIdResolver`
    (default `readSessionId` from the browser cookie).
  - sets `credentials: "include"`, `cache: "no-store"`, JSON content type.
  - throws `ApiError(status, message, body)` on non-2xx.
  - Resolvers are swappable with `setBaseUrlResolver` / `setSessionIdResolver`.
- `lib/api/server.ts` — server-side wiring: base URL derived from the request
  host, session id read from the `yourverse-session` cookie via `next/headers`.
- `lib/api/types.ts` — all DTOs:
  `LocalizedTextDto`, `WorldSummaryDto`, `WorldDetailDto`,
  `ProductListResponseDto`, `ProductListItemDto`, `ProductDetailDto`,
  `CartDto`, `CartItemDto`, `AddCartItemRequestDto`, `UpdateCartItemRequestDto`,
  `AddressDto`, `CreateOrderRequestDto`, `OrderDto`, `OrderItemDto`,
  `OrderListResponseDto`, `OrderStatus`, `UserDto`, `LoginRequestDto`,
  `RegisterRequestDto`, `SessionDto`.
- Service modules (typed wrappers over `apiRequest`):
  - `catalog.ts` — `getWorlds`, `getWorld`, `getWorldProducts`, `getProduct`.
  - `cart.ts` — `getCart`, `addCartItem`, `updateCartItem`, `removeCartItem`.
  - `orders.ts` — `createOrder`, `getOrders`, `getOrder` (404 → `null`).
  - `users.ts` — `getCurrentUser` (401 → `null`), `login`, `register`, `logout`.

---

## 6. Cart & Checkout State

**Store** (`lib/cart/cart-store.ts`)

- A module-scoped singleton `cartStore` implementing the `CartStore` interface
  (get / subscribe / add / update / remove / clear / refresh / hydrate / reset).
  The interface is the contract — the implementation can change without touching
  consumers.
- Optimistic updates: `updateItem` / `removeItem` patch the snapshot immediately,
  then reconcile with the server response; on failure they roll back to
  `lastConfirmed` and flip status to `error`.
- `addItem` clamps quantity to ≥ 1 and writes the session cookie lazily.
- `hydrate()` loads the cart once per client session (deduped via
  `hydratePromise`); `refresh()` dedupes in-flight requests.

**Hook** (`hooks/useCart.ts`)

- `useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.getServerSnapshot)`
  for both the cart snapshot and the status. `getServerSnapshot` returns the
  `EMPTY_CART` so SSR never reads mutable client state.

**Session cookie** (`lib/cart/session-cookie.ts`)

- `yourverse-session` cookie (30-day, `SameSite=Lax`); `ensureSessionId()`
  generates `crypto.randomUUID()` when absent. Cookie access is guarded for SSR.

**Checkout flow**

- `CheckoutForm` (client) orchestrates a 3-step wizard defined by
  `checkout-steps.tsx` (`shipping → payment → review`). Steps are plain
  components bound to a `CheckoutStepConfig` (`id`, `labelKey`, `component`).
- `CheckoutSteps` renders the stepper and the active step's component.
- On the final step, `createOrder(payload)` is called, the cart refreshes, and
  the router pushes to `/checkout/confirmation/:orderId`.
- `OrderConfirmation` (client, dict-prop-driven) renders the placed order; empty
  carts / loading states are handled in the form.

**Payment methods** (`payment-methods.tsx`)

- Data-driven registry: `{ id, labelKey, descriptionKey, requiredFields, icon, form }`.
  Methods: `card` (`CardForm`), `wallet` (`WalletForm`), `cod` (`CodForm`).
  Adding a method = adding one descriptor (no hard-coded branches).

---

## 7. Theme Engine & World Configs

**Data** (`config/worlds/*`)

- Six world configs: `tech`, `gaming`, `anime`, `poetry`, `football`, `chess`
  (files `tech.config.ts`, `gaming.config.ts`, …).
- `index.ts` registers all configs and validates each against
  `world-config.schema.ts` at import time, throwing on invalid configs.
  Exposes `getWorldConfig`, `getAllWorldSlugs`, `getActiveWorldConfigs`.

**Schema** (`world-config.schema.ts`)

- Zod schema for `WorldConfig`: theme colors, text colors, fonts, radius,
  motion profile, product-card variant/field labels, landing config, copy, nav.
- Enforces **WCAG 2.1 AA contrast** (`MIN_CONTRAST_RATIO = 4.5`) for
  `textColor` and `textMutedColor` against every background surface (`bg`,
  `bgAlt`, `surface`). A deliberately invalid config is rejected (covered by tests).

**Application** (`lib/theme/applyWorldTheme.ts`)

- Maps a `WorldTheme` to CSS custom properties: `--world-bg`, `--world-surface`,
  `--world-primary`, `--world-text`, `--world-radius`, `--world-font-*`, etc.
- Derives `--world-color-scheme` (light/dark) purely from the background
  luminance so browser chrome matches; this is a palette classification, not a
  user-facing dark/light toggle.

**Rendering** (`components/world/WorldProvider.tsx`)

- Client context provider. Injects `data-world={slug}` and the theme CSS
  variables on a `.world-root` wrapper. `useWorldConfig()` reads the context.

**Product cards** (`components/world/cards/`)

- `ProductCard` switches on `productCard.variant`:
  `repo`, `character`, `verse`, `player`, `loot`, `square`
  (layouts in `RepoCardLayout.tsx`, `CharacterCardLayout.tsx`, …).
  Cards render localized field labels and an add-to-cart action when available.

---

## 8. i18n & Motion

### i18n (`lib/i18n`)

- `config.ts` — `Locale = "en" | "ar" | "fr"`, `defaultLocale = "en"`,
  `localeDirs` (ar → `rtl`), `LOCALE_COOKIE = "locale"`, `isLocale`, `dirForLocale`.
- `dictionaries/en.json`, `ar.json`, `fr.json` — full app copy under top-level
  keys: `a11y`, `nav`, `common`, `cart`, `checkout`, `payment`, `auth`,
  `account`, `orders`, `achievements`, `loyalty`. All three files share the same
  key structure (enforced by a test), so adding a locale is purely
  dictionary + config — no component changes.
- `getDictionary.ts` — loads the JSON for a locale (fallback → default);
  `Dictionary` type derives from `en`.
- `translate.ts` — `lookup` (dotted path), `interpolate` (`{name}` params),
  `translate`, `createTranslator`.
- `detect.ts` — `parseAcceptLanguage` (q-values, sorted) and `resolveLocale`
  (cookie → exact Accept-Language match → base-language match → default).
- `server.ts` — `getLocaleFromHeaders` / `getLowMotionFromHeaders` /
  `getServerDictionary` using the headers set by the middleware.
- `locale-provider.tsx` — client `LocaleProvider` + `useI18n()` exposing
  `{ locale, dict, dir, lowMotion, t }`.

### Locale resolution flow

1. `middleware.ts` runs on every non-`api/`, non-static request.
2. It resolves the locale (cookie → Accept-Language → default) and writes
   `x-locale`; reads the `low-motion` cookie and writes `x-low-motion`.
3. The async root layout reads those headers and sets `lang`, `dir`, and
   `data-low-motion` on `<html>` before hydration.

### Motion

- `lib/motion/config.ts` — constants: `low-motion` cookie, `data-low-motion`
  attribute, `x-low-motion` header.
- `hooks/useLowMotionPreference.ts` — reads the `data-low-motion` attribute
  first (present before hydration), then falls back to the cookie.
- `hooks/useReducedMotion.ts` — `prefers-reduced-motion` media query.
- `lib/theme/animation-registry.ts` — maps a `MotionProfile` to a lazily-loaded,
  `ssr: false` motion component (`TerminalMotion`, `GlitchMotion`, `InkMotion`,
  `StadiumMotion`, `PixelMotion`, `MarbleMotion`).
- `components/world/WorldMotion.tsx` — returns `null` when reduced motion or the
  low-motion preference is on; otherwise renders the profile's motion component.
- CSS also suppresses animations globally for `[data-low-motion="true"]` and
  `prefers-reduced-motion: reduce` (`globals.css` base layer).

---

## 9. Auth Integration Boundary

The frontend implements the **boundary** for the future Backend auth system —
no real authentication logic exists.

- `lib/auth/getSession.ts`
  - `Session = { user: UserDto } | null`.
  - `getSession()` calls `getCurrentUser()` (via `lib/api/users.ts`); 401 → `null`.
  - `requireSession()` calls `getSession()` and `redirect("/login")` when absent.
  - When the Backend ships real endpoints, only this file + `lib/api/users.ts`
    need re-wiring; protected pages/components stay unchanged.
- Protected routes (`/account*`) call `await requireSession()` at the top, so an
  unauthenticated visitor is redirected to `/login` (server-side, HTTP 307).
- Mock auth endpoints (`app/api/mock/users/`):
  - `POST /api/mock/users/login|register|logout` → **501** with
    `"Authentication is not available yet"` (`not-available.ts`).
  - `GET /api/mock/users/me` → **401** (so `getSession()` yields `null`).
  - This deliberately avoids faking sessions, tokens, or JWTs.
- Client forms (`components/auth/LoginForm.tsx`, `RegisterForm.tsx`) validate
  input, call `login`/`register`, and render the localized `auth.authUnavailable`
  message on a 501. No credentials are stored in localStorage, sessionStorage,
  React state, or URLs.

---

## 10. Account Domain

- `lib/account/loyalty.ts` — tier configuration (`bronze` 0, `silver` 250,
  `gold` 750) and `getLoyaltyProgress(points, tiers?)` → current/next tier,
  points to next, clamped progress (data-driven; testable with custom tiers).
- `lib/account/achievements.ts` — `getMockAchievements()` returns mock
  achievements referencing i18n keys (`achievements.items.*`) with earned/locked
  state.
- Components:
  - `components/account/OrderHistoryList.tsx` — server-friendly, props-driven
    (`orders`, `t`, `locale`); renders order cards with localized status.
  - `components/account/AchievementBadge.tsx` — locked/unlocked visual.
  - `components/account/LoyaltyProgressBar.tsx` — `role="progressbar"` with
    `aria-valuemin/max/now`.
  - These components are independent and have no cross-dependencies on auth,
    world configs, or locale detection.

---

## 11. Styling Architecture

- `styles/tokens.css` — global design tokens (spacing scale, type scale,
  z-index scale: dropdown/sticky/drawer/overlay/toast).
- `app/globals.css` — three layers:
  - **base**: reset, `:focus-visible` outline, skip-link, motion suppression.
  - **components**: `.world-root`, `.world-nav`, `.world-grid`, `.world-card*`,
    `.world-button`, `.world-field`, `.shop-root`, `.shop-header`, `.shop-drawer`,
    `.shop-steps`, `.shop-payment`, `.shop-summary`, `.shop-confirmation`,
    `.auth-*`, `.account-*`, `.order-*`, `.achievement-*`, `.loyalty-*`, etc.
  - **utilities**: Tailwind utilities.
- Theming is driven entirely by CSS custom properties injected per world
  (`--world-*`); the shop/auth/account surfaces share a dark neutral palette
  defined on `.shop-root` / `.auth-main`.
- **RTL**: layout uses logical properties (`inset-inline-*`, `margin-inline-*`,
  `text-align: start/end`, `border-inline-*`) so `dir="rtl"` works without
  per-world overrides. The drawer panel anchors to the inline-end.
- **Accessibility**: visible `:focus-visible` outline, skip-to-content link,
  semantic landmarks (`nav`, `main`, `header`), labelled form fields,
  `aria-label`s on icon buttons, `role="dialog"`/`aria-modal` drawer with a
  focus trap + Escape + focus return to the opener, `role="radiogroup"` payment
  selector, `role="alert"` errors, `role="progressbar"` loyalty bar,
  decorative SVGs marked `aria-hidden`.

---

## 12. Hooks

| Hook | Purpose |
| --- | --- |
| `useCart` | Reactive cart state via `useSyncExternalStore` + hydration |
| `useWorldConfig` | Reads `WorldConfig` from context (throws outside provider) |
| `useLowMotionPreference` | `data-low-motion` attribute → cookie → boolean |
| `useReducedMotion` | `prefers-reduced-motion` media query |
| `useI18n` (in `lib/i18n`) | `{ locale, dict, dir, lowMotion, t }` from `LocaleProvider` |

---

## 13. Testing

Vitest, node environment, alias `@`. Ten test files, 60 tests:

| File | Coverage |
| --- | --- |
| `lib/i18n/detect.test.ts` | Accept-Language parsing, cookie precedence, fallbacks |
| `lib/i18n/translate.test.ts` | lookup, interpolation, translator |
| `lib/i18n/dictionaries.test.ts` | identical key structure across locales; no empty values |
| `lib/cart/cart-store.test.ts` | store contract, optimistic updates, rollback |
| `lib/orders/order-totals.test.ts` | subtotal/shipping/tax/total, rounding |
| `lib/catalog/mock-catalog.test.ts` | world-scoped product view-models |
| `lib/theme/applyWorldTheme.test.ts` | CSS variable mapping, light/dark classification |
| `config/worlds/index.test.ts` | registry, slugs, active filtering |
| `config/worlds/world-config.schema.test.ts` | schema validation incl. deliberate contrast failures |
| `lib/account/loyalty.test.ts` | tier progression, clamping, custom tiers |

Run with `npm test`. Type safety with `npm run typecheck`. Production build with
`npm run build`; serve with `npm start`.

---

## 14. Known Behaviors / Notes

- No root `/` page exists (404); the store entry is a world route.
- The mock API is in-memory and resets between server restarts; carts/orders are
  keyed by a `yourverse-session` cookie id.
- Product 404s are soft (200 status with `noindex`) due to streamed responses —
  documented Next.js 14 behavior.
- ESLint is currently not enforced during `next build`.
- The auth endpoints intentionally return 501 — real authentication is a future
  Backend concern connected through `lib/auth/getSession.ts` and `lib/api/users.ts`.
