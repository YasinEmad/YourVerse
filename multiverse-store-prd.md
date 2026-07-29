# PRD — Multiverse Store
### A Multi-World, Identity-Driven E-Commerce Platform
**Version:** 1.0
**Stack:** Next.js 14+ (App Router) · NestJS (Modular Monolith) · PostgreSQL · Prisma · Redis · BullMQ

---

## 1. Product Vision

Multiverse Store is not a traditional storefront. It is a single brand that manifests as several distinct visual/experiential "worlds" (Tech, Anime, Arabic Poetry, Football, Gaming, Chess), each with its own visual language, product vocabulary, and interaction patterns — while sharing one backend, one cart, one checkout, and one identity system.

**Core principle:** *One system, many skins.* The platform is architected as a **Theme Engine** driving a shared component library — not six independently built storefronts. This is the single most important engineering decision in this PRD, and every module below is designed around it.

**North Star metric:** Repeat visit rate + cross-world purchase rate (a user buying from 2+ worlds is the signal that the "universe" concept is working, not just the individual product).

---

## 2. Goals & Non-Goals

### Goals
- Ship an MVP with **2 worlds** (Tech + Gaming) fully realized, architected so 4 more worlds can be added by *configuration*, not new code.
- Sub-3s LCP on mobile for the homepage and world landing pages.
- A single, boring, reliable checkout flow regardless of which world the user came from.
- A theming system a non-engineer (or Claude) can extend by editing a config file + a small set of assets.

### Non-Goals (explicitly out of scope for v1)
- Voice/sound design (opt-in, post-MVP).
- Full 6-world launch on day one.
- Native mobile app.
- User-generated content / community photo uploads (post-MVP, Phase 3).

---

## 3. System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js 14 (App Router)               │
│  ┌───────────┐ ┌───────────┐ ┌──────────────────────┐     │
│  │ (home)    │ │ (world)   │ │ (shop)               │     │
│  │ route grp │ │ route grp │ │ cart/checkout/account │     │
│  └───────────┘ └───────────┘ └──────────────────────┘     │
│         │              │                │                  │
│         └──────── Theme Engine (shared) ─────────┘         │
│                          │                                   │
└──────────────────────────┼──────────────────────────────────┘
                           │ REST/GraphQL (internal, typed)
┌──────────────────────────┼──────────────────────────────────┐
│                     NestJS Modular Monolith                  │
│  Catalog │ Worlds │ Cart │ Orders │ Users │ Loyalty │ Media   │
│  ────────────────────────────────────────────────────────    │
│  Prisma ORM → PostgreSQL   │   Redis (cache/session)          │
│  BullMQ (jobs: email, drops, points)                          │
└────────────────────────────────────────────────────────────┘
```

**Why this shape works for you specifically:** it mirrors the ROS architecture you already committed to (NestJS modular monolith + Prisma/Postgres/Redis/BullMQ backend, unified Next.js frontend with Route Groups for surface separation). Same mental model, different domain — Route Groups separate *worlds* here the way they separated admin/POS/KDS/customer there.

---

## 4. The Theme Engine (core innovation)

This is what prevents "6 worlds" from becoming "6 codebases."

### 4.1 Concept
Every world is defined by a single **WorldConfig** object, not a separate set of components. Components are theme-aware and render differently based on which config is active, via CSS variables + a small set of "variant" props — not by branching into different component trees.

### 4.2 WorldConfig shape

```ts
// types/world-config.ts
export interface WorldConfig {
  slug: string;                    // "tech" | "anime" | "poetry" | ...
  name: { en: string; ar: string };
  tagline: { en: string; ar: string };

  theme: {
    colors: {
      bg: string; bgAlt: string;
      primary: string; accent: string;
      text: string; textMuted: string;
      border: string;
    };
    fonts: {
      heading: string;   // e.g. "JetBrains Mono" for Tech
      body: string;
      arabic?: string;   // for Poetry world
    };
    radius: "sharp" | "soft" | "round";
    motionProfile: "terminal" | "neon-glitch" | "ink" | "stadium" | "rgb-pixel" | "marble";
  };

  productCard: {
    variant: "repo" | "character" | "verse" | "player" | "loot" | "square";
    fieldLabels: {
      title: string;        // "Repository" vs "Product Name" vs "Player"
      primaryMeta: string;  // "Stars" vs "Fans" vs "Rating"
      secondaryMeta?: string;
      ctaLabel: string;     // "Deploy to Closet" vs "Add to Squad"
    };
  };

  landing: {
    heroAnimation: string;       // key into the animation registry
    sectionOrder: string[];      // which landing blocks to render, in order
  };

