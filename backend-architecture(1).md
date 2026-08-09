# Yourverse — Backend Architecture

This document describes the target design for `Backend/` — a NestJS modular
monolith that replaces `Frontend/web/app/api/mock/*` without requiring any
change to `lib/api/*`, the cart store, checkout flow, or any component.

> This is a design doc for work not yet started. `Backend/` is currently
> empty. Section 15 ("Migration Path") is the part that matters most for
> Phase 0 → Phase 1: it defines exactly what has to line up for the frontend's
> existing API client boundary to point here with a base-URL change and
> nothing else.

**Companion doc:** `frontend-architecture.md` (describes the current, already-built
frontend, including the exact mock endpoints and DTOs this backend must reproduce).

---

## 1. Architectural Philosophy

**One backend, six storefronts, one physical catalog.** The same product can
be presented differently per world (different framing copy, different
featured badge, different sort position) without duplicating inventory. This
is modeled as a `ProductWorldPresentation` join table, not six catalogs.

**The backend does not own the visual Theme Engine.** `WorldConfig` — colors,
fonts, motion profile, card variant, copy, nav — remains a statically
validated TypeScript/Zod asset in the frontend repo (`config/worlds/*`), per
`frontend-architecture.md` §7. The backend's `World` entity is a lightweight
reference model: `slug`, `name`, `isActive`. Its only jobs are (a) giving
`ProductWorldPresentation` something to join against, and (b) being the
commercial source of truth for which worlds are live — not the theme.

This split is deliberate: two systems fighting to own "what a world looks
like" is worse than one clearly-scoped owner per concern. If Phase 3's
"CMS-backed config" roadmap item happens, it extends this `World` model
rather than duplicating `WorldConfig`'s shape into the database.

**No client-trusted totals, ever.** Order totals (shipping, tax, total) are
computed server-side on every order creation and are the only totals that
appear on a confirmation page. The frontend's `lib/orders/order-totals.ts` is
explicitly a **preview-only** calculator for the checkout UI before
submission — it is not authoritative and must never diverge silently from
this backend's calculation (see §12).

**Domain events decouple side effects from the request path.** Placing an
order does not synchronously award loyalty points or send a confirmation
email inline in the request handler — it emits `order.placed`, and separate
listeners handle those concerns. This is the same pattern used in the related
ROS project, chosen so any of these modules (Loyalty, Notifications) could
later be extracted into a standalone service without touching the Orders
module's request-handling code.

---

## 2. Tech Stack

| Concern | Choice |
| --- | --- |
| Framework | NestJS 10 (modular monolith, not microservices) |
| ORM | Prisma over PostgreSQL |
| Cache / guest cart store | Redis |
| Background jobs | BullMQ (Redis-backed) |
| Validation | `class-validator` / `class-transformer` DTOs, mirrored 1:1 against frontend's `lib/api/types.ts` shapes |
| Auth | JWT (access + refresh), httpOnly cookies, rotation on refresh |
| Domain events | `@nestjs/event-emitter` (`EventEmitter2`) |
| Payments | Provider-agnostic interface; Stripe and Paymob both implementable behind it |
| Testing | Jest (unit + e2e), Supertest for HTTP-level e2e |

---

## 3. Module Boundaries

