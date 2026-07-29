# Frontend Architecture — Multiverse Store
### Next.js 14+ (App Router)
**Version:** 1.0
**Companion doc:** `backend-architecture.md`

---

## 1. Architectural Philosophy

One Next.js project. One design token system. Six (eventually) worlds rendered by the **same component tree**, differentiated entirely by a **WorldConfig** object injected at the layout level. No world gets its own copy of `ProductCard`, `CartDrawer`, or checkout logic — only its own config file and theme assets.

Route Groups separate *concerns* (marketing, world browsing, shop, auth), not *worlds*. Worlds are a **dynamic route segment**, not a set of hardcoded folders — this is what keeps "add world #7" a config change instead of a new deployment surface.

---

## 2. Directory Structure

```
apps/web/
├─ app/
│   ├─ layout.tsx                      # root layout: fonts, providers, global CSS
│   ├─ globals.css                     # design tokens (base layer, not world-specific)
│   │
│   ├─ (marketing)/
│   │   ├─ layout.tsx
│   │   └─ page.tsx                    # homepage — world selector grid
│   │
│   ├─ (world)/
│   │   └─ [worldSlug]/
│   │       ├─ layout.tsx              # loads WorldConfig server-side, wraps WorldProvider
│   │       ├─ page.tsx                # world landing page
│   │       ├─ loading.tsx
│   │       ├─ not-found.tsx           # inactive/unknown world slug
│   │       └─ product/
│   │           └─ [productSlug]/
│   │               ├─ page.tsx
│   │               └─ loading.tsx
│   │
│   ├─ (shop)/
│   │   ├─ layout.tsx                  # neutral layout, minimal theming
│   │   ├─ cart/
│   │   │   └─ page.tsx
│   │   ├─ checkout/
│   │   │   ├─ page.tsx
│   │   │   └─ confirmation/[orderId]/page.tsx
│   │   └─ account/
│   │       ├─ page.tsx
│   │       ├─ orders/page.tsx
│   │       ├─ orders/[orderId]/page.tsx
│   │       └─ achievements/page.tsx
│   │
│   ├─ (auth)/
│   │   ├─ login/page.tsx
│   │   └─ register/page.tsx
│   │
│   └─ api/
│       └─ webhooks/                   # payment provider callbacks if needed at edge
│
├─ config/
│   └─ worlds/
│       ├─ world-config.schema.ts      # zod schema — validates every config at build time
│       ├─ tech.config.ts
│       ├─ gaming.config.ts
│       ├─ anime.config.ts
│       ├─ poetry.config.ts
│       ├─ football.config.ts
│       ├─ chess.config.ts
│       └─ index.ts                    # registry: slug → config, used by getStaticParams
│
├─ components/
│   ├─ world/
│   │   ├─ WorldProvider.tsx           # sets CSS vars, provides config via context
│   │   ├─ WorldHero.tsx
│   │   ├─ WorldNav.tsx
│   │   ├─ WorldMotion.tsx             # lazy-loaded animation wrapper
│   │   ├─ ProductCard.tsx             # variant-driven (repo/character/verse/player/loot/square)
│   │   └─ WorldSelectorGrid.tsx       # homepage cards
│   │
│   ├─ shop/                            # NOT theme-variant — structurally identical everywhere
│   │   ├─ CartDrawer.tsx
│   │   ├─ CartLineItem.tsx
│   │   ├─ CheckoutForm.tsx
│   │   ├─ CheckoutSteps.tsx
│   │   ├─ OrderSummary.tsx
│   │   └─ PaymentMethodSelect.tsx
│   │
│   ├─ account/
│   │   ├─ OrderHistoryList.tsx
│   │   ├─ AchievementBadge.tsx
│   │   └─ LoyaltyProgressBar.tsx
│   │
│   └─ ui/                              # shared primitives (buttons, inputs, modals)
│       ├─ Button.tsx                  # theme-aware via CSS vars, not per-world variants
│       ├─ Input.tsx
│       ├─ Modal.tsx
│       └─ Skeleton.tsx
│
├─ lib/
│   ├─ theme/
│   │   ├─ applyWorldTheme.ts          # maps WorldConfig.theme → CSS custom properties
│   │   └─ animation-registry.ts       # motionProfile string → dynamic() import map
│   │
│   ├─ api/
│   │   ├─ client.ts                   # typed fetch wrapper, base URL, auth header injection
│   │   ├─ catalog.ts                  # getProduct, getWorldProducts, etc.
│   │   ├─ cart.ts
│   │   ├─ orders.ts
│   │   ├─ users.ts
│   │   └─ types.ts                    # shared DTO types (mirrors backend DTOs)
│   │
│   ├─ cart/
│   │   └─ cart-store.ts               # client cart state (see §5)
│   │
│   └─ i18n/
│       ├─ config.ts                   # ar/en locale config
│       └─ dictionaries/
│           ├─ en.json
│           └─ ar.json
│
├─ hooks/
│   ├─ useWorldConfig.ts               # reads WorldProvider context
│   ├─ useCart.ts
│   ├─ useReducedMotion.ts
│   └─ useLowMotionPreference.ts       # reads/writes the "Low Motion" cookie
│
├─ types/
│   └─ world-config.ts                 # WorldConfig interface (source of truth)
│
├─ styles/
│   └─ tokens.css                      # base design tokens: spacing, type scale, z-index
│
├─ middleware.ts                       # locale detection, low-motion cookie read
└─ next.config.js
```