  copy: {
    addToCart: { en: string; ar: string };
    emptyCart: { en: string; ar: string };
  };
}
```

Six JSON/TS files (`worlds/tech.config.ts`, `worlds/anime.config.ts`, ...) live in a `/config/worlds/` directory. Adding world #7 means adding one file + a handful of theme assets — not new pages, not new component trees.

### 4.3 How components consume it

- `<WorldProvider config={worldConfig}>` sets CSS custom properties (`--world-bg`, `--world-primary`, `--world-radius`, etc.) at the root of the route group's layout.
- `<ProductCard variant={config.productCard.variant} />` — one component, switches internal layout via the `variant` prop (a `switch` on 5-6 known variants, not six separate files).
- `<WorldMotion profile={config.theme.motionProfile} />` — a wrapper that lazy-loads the corresponding animation module (see §6, Performance).

### 4.4 What is NOT themeable (and must stay identical everywhere)
To protect conversion and sanity:
- Cart drawer logic and checkout flow structure (visual skin can shift subtly — icon color, button radius — but steps, fields, and validation never change).
- Account/order history data structure.
- Search and navigation keyboard/accessibility behavior.

---

## 5. Frontend Structure (Next.js App Router)

```
app/
├─ (marketing)/
│   └─ page.tsx                 # homepage — world selector
├─ (world)/
│   └─ [worldSlug]/
│       ├─ layout.tsx           # loads WorldConfig, wraps in WorldProvider
│       ├─ page.tsx             # world landing page
│       └─ product/[slug]/page.tsx
├─ (shop)/
│   ├─ cart/page.tsx
│   ├─ checkout/page.tsx
│   └─ account/
│       ├─ page.tsx
│       ├─ orders/page.tsx
│       └─ achievements/page.tsx
├─ (auth)/
│   ├─ login/page.tsx
│   └─ register/page.tsx
config/
├─ worlds/
│   ├─ tech.config.ts
│   ├─ gaming.config.ts
│   ├─ anime.config.ts
│   ├─ poetry.config.ts
│   ├─ football.config.ts
│   └─ chess.config.ts
components/
├─ world/
│   ├─ ProductCard.tsx           # variant-driven
│   ├─ WorldHero.tsx
│   ├─ WorldMotion.tsx           # lazy animation loader
│   └─ WorldNav.tsx
├─ shop/
│   ├─ CartDrawer.tsx            # NOT themeable in structure
│   ├─ CheckoutForm.tsx
│   └─ OrderSummary.tsx
lib/
├─ theme/
│   ├─ applyWorldTheme.ts        # sets CSS vars from config
│   └─ animation-registry.ts     # maps motionProfile → lazy import
```

`[worldSlug]` as a dynamic segment (rather than 6 hardcoded route groups) is what makes "add a 7th world" a config change instead of a deploy of new routes.

---

## 6. Performance Strategy (this will make or break the concept)

Six worlds' worth of terminal effects, glitch, particles, and ink animations is a real risk to Core Web Vitals and mobile bounce rate. Concrete rules:

| Rule | Implementation |
|---|---|
| Animations lazy-load per world | `next/dynamic` with `ssr: false` for the `WorldMotion` component; only the active world's animation bundle ships |
| Respect reduced motion | `prefers-reduced-motion` media query disables heavy effects; app also exposes an explicit "Low Motion" toggle stored in a cookie |
| No JS-driven layout thrash | All world transitions use CSS transforms/opacity, never top/left/width animation |
| Product images | Next.js `<Image>` with world-specific aspect ratios pre-defined in config, served via CDN |
| Critical CSS only | Base design tokens (layout, typography scale, spacing) ship globally; world-specific colors/fonts are CSS variables swapped at runtime, not separate stylesheets bundled per route |
| Budget | Each world's animation bundle capped at 50KB gzipped; enforced via CI bundle-size check |

---

## 7. Backend — NestJS Modules

| Module | Responsibility |
|---|---|
| `WorldsModule` | Serves WorldConfig metadata (if config is DB-backed for admin editing rather than static files — see §7.1), world-specific landing content |
| `CatalogModule` | Products, variants, categories, per-world product-to-world mapping |
| `CartModule` | Cart state (Redis-backed for guest carts, Postgres for persisted) |
| `OrdersModule` | Order creation, status, history |
| `UsersModule` | Auth, profile, saved interests |
| `LoyaltyModule` | Cross-world points, membership tiers, achievements/badges |
| `DropsModule` | Limited-edition drops with countdown, BullMQ job to open/close windows |
| `MediaModule` | Product image/asset management, CDN URLs |
| `NotificationsModule` | Email/push via BullMQ queues (order confirmation, drop alerts) |

### 7.1 Static config vs. DB-backed config
Recommendation for v1: **WorldConfig lives as static TS files in the frontend repo**, not in the database. Reasoning: these are design decisions (colors, fonts, motion), not business data — they change rarely and benefit from type safety and version control. Only *content* that changes often (which products are "featured" in a world, active drops, copy strings) should be DB-backed via `WorldsModule`. Revisit this if a non-engineer needs to edit themes directly — that would justify a CMS-backed config layer in Phase 3.

### 7.2 Data Model (core entities)

```prisma
model Product {
  id          String   @id @default(cuid())
  slug        String   @unique
  baseTitle   String
  basePrice   Decimal
  worlds      ProductWorld[]
  variants    ProductVariant[]
  createdAt   DateTime @default(now())
}