```
Backend/
├─ src/
│   ├─ main.ts                        # Nest bootstrap, cookie parser, CORS, global pipes
│   ├─ app.module.ts                  # Root module wiring
│   │
│   ├─ worlds/
│   │   ├─ worlds.module.ts
│   │   ├─ worlds.controller.ts       # GET /worlds, GET /worlds/:slug
│   │   ├─ worlds.service.ts
│   │   └─ dto/                       # WorldSummaryDto, WorldDetailDto
│   │
│   ├─ catalog/
│   │   ├─ catalog.module.ts
│   │   ├─ products.controller.ts     # GET /products, GET /products/:slug
│   │   ├─ products.service.ts        # world-scoped presentation resolution
│   │   └─ dto/                       # ProductListResponseDto, ProductListItemDto, ProductDetailDto
│   │
│   ├─ cart/
│   │   ├─ cart.module.ts
│   │   ├─ cart.controller.ts         # GET /cart, POST/PATCH/DELETE /cart/items(/:lineId)
│   │   ├─ cart.service.ts
│   │   ├─ guest-session.service.ts   # signs/validates the guest session id
│   │   └─ dto/                       # CartDto, CartItemDto, AddCartItemRequestDto, UpdateCartItemRequestDto
│   │
│   ├─ orders/
│   │   ├─ orders.module.ts
│   │   ├─ orders.controller.ts       # POST /orders, GET /orders, GET /orders/:id
│   │   ├─ orders.service.ts
│   │   ├─ order-totals.service.ts    # single source of truth for pricing math
│   │   └─ dto/                       # CreateOrderRequestDto, OrderDto, OrderItemDto, OrderListResponseDto, AddressDto
│   │
│   ├─ users/
│   │   ├─ users.module.ts
│   │   ├─ users.controller.ts        # POST /users/login|register|logout, GET /users/me
│   │   ├─ users.service.ts
│   │   ├─ auth/
│   │   │   ├─ jwt.strategy.ts
│   │   │   ├─ jwt-refresh.strategy.ts
│   │   │   ├─ public.decorator.ts    # @Public() opt-out of the global auth guard
│   │   │   └─ auth.guard.ts
│   │   └─ dto/                       # UserDto, LoginRequestDto, RegisterRequestDto, SessionDto
│   │
│   ├─ loyalty/
│   │   ├─ loyalty.module.ts
│   │   ├─ loyalty.service.ts
│   │   └─ listeners/
│   │       └─ order-placed.listener.ts   # awards points on order.placed
│   │
│   ├─ drops/                          # scheduled limited releases (Phase 2 roadmap item)
│   │   ├─ drops.module.ts
│   │   ├─ drops.service.ts
│   │   └─ jobs/
│   │       └─ drop-activation.processor.ts   # BullMQ processor
│   │
│   ├─ media/
│   │   ├─ media.module.ts
│   │   └─ media.service.ts            # signed upload URLs for product/world assets
│   │
│   ├─ notifications/
│   │   ├─ notifications.module.ts
│   │   ├─ notifications.service.ts
│   │   └─ listeners/
│   │       └─ order-placed.listener.ts   # sends confirmation email via BullMQ job
│   │
│   ├─ payments/
│   │   ├─ payments.module.ts
│   │   ├─ payment-provider.interface.ts  # charge(), refund(), verifyWebhook()
│   │   ├─ providers/
│   │   │   ├─ stripe.provider.ts
│   │   │   └─ paymob.provider.ts
│   │   └─ payment-provider.token.ts      # DI token, swappable via config
│   │
│   └─ common/
│       ├─ prisma/                     # PrismaService, module
│       ├─ redis/                      # RedisService, module
│       ├─ filters/                    # global exception filter → ApiError shape
│       ├─ interceptors/               # logging, response shaping
│       └─ events/                     # typed event names + payload contracts
│
├─ prisma/
│   ├─ schema.prisma
│   └─ migrations/
│
└─ test/                               # e2e (Supertest) suites, one per module
```

---

## 4. Data Model (Prisma)

