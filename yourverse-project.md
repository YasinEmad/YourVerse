# Yourverse — Project Overview (Frontend + Backend)

> Current state snapshot of the Yourverse (Multiverse Store) monorepo: one
> brand that manifests as six distinct "worlds", sharing one backend, one
> cart, one checkout, and one identity system.
>
> Companion docs: `multiverse-store-prd.md` (product vision/PRD),
> `multiverse-store-creative-direction.md` (visual direction per world).

---

## 1. Product Vision

Yourverse is **not a traditional storefront**. It is a single brand that
manifests as several distinct visual/experiential "worlds" — Tech, Gaming,
Anime, Arabic Poetry, Football, Chess — each with its own visual language,
product vocabulary, and interaction patterns, while sharing:

- one backend (NestJS modular monolith),
- one cart, one checkout (Cash on Delivery),
- one identity system (Firebase Auth → httpOnly backend session),
- one catalog (products get per-world "presentations" via a join table).

**Core principle: *One system, many skins.*** The platform is a **Theme
Engine** driving a shared component library — not six independently built
storefronts. Adding world #7 is a config-file + assets change, not new routes
or new components.

**North Star metric:** repeat-visit rate + cross-world purchase rate (a user
buying from 2+ worlds is proof the "universe" concept works).

---

## 2. Repository Layout

```
Yourverse/
├── Backend/                            # NestJS modular monolith
│   ├── prisma/
│   │   ├── schema.prisma               # data model (World, Product, PWP, Cart, Order, User)
│   │   ├── migrations/                 # 4 migrations: init, cart, orders, user-auth
│   │   ├── seed.ts / seed-data.ts      # seed world + product/presentation rows
│   ├── src/
│   │   ├── app.module.ts               # root module wiring
│   │   ├── main.ts                     # bootstrap, ValidationPipe, CORS
│   │   ├── common/                     # config, prisma, redis, auth, errors, filters
│   │   ├── firebase/                   # firebase-admin init + ID-token verification
│   │   ├── worlds/                     # worlds + per-world product presentations
│   │   ├── catalog/                    # products list/detail, cursor pagination, Redis cache
│   │   ├── cart/                       # guest/user carts, guest-session minting
│   │   ├── orders/                     # COD order creation, list, detail
│   │   └── users/                      # session cookie lifecycle, user upsert, cart merge
│   ├── test/                           # e2e + contract tests
│   └── package.json
│
├── Frontend/                           # Next.js 14 App Router
│   ├── app/
│   │   ├── (world)/[worldSlug]/        # dynamic world landing + product pages
│   │   ├── (shop)/                     # cart, checkout, confirmation, account pages
│   │   ├── (auth)/                     # login / register
│   │   └── api/mock/                   # in-memory mock backend (fallback when no API_BASE_URL)
│   ├── components/
│   │   ├── world/                      # ProductCard (6 variants), WorldHero, WorldNav, WorldMotion, 6 motion effects
│   │   ├── shop/                       # CartDrawer, checkout steps, order summary
│   │   ├── account/                    # loyalty bar, achievement badges, order history
│   │   └── auth/                       # login/register forms (Firebase)
│   ├── config/worlds/                  # 6 WorldConfig files + Zod schema
│   ├── hooks/                          # useCart, useWorldConfig, useReducedMotion, useLowMotionPreference
│   ├── lib/
│   │   ├── api/                        # typed API client (the only network boundary)
│   │   ├── auth/                       # server-side session boundary
│   │   ├── cart/                       # cart store + session cookie
│   │   ├── catalog/                    # mock product catalog data
│   │   ├── i18n/                       # en/ar/fr dictionaries + translation engine
│   │   ├── motion/                     # low-motion constants
│   │   ├── orders/                     # order totals math (preview)
│   │   ├── account/                    # loyalty tiers + mock achievements
│   │   ├── theme/                      # world theme → CSS vars; animation registry
│   │   └── firebase/                   # Firebase client init (in-memory persistence)
│   └── package.json
│
├── multiverse-store-prd.md             # product requirements doc
├── multiverse-store-creative-direction.md  # per-world creative direction
└── yourverse-project.md                # THIS document
```