model World {
  id        String   @id @default(cuid())
  slug      String   @unique   // matches config file slug
  isActive  Boolean  @default(true)
  products  ProductWorld[]
}

// Many-to-many: a product can appear in multiple worlds
// with world-specific overrides (e.g. different display title/meta)
model ProductWorld {
  productId     String
  worldId       String
  displayTitle  String?          // "React Hoodie" overrides base title in Tech world
  metaOverride  Json?            // { stars: 4200, language: "TypeScript" }
  product       Product @relation(fields: [productId], references: [id])
  world         World   @relation(fields: [worldId], references: [id])
  @@id([productId, worldId])
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  favoriteWorld String?
  loyaltyPoints Int      @default(0)
  achievements  Achievement[]
  orders        Order[]
}

model Order {
  id         String   @id @default(cuid())
  userId     String
  worldSlug  String            // which world the purchase originated from, for analytics
  total      Decimal
  status     OrderStatus
  items      OrderItem[]
  createdAt  DateTime @default(now())
}

model Drop {
  id         String   @id @default(cuid())
  worldSlug  String
  startsAt   DateTime
  endsAt     DateTime
  productIds String[]
  status     DropStatus
}
```

The `ProductWorld` join table is the key modeling decision: it lets the **same physical product** (e.g., a hoodie) be sold under different presentations in different worlds without duplicating inventory — and it's what makes "Nerd Bundle" cross-world bundling (§9) straightforward later.

---

## 8. MVP Scope & Phasing

### Phase 0 — Foundation (2–3 weeks)
- NestJS modular monolith skeleton: Catalog, Cart, Orders, Users
- Prisma schema + migrations (core tables above)
- Next.js app shell: route groups, WorldProvider, design token system
- Theme Engine: config schema, `applyWorldTheme`, one working world (Tech) end-to-end including checkout

**Exit criteria:** a user can browse Tech world, add to cart, and complete checkout.

### Phase 1 — Second World + Loyalty (2 weeks)
- Add Gaming world (proves the config-only-addition model actually holds)
- `LoyaltyModule`: points on purchase, basic achievements
- Account page: order history, saved interests

**Exit criteria:** adding Gaming required zero changes to shared components — only a new config file + assets. If this isn't true, the Theme Engine needs rework before adding more worlds.

### Phase 2 — Remaining Worlds + Drops (3–4 weeks)
- Anime, Poetry, Football, Chess worlds
- `DropsModule`: countdown drops, BullMQ scheduling
- Onboarding: "pick your interest" flow that sets initial world + theming

### Phase 3 — Community Layer (post-MVP)
- Customer photo uploads, monthly contests, design voting
- CMS-backed world config (if non-engineers need to edit themes)
- Sound design (opt-in)

---

## 9. Cross-World Features

- **Unified loyalty points**: purchases in any world contribute to one point balance and one membership tier — this is the mechanic that makes "one brand" feel real despite visually separate worlds.
- **Nerd Bundles**: curated cross-world bundles (e.g., one Tech item + one Chess item) surfaced via the `ProductWorld` join table — no special-case logic needed, just a `Bundle` model referencing existing products.
- **Interest-based onboarding**: new users pick a favorite world; homepage and email content adapt, stored on `User.favoriteWorld`.
- **Persistent identity elements**: logo, cart icon, account icon stay in the same position and general shape across all worlds so navigation muscle memory isn't broken by the theme change.

---

## 10. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | LCP < 3s mobile, < 1.5s desktop, per world landing page |
| Accessibility | WCAG 2.1 AA baseline maintained even inside heavily-themed worlds; reduced-motion respected everywhere |
| i18n | Arabic/English support from day one (RTL handling especially critical for Poetry world) |
| Checkout reliability | Checkout flow structure identical across worlds; covered by E2E tests independent of theme |
| Scalability | Adding a world = new config file + assets, zero shared-component changes (validated at Phase 1 exit) |
| Bundle budget | Per-world animation/JS bundle ≤ 50KB gzipped |

---

## 11. Open Questions for You

1. Inventory model: is this print-on-demand / dropship, or do you hold physical stock? This affects whether `Order` needs fulfillment-provider integration in Phase 0.
2. Payment provider — Stripe, Paymob, or both (given Egypt-based audience, local payment rails likely matter)?
3. Should `favoriteWorld` genuinely re-theme transactional emails, or just the on-site experience?
4. Confirm MVP world pair: Tech + Gaming, or a different combination based on your actual target audience research?

---

*Next suggested step: once Phase 0 scope is locked, I can generate the detailed NestJS module scaffolding (controllers/services/DTOs) and the Prisma schema file, the same way we approached ROS.*