---

## 3. Rendering Strategy

| Route | Strategy | Reasoning |
|---|---|---|
| `(marketing)/page.tsx` | Static (ISR, revalidate 1h) | Rarely changes, needs to be fast |
| `(world)/[worldSlug]/page.tsx` | Static per world (`generateStaticParams` over 6 slugs) + ISR | Config is static; featured products revalidate hourly |
| `(world)/[worldSlug]/product/[productSlug]` | Static (ISR) with `dynamicParams: true` | New products shouldn't require full rebuild |
| `(shop)/cart` | Client-rendered (dynamic, user-specific) | Cart state is per-session |
| `(shop)/checkout` | Server component shell + client form | Sensitive, needs fresh server validation |
| `(shop)/account/*` | Dynamic, authenticated | User-specific data, no caching |

`generateStaticParams` in `(world)/[worldSlug]/layout.tsx` iterates the world config registry (`config/worlds/index.ts`) — meaning the six known worlds are pre-rendered at build time, but the routing structure doesn't hardcode them.

---

## 4. The Theme Engine — Implementation Detail

### 4.1 Loading a world's config

```tsx
// app/(world)/[worldSlug]/layout.tsx
import { getWorldConfig } from "@/config/worlds";
import { WorldProvider } from "@/components/world/WorldProvider";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllWorldSlugs().map((slug) => ({ worldSlug: slug }));
}

export default function WorldLayout({ children, params }: {
  children: React.ReactNode;
  params: { worldSlug: string };
}) {
  const config = getWorldConfig(params.worldSlug);
  if (!config || !config.isActive) notFound();

  return (
    <WorldProvider config={config}>
      <WorldNav config={config} />
      {children}
    </WorldProvider>
  );
}
```

### 4.2 Applying theme as CSS variables

```tsx
// components/world/WorldProvider.tsx
"use client";
import { createContext, useContext, useMemo } from "react";
import { applyWorldTheme } from "@/lib/theme/applyWorldTheme";
import type { WorldConfig } from "@/types/world-config";

const WorldContext = createContext<WorldConfig | null>(null);
export const useWorldConfig = () => {
  const ctx = useContext(WorldContext);
  if (!ctx) throw new Error("useWorldConfig must be used within WorldProvider");
  return ctx;
};

export function WorldProvider({ config, children }: {
  config: WorldConfig; children: React.ReactNode;
}) {
  const styleVars = useMemo(() => applyWorldTheme(config.theme), [config]);
  return (
    <WorldContext.Provider value={config}>
      <div style={styleVars} data-world={config.slug} className="world-root">
        {children}
      </div>
    </WorldContext.Provider>
  );
}
```

`applyWorldTheme` returns a plain object of `--world-*` CSS custom properties, applied inline on the root wrapper — no per-world stylesheet bundle needed. All shared components reference `var(--world-primary)`, `var(--world-radius)`, etc.

### 4.3 Variant-driven ProductCard (not six components)

```tsx
// components/world/ProductCard.tsx
export function ProductCard({ product }: { product: ProductViewModel }) {
  const { productCard } = useWorldConfig();
  switch (productCard.variant) {
    case "repo":      return <RepoCardLayout product={product} labels={productCard.fieldLabels} />;
    case "character": return <CharacterCardLayout product={product} labels={productCard.fieldLabels} />;
    case "verse":     return <VerseCardLayout product={product} labels={productCard.fieldLabels} />;
    case "player":    return <PlayerCardLayout product={product} labels={productCard.fieldLabels} />;
    case "loot":      return <LootCardLayout product={product} labels={productCard.fieldLabels} />;
    default:          return <SquareCardLayout product={product} labels={productCard.fieldLabels} />;
  }
}
```

Each `*CardLayout` is a small presentational component (30-60 lines), not a full page — they share the same data shape (`ProductViewModel`) and only differ in arrangement/typography treatment.

### 4.4 Lazy-loaded motion