---

## 3. Tech Stack

| Concern | Frontend | Backend |
|---|---|---|
| Framework | Next.js `14.2.15` (App Router) | NestJS `10` (modular monolith) |
| Language | TypeScript `5.5.4` (strict) | TypeScript `5.5.4` |
| UI | React `18.3.1` | — |
| Styling | Tailwind CSS `3.4.10` + CSS custom properties (design tokens) | — |
| Validation | Zod `3.23.8` | class-validator / class-transformer + global `ValidationPipe` |
| ORM | — | Prisma `5.22` over PostgreSQL |
| Cache | — | ioredis (Redis): catalog list cache, cart DTO cache |
| Auth | Firebase SDK `12` (client, in-memory persistence) | firebase-admin `13` (verifies ID tokens) |
| State (cart) | Module-scoped store + `useSyncExternalStore` | Postgres source of truth + Redis cache |
| Testing | Vitest `2.1.1` | Jest (unit) + supertest (e2e) + contract tests |
| Server ports | 3000 | 3001 |

---

## 4. Core Architecture

### 4.1 The Theme Engine (why 6 worlds ≠ 6 codebases)

Every world is defined by a single **WorldConfig** object (validated by a Zod
schema at module load). Components are theme-aware and render differently via
**CSS custom properties** + a small set of **variant props** — never by
branching into different component trees.

- `WorldProvider` applies the config's theme as `--world-*` CSS variables.
- `ProductCard` switches internal layout on `variant` (`repo | character |
  verse | player | loot | square`), not six separate files.
- `WorldMotion` lazy-loads the animation module matching `motionProfile`
  (`next/dynamic` with `ssr: false`) — only the active world's animation
  bundle ships.

### 4.2 The 6 worlds

| World | Slug | Name (en) | Card variant | Motion profile | Heading font | Theme |
|---|---|---|---|---|---|---|
| Tech | `tech` | The Instrument Panel | `repo` | `terminal` | JetBrains Mono | terminal green/amber on dark |
| Gaming | `gaming` | Rig & Rank | `loot` | `rgb-pixel` | Rajdhani | loot rarity colors |
| Anime | `anime` | Cel-Shaded Dusk | `character` | `neon-glitch` | Anton | cel-shaded dusk |
| Poetry | `poetry` | The Living Diwan | `verse` | `ink` | Aref Ruqaa | Arabic diwan / ink |
| Football | `football` | Matchday | `player` | `stadium` | Integral CF | stadium night |
| Chess | `chess` | The Board Room | `square` | `marble` | Canela | marble/boardroom |

All six world configs live in `Frontend/config/worlds/*.config.ts`. World
metadata in the backend (`World` table) is a lightweight reference (slug,
name, tagline, isActive) — **the backend does not own the theme**.

### 4.3 What is deliberately NOT themeable

- Cart drawer logic + checkout flow structure (fields, steps, validation).
- Account/order-history data structures.
- Search/navigation accessibility behavior.

### 4.4 Shared catalog + per-world "presentations"

The same physical product is sold under different presentations per world via
the `ProductWorldPresentation` join table (display title, subtitle, primary/
secondary meta, badge, accent color, availability, sort weight, featured
flag). One product → six possible skins, no duplicated inventory.

---

## 5. Backend (NestJS)

### 5.1 Modules

| Module | Responsibility |
|---|---|
| `CommonModule` | `AppConfigService` (env), `PrismaService`, `RedisService`, global auth guard, `AllExceptionsFilter`, HMAC-signed guest sessions |
| `FirebaseModule` | Lazy `firebase-admin` init; `verifyIdToken()` → `{ uid, email }` |
| `WorldsModule` | `GET /worlds`, `GET /worlds/:slug` (world + its product presentations) |
| `CatalogModule` | `GET /products` (cursor-paginated, world-filterable, Redis-cached), `GET /products/:slug` |
| `CartModule` | `GET/POST/PATCH/DELETE` cart + items; guest session minting; cart merging on auth |
| `OrdersModule` | `POST /orders` (COD), `GET /orders`, `GET /orders/:id` (session-scoped) |
| `UsersModule` | `POST /users/session` (Firebase ID token → httpOnly session cookie), `POST /users/logout`, `GET /users/me` |