```prisma
model World {
  id        String   @id @default(cuid())
  slug      String   @unique
  name      Json     // { en: string, ar: string, fr: string } — mirrors LocalizedTextDto
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  presentations ProductWorldPresentation[]
}

model Product {
  id          String   @id @default(cuid())
  slug        String   @unique
  basePrice   Int      // minor units (cents)
  currency    String   @default("USD")
  createdAt   DateTime @default(now())

  presentations ProductWorldPresentation[]
  orderItems    OrderItem[]
  cartItems     CartItem[]
}

// The per-world "skin" of a product: what ProductCard actually renders.
// WorldConfig.productCard.fieldLabels supplies the *labels* ("Stars", "Rating");
// this table supplies the *values* for a given product in a given world.
model ProductWorldPresentation {
  id             String  @id @default(cuid())
  productId      String
  worldId        String
  title          Json    // LocalizedTextDto
  primaryValue   String  // e.g. "1.2k" for Tech's "Stars" label
  secondaryValue String? // e.g. "MIT" for Tech's "License" label
  imageUrl       String
  badge          String?
  isAvailable    Boolean @default(true)
  isFeatured     Boolean @default(false)
  sortWeight     Int     @default(0)

  product Product @relation(fields: [productId], references: [id])
  world   World   @relation(fields: [worldId], references: [id])

  @@unique([productId, worldId])
  @@index([worldId, isAvailable, sortWeight])
}

model Cart {
  id         String   @id @default(cuid())
  sessionId  String   @unique   // guest session id, or userId once merged
  userId     String?  @unique
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  items CartItem[]
  user  User?      @relation(fields: [userId], references: [id])
}

model CartItem {
  id        String  @id @default(cuid())
  cartId    String
  productId String
  quantity  Int

  cart    Cart    @relation(fields: [cartId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@unique([cartId, productId])
}

model Order {
  id              String      @id @default(cuid())
  userId          String?
  sessionId       String      // guest session at time of purchase, for lookup pre-auth
  status          OrderStatus @default(PENDING)
  paymentMethodId String
  shippingAddress Json        // AddressDto
  subtotal        Int
  shipping        Int
  tax             Int
  total           Int
  currency        String      @default("USD")
  createdAt       DateTime    @default(now())

  items OrderItem[]
  user  User?       @relation(fields: [userId], references: [id])
}

model OrderItem {
  id          String @id @default(cuid())
  orderId     String
  productId   String
  worldSlug   String  // which world's presentation the item was purchased through
  quantity    Int
  unitPrice   Int     // captured at purchase time — never recomputed from live Product

  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])
}

enum OrderStatus {
  PENDING
  PAID
  FULFILLED
  CANCELLED
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  favoriteWorldSlug String?
  createdAt    DateTime @default(now())

  refreshTokens    RefreshToken[]
  loyaltyAccount   LoyaltyAccount?
  achievements     UserAchievement[]
  orders           Order[]
  cart             Cart?
}

model RefreshToken {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String
  expiresAt DateTime
  revokedAt DateTime?

  user User @relation(fields: [userId], references: [id])
}

model LoyaltyAccount {
  userId String @id
  points Int    @default(0)

  user         User               @relation(fields: [userId], references: [id])
  transactions LoyaltyTransaction[]
}

model LoyaltyTransaction {
  id        String   @id @default(cuid())
  userId    String
  points    Int
  reason    String   // e.g. "order.placed:<orderId>"
  createdAt DateTime @default(now())

  account LoyaltyAccount @relation(fields: [userId], references: [userId])
}

model Achievement {
  id          String @id @default(cuid())
  key         String @unique  // matches i18n key achievements.items.<key>
  criteria    Json            // rule descriptor evaluated by loyalty/achievement service

  users UserAchievement[]
}

model UserAchievement {
  userId        String
  achievementId String
  earnedAt      DateTime @default(now())

  user        User        @relation(fields: [userId], references: [id])
  achievement Achievement @relation(fields: [achievementId], references: [id])

  @@id([userId, achievementId])
}

model Drop {
  id         String   @id @default(cuid())
  worldId    String
  activatesAt DateTime
  expiresAt   DateTime?
  status     String   @default("scheduled") // scheduled | active | ended
}
```

---

## 5. API Surface

This mirrors `frontend-architecture.md` §4 endpoint-for-endpoint and
§5's DTO list name-for-name. The frontend's `lib/api/*` service functions do
not change; only `baseUrlResolver` moves from `/api/mock` to this backend.

| Route | Method | Auth | Request DTO | Response DTO |
| --- | --- | --- | --- | --- |
| `/worlds` | GET | `@Public()` | — | `WorldSummaryDto[]` (active only) |
| `/worlds/:slug` | GET | `@Public()` | — | `WorldDetailDto` (404 if unknown/inactive) |
| `/products` | GET | `@Public()` | query: `worldSlug?, cursor?, limit?` | `ProductListResponseDto` (`{ items, nextCursor }`) |
| `/products/:slug` | GET | `@Public()` | query: `world?` | `ProductDetailDto` (404 if unavailable in that world) |
| `/cart` | GET | guest or user | header: `x-session-id` | `CartDto` (created empty if missing) |
| `/cart/items` | POST | guest or user | `AddCartItemRequestDto` | `CartDto` (merges into existing line; 404 unknown/unavailable product) |
| `/cart/items/:lineId` | PATCH | guest or user | `UpdateCartItemRequestDto` | `CartDto` (`quantity <= 0` removes the line) |
| `/cart/items/:lineId` | DELETE | guest or user | — | `CartDto` |
| `/orders` | POST | guest or user | `CreateOrderRequestDto` | `OrderDto` (201; validates address + payment method; clears cart) |
| `/orders` | GET | guest or user | header: `x-session-id` | `OrderListResponseDto` (400 without session) |
| `/orders/:id` | GET | guest or user | — | `OrderDto` (404 if unknown, or not owned by this session/user) |
| `/users/login` | POST | `@Public()` | `LoginRequestDto` | `SessionDto`, sets httpOnly access+refresh cookies |
| `/users/register` | POST | `@Public()` | `RegisterRequestDto` | `SessionDto`, sets httpOnly access+refresh cookies |
| `/users/logout` | POST | any | — | 204, clears cookies, revokes refresh token |
| `/users/me` | GET | any | — | `UserDto` (401 if no valid session — this is what makes `getSession()` return `null`) |

