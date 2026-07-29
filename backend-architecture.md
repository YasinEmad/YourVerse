# Backend Architecture — Multiverse Store
### NestJS Modular Monolith
**Version:** 1.0
**Companion doc:** `frontend-architecture.md`

---

## 1. Architectural Philosophy

A single NestJS application, organized as a **modular monolith**: strict module boundaries enforced by NestJS's own module system (each domain exposes a public API via exported providers; internal services stay private), but deployed as one process for v1. This keeps operational complexity low while the product is unproven, but the module boundaries are drawn so that any module (e.g. `OrdersModule` or `DropsModule`) can be extracted into its own service later without a rewrite — only a change in transport (in-process call → HTTP/queue call).

Data layer: Prisma ORM over PostgreSQL, Redis for cache/session/guest-cart state, BullMQ (Redis-backed) for background jobs.

---

## 2. Directory Structure

```
apps/api/
├─ src/
│   ├─ main.ts                          # bootstrap, global pipes/filters, CORS, Swagger
│   ├─ app.module.ts                    # root module, imports all domain modules
│   │
│   ├─ common/
│   │   ├─ decorators/                  # @CurrentUser(), @Public(), etc.
│   │   ├─ filters/
│   │   │   └─ http-exception.filter.ts
│   │   ├─ guards/
│   │   │   ├─ jwt-auth.guard.ts
│   │   │   └─ roles.guard.ts
│   │   ├─ interceptors/
│   │   │   └─ logging.interceptor.ts
│   │   ├─ pipes/
│   │   │   └─ validation.pipe.ts       # class-validator based, applied globally
│   │   └─ dto/
│   │       └─ pagination.dto.ts
│   │
│   ├─ config/
│   │   ├─ configuration.ts             # typed env config (@nestjs/config)
│   │   └─ validation.schema.ts         # joi/zod validation of process.env
│   │
│   ├─ prisma/
│   │   ├─ prisma.module.ts
│   │   ├─ prisma.service.ts            # extends PrismaClient, handles connection lifecycle
│   │   └─ schema.prisma
│   │
│   ├─ modules/
│   │   ├─ worlds/
│   │   │   ├─ worlds.module.ts
│   │   │   ├─ worlds.controller.ts     # GET /worlds, GET /worlds/:slug
│   │   │   ├─ worlds.service.ts
│   │   │   └─ dto/
│   │   │
│   │   ├─ catalog/
│   │   │   ├─ catalog.module.ts
│   │   │   ├─ products.controller.ts   # GET /products, GET /products/:slug
│   │   │   ├─ products.service.ts
│   │   │   ├─ product-world.service.ts # resolves world-specific product presentation
│   │   │   └─ dto/
│   │   │       ├─ product-response.dto.ts
│   │   │       └─ create-product.dto.ts
│   │   │
│   │   ├─ cart/
│   │   │   ├─ cart.module.ts
│   │   │   ├─ cart.controller.ts       # GET/POST/PATCH/DELETE /cart
│   │   │   ├─ cart.service.ts
│   │   │   ├─ cart-session.service.ts  # Redis-backed guest cart resolution
│   │   │   └─ dto/
│   │   │
│   │   ├─ orders/
│   │   │   ├─ orders.module.ts
│   │   │   ├─ orders.controller.ts     # POST /orders, GET /orders, GET /orders/:id
│   │   │   ├─ orders.service.ts
│   │   │   ├─ order-status.state-machine.ts
│   │   │   └─ dto/
│   │   │
│   │   ├─ users/
│   │   │   ├─ users.module.ts
│   │   │   ├─ users.controller.ts
│   │   │   ├─ users.service.ts
│   │   │   ├─ auth/
│   │   │   │   ├─ auth.controller.ts   # POST /auth/login, /auth/register
│   │   │   │   ├─ auth.service.ts
│   │   │   │   └─ strategies/
│   │   │   │       └─ jwt.strategy.ts
│   │   │   └─ dto/
│   │   │
│   │   ├─ loyalty/
│   │   │   ├─ loyalty.module.ts
│   │   │   ├─ loyalty.controller.ts    # GET /loyalty/me, GET /loyalty/achievements
│   │   │   ├─ loyalty.service.ts
│   │   │   ├─ achievements.service.ts
│   │   │   └─ listeners/
│   │   │       └─ order-completed.listener.ts   # awards points on order events
│   │   │
│   │   ├─ drops/
│   │   │   ├─ drops.module.ts
│   │   │   ├─ drops.controller.ts      # GET /drops, GET /drops/active
│   │   │   ├─ drops.service.ts
│   │   │   └─ processors/
│   │   │       └─ drop-scheduler.processor.ts   # BullMQ processor: open/close drop windows
│   │   │
│   │   ├─ media/
│   │   │   ├─ media.module.ts
│   │   │   ├─ media.controller.ts
│   │   │   └─ media.service.ts         # signed upload URLs, CDN URL resolution
│   │   │
│   │   └─ notifications/
│   │       ├─ notifications.module.ts
│   │       ├─ notifications.service.ts
│   │       └─ processors/
│   │           ├─ order-email.processor.ts
│   │           └─ drop-alert.processor.ts
│   │
│   ├─ events/
│   │   └─ domain-events.ts             # typed event names (OrderCompleted, DropOpened, ...)
│   │
│   └─ queue/
│       ├─ queue.module.ts              # registers BullMQ queues centrally
│       └─ queue-names.ts
│
├─ prisma/
│   ├─ schema.prisma
│   ├─ migrations/
│   └─ seed.ts
│
└─ test/
    ├─ unit/
    └─ e2e/
```