### 5.2 Data model (`prisma/schema.prisma`)

- **World** — slug (unique), localized `name`/`tagline` JSON, `isActive`.
- **Product** — slug, `baseTitle`, `basePrice` (**integer minor units / cents**),
  `currency`.
- **ProductWorldPresentation** — per-world product skin; `@@unique([productId, worldId])`,
  indexed on `(worldId, isAvailable, sortWeight)`.
- **Cart / CartItem** — one cart per `sessionId` (guest signed id OR `User.id`
  once merged); `@@unique([cartId, productId])`; quantity-increment semantics.
- **Order / OrderItem** — COD is implicit (no payment-method column);
  `OrderItem.unitPrice` snapshots the price at purchase time and is **never
  recomputed**; `worldSlug` on items uses sentinel `"__none__"` until the cart
  carries world context. All money is integer cents.
- **User** — keyed by verified `firebaseUid`; email denormalized; no passwords
  or tokens ever stored.

`OrderStatus` enum (backend): `PENDING | PAID | FULFILLED | CANCELLED`. Only
`PENDING` is written today.

### 5.3 Identity & sessions

1. Frontend signs in with Firebase (email/password) — client keeps auth state
   **in memory only**, no tokens in storage.
2. `POST /users/session` sends the short-lived Firebase ID token.
3. Backend verifies the token (`firebase-admin`), upserts the `User` by UID,
   **merges the guest cart** (via `CartService.mergeGuestCart`, in one
   transaction), and sets an **httpOnly session cookie**.
4. `GET /users/me` is protected by a global `AuthGuard`; cart/orders routes are
   `@Public()` and resolve ownership from either the guest session header
   (`x-session-id`) or the httpOnly cookie.

Guest carts use a **signed guest session id** (`v1.<uuid>.<sig>`, HMAC) in a
browser-readable cookie; the backend re-issues its own signed cookie on first
contact. Mutations require a session (`400 Missing session`, matching the mock).

### 5.4 Key backend rules (enforced in code)

- **No client-trusted totals.** Order totals (subtotal/shipping/tax/total) are
  recomputed server-side from the cart at creation; the client never sends them
  (whitelist pipe strips extras). Shipping flat rate `5`, tax `10%`.
- **Source-of-truth write order.** Cart mutations write Postgres first, then
  invalidate the `cart:{sessionId}` Redis key (delete, not expire).
- **One transaction per order.** Order + items written and cart cleared in a
  single Prisma transaction — a mid-way failure leaves nothing behind.
- **No cross-session reads.** Orders are scoped to the resolved session; an
  order belonging to someone else is indistinguishable from an unknown one (404).
- **Cache invalidation on catalog writes.** Any `ProductWorldPresentation`
  write invalidates the affected world's `catalog:list:*` keys (or purges all).

### 5.5 Backend endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/worlds` | public | active worlds (summary) |
| GET | `/worlds/:slug` | public | world + product presentations |
| GET | `/products?world&cursor&limit` | public | cursor-paginated; Redis-cached |
| GET | `/products/:slug?world` | public | product detail (world-skimmed) |
| GET | `/cart` | guest/user | get-or-create cart |
| POST | `/cart/items` | guest/user | `{ productSlug, quantity }` |
| PATCH | `/cart/items/:lineId` | guest/user | `{ quantity }` (≤0 removes) |
| DELETE | `/cart/items/:lineId` | guest/user | silent remove |
| POST | `/orders` | guest/user | `{ shippingAddress }` only |
| GET | `/orders` | guest/user | newest first |
| GET | `/orders/:id` | guest/user | session-scoped 404 |
| POST | `/users/session` | public | Firebase ID token → session cookie |
| POST | `/users/logout` | public | clears cookie (204) |
| GET | `/users/me` | session | current user |

---

## 6. Frontend (Next.js 14 App Router)

### 6.1 Routes