Note: the mock's `/users/*` deliberately return 501/401 today (frontend
§9). This backend is what turns those into real endpoints — nothing in
`lib/auth/getSession.ts`, `LoginForm.tsx`, or `RegisterForm.tsx` needs to
change; they already handle both the stub and a real response shape.

---

## 6. Session & Guest Cart Strategy

Guest carts must keep working exactly as the frontend already built them
(§6 of the frontend doc: `yourverse-session` cookie, 30-day, `SameSite=Lax`,
`x-session-id` header on requests), while becoming reconcilable with a real
authenticated identity.

- **Guest session id**: the frontend currently mints this client-side via
  `crypto.randomUUID()` (`lib/cart/session-cookie.ts`). This backend accepts
  a client-supplied `x-session-id` **as-is for Phase 0** to avoid a frontend
  change, but signs and re-issues it via `Set-Cookie` on first contact so
  subsequent requests carry a value the backend has verified it minted. Any
  request with a tampered/unsigned id is treated as "no session" (empty cart
  returned, matching current 400/empty behavior) rather than erroring — see
  §15 for why this is called out as a migration risk rather than assumed.
- **Redis-backed cart cache**: `Cart` rows in Postgres are the source of
  truth; a Redis key (`cart:{sessionId}`) caches the hydrated `CartDto` with
  a short TTL, invalidated on every mutation. This is what the original
  Phase 0 spec meant by "Redis (guest carts)" — Redis is a cache in front of
  Postgres, not the only copy of cart state.
- **Cart merge on login**: on successful `/users/login`, if the guest
  session's `Cart` has items and the user has no existing cart, the guest
  cart is reassigned (`sessionId` → `userId`) rather than merged
  line-by-line, to avoid silently overwriting a returning user's real cart.
  If the user *does* have an existing cart, guest items are merged in
  (matching `POST /cart/items` semantics: quantity adds to existing lines).

---

## 7. Auth & Security

- **JWT in httpOnly cookies** (`access_token`, `refresh_token`), not
  `Authorization` headers — consistent with "no credentials in localStorage,
  sessionStorage, React state, or URLs" already stated as a frontend
  constraint (§9).
- **Refresh rotation**: each `/users/login` or refresh issues a new refresh
  token and revokes the previous one (`RefreshToken.revokedAt`); reuse of a
  revoked token invalidates the entire token family for that user (standard
  rotation-theft mitigation).
- **`@Public()` decorator** opt-out on a global auth guard — the default is
  "this route requires a session," and public routes (`/worlds/*`,
  `/products/*`, `/users/login`, `/users/register`) explicitly opt out,
  rather than the default being open and someone forgetting to protect a new
  route.
- **Cart/order routes accept both guest and authenticated sessions** — they
  are not behind the global auth guard, but resolve identity from either the
  JWT cookie (if present and valid) or the guest session id (if not),
  preferring the JWT when both are present.
- **Password hashing**: bcrypt (or argon2id), cost factor tuned per
  deployment target; never logged, never returned in `UserDto`.

---

## 8. Domain Events

`EventEmitter2`, emitted from services after a successful state change, not
from controllers.