---

## 3. Module Boundaries & Communication

Each module in `modules/` exports only what other modules need via its `*.module.ts` `exports` array — internal services never leaked wholesale. Cross-module communication happens two ways:

1. **Direct injection** for synchronous, same-transaction needs (e.g. `OrdersService` injects `CatalogService` to validate product availability before creating an order).
2. **Domain events** (NestJS `EventEmitter2` in-process, backed by the same event names that would map to a message broker if extracted later) for side effects that shouldn't block the primary request — e.g. `OrderCompleted` triggers `LoyaltyModule`'s point award and `NotificationsModule`'s confirmation email **asynchronously**, so a slow email provider never delays checkout response time.

```ts
// modules/orders/orders.service.ts (excerpt)
async completeOrder(orderId: string) {
  const order = await this.prisma.order.update({
    where: { id: orderId },
    data: { status: 'COMPLETED' },
  });
  this.eventEmitter.emit('order.completed', new OrderCompletedEvent(order));
  return order;
}
```

```ts
// modules/loyalty/listeners/order-completed.listener.ts
@OnEvent('order.completed')
async handleOrderCompleted(event: OrderCompletedEvent) {
  await this.loyaltyService.awardPoints(event.order.userId, event.order.total);
}
```

This event-driven seam is deliberately the same pattern used in the ROS project — it's what makes future extraction of `NotificationsModule` or `LoyaltyModule` into standalone services a transport change, not a rewrite.

---

## 4. Data Layer

### 4.1 Prisma schema (core, expanded from PRD)