```ts
// lib/theme/animation-registry.ts
import dynamic from "next/dynamic";

export const motionRegistry = {
  terminal:    dynamic(() => import("@/components/world/motion/TerminalMotion"), { ssr: false }),
  "neon-glitch": dynamic(() => import("@/components/world/motion/GlitchMotion"), { ssr: false }),
  ink:         dynamic(() => import("@/components/world/motion/InkMotion"), { ssr: false }),
  stadium:     dynamic(() => import("@/components/world/motion/StadiumMotion"), { ssr: false }),
  "rgb-pixel": dynamic(() => import("@/components/world/motion/PixelMotion"), { ssr: false }),
  marble:      dynamic(() => import("@/components/world/motion/MarbleMotion"), { ssr: false }),
};
```

`WorldMotion` reads `config.theme.motionProfile`, looks it up here, and renders nothing if `useReducedMotion()` or the Low Motion cookie is set — so the bundle isn't even fetched in that case.

---

## 5. State Management

Kept intentionally simple — **no global state library** (Redux/Zustand) unless cart complexity grows significantly. Rationale: most state is either server state (products, orders — fetched via server components) or narrowly scoped client state (cart, theme, motion preference).

| State | Owner | Mechanism |
|---|---|---|
| World theme/config | `WorldProvider` (React Context) | Set once per route, read via `useWorldConfig()` |
| Cart | `lib/cart/cart-store.ts` | Lightweight client store (e.g. Zustand or a custom hook + `useSyncExternalStore`), synced to backend via `CartModule` API on mutation, persisted in a cookie-backed guest session ID |
| Auth session | Server-set HTTP-only cookie (JWT or session ID) | Read server-side in layouts/pages that require auth; no client-side token storage |
| Low motion preference | Cookie, read in `middleware.ts` and passed down | Avoids FOUC of heavy animation before hydration |
| Locale (ar/en) | `middleware.ts` + `next-intl` or custom dictionary loader | URL-independent unless SEO requires `/ar/` `/en/` prefixes (decide with SEO strategy) |

Cart and order data are never held purely client-side — every mutation round-trips through `lib/api/cart.ts` to the NestJS `CartModule`, keeping frontend and backend cart state consistent (important given Redis-backed guest carts on the backend, per `backend-architecture.md`).

---

## 6. Performance Budget & Enforcement

| Rule | Mechanism |
|---|---|
| Per-world animation bundle ≤ 50KB gzipped | CI step: `next build` + bundle analyzer, fails PR if any `motion/*` chunk exceeds budget |
| No heavy JS on first paint | All `WorldMotion` components `dynamic(..., { ssr:false })`; critical content (product grid, price, CTA) never blocked by animation load |
| Images | `next/image` everywhere, `sizes` prop tuned per breakpoint, AVIF/WebP via loader, aspect ratios pre-declared in `WorldConfig` to avoid layout shift |
| Font loading | `next/font` with `display: swap`, world-specific fonts subset to used glyphs only |
| LCP target | < 3s mobile / < 1.5s desktop, tracked via Vercel Analytics or self-hosted Web Vitals reporting to the backend |

---

## 7. Accessibility & Internationalization

- `prefers-reduced-motion` respected globally; explicit "Low Motion" toggle overrides regardless of world.
- All interactive elements (cards, CTAs, nav) meet WCAG 2.1 AA contrast **even against themed backgrounds** — enforced by defining `--world-text` and `--world-text-muted` per world with a minimum contrast ratio check as part of the config schema validation (a zod refinement, not just types).
- RTL handling: `dir="rtl"` set at `<html>` level based on locale; Poetry world's decorative elements (ink effects, calligraphy) built RTL-first since it's the most Arabic-native section.
- Focus states and keyboard navigation identical across worlds — theming only affects color/shape of the focus ring, never removes it.

---

## 8. Testing Strategy

| Layer | Tool | Scope |
|---|---|---|
| Unit | Vitest | `applyWorldTheme`, `world-config.schema.ts` validation, cart store logic |
| Component | Testing Library | `ProductCard` variant rendering, `CheckoutForm` validation states |
| E2E | Playwright | Full checkout flow run **once per world** using the same test spec parameterized by `worldSlug` — proves checkout structure is truly world-independent |
| Visual regression | Playwright screenshots or Chromatic | One snapshot per world landing page, catches unintended shared-component drift |
| Bundle size | `@next/bundle-analyzer` in CI | Enforces §6 budget |

The **Phase 1 exit criterion** from the PRD (adding Gaming world requires zero shared-component changes) is validated concretely here: the E2E checkout spec parameterized by `worldSlug` must pass unmodified for every new world added.

---

## 9. Open Implementation Decisions

1. Locale strategy: cookie-based (no URL prefix) vs. `/ar/[worldSlug]` path-based — affects SEO and static generation matrix. Recommend path-based if organic search matters for discovery.
2. Cart store library: lightweight custom hook vs. Zustand — revisit once cart features (bundles, drops) add complexity in Phase 2.
3. Whether `WorldMotion` components should be `.tsx` (React-driven) or raw CSS/`<canvas>` for the heaviest effects (glitch, particles) — canvas may be more performant but harder to theme via CSS variables; worth a small spike before Phase 2.