| Event | Emitted by | Listeners |
| --- | --- | --- |
| `order.placed` | `orders.service.ts`, after order + order items committed | `loyalty` (award points, evaluate achievements), `notifications` (queue confirmation email) |
| `order.status-changed` | `orders.service.ts` | `notifications` (shipping/fulfillment email) |
| `cart.abandoned` | scheduled job comparing `Cart.updatedAt` age | `notifications` (reminder email, Phase 2+) |
| `drop.activated` | `drops` BullMQ processor | `notifications` (drop-live email/push, Phase 2+) |

Listeners are registered in their own module (`loyalty/listeners/*`,
`notifications/listeners/*`) rather than inside `orders/`, so `orders.module.ts`
has no import-time knowledge of loyalty or notification internals — only the
event contract in `common/events/`.

---

## 9. Payments

A provider-agnostic interface, matching the frontend's already-built
data-driven payment method registry (`payment-methods.tsx`: `card`, `wallet`,
`cod`, each a descriptor with `{ id, labelKey, requiredFields, form }`).

```ts
export interface PaymentProvider {
  charge(input: ChargeInput): Promise<ChargeResult>;
  refund(input: RefundInput): Promise<RefundResult>;
  verifyWebhook(rawBody: Buffer, signature: string): WebhookEvent;
}
```

- `card` and `wallet` payment method ids map to a configured provider
  (Stripe or Paymob — see §16 open decision) implementing this interface.
- `cod` (cash on delivery) short-circuits the interface entirely — order is
  created with `status: PENDING` and no charge call, matching the frontend's
  `CodForm` requiring no payment fields.
- Adding a payment method on the backend is: add a provider (if it's a new
  processor) or add a case to the existing provider's method-id mapping (if
  it's a new product on an existing processor) — never a new endpoint.

---

## 10. Background Jobs (BullMQ)

| Queue | Job | Trigger |
| --- | --- | --- |
| `notifications` | send order confirmation email | `order.placed` listener |
| `notifications` | send status-change email | `order.status-changed` listener |
| `drops` | activate a scheduled drop | cron-scheduled, checks `Drop.activatesAt` |
| `loyalty` | recompute achievement eligibility | `order.placed` listener (async, not inline, since criteria evaluation may scan order history) |

Jobs are idempotent (keyed by `orderId` + job type) so a retried job doesn't
double-send an email or double-award points.

---

## 11. Caching & Performance

- `GET /worlds` and `GET /worlds/:slug` — cached in Redis with a short TTL
  (these change rarely; a world going active/inactive is an admin action,
  not a hot path).
- `GET /products` — cached per `(worldSlug, cursor, limit)` key; invalidated
  on any `ProductWorldPresentation` write for that world.
- Cart and order endpoints are never cached (always current, per-session).
- Prisma query patterns favor `include` over N+1 lookups for
  `ProductWorldPresentation` joins; product list queries are indexed on
  `(worldId, isAvailable, sortWeight)` per the schema above.

---

## 12. Order Totals & Business Rules

The frontend's `lib/orders/order-totals.ts` currently implements: flat $5
shipping, 10% tax, rounded to cents. This backend's `order-totals.service.ts`
is the **only** place this logic may live going forward:

- It starts as a direct port of the same constants, so Phase 0's numbers
  don't silently change on cutover.
- The frontend calculator is explicitly relabeled (in a follow-up frontend
  change, not this doc) as a **checkout preview estimate** — used only to
  render running totals before submission — and every confirmation page
  render uses the backend's `OrderDto.total`, never a value computed
  client-side.
- If shipping/tax rules diverge (e.g. per-world shipping, per-locale tax),
  this service is the single edit point; the frontend preview calculator
  either gets deleted in favor of a `POST /cart/estimate` round-trip, or is
  explicitly documented as "may drift, confirmation is authoritative" — this
  is an open decision (§16), not a silent risk.

---

## 13. Testing Strategy