```prisma
// prisma/schema.prisma
model Product {
  id          String         @id @default(cuid())
  slug        String         @unique
  baseTitle   String
  basePrice   Decimal
  variants    ProductVariant[]
  worlds      ProductWorld[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}

model ProductVariant {
  id         String   @id @default(cuid())
  productId  String
  sku        String   @unique
  size       String?
  color      String?
  stock      Int      @default(0)
  product    Product  @relation(fields: [productId], references: [id])
}

model World {
  id        String         @id @default(cuid())
  slug      String         @unique
  isActive  Boolean        @default(true)
  products  ProductWorld[]
  drops     Drop[]
}

model ProductWorld {
  productId     String
  worldId       String
  displayTitle  String?
  metaOverride  Json?
  product       Product @relation(fields: [productId], references: [id])
  world         World   @relation(fields: [worldId], references: [id])
  @@id([productId, worldId])
}

model User {
  id            String         @id @default(cuid())
  email         String         @unique
  passwordHash  String
  favoriteWorld String?
  loyaltyPoints Int            @default(0)
  achievements  UserAchievement[]
  orders        Order[]
  createdAt     DateTime       @default(now())
}

model Order {
  id         String      @id @default(cuid())
  userId     String
  worldSlug  String
  total      Decimal
  status     OrderStatus @default(PENDING)
  items      OrderItem[]
  user       User        @relation(fields: [userId], references: [id])
  createdAt  DateTime    @default(now())
}

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  variantId   String
  quantity    Int
  unitPrice   Decimal
  order       Order   @relation(fields: [orderId], references: [id])
}

model Drop {
  id         String     @id @default(cuid())
  worldId    String
  startsAt   DateTime
  endsAt     DateTime
  productIds String[]
  status     DropStatus @default(SCHEDULED)
  world      World      @relation(fields: [worldId], references: [id])
}

model Achievement {
  id          String   @id @default(cuid())
  key         String   @unique
  title       String
  description String
  users       UserAchievement[]
}

model UserAchievement {
  userId        String
  achievementId String
  unlockedAt    DateTime @default(now())
  user          User        @relation(fields: [userId], references: [id])
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  @@id([userId, achievementId])
}

enum OrderStatus {
  PENDING
  PAID
  COMPLETED
  CANCELLED
  REFUNDED
}

enum DropStatus {
  SCHEDULED
  ACTIVE
  CLOSED
}
```

### 4.2 Redis usage

| Key pattern | Purpose | TTL |
|---|---|---|
| `cart:guest:{sessionId}` | Guest cart contents (JSON) | 7 days rolling |
| `session:{userId}` | Auth session cache (if session-based, alternative to pure JWT) | matches token expiry |
| `world-config-cache:{slug}` | Cached DB-backed world content (featured products) | 5 min |
| `rate-limit:{ip}:{route}` | Throttling for auth endpoints | 1 min window |

Guest carts are Redis-only; on login/checkout, `CartService.mergeGuestCart(userId, sessionId)` migrates the Redis cart into a Postgres-persisted cart tied to the user, then clears the Redis key.

---

## 5. API Design

REST, versioned via URL prefix (`/api/v1`), documented via `@nestjs/swagger` auto-generated OpenAPI spec (consumed by frontend for type generation — keeps `lib/api/types.ts` on the frontend in sync via a codegen step in CI).

| Endpoint | Method | Module | Notes |
|---|---|---|---|
| `/api/v1/worlds` | GET | Worlds | List active worlds + summary content |
| `/api/v1/worlds/:slug` | GET | Worlds | Landing content for one world |
| `/api/v1/products` | GET | Catalog | Filterable by `worldSlug`, paginated |
| `/api/v1/products/:slug` | GET | Catalog | Includes world-specific presentation if `?world=` provided |
| `/api/v1/cart` | GET | Cart | Resolves guest or user cart |
| `/api/v1/cart/items` | POST | Cart | Add item |
| `/api/v1/cart/items/:id` | PATCH/DELETE | Cart | Update/remove item |
| `/api/v1/orders` | POST | Orders | Creates order from cart, triggers payment intent |
| `/api/v1/orders` | GET | Orders | Auth required, user's order history |
| `/api/v1/orders/:id` | GET | Orders | Auth required |
| `/api/v1/auth/register` | POST | Users | |
| `/api/v1/auth/login` | POST | Users | Returns JWT (httpOnly cookie set) |
| `/api/v1/loyalty/me` | GET | Loyalty | Auth required, points + tier |
| `/api/v1/loyalty/achievements` | GET | Loyalty | Auth required |
| `/api/v1/drops` | GET | Drops | Active + upcoming drops |
| `/api/v1/media/upload-url` | POST | Media | Admin-only, signed upload URL |

All list endpoints use cursor-based pagination (`common/dto/pagination.dto.ts`) rather than offset — matters once product catalogs grow.

---

## 6. Background Jobs (BullMQ)