```
app/
├─ layout.tsx                    # root: locale/dir/data-low-motion, skip link, LocaleProvider
├─ (world)/[worldSlug]/
│   ├─ layout.tsx                # validates config → WorldProvider
│   ├─ page.tsx                  # world landing (hero + product grid)
│   ├─ loading.tsx / not-found.tsx
│   └─ product/[productSlug]/page.tsx   # product detail
├─ (shop)/
│   ├─ layout.tsx                # ShopHeader + CartDrawer
│   ├─ cart/page.tsx
│   ├─ checkout/page.tsx
│   ├─ checkout/confirmation/[orderId]/page.tsx  # server-rendered, recomputes totals
│   └─ account/
│       ├─ page.tsx              # profile + loyalty + recent achievements (requireSession)
│       ├─ orders/page.tsx
│       ├─ orders/[orderId]/page.tsx
│       └─ achievements/page.tsx
├─ (auth)/
│   ├─ login/page.tsx
│   └─ register/page.tsx
└─ api/mock/                     # in-memory mock backend (fallback)
```

`[worldSlug]` as a dynamic segment (not 6 hardcoded route groups) is what makes
"add a 7th world" a config-only change.

### 6.2 Data flow & API boundary

- **Components never fetch directly.** Only `lib/api/*` touches the network,
  through the typed wrapper in `lib/api/client.ts`.
- `client.ts` injects the `x-session-id` header, sends `credentials: "include"`,
  and normalizes errors into `ApiError { status, body, message }`.
- `lib/api/server.ts` swaps the resolvers for the server side (base URL from
  `NEXT_PUBLIC_API_BASE_URL` or same-origin `/api/mock`; session id from the
  `yourverse-session` cookie).
- **Env switch:** with `NEXT_PUBLIC_API_BASE_URL` unset the app uses the
  in-memory mock API (`app/api/mock/*`); set it to `http://localhost:3001` and
  the same DTOs are served by the real NestJS backend — no other change needed.

### 6.3 Cart state

- `lib/cart/cart-store.ts` — singleton store behind a `CartStore` interface
  using `useSyncExternalStore`. Optimistic updates reconcile with server
  responses; rollback to `lastConfirmed` on failure. Statuses:
  `idle | loading | ready | error`.
- `lib/cart/session-cookie.ts` — 30-day `yourverse-session` cookie helpers.
- `hooks/useCart.ts` — the only public surface components use; hydrates on mount.

### 6.4 Checkout

- Step-array-driven: `shipping → review` (payment step removed — **COD only**).
- `OrderConfirmation` does **not trust client totals**: it loads the order from
  the server by id and re-derives totals via `computeOrderTotals` before render.
- `lib/orders/order-totals.ts` is explicitly a **preview-only** calculator; the
  backend is authoritative.

### 6.5 Theming & motion

- `applyWorldTheme(theme)` maps a `WorldTheme` to `--world-*` CSS variables
  (including a luminance-derived `--world-color-scheme`).
- `animation-registry.ts` maps each `MotionProfile` to a lazy-loaded effect
  component (Terminal, Glitch, Ink, Stadium, Pixel, Marble).
- `prefers-reduced-motion` + an explicit "Low Motion" cookie toggle
  (`lib/motion/config.ts`) disable heavy effects.

### 6.6 i18n

- Locales: **en, ar, fr**; Arabic is RTL (`dir="rtl"`).
- `middleware.ts` resolves locale from cookie/`accept-language`, sets
  `x-locale` + low-motion headers.
- Dictionaries in `lib/i18n/dictionaries/{en,ar,fr}.json`, translation engine +
  `LocaleProvider` context. The backend also reads `x-locale` to localize
  world/product copy at the DTO boundary.

### 6.7 Auth (frontend half)

- `lib/firebase/client.ts` — single Firebase app/auth init, pinned to
  **inMemoryPersistence** (no token written to browser storage).
- `lib/auth/client.ts` — `loginWithEmail`, `registerWithEmail`, `endSession`;
  maps Firebase error codes to localized copy.
- `lib/auth/getSession.ts` — server-side boundary: `getSession()` /
  `requireSession()` (redirects to `/login`); only this file + `lib/api/users.ts`
  know about the backend session.

---

## 7. Implementation Status (what exists today)