| Layer | Tool | Scope |
| --- | --- | --- |
| Unit | Jest | `order-totals.service.ts`, `guest-session.service.ts` signing/verification, loyalty tier math (ported from the frontend's already-tested tier logic in `lib/account/loyalty.ts` — same constants, now server-owned) |
| Integration | Jest + Prisma test DB | Cart merge-on-login, order creation clearing the cart, `ProductWorldPresentation` availability filtering |
| E2E | Jest + Supertest | One suite per module hitting real HTTP routes against a test DB + test Redis; asserts response shapes match the DTOs in §5 exactly (this is what proves the frontend contract holds) |
| Contract | Shared fixtures | A small script diffing this backend's OpenAPI/DTO shapes against `Frontend/web/lib/api/types.ts` — fails CI if they drift (see §15) |

---

## 14. Deployment Shape

- Single NestJS process (modular monolith) behind a reverse proxy; Postgres
  and Redis as managed/adjacent services.
- BullMQ workers can run in-process initially; split into a separate worker
  process once job volume justifies it (Phase 2+, when `drops` scheduling
  and email volume grow) — no code change required, just a different
  entrypoint consuming the same queues.
- Environment-driven config: DB URL, Redis URL, JWT secrets, payment
  provider selection + credentials, CORS origin allowlist (must include the
  frontend's deployed origin so `credentials: "include"` cookies work).

---

## 15. Migration Path from Mock API

The frontend was deliberately built with `lib/api/client.ts`'s
`baseUrlResolver` and `sessionIdResolver` as swappable functions (§5 of the
frontend doc). Cutover is:

1. Deploy this backend; confirm `/worlds`, `/products` respond with the
   exact same DTO shapes the mock returns (contract test in §13 gates this).
2. Change `setBaseUrlResolver` from `/api/mock` to the backend's real origin.
   No component, hook, or page changes.
3. Confirm the session cookie name (`yourverse-session`) and header
   (`x-session-id`) match — they were chosen to match this backend's
   expectations, but re-verify given §6's note about the id being
   client-minted today vs. backend-signed going forward. This is the one
   genuine risk in an otherwise config-only cutover: if the backend starts
   rejecting client-minted ids instead of re-signing them, every existing
   guest cart in a user's browser goes empty on cutover day. Decide this
   explicitly before shipping, don't let it default.
4. Flip `/users/*` from the mock's 501 stubs to this backend's real auth;
   `getSession()` and the login/register forms already handle both cases,
   so this is a deploy, not a code change.
5. Retire `app/api/mock/*` once the above is confirmed in a staging
   environment — keep it in the repo behind a feature flag for one release
   in case rollback is needed.

---

## 16. Open Implementation Decisions

Carried over from the PRD, plus backend-specific additions:

1. **Payment provider**: Stripe vs. Paymob vs. both simultaneously (relevant
   given the project's Arabic/RTL-first Poetry world and likely
   MENA-region users — Paymob has better regional card/wallet coverage;
   Stripe has broader international coverage). The `PaymentProvider`
   interface in §9 supports either without a rewrite either way.
2. **Inventory/fulfillment model**: whether `Product.basePrice`/availability
   is single-warehouse or needs a stock model — not yet decided, and not
   modeled in §4's schema; adding it later is additive (a `Stock` table) if
   the current schema doesn't need to change shape.
3. **Locale URL strategy**: cookie-based (current) vs. `/ar/[worldSlug]`
   path-based — a frontend decision, but affects whether this backend needs
   to accept a locale in the request path for SEO-relevant responses (it
   currently doesn't, since `LocalizedTextDto` returns all locales and the
   frontend picks).
4. **`favoriteWorldSlug` re-theming transactional emails**: the `User` model
   above includes the field (per the PRD's open question), but no
   `notifications` template currently reads it — decide before Phase 2
   whether order-confirmation emails should render in the user's favorite
   world's visual style, which would require exporting a subset of
   `WorldConfig`'s theme (or at least brand colors) into the backend or into
   email templates, not just the world's `name`/`slug`.
5. **Guest session signing** (§6, §15): whether the backend re-signs a
   client-minted id transparently, or requires an explicit
   `POST /session` bootstrap call before first cart interaction. The former
   is a smoother cutover; the latter is a cleaner security boundary. Decide
   before Phase 1 cutover, not after.
6. **Checkout preview vs. estimate endpoint** (§12): whether
   `lib/orders/order-totals.ts` stays as a client-side estimate (drift risk,
   documented) or is replaced by a `POST /cart/estimate` round-trip
   (extra request per keystroke/step, but zero drift risk). Recommend the
   round-trip if shipping/tax rules are expected to get more complex
   (per-world or per-locale) before Phase 2; keep the local estimate if
   they're expected to stay flat.