| Queue | Job | Trigger | Purpose |
|---|---|---|---|
| `notifications` | `send-order-confirmation` | `order.completed` event | Transactional email |
| `notifications` | `send-drop-alert` | Drop status change | Notify subscribed users |
| `drops` | `open-drop-window` | Scheduled (delayed job set at drop creation) | Flips `Drop.status` to `ACTIVE` |
| `drops` | `close-drop-window` | Scheduled | Flips `Drop.status` to `CLOSED`, disables purchase |
| `loyalty` | `award-points` | `order.completed` event | Decoupled from request path |
| `catalog` | `sync-stock-alert` | Stock threshold check (cron) | Low-stock internal alert |

Each queue has its own `*.processor.ts` with concurrency limits configured per job type (e.g. email sending capped to avoid provider rate limits).

---

## 7. Authentication & Authorization

- JWT-based auth, access token in httpOnly cookie (not localStorage — mitigates XSS token theft), short expiry (15 min) + refresh token rotation.
- `JwtAuthGuard` applied globally with `@Public()` decorator opt-out for public routes (catalog browsing, world content).
- `RolesGuard` for admin-only routes (`/media/upload-url`, future admin dashboard endpoints) — role stored on `User` model (`CUSTOMER` | `ADMIN`).
- Guest checkout is fully supported: `CartSessionService` issues an anonymous session ID (signed cookie) so unauthenticated users can browse/cart/checkout, with account creation optional at order confirmation.

---

## 8. Payments (pending decision, per PRD open question)

Recommended structure regardless of provider chosen (Stripe vs. Paymob):

```
modules/payments/
├─ payments.module.ts
├─ payments.service.ts          # provider-agnostic interface
├─ providers/
│   ├─ stripe.provider.ts
│   └─ paymob.provider.ts
└─ webhooks/
    └─ payment-webhook.controller.ts   # verifies signature, emits payment.succeeded event
```

`PaymentsService` exposes `createPaymentIntent(order)` and `verifyWebhook(payload, signature)` behind an interface (`PaymentProvider`), so switching or supporting both providers simultaneously (relevant given Egypt-based audience) doesn't touch `OrdersModule` — `OrdersService` only reacts to the `payment.succeeded` / `payment.failed` domain events.

---

## 9. Observability

| Concern | Approach |
|---|---|
| Logging | Structured JSON logs via `nestjs-pino`, correlation ID per request injected in `LoggingInterceptor` |
| Error tracking | Sentry (or equivalent) wired into `HttpExceptionFilter` |
| Metrics | Basic request duration/error-rate via Prometheus exporter if self-hosted, or platform-native (Vercel/Railway) metrics otherwise |
| Health checks | `/api/v1/health` via `@nestjs/terminus`, checks Postgres + Redis connectivity |

---

## 10. Testing Strategy

| Layer | Tool | Scope |
|---|---|---|
| Unit | Jest | Services in isolation, mocked Prisma client |
| Integration | Jest + test Postgres container | Repository-level logic (e.g. `ProductWorld` resolution, cart merge logic) |
| E2E | Jest + Supertest | Full request/response cycles against a seeded test DB — critical for `/orders` and `/cart` flows |
| Contract | OpenAPI schema diff in CI | Ensures frontend `lib/api/types.ts` codegen doesn't silently drift from actual API shape |

---

## 11. Deployment Shape (v1)

Single NestJS process (containerized), Postgres + Redis as managed services. No need for a message broker beyond BullMQ/Redis at this scale. This mirrors the ROS backend's operational simplicity — modular monolith first, extract only when a specific module's load profile (most likely `NotificationsModule` under high order volume, or `DropsModule` during high-traffic drop events) actually demands independent scaling.

---

## 12. Open Implementation Decisions

1. Payment provider(s) — pending PRD §11 decision; module structure above supports either or both.
2. Session strategy: pure JWT vs. JWT + Redis session cache for revocation support (matters if you need "log out everywhere" functionality).
3. Whether `DropsModule`'s scheduled jobs need a dedicated worker process separate from the API process once drop traffic is significant (Phase 2+ concern, not v1).