Committed history (most recent first): Firebase backend + frontend → COD-only
checkout with backend totals → backend orders → backend cart/guest sessions →
worlds & catalog foundation → shop/cart/checkout → account/auth/i18n/a11y →
theme engine → foundation & design tokens.

**Done and working end-to-end:**
- 6 world configs + Zod validation, dynamic `[worldSlug]` routing, theme engine,
  motion effects, product cards in all 6 variants.
- Shared cart (drawer + full page), optimistic store, guest session cookie.
- COD checkout with server-side totals; server-rendered confirmation page.
- Account pages: profile, loyalty tiers, achievements, order history.
- Firebase email/password auth wired to a backend httpOnly session, with guest
  cart merge on first login.
- NestJS backend with worlds/catalog/cart/orders/users modules over
  Postgres + Redis, cursor pagination, cache invalidation, e2e + contract tests.
- en/ar/fr i18n with RTL.

**Not yet built (later phases):** Loyalty *earning* (points on purchase),
DropsModule (countdown drops via BullMQ), bundles, onboarding interest flow,
CMS-backed world config, community layer, real payments (COD only by design).

---

## 8. Tests & Verification

- Backend: `npm test` (Jest unit), `npm run test:e2e` (supertest against app:
  worlds, products, cart, orders, users, redis invalidation), `npm run
  test:contract` (DTO contract spec ensuring backend DTOs match the frontend's
  `lib/api/types.ts` contract).
- Frontend: `npm test` (Vitest: cart store, order totals, i18n, API client,
  catalog mock, world-config schema, checkout steps, loyalty), `npm run
  typecheck` (`tsc --noEmit`), `npm run build`.

---

## 9. Configuration

### Backend `.env` (see `Backend/.env.example`)
`PORT` (3001), `DATABASE_URL` (Postgres), `REDIS_URL`,
`CORS_ORIGINS` (exact frontend origin, e.g. `http://localhost:3000`),
`CACHE_TTL_SECONDS`, `SESSION_SIGNING_SECRET` (HMAC for guest ids),
`SESSION_TTL_DAYS`, `CART_CACHE_TTL_SECONDS`,
`FIREBASE_PROJECT_ID` + `FIREBASE_SERVICE_ACCOUNT` (JSON) **or**
`GOOGLE_APPLICATION_CREDENTIALS`.

### Frontend `.env` (see `Frontend/.env.example`)
`NEXT_PUBLIC_API_BASE_URL` (unset → in-memory mock API; set → real backend),
`NEXT_PUBLIC_FIREBASE_API_KEY/AUTH_DOMAIN/PROJECT_ID/APP_ID` (public web-app
identifiers only — **never** service-account credentials).

### Useful scripts

```bash
# Backend
cd Backend
npm run start:dev           # nest start --watch
npm run prisma:migrate      # prisma migrate dev
npm run prisma:seed         # seed worlds + products
npm test                    # unit
npm run test:e2e            # e2e
npm run test:contract       # DTO contract spec

# Frontend
cd Frontend
npm run dev                 # next dev (port 3000)
npm test                    # vitest run
npm run typecheck           # tsc --noEmit
npm run build               # next build
```

---

## 10. Key Engineering Decisions (recap)

1. **One system, many skins** — `WorldConfig` files + theme engine instead of
   six codebases; `ProductWorldPresentation` join table instead of six catalogs.
2. **Backend does not own the theme** — `WorldConfig` stays a type-safe frontend
   asset; the backend `World` model is only the commercial source of truth for
   live worlds.
3. **No client-trusted totals** — server recomputes order totals; client
   calculator is preview-only.
4. **COD is implicit** — no payment-method concept in the data model; reintroducing
   cards/wallets is a future "payments" phase.
5. **Money as integer cents** — never floats, serialized to major units at the
   DTO boundary.
6. **Postgres is truth, Redis is cache** — writes land in DB first, cache keys
   are deleted (not just expired) after mutation.
7. **Firebase owns credentials** — the backend only ever sees a verified UID;
   the client keeps tokens in memory; the app session is an httpOnly cookie.
8. **Dynamic `[worldSlug]` routing** — adding a world is config + assets, zero
   shared-component or route changes (validated when world #2 shipped).
