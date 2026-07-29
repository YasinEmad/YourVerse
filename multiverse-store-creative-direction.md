# Multiverse Store — Master Creative Direction
### One brand. Six universes. One backend.

**Brand thesis:** Multiverse Store is a portal, not a marketplace. The header, cart, checkout, and account shell are the *airlock* — calm, consistent, invisible. The moment you step through into a World, the airlock disappears and you are somewhere else entirely. The shared systems never leak their visual language into the Worlds; the Worlds never leak into each other. What ties them together is craft discipline, not shared color.

**Shared system (the airlock — appears in all Worlds identically):**
- Global header: logo mark + world-switcher ("Enter another universe"), cart, account — rendered in a neutral, un-themed slate/white UI (`#0B0D12` / `#F7F7F8`) with system font (Inter). This is intentional — it's the seam between universes and should read as "platform," never "theme."
- Checkout, order history, saved addresses, payment: identical neutral UI across all six Worlds. No re-skinning. Trust and speed matter more than immersion at the moment of payment.
- Each World's theme governs everything *before* checkout begins: home, category, PDP, search, wishlist, empty states. The instant a user clicks "Checkout," they fade through a 400ms neutral transition into the shared shell.

Below are the six Worlds in full, followed by a master comparison table.

---

# 1. TECH — "The Instrument Panel"

## 1. Brand Personality
- **Emotions:** Precision, quiet confidence, the feeling of holding something engineered rather than manufactured. Calm competence — never hype.
- **Audience:** Engineers, builders, people who read spec sheets for fun, early adopters who care about tolerances and materials, not marketing copy.
- **Three words:** Precise · Calibrated · Understated

## 2. Visual Identity
- **Palette:**
  - Primary: `#1A1D24` (instrument graphite, not pure black)
  - Secondary: `#3A4048` (brushed steel)
  - Background: `#101216`
  - Surface: `#181B20`
  - Accent: `#7CFF9E` (phosphor signal green — used at <8% of surface area, like an indicator LED, never as a wash)
  - Secondary accent: `#FF9F4A` (calibration amber, for warnings/limited states only)
- **Typography:** Display — *Neue Montreal* or *General Sans* (geometric grotesque, tight tracking). Body — *Inter*. Data/specs — *JetBrains Mono* for every number, dimension, and SKU. Numbers are never set in the display face — this is the signature rule of the whole World.
- **Border radius:** 4px on cards, 2px on buttons and inputs — machined, not soft. No pill shapes anywhere.
- **Shadows:** Almost none. A single 1px inset hairline (`#2A2E35`) replaces drop shadow as the primary depth cue — like a milled panel seam, not a floating card.
- **Glass or flat:** Flat, with one exception — the product configurator panel uses a thin frosted glass strip (8px blur, 6% white) to suggest a HUD overlay, used exactly once per page.
- **Texture:** Fine brushed-metal micro-grain (2% opacity noise) on surfaces; hairline grid (24px) faintly visible on backgrounds, like graph paper for engineers.
- **Lighting:** Single hard key light from top-left, as if photographed in a product-shot lightbox. No ambient glow, no bloom — the opposite of "gamer RGB."

## 3. Design Inspiration
Braun (Dieter Rams), Teenage Engineering hardware, Arc Browser's settings panel, Framer's editor, NASA mission-control typography, Rolex product photography, Apple's product pages pre-2020 (pared down), Stripe Docs, oscilloscope UIs, Leica's dial-and-dot iconography.

## 4. Hero Section
A full-bleed dark stage. Center: a single hero product rendered as a rotating 3D wireframe that resolves, line by line, into a photoreal render as the user scrolls — like a blueprint becoming a real object. Background: the faint 24px grid, one thin amber crosshair that tracks the cursor at 15% opacity (a "targeting" cue, subtle). Headline sets in Neue Montreal, sentence case, no exclamation: *"Built to spec. Shipped to you."* Beneath it, a live spec ticker in JetBrains Mono scrolls actual product tolerances (weight, materials, latency numbers) — real information, not filler. CTA is a single 2px-radius button, label: **"Inspect the build"**. Scroll interaction: the wireframe→render transform is scroll-scrubbed (tied to scroll position, not time), so the user controls the reveal. No parallax clutter — one deliberate moment, then the page settles into a calm grid of categories.

## 5. Product Cards
- **Shape:** Rectangular, 4px radius, thin 1px border that lights up (transitions from `#2A2E35` to `#7CFF9E` at 40% opacity) on hover — like a device powering on.
- **Hover animation:** Card lifts 2px (not 8px — restraint), the product photo cross-fades to a wireframe/exploded-view alt shot, spec chips (weight, battery, material) fade in along the bottom edge.
- **Labels:** Small mono-font eyebrow above title: `SKU-2291 · REV.C`
- **Badges:** Rectangular, not rounded. "NEW BUILD" (amber outline), "LIMITED RUN — 240 UNITS" (green outline, shows a live countdown of remaining units).
- **Icons:** Thin 1.5px outline, geometric, technical-drawing style (compass-and-ruler feel).
- **CTA wording:** *"Add to Rig"* (primary action) · *"Spec Sheet"* (view details) · *"Reserve Build"* (pre-order/limited).

## 6. Navigation
- **Navbar:** Slim 56px bar, logo left, categories center-set in mono caps (`AUDIO / COMPUTE / CARRY / WEARABLE`), cart icon renders as a small filled progress bar (not a badge number) showing "cart weight" in grams as a playful engineering touch.
- **Mobile:** Bottom sheet drawer with a physical "slide to open" toggle switch aesthetic instead of a hamburger icon.
- **Search:** Command-palette style (⌘K), monospace input, live results as a scrolling terminal-like list with fuzzy-match highlighting.
- **Filters:** Presented as toggle switches and range sliders with live-updating numeric readouts (exact values, not "$$"), styled like a mixing console.
- **Category nav:** Left rail on desktop, styled as a schematic diagram — categories connected by thin lines like a circuit map.

## 7. Microinteractions
- **Hover:** 1px border lights up green, 120ms.
- **Click:** A single 40ms "click" — button inset by 1px, no bounce.
- **Loading:** A horizontal scan-line sweeps across a skeleton, like a barcode scanner.
- **Page transition:** 250ms cross-fade with a 1px green line that sweeps left-to-right across the viewport, like a progress scan.
- **Success:** A small green dot pulses once and settles — like an LED confirming state, no confetti.
- **Wishlist:** Outline icon fills solid green with a 150ms "charge" animation (fills bottom-to-top like a battery).
- **Cart:** Item flies to cart icon along a subtle curved path (300ms), cart icon's "weight bar" increments.

## 8. Motion Design
- **Style:** Mechanical, deliberate, snappy — never bouncy or elastic.
- **Duration:** 120–250ms for micro, 400–600ms for hero moments.
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (standard material-style ease) — nothing overshoots.
- **Page transitions:** Scan-line wipe, 250ms.
- **Hover motion:** 2px translate max, no scale beyond 1.02.
- **Parallax:** Minimal — only the hero wireframe-to-render scrub.
- **Particles:** None. Particles read as "gamer," which this World explicitly avoids.
- **Cursor:** Default arrow, but hovering an interactive element adds a 1px green ring that follows with 80ms lag — like a targeting reticle.

## 9. Icons
Outlined, 1.5px stroke, geometric, technical-drawing derived (compass/ruler construction, consistent corner radii). No filled icons except state confirmations.

## 10. Illustration Style
Blueprint / schematic — exploded-view diagrams, wireframe renders, isometric technical drawings in single-color line art on dark ground. Every illustration looks like it came from a patent filing or a spec sheet, never cartoon.

## 11. Empty States
- **Empty cart:** A wireframe outline of an empty product silhouette on the grid background. Copy: *"No build in progress. Start one."* CTA: "Browse the catalog."
- **No search results:** A blinking cursor at the end of the query in mono font: *"No match for `query`. Try a SKU or spec."*
- **Wishlist empty:** A dotted-outline card grid (ghost slots), copy: *"Nothing queued for build."*
- **Order success:** The scan-line sweeps once across a completed wireframe-to-render product, a mono readout: *"BUILD CONFIRMED · ETA 3–5 DAYS"* with tracking number in mono type.

## 12. Copywriting
| Generic | Tech World |
|---|---|
| Add to Cart | **Add to Rig** |
| Checkout | **Finalize Build** |
| Wishlist | **Queue** |
| View Details | **Spec Sheet** |
| Sold Out | **Production Halted** |
| New Arrival | **New Build** |
| Limited Edition | **Limited Run** |
| Continue Shopping | **Back to Catalog** |

## 13. Sound
A single low-frequency "power-on" hum (200ms) on page load; a soft mechanical "click" (like a relay) on button press; a short rising two-tone "confirm" chime on successful checkout — nothing musical, everything sounds like calibrated hardware.

## 14. Theme Tokens
```json
{
  "colors": {
    "primary": "#1A1D24",
    "secondary": "#3A4048",
    "background": "#101216",
    "surface": "#181B20",
    "accent": "#7CFF9E",
    "accentWarn": "#FF9F4A",
    "border": "#2A2E35",
    "textPrimary": "#F2F3F5",
    "textMuted": "#8A8F98"
  },
  "typography": {
    "display": "Neue Montreal",
    "body": "Inter",
    "mono": "JetBrains Mono",
    "scale": [12,14,16,20,28,40,56]
  },
  "spacing": [4,8,12,16,24,32,48,64],
  "radius": { "sm": 2, "md": 4, "lg": 6, "pill": 0 },
  "shadows": { "hairline": "inset 0 0 0 1px #2A2E35" },
  "motionProfile": { "fast": "120ms", "base": "250ms", "slow": "500ms", "easing": "cubic-bezier(0.4,0,0.2,1)" },
  "gradients": { "scanline": "linear-gradient(90deg, transparent, #7CFF9E, transparent)" },
  "borders": { "hairline": "1px solid #2A2E35", "activeGlow": "1px solid rgba(124,255,158,0.4)" }
}
```

## 15. Premium Features
- **Live Spec Configurator:** A real-time build panel showing weight/price/ETA update as the user picks options, like a car configurator.
- **Terminal Easter Egg:** Typing `/terminal` opens a real command-line interface into order status, tracking, and specs — pure keyboard-driven.
- **Exploded-View Viewer:** Drag a slider to "explode" a product's components apart in 3D, part by part.
- **Tolerance Certificate:** Every product page shows a downloadable one-page spec certificate, styled like a factory QA sheet.

## 16. Performance Considerations
- 3D wireframe hero uses a lightweight WebGL/Three.js scene, lazy-loaded after first paint, with a static SVG wireframe as the LCP-safe placeholder to protect LCP.
- Scan-line and grid textures are CSS-only (no images) to avoid extra requests.
- Command palette search index is fetched on first keypress, not on page load.
- Mono font subset to used glyphs only (numerals + limited alphabet) to reduce font payload.
- All hover/cursor-ring effects are `transform`/`opacity` only — no layout-triggering properties, keeping CLS at zero.

---

# 2. ANIME — "Cel-Shaded Dusk"

## 1. Brand Personality
- **Emotions:** Nostalgia, adrenaline, wonder — the feeling of an opening-credits sequence. Big feelings, worn proudly.
- **Audience:** Anime and manga fans, collectors, cosplayers, people who want their fandom taken seriously and rendered beautifully, not infantilized.
- **Three words:** Vivid · Kinetic · Emotional

## 2. Visual Identity
- **Palette:**
  - Primary: `#FF4E6E` (sakura-sunset pink-red)
  - Secondary: `#3E2E86` (twilight violet)
  - Background: `#12101C` (night sky indigo-black)
  - Surface: `#1D1830`
  - Accent: `#FFD84A` (sunset gold, used for highlights/rim-light)
- **Typography:** Display — a bold condensed sans with sharp terminals (e.g., *Anton* or a custom condensed cut) for headlines, always set with a subtle drop-shadow "print" offset like manga cover lettering. Body — *Zen Kaku Gothic New* or *Manrope* for clean legibility. Sound-effect accents in a hand-lettered display face used sparingly for badges only.
- **Border radius:** Sharp asymmetric cuts — cards have one squared corner and one 16px-rounded corner (a diagonal "action-panel" cut), never uniform rounding.
- **Shadows:** Hard-edged colored shadows (offset 4px, no blur) — like halftone print separation, not soft drop shadows.
- **Glass or flat:** Flat, with bold flat color blocking — glassmorphism would mute the saturation this World depends on.
- **Texture:** Screentone dot patterns (manga halftone) at low opacity in panel backgrounds; speed-lines radiating from focal points on hover.
- **Lighting:** Anime rim-lighting — a bright gold/pink edge-light on product photography cutouts, dramatic backlight glow behind hero subjects.

## 3. Design Inspiration
Makoto Shinkai's skies, Studio Ghibli's warmth balanced with Kill la Kill's kinetic energy, manga panel layouts (Weekly Shonen Jump), Crunchyroll and MyAnimeList as category peers to leapfrog, Junji Ito's ink contrast for horror-adjacent lines, Tokyo's Shibuya digital billboards, vintage VHS anime box-art typography.

## 4. Hero Section
Background: a painted dusk sky (gradient violet-to-pink) with parallax cloud layers drifting slowly. A hero character/product illustration bursts through a manga "impact frame" (jagged speed-line burst) as the page loads — a signature, one-time entrance animation (900ms), not repeated. Layout: an asymmetric manga-panel grid — the hero splits into 2–3 diagonal panels like a page spread, each panel showing a different product/collection. Scroll effect: as the user scrolls, panels rotate into alignment one by one (each panel un-tilts to 0° as it enters viewport) — the page physically "settles" as you read it, echoing turning a manga page. Headline in bold condensed caps with the manga drop-shadow offset: *"Your next favorite scene starts here."* CTA button styled like a manga speech bubble with a pointed tail: **"Enter the Story"**.

## 5. Product Cards
- **Shape:** Diagonal-cut corner (one corner cut at 45°, evoking a manga panel edge), rest square.
- **Hover animation:** Speed-lines radiate outward from the card center (150ms burst), the product image gets a subtle rim-light glow increase, and the card tilts -2° like a panel coming alive.
- **Labels:** A small chapter-style eyebrow: `EP.04 — RELEASE`.
- **Badges:** Jagged "impact star" badge shapes (not circles/rectangles) for "NEW ARC," halftone-textured ribbon for "LIMITED."
- **Icons:** Small hand-drawn-style icons (heart, star) with a slightly imperfect ink-brush stroke.
- **CTA wording:** *"Claim This Drop"* (add to cart) · *"Read the Lore"* (view details) · *"Reserve My Arc"* (pre-order).

## 6. Navigation
- **Navbar:** Diagonal-bottom-edge bar (a slanted panel cut, not a straight rectangle), logo has a small speed-line flourish on hover.
- **Mobile:** Full-screen takeover menu styled as manga chapter list — categories appear as vertical "volume spines."
- **Search:** A speech-bubble-shaped search field; typing triggers a soft "page-flip" sound cue (if sound enabled) and results appear as manga panels sliding in from the right.
- **Filters:** Chip-based filters shaped like manga sound-effect badges (POW!, NEW!) rather than plain pills.
- **Category nav:** Horizontal scrolling "volume covers" — each category is a mini poster, not a text link.

## 7. Microinteractions
- **Hover:** Speed-line burst + 2° tilt.
- **Click:** A small ink-splash ripple at the click point.
- **Loading:** A manga-style "loading panel" — halftone dots fill in like screentone shading being drawn on.
- **Page transition:** A diagonal wipe transition (like a manga panel cut), 350ms.
- **Success:** A burst of small star/sparkle particles from the action point.
- **Wishlist:** Heart icon fills with a small "beat" scale pulse (1 → 1.3 → 1) in gold.
- **Cart:** Item "jumps" into the cart icon along an arced path with a small motion-line trail.

## 8. Motion Design
- **Style:** Kinetic, punchy, exaggerated (anime "impact frame" timing) but never sluggish.
- **Duration:** 150–350ms for micro, 800–1000ms for hero entrance.
- **Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (overshoot/anticipation, true to anime timing charts).
- **Page transitions:** Diagonal panel wipe.
- **Hover motion:** 2° tilt + speed lines.
- **Parallax:** Layered dusk sky, 3 depth layers, slow drift (20s loop).
- **Particles:** Sparkle/star bursts on success and wishlist actions only — celebratory, not ambient/constant.
- **Cursor:** Default, but click leaves a brief ink-splash trail that fades in 300ms.

## 9. Icons
Hand-drawn / ink-brush style with slightly imperfect strokes — warm and human, never perfectly geometric.

## 10. Illustration Style
Manga/cel-shaded anime illustration — bold ink outlines, flat cel-shaded color with one hard highlight, halftone screentone shading in backgrounds, dynamic action poses for hero art.

## 11. Empty States
- **Empty cart:** An illustrated character shrugging with a small speech bubble: *"This panel's empty. Let's fill the next one."*
- **No search results:** A "404 chapter not found" manga cover parody illustration, copy: *"This chapter hasn't been drawn yet. Try another search."*
- **Wishlist empty:** A single blank manga panel with dotted border: *"No favorites bookmarked yet."*
- **Order success:** A full-bleed celebratory splash panel with sparkle particles: *"Arc Complete! Your order is confirmed."*

## 12. Copywriting
| Generic | Anime World |
|---|---|
| Add to Cart | **Claim This Drop** |
| Checkout | **Finish the Chapter** |
| Wishlist | **Bookmark** |
| View Details | **Read the Lore** |
| Sold Out | **Arc Concluded** |
| New Arrival | **New Arc** |
| Limited Edition | **Rare Drop** |
| Continue Shopping | **Back to the Story** |

## 13. Sound
A soft "page-flip" swish on navigation, a light chime (like a text-message notification in anime UIs) on wishlist, an uplifting orchestral-hit sting (1s) on order success.

## 14. Theme Tokens
```json
{
  "colors": {
    "primary": "#FF4E6E",
    "secondary": "#3E2E86",
    "background": "#12101C",
    "surface": "#1D1830",
    "accent": "#FFD84A",
    "textPrimary": "#FFFFFF",
    "textMuted": "#B9AEDC"
  },
  "typography": {
    "display": "Anton (condensed)",
    "body": "Manrope",
    "accentLettering": "Hand-lettered display (badges only)",
    "scale": [12,14,16,22,32,48,64]
  },
  "spacing": [4,8,12,16,24,32,48,64],
  "radius": { "cutCorner": "45deg-cut", "rounded": 16, "pill": 999 },
  "shadows": { "hard": "4px 4px 0px rgba(0,0,0,0.5)" },
  "motionProfile": { "fast": "150ms", "base": "350ms", "hero": "900ms", "easing": "cubic-bezier(0.34,1.56,0.64,1)" },
  "gradients": { "duskSky": "linear-gradient(180deg, #3E2E86, #FF4E6E)" },
  "borders": { "panel": "2px solid rgba(255,255,255,0.08)" }
}
```

## 15. Premium Features
- **Manga Panel Product Gallery:** Product photos displayed as a manga page spread, tap a panel to zoom, swipe to flip pages.
- **Character Voice Lines:** Optional short voice-line audio snippets on key products (licensed VAs), toggle-able.
- **Seasonal Arc Drops:** Homepage restructures quarterly as a new "story arc" with a new key visual and OST-style background music option.
- **AR Poster Mode:** Point phone camera at packaging to trigger an AR character pose animation.

## 16. Performance Considerations
- Screentone/halftone textures shipped as tiny repeating SVG/CSS patterns, not raster images, to keep payload small.
- Hero entrance illustration lazy-loads as a lightweight SVG/PNG sprite; heavier parallax sky layers load after LCP via `loading="lazy"` and `content-visibility: auto`.
- Particle bursts are canvas-based, capped to short bursts (<500ms), never persistent/ambient, to avoid battery/CPU drain on mobile.
- Condensed display font subset to Latin + punctuation only; no full CJK weight loaded unless the user's locale requires it.

---

# 3. ARABIC POETRY — "The Living Diwan"

## 1. Brand Personality
- **Emotions:** Reverence, intimacy, quiet awe — like reading a beloved verse by lamplight. Sophisticated, never touristic.
- **Audience:** Lovers of Arabic literature and calligraphy, collectors of fine editions, people who want their heritage presented with the same gravity as haute couture — not folklore packaging.
- **Three words:** Reverent · Elegant · Timeless

## 2. Visual Identity
- **Palette:**
  - Primary: `#0E1B1A` (deep ink — near-black with a green undertone, like old manuscript ink)
  - Secondary: `#8C6A3F` (aged brass/gold leaf, muted not shiny)
  - Background: `#12100D` (warm near-black, candlelit)
  - Surface: `#F4EBD8` (parchment — used only for card surfaces, never full background, to avoid a "menu" look)
  - Accent: `#C9A24B` (gold leaf, used sparingly for calligraphy strokes and dividers)
- **Typography:** Display — a genuine Naskh or Kufi-derived Arabic typeface set large (e.g., a licensed high-quality Naskh like *Aref Ruqaa* or a premium Amiri cut) for verses; Latin display pairing — a refined serif (*Fraunces* or *Canela*) for English content, chosen because both have calligraphic terminals that echo each other. Body — a clean humanist sans for UI chrome (*Inter* / *IBM Plex Sans Arabic* bilingual pairing).
- **Border radius:** None on content blocks (sharp rectangles, like a manuscript page edge); a single soft arch shape (a pointed "iwan" arch, radius only at top) reserved for one signature element only — the featured-verse frame.
- **Shadows:** None. Depth comes from a fine gold hairline border and paper-grain texture, not shadow.
- **Glass or flat:** Flat, with a matte parchment texture — glass would feel too modern/cold for this world's warmth.
- **Texture:** Subtle paper-grain noise on parchment surfaces; a faint geometric girih (star-and-polygon) pattern at 4% opacity as a background watermark — architectural, not "Aladdin-lamp" decorative.
- **Lighting:** Warm, low, candlelit — a soft radial glow behind featured calligraphy, like light through a manuscript held up to a window.

## 3. Design Inspiration
Ottoman and Andalusian manuscript illumination, Ahmed Moustafa's calligraphic art, the Aga Khan Museum's typographic restraint, Alhambra's girih geometry (as architecture, not cliché ornament), fine European book-publishing houses (Assouline, Taschen) for how they photograph and pace luxury print objects, Apple's "Behind the Mac" editorial pacing, the calm authority of a well-set poetry anthology.

## 4. Hero Section
Background: a near-black ground with a single faint girih geometric lattice glowing at the edges, like light through a mashrabiya screen. Center-stage: a single verse of real, attributed classical Arabic poetry (e.g., a public-domain Mutanabbi or Al-Ma'arri line) rendered in large calligraphic type, animated stroke-by-stroke as if being written live by an invisible hand (an SVG path-draw animation, 3–4 seconds, elegant and slow — the signature moment of the whole brand). Beneath it, the same line in refined English translation, smaller, italic. Layout: centered, generous negative space — poetry needs silence around it. Scroll effect: as the user scrolls past the hero, the calligraphy line recedes and fragments into individual letterforms that drift apart slowly (a "verse dissolving into its component beauty" moment) before the page settles into the collection grid. CTA, set beneath in a thin gold-outline button with no fill: **"Open the Diwan"**.

## 5. Product Cards
- **Shape:** Sharp-edged parchment-toned card, thin gold hairline border, a small pointed-arch cutout at the top holding a single decorative letterform from the product's associated poet/verse.
- **Hover animation:** The gold hairline border animates as if being hand-inked (a stroke-draw effect, 400ms), and a single line of the associated verse fades in beneath the product title.
- **Labels:** Poet or era attribution set in small caps beneath the title: `مِنْ شِعْرِ المُتَنَبِّي` / "After Al-Mutanabbi."
- **Badges:** No loud badges — a subtle gold wax-seal-style circular mark for "First Edition" or "Signed Calligraphy," understated, like a publisher's colophon.
- **Icons:** A single custom calligraphic flourish mark used as the wishlist icon (not a heart) — a stylized qalam (reed pen) nib.
- **CTA wording:** *"Add to My Diwan"* (add to cart/collection) · *"Read the Full Verse"* (view details) · *"Reserve This Edition"* (pre-order/limited).

## 6. Navigation
- **Navbar:** A thin, quiet bar with generous letter-spacing, logo centered (not left), echoing a book's title page rather than a typical e-commerce header.
- **Mobile:** A vertical scroll drawer styled like turning pages of a bound diwan, categories listed as "chapters" (أبواب).
- **Search:** Search field framed by a thin gold line, placeholder set in italic: *"Search a verse, a poet, an era…"*
- **Filters:** Filter by era (Jahili, Abbasid, Andalusian, Modern), by poet, by form (qasida, ghazal, free verse) — presented as an elegant dropdown list, not checkboxes/pills, to keep the tone literary rather than transactional.
- **Category nav:** A horizontal "table of contents" style list, each category numbered in Arabic-Indic numerals with a thin divider rule, like chapter headings.

## 7. Microinteractions
- **Hover:** Gold hairline "ink-draw" border animation, 400ms.
- **Click:** A soft 200ms fade-press, no bounce — respectful restraint.
- **Loading:** A single calligraphic stroke draws itself repeatedly (loop) as the loading indicator — an animated pen stroke, not a spinner.
- **Page transition:** A slow page-turn cross-fade, 500ms, like turning a manuscript leaf.
- **Success:** A short verse line fades in and gently dissolves — celebratory but literary, not confetti.
- **Wishlist:** The qalam-nib icon "writes" a small flourish stroke when activated (250ms path-draw).
- **Cart:** Item settles into the cart icon with a soft parchment-fold fold-in motion, no bounce.

## 8. Motion Design
- **Style:** Slow, deliberate, calligraphic — every motion should look hand-inked, never mechanical or bouncy.
- **Duration:** 300–500ms for micro, 3000–4000ms for the hero calligraphy stroke-draw.
- **Easing:** `cubic-bezier(0.65, 0, 0.35, 1)` (smooth ease-in-out, like a steady hand).
- **Page transitions:** Cross-fade with a page-turn curl suggestion at the edge.
- **Hover motion:** Border ink-draw, no scale/translate — this world never "jumps."
- **Parallax:** Very subtle girih lattice drift (30s slow loop) behind hero only.
- **Particles:** None — particles would break the manuscript solemnity.
- **Cursor:** Default arrow; on the featured-verse hero, cursor becomes a thin reed-pen glyph.

## 9. Icons
Minimal, calligraphic-flourish derived — each icon is a single custom-drawn stroke mark (pen nib, ink drop, open book) rather than a generic icon-font shape.

## 10. Illustration Style
Ink and gold-leaf illumination — manuscript-margin style decorative marks, geometric girih patterns rendered as fine line art, no figurative illustration (respecting the aniconic tradition of classical Islamic manuscript art) — all visual richness comes from calligraphy, geometry, and gold leaf.

## 11. Empty States
- **Empty cart:** A blank parchment page with a single faint girih watermark: *"Your diwan is empty. Every collection begins with one verse."*
- **No search results:** *"لم نجد قصيدة" — "No verse found. Try a poet's name or an opening line."*
- **Wishlist empty:** *"No verses bookmarked yet. Begin your anthology."*
- **Order success:** A full calligraphic stroke-draw animation completes into a short verse of gratitude, followed by: *"Your edition has been reserved. It travels to you with care."*

## 12. Copywriting
| Generic | Arabic Poetry World |
|---|---|
| Add to Cart | **Add to My Diwan** |
| Checkout | **Bind My Collection** |
| Wishlist | **My Anthology** |
| View Details | **Read the Full Verse** |
| Sold Out | **This Edition Has Closed** |
| New Arrival | **Newly Inked** |
| Limited Edition | **Rare Edition** |
| Continue Shopping | **Return to the Diwan** |

## 13. Sound
The soft scratch of a reed pen on paper for typing/search; a single low oud string pluck on wishlist save; a gentle, unhurried instrumental phrase (2–3 notes, qanun or oud) on order confirmation — nothing loud, everything sounds handmade.

## 14. Theme Tokens
```json
{
  "colors": {
    "primary": "#0E1B1A",
    "secondary": "#8C6A3F",
    "background": "#12100D",
    "surface": "#F4EBD8",
    "accent": "#C9A24B",
    "textPrimary": "#F4EBD8",
    "textOnParchment": "#2A2118"
  },
  "typography": {
    "displayArabic": "Aref Ruqaa / Amiri (premium cut)",
    "displayLatin": "Fraunces",
    "body": "Inter / IBM Plex Sans Arabic",
    "scale": [13,15,18,24,34,48,64]
  },
  "spacing": [8,12,16,24,32,48,64,96],
  "radius": { "sharp": 0, "iwanArch": "48px top-only" },
  "shadows": { "none": "n/a — depth via border + texture" },
  "motionProfile": { "fast": "300ms", "base": "500ms", "hero": "3500ms", "easing": "cubic-bezier(0.65,0,0.35,1)" },
  "gradients": { "candlelight": "radial-gradient(circle, rgba(201,162,75,0.15), transparent 70%)" },
  "borders": { "goldHairline": "1px solid #8C6A3F" }
}
```

## 15. Premium Features
- **Live Calligraphy Animation Engine:** Every featured verse on the platform is rendered with a real stroke-order SVG animation (built once per verse, reused across pages) — the platform's single most iconic signature.
- **Poet Timeline Explorer:** An interactive horizontal timeline of eras (Jahili → Abbasid → Andalusian → Nahda → Modern) letting users browse products by literary period.
- **Verse Pairing Engine:** Each product page pairs the item with a relevant classical verse chosen for thematic resonance (e.g., a perfume paired with a verse about longing).
- **Bilingual Toggle with Calligraphic Integrity:** Arabic/English toggle that never simply "translates the layout" — Arabic mode uses full RTL-native composition, not a mirrored LTR template.

## 16. Performance Considerations
- The hero stroke-draw SVG animation is pre-rendered as an optimized path (not video), lazy-triggered on scroll-into-view, with a static high-quality calligraphy image as the LCP element so the animation doesn't block first paint.
- Arabic web fonts (Naskh/Kufi) are large glyph sets — subset aggressively to only the characters used in featured verses for above-the-fold content, full font loaded async for body content.
- Girih lattice background is a tiling SVG pattern (tiny file size), not a raster image.
- RTL layout is built with logical CSS properties (`margin-inline-start`, etc.) from day one, not mirrored after the fact, to avoid layout-shift bugs between locales.

---

# 4. FOOTBALL — "Matchday"

## 1. Brand Personality
- **Emotions:** Adrenaline, tribal pride, the roar of a crowd, the hush before a penalty. Passion that borders on obsession.
- **Audience:** Supporters, ultras, fantasy-league players, kit collectors — people for whom this is identity, not hobby.
- **Three words:** Electric · Tribal · Triumphant

## 2. Visual Identity
- **Palette:**
  - Primary: `#0B2E1A` (deep pitch green, desaturated — night-match turf, not cartoon green)
  - Secondary: `#101820` (floodlight-night navy-black)
  - Background: `#0A0C10`
  - Surface: `#131A22`
  - Accent: `#FFFFFF` with a single high-voltage accent `#FF3B30` (referee-card red) used only for live/urgent states (match countdown, "last chance") and `#F2C94C` (floodlight gold) for premium/trophy moments.
- **Typography:** Display — a bold, athletic condensed sans with slight italic slant (evoking kit numbering/team typography, e.g. a custom cut like *Druk* or *Integral CF*). Body — *Inter Tight*. Squad numbers and stats always set in a heavy tabular numeral style.
- **Border radius:** Sharp, sporty — 0–4px, with one exception: badges/crests keep their natural circular/shield shapes.
- **Shadows:** Directional hard shadow simulating floodlight glare (offset down, soft blur, `rgba(0,0,0,0.6)`) on hero product shots — like a player under stadium lights.
- **Glass or flat:** A restrained frosted-glass scoreboard panel (used for the live countdown / stats ticker only) — everything else flat.
- **Texture:** Faint pitch-line texture (touchline markings) as a background watermark; subtle grass-grain noise on hero backgrounds.
- **Lighting:** Stadium floodlight — hard directional light from above, long shadow, a subtle lens-flare glint on foil/badge details, exactly like matchday broadcast photography.

## 3. Design Inspiration
Nike and Adidas football campaign sites, matchday broadcast graphics (Sky Sports/DAZN scoreboard systems), tifo choreography and terrace culture, FIFA/EA Sports FC menu systems, stadium architecture (curved stands, floodlight towers), the energy of a Champions League anthem intro sequence.

## 4. Hero Section
Background: a dark stadium at night, floodlights glowing at the top corners, faint pitch-line texture underfoot. A hero product (a kit or boot) is lit dramatically like a player walkout photo, with a subtle ambient crowd-roar audio cue on load (optional, muted by default). Layout: full-bleed, headline set in bold italic-condensed caps like a scoreboard: *"MATCHDAY. EVERY DAY."* A live animated countdown ticker beneath the headline (styled like a broadcast match clock) counts down to the next drop/release. Scroll effect: as the user scrolls, the "floodlights" intensity subtly dims and the page transitions from stadium-night to locker-room-tunnel imagery, like walking out of the tunnel into the collection grid. CTA styled like a substitution board: **"Enter the Stadium"**.

## 5. Product Cards
- **Shape:** Rectangular with a diagonal "sash" corner ribbon (like a kit sponsor stripe), sharp corners.
- **Hover animation:** A subtle floodlight glint sweeps across the card (a moving highlight, 500ms), and the card's crest/badge element does a small "shine" animation like foil catching light.
- **Labels:** Squad-number-style tag in the corner: `№ 09 — LIMITED KIT`.
- **Badges:** Shield-shaped badges for "Match Worn," ribbon badge for "Derby Exclusive," a red "FINAL MINUTES" badge with live countdown for flash drops.
- **Icons:** Bold, solid, sport-iconography — a whistle, a ball, a shield — filled style, high contrast.
- **CTA wording:** *"Join the Squad"* (add to cart) · *"Full Match Report"* (view details) · *"Book Your Seat"* (pre-order/reserve).

## 6. Navigation
- **Navbar:** A scoreboard-style bar — dark with a thin gold underline, categories set like a fixture list (`KITS / BOOTS / TERRACE / LEGENDS`).
- **Mobile:** Slide-in menu styled as a substitutes board (numbered tiles flipping in).
- **Search:** Search bar styled as a "player search" (like FIFA Ultimate Team's search), with instant results showing a small crest/thumbnail per result.
- **Filters:** Filter by club/league/kit-type presented as team-crest chips, not text — visual-first browsing.
- **Category nav:** Horizontal "fixture list" style tabs with a live-score-ticker aesthetic underline that slides between active tabs.

## 7. Microinteractions
- **Hover:** Floodlight glint sweep, 500ms.
- **Click:** A short "whistle-blow" visual snap (quick brightness flash, 100ms).
- **Loading:** A spinning ball icon (subtle, not cartoonish) or a pitch-line progress bar filling like a match clock.
- **Page transition:** A tunnel-walkout style zoom-fade (400ms), like walking through the players' tunnel.
- **Success:** A brief crowd-roar particle burst (confetti in club-agnostic gold/white, not team-specific) with a scoreboard "GOAL"-style flash — restrained, tasteful, not gimmicky.
- **Wishlist:** Shirt-badge icon does a small "pin to kit" animation, filling gold.
- **Cart:** Item flies into the cart icon like a corner-kick arc trajectory.

## 8. Motion Design
- **Style:** High-energy but controlled — broadcast-graphic sharp, not chaotic.
- **Duration:** 150–400ms for micro, 600ms for hero floodlight reveal.
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (fast-out, confident settle — sprint-and-stop).
- **Page transitions:** Tunnel zoom-fade.
- **Hover motion:** Floodlight sweep + subtle 1.02 scale.
- **Parallax:** Floodlight glow layers drift subtly on hero scroll.
- **Particles:** Gold/white confetti burst on purchase success only.
- **Cursor:** Default; on the hero, a subtle circular "spotlight" follows the cursor, dimming the rest of the stadium slightly.

## 9. Icons
Bold, solid, high-contrast sport iconography — filled shapes, athletic and graphic, echoing broadcast scoreboard iconography.

## 10. Illustration Style
Photographic-first world (real kit/product photography under dramatic floodlight), supplemented by bold flat-graphic crest/badge illustration for editorial moments — no cartoon mascots.

## 11. Empty States
- **Empty cart:** An empty locker with a single hanger, copy: *"Your locker's empty. Suit up."*
- **No search results:** *"No result on the scoreboard. Try a club or player name."*
- **Wishlist empty:** *"Your bench is empty — sub someone in."*
- **Order success:** A scoreboard flashes "FULL TIME — ORDER CONFIRMED" with a brief gold confetti burst and a tracking "match clock" showing delivery ETA.

## 12. Copywriting
| Generic | Football World |
|---|---|
| Add to Cart | **Join the Squad** |
| Checkout | **Confirm the Lineup** |
| Wishlist | **The Bench** |
| View Details | **Full Match Report** |
| Sold Out | **Full Time — Gone** |
| New Arrival | **New Signing** |
| Limited Edition | **Derby Exclusive** |
| Continue Shopping | **Back to the Terrace** |

## 13. Sound
A distant crowd murmur that swells briefly on page load (optional/muted default); a short whistle-chirp on button click; a full stadium roar (1.5s) on order success — the platform's most emotionally loud sound moment, used sparingly and only here.

## 14. Theme Tokens
```json
{
  "colors": {
    "primary": "#0B2E1A",
    "secondary": "#101820",
    "background": "#0A0C10",
    "surface": "#131A22",
    "accentGold": "#F2C94C",
    "accentRed": "#FF3B30",
    "textPrimary": "#FFFFFF",
    "textMuted": "#8C97A3"
  },
  "typography": {
    "display": "Druk / Integral CF (condensed italic)",
    "body": "Inter Tight",
    "stats": "Tabular numeral heavy weight",
    "scale": [12,14,18,24,34,48,72]
  },
  "spacing": [4,8,16,24,32,48,64,96],
  "radius": { "sharp": 0, "card": 4, "crest": "natural shield/circle" },
  "shadows": { "floodlight": "0 12px 24px rgba(0,0,0,0.6)" },
  "motionProfile": { "fast": "150ms", "base": "400ms", "hero": "600ms", "easing": "cubic-bezier(0.22,1,0.36,1)" },
  "gradients": { "floodlight": "radial-gradient(circle at top, rgba(242,201,76,0.15), transparent 60%)" },
  "borders": { "goldUnderline": "2px solid #F2C94C" }
}
```

## 15. Premium Features
- **Live Match-Day Countdown:** Real-time countdown widgets synced to actual fixtures for licensed drops ("Available when the whistle blows").
- **Stadium Atmosphere Mode:** Toggle ambient crowd sound while browsing (opt-in, off by default).
- **Kit Number Customizer:** Live 3D/2D preview of name-and-number printing on jerseys before adding to cart.
- **Fixture-Linked Drops:** Product releases timed to real match schedules, with a "Next Drop" fixture-list style homepage module.

## 16. Performance Considerations
- Floodlight lens-flare/glint effects are CSS gradient + blend-mode based, not video, to keep hero lightweight and LCP fast.
- Crowd-roar and ambient sound assets are lazy-loaded only on user opt-in (never autoplay on load) to protect both performance and UX trust.
- Confetti burst uses a lightweight canvas particle system capped at <1s duration and destroyed immediately after, avoiding memory leaks on repeat purchases.
- Crest/badge images use SVG wherever possible (vector shields) instead of PNG to keep the visually-heavy filter/category UI light.

---

# 5. GAMING — "Rig & Rank"

## 1. Brand Personality
- **Emotions:** Competitive drive, tribal fandom (esports-style), the satisfaction of an unlock/level-up moment. Confident, a little cocky, always performance-obsessed.
- **Audience:** PC/console gamers, esports fans, streamers, loot/collector-driven shoppers who respond to rarity and progression systems.
- **Three words:** Charged · Competitive · Rewarding

## 2. Visual Identity
- **Palette:**
  - Primary: `#0D0F14` (chassis black)
  - Secondary: `#1A1E29` (gunmetal panel)
  - Background: `#08090C`
  - Surface: `#12141B`
  - Accent: `#7B5CFF` (electric violet — the brand's signature RGB accent, used as a single accent color, not a rainbow, to avoid looking generic "gamer")
  - Rarity accents (system, not decoration): Common `#8A8F98` · Rare `#4FA8FF` · Epic `#B24FFF` · Legendary `#FFB800`
- **Typography:** Display — a sharp, aggressive geometric sans with angular cuts (e.g., a custom-cut *Rajdhani* or *Chakra Petch* style). Body — *Inter*. All prices/stats in tabular mono for that "HUD readout" feel.
- **Border radius:** Angular-cut corners (chamfered, not rounded) — 8px chamfer cut on two opposite corners of cards, echoing gaming-peripheral chassis design.
- **Shadows:** A soft violet glow shadow (`0 0 24px rgba(123,92,255,0.25)`) on hover only — restrained RGB-glow, not everywhere at once.
- **Glass or flat:** Frosted glass HUD panels for overlays (cart drawer, quick-view) — dark glass with a thin violet edge-glow border, like an in-game inventory panel.
- **Texture:** Subtle carbon-fiber weave texture on card backgrounds at low opacity; faint circuit-trace linework at card edges.
- **Lighting:** RGB accent lighting used as a *system*, not decoration — a single glowing edge-strip per card that responds to interaction, like an actual gaming peripheral's LED strip.

## 3. Design Inspiration
Riot Games' esports broadcast graphics, Steam's library/inventory UI, PlayStation's UI motion language, Razer/Corsair product design (RGB chassis aesthetics), Discord's dark-UI patterns, Valorant's HUD typography, trading-card-game rarity systems (Hearthstone, MTG Arena).

## 4. Hero Section
Background: a dark chassis-black stage with a single subtle violet RGB strip animating along the viewport edges (like a keyboard's underglow, looping slowly). Center-stage: a hero product rendered with a dramatic rim-light in the brand violet, rotating slowly in a 3D viewer. Layout: a HUD-style overlay of live stats around the product (e.g., "12,402 units claimed today," a live leaderboard-style ticker) — real-feeling data, gamified. Headline in the aggressive angular display face: *"GEAR UP. RANK UP."* Scroll effect: scrolling triggers an "unlock" sequence — category tiles animate in like inventory slots unlocking one by one with a small light-flash per tile. CTA styled like a game's primary menu button with a glowing edge: **"Enter the Arena"**.

## 5. Product Cards
- **Shape:** Chamfered-corner card (two corners cut at 8px angle) with a rarity-colored edge-glow border (color depends on the product's designated "tier": Common/Rare/Epic/Legendary) — this rarity system is the World's signature mechanic, applied to real merchandise (e.g., a standard hoodie = Common, a signed collector's item = Legendary).
- **Hover animation:** The rarity edge-glow intensifies and a subtle "scan line" sweeps down the card once (200ms), card lifts 4px with the violet glow shadow.
- **Labels:** Small tag: `TIER: EPIC · DROP RATE 3%` for collector items (playful nod to loot mechanics, transparently just describing stock scarcity).
- **Badges:** Diamond-shaped badges for rarity tier, a pulsing "LIVE DROP" badge with countdown for flash sales.
- **Icons:** Angular, minimal geometric icons echoing HUD iconography (a shield, a lightning bolt, a crosshair).
- **CTA wording:** *"Unlock This Item"* (add to cart) · *"Inspect"* (view details) · *"Queue for Drop"* (pre-order/reserve).

## 6. Navigation
- **Navbar:** Dark chassis bar with a thin animated violet underline that "charges up" (fills left-to-right) on page load; categories set in the angular display face: `GEAR / PERIPHERALS / APPAREL / COLLECTIBLES`.
- **Mobile:** Slide-out drawer styled like an in-game inventory/pause menu, with tabbed sections.
- **Search:** Search bar styled as an in-game console command bar, with a blinking cursor placeholder and instant "matchmaking"-style result animation.
- **Filters:** Filter by rarity tier, by category, by "loadout" (curated bundles) — presented as toggle chips with rarity-color coding.
- **Category nav:** A horizontal tab bar styled like a game's main-menu selector, with a glowing underline that slides between tabs (200ms).

## 7. Microinteractions
- **Hover:** Rarity glow intensifies, scan-line sweep.
- **Click:** A short violet flash-pulse at the click point (like an ability activation).
- **Loading:** A circular "charging" ring animation (like a cooldown timer filling).
- **Page transition:** A quick "level-load" style wipe with a brief progress-bar flash (300ms).
- **Success:** An "XP gained"-style toast slides in with a small violet particle burst and a satisfying chime.
- **Wishlist:** Icon does a "favorite/pin" animation with a small star-burst in the item's rarity color.
- **Cart:** Item flies into the cart icon with a trailing violet particle streak, cart icon briefly pulses like a notification.

## 8. Motion Design
- **Style:** Snappy, high-performance, "120fps feel" — motion should feel as responsive as a competitive game's UI.
- **Duration:** 100–250ms for micro, 500ms for hero unlock sequence.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (fast expo-out — instant response, smooth settle).
- **Page transitions:** Level-load wipe with progress flash.
- **Hover motion:** 4px lift + glow intensify.
- **Parallax:** Subtle RGB edge-strip looping animation on hero border only.
- **Particles:** Violet spark particles on success/unlock moments only, rarity-colored for legendary item interactions.
- **Cursor:** A custom crosshair-style cursor on product grids (thin, minimal, on-brand) — one of the few worlds where a custom cursor makes sense.

## 9. Icons
Geometric, angular, HUD-derived — sharp minimal line icons with slight angular chamfers, echoing gaming peripheral iconography (crosshair, shield, lightning, chevron).

## 10. Illustration Style
Semi-realistic 3D render style for hero products (like a AAA game's store-front render), flat geometric HUD iconography for UI — no cartoon/anime crossover here, keeping Gaming distinct from the Anime World.

## 11. Empty States
- **Empty cart:** An empty inventory grid (ghost slots), copy: *"Inventory empty. Time to loot."*
- **No search results:** *"No matches found. Recalibrate your search."*
- **Wishlist empty:** *"Your loadout is empty. Save your favorites."*
- **Order success:** An "XP bar" fills to 100% with a level-up flash: *"LEVEL UP! Order confirmed — tracking unlocked."*

## 12. Copywriting
| Generic | Gaming World |
|---|---|
| Add to Cart | **Unlock This Item** |
| Checkout | **Confirm Loadout** |
| Wishlist | **Loadout / Favorites** |
| View Details | **Inspect** |
| Sold Out | **Out of Stock — Respawning Soon** |
| New Arrival | **New Drop** |
| Limited Edition | **Legendary Drop** |
| Continue Shopping | **Back to the Store** |

## 13. Sound
A short "power-up" synth blip on hover; a satisfying mechanical-keyboard-style click on button press; an "achievement unlocked" chime (rising arpeggio, 600ms) on successful checkout.

## 14. Theme Tokens
```json
{
  "colors": {
    "primary": "#0D0F14",
    "secondary": "#1A1E29",
    "background": "#08090C",
    "surface": "#12141B",
    "accent": "#7B5CFF",
    "rarityCommon": "#8A8F98",
    "rarityRare": "#4FA8FF",
    "rarityEpic": "#B24FFF",
    "rarityLegendary": "#FFB800",
    "textPrimary": "#F5F5F7"
  },
  "typography": {
    "display": "Rajdhani / Chakra Petch",
    "body": "Inter",
    "hudMono": "JetBrains Mono",
    "scale": [12,14,16,20,28,40,60]
  },
  "spacing": [4,8,12,16,24,32,48,64],
  "radius": { "chamfer": "8px cut corners", "pill": 999 },
  "shadows": { "glow": "0 0 24px rgba(123,92,255,0.25)" },
  "motionProfile": { "fast": "100ms", "base": "250ms", "hero": "500ms", "easing": "cubic-bezier(0.16,1,0.3,1)" },
  "gradients": { "rgbEdge": "linear-gradient(90deg, #7B5CFF, #4FA8FF, #B24FFF)" },
  "borders": { "rarityGlow": "1px solid var(--rarity-color)" }
}
```

## 15. Premium Features
- **Rarity/Tier System for Real Merch:** Products genuinely tagged Common → Legendary based on scarcity, with visual rarity glow — turns a normal catalog into a collection-driven experience.
- **Live Inventory Ticker:** Real stock counts shown as a "drop counter," gamifying scarcity honestly.
- **Loadout Builder:** Let users save curated product bundles ("loadouts") and share them, like an in-game build.
- **Achievement System:** Real account achievements (first purchase, 5 orders, collector milestones) with unlock animations — genuine loyalty gamification, not fake FOMO.

## 16. Performance Considerations
- 3D hero product render uses a pre-baked video/WebM loop as a fallback for low-power devices, full interactive 3D (Three.js) only loads on capable devices/after user interaction.
- Rarity glow shadows are single-layer `box-shadow`/CSS filter effects, not blurred images, to keep repaint cost low across dozens of cards in a grid.
- RGB edge-strip animation is GPU-accelerated (`transform`/`background-position` only) and paused when off-screen via `IntersectionObserver` to save battery.
- Custom crosshair cursor disabled automatically on touch devices (no hover state) to avoid unnecessary JS overhead on mobile.

---

# 6. CHESS — "The Board Room"

## 1. Brand Personality
- **Emotions:** Calm intensity, focus, quiet mastery — the feeling of sitting across a board from a worthy opponent. Intellectual pride without pretension.
- **Audience:** Serious players, club members, collectors of fine sets, people who see chess as craft and philosophy, not just a game.
- **Three words:** Composed · Deliberate · Masterly

## 2. Visual Identity
- **Palette:**
  - Primary: `#1C1A17` (ebony wood)
  - Secondary: `#E8E1D3` (bone/ivory)
  - Background: `#F7F5F0` (light mode default — chess is the one World that reads better in a warm light surface, like a study desk)
  - Surface: `#FFFFFF`
  - Accent: `#7A1E2C` (deep burgundy leather) with `#B08D45` (brass) as a secondary metal accent
- **Typography:** Display — a refined transitional serif (*Freight Display* or *Canela*) for editorial gravitas. Body — a humanist sans (*Söhne* or *Inter*). Notation (moves, algebraic squares) always set in a distinct monospace to visually separate "the game's language" from prose.
- **Border radius:** Minimal, 2–6px — echoes the precision of a wooden board's inlay edge.
- **Shadows:** Soft, long, low-contrast shadows like raking light across a wooden table (`0 8px 24px rgba(28,26,23,0.08)`) — warm, not harsh.
- **Glass or flat:** Flat, with a matte, tactile material feel (wood grain, felt, leather) rather than any glass/plastic language.
- **Texture:** Fine wood-grain texture on dark surfaces, subtle felt/linen texture on card backgrounds — this world is about *material*, echoing real chess sets.
- **Lighting:** Warm raking light from one side, like a reading lamp over a wooden board — soft, directional, studious.

## 3. Design Inspiration
The Queen's Gambit's production design, Chess.com and Lichess as functional peers to visually surpass, fine furniture-making (Herman Miller, Scandinavian wood craft), London gentlemen's-club libraries, Hermès leather-goods photography, the typographic calm of The New York Times' long-form essays, Row House/museum architecture (travertine, brass rail details).

## 4. Hero Section
Background: a softly lit close-up of a real handcrafted wooden chessboard mid-game, shot from a dramatic low angle (photographic realism, not illustration). Layout: an asymmetric editorial grid — large photographic hero on one side, a live-updating "Opening of the Day" mini interactive board on the other, where visitors can actually play through a famous opening's first moves. Scroll effect: as the user scrolls, the camera angle on the hero board subtly "pans" (a parallax crop shift, not a full 3D scene) as if walking around the table, revealing the collection grid beyond. Headline in the transitional serif, restrained: *"Every piece has a purpose."* CTA in a thin brass-bordered button: **"Study the Collection"**.

## 5. Product Cards
- **Shape:** Clean rectangular card with a fine brass hairline border, gentle warm shadow — echoes a museum object label.
- **Hover animation:** The card's shadow deepens subtly (like the object lifting off the table) and a small algebraic-notation-style tag animates in (e.g., "Nf3" flickers briefly) — a subtle wink for players, purely decorative and optional.
- **Labels:** Material/craft eyebrow: `Handcarved Boxwood & Ebony · 3.75" King`.
- **Badges:** A small engraved-looking brass seal badge for "Master's Choice" or "Tournament Standard," a burgundy ribbon for "Limited Edition."
- **Icons:** Minimal line icons derived from actual chess-piece silhouettes (a knight outline as the wishlist icon, for instance) — meaningful, not generic.
- **CTA wording:** *"Add to My Collection"* (add to cart) · *"Study This Piece"* (view details) · *"Reserve the Set"* (pre-order/limited).

## 6. Navigation
- **Navbar:** A clean, quiet bar on the warm background, logo left, categories set in small caps with generous tracking: `SETS / BOARDS / CLOCKS / LIBRARY`.
- **Mobile:** A simple slide-down panel, calm and uncluttered — no heavy animation, respecting the World's composed tone.
- **Search:** A minimal search field, placeholder: *"Search a set, a designer, an opening…"*
- **Filters:** Filter by material (wood species), by size (king height), by style (Staunton, Soviet, artisan) — presented as a refined dropdown/accordion, not colorful chips.
- **Category nav:** A horizontal understated tab list with a thin brass underline that slides between tabs.

## 7. Microinteractions
- **Hover:** Shadow deepens, brass border warms slightly in tone.
- **Click:** A soft, single "wood-tap" visual settle (button depresses 1px, 150ms) — echoing the satisfying tap of a chess clock.
- **Loading:** A minimal pulsing knight-silhouette icon, or a thin brass line that fills like a progress bar.
- **Page transition:** A calm cross-fade (400ms) — no dramatic wipes, this World never rushes.
- **Success:** A small "checkmate" flourish — a single elegant line-draw animation of a king icon tipping over gently, paired with quiet confirmation text.
- **Wishlist:** Knight-icon "saves" with a small 200ms fade-scale, filling burgundy.
- **Cart:** Item settles into the cart icon with a gentle, weighted drop (echoing a chess piece being placed on a square) — a soft "thock" sound cue if enabled.

## 8. Motion Design
- **Style:** Slow, composed, weighted — every motion should feel like a considered move, never rushed or flashy.
- **Duration:** 200–400ms for micro, 800ms for hero parallax pan.
- **Easing:** `cubic-bezier(0.25, 0.1, 0.25, 1)` (classic ease-in-out — measured, confident).
- **Page transitions:** Calm cross-fade.
- **Hover motion:** Shadow deepen only, no scale/translate — restraint is the signature here.
- **Parallax:** Subtle hero board pan on scroll, nothing else.
- **Particles:** None — this World's elegance depends on visual quiet.
- **Cursor:** Default arrow throughout — no gimmicks; the interactive opening-explorer board is the one place cursor behavior matters (drag-to-move pieces).

## 9. Icons
Minimal geometric line icons derived from actual chess piece silhouettes — quietly meaningful, editorial in feel.

## 10. Illustration Style
Photographic realism (real material, real wood/leather/brass photography) as the primary visual language; where illustration is needed, fine ink line-art of piece silhouettes only — no cartoon, no 3D render, this World trusts real craftsmanship photography to do the work.

## 11. Empty States
- **Empty cart:** An empty wooden board photograph with all squares bare: *"An empty board. Every game starts here."*
- **No search results:** *"No pieces match that search. Try a material or a name."*
- **Wishlist empty:** *"Nothing saved yet. Bookmark a set worth studying."*
- **Order success:** A quiet checkmate-flourish animation completes: *"Move confirmed. Your set is being prepared."*

## 12. Copywriting
| Generic | Chess World |
|---|---|
| Add to Cart | **Add to My Collection** |
| Checkout | **Confirm the Move** |
| Wishlist | **Study List** |
| View Details | **Study This Piece** |
| Sold Out | **Set Retired** |
| New Arrival | **New to the Library** |
| Limited Edition | **Grandmaster Edition** |
| Continue Shopping | **Return to the Library** |

## 13. Sound
The soft "click-clack" of a wooden piece placed on a board for confirmations; the gentle "thock" of a chess clock button for cart actions; a quiet single piano note (or wooden knock) on order success — restrained throughout, nothing celebratory-loud.

## 14. Theme Tokens
```json
{
  "colors": {
    "primary": "#1C1A17",
    "secondary": "#E8E1D3",
    "background": "#F7F5F0",
    "surface": "#FFFFFF",
    "accent": "#7A1E2C",
    "accentMetal": "#B08D45",
    "textPrimary": "#1C1A17",
    "textMuted": "#6B655C"
  },
  "typography": {
    "display": "Canela / Freight Display",
    "body": "Söhne / Inter",
    "notation": "JetBrains Mono",
    "scale": [13,15,18,22,30,42,56]
  },
  "spacing": [8,12,16,24,32,48,64,96],
  "radius": { "sm": 2, "md": 4, "lg": 6 },
  "shadows": { "warm": "0 8px 24px rgba(28,26,23,0.08)" },
  "motionProfile": { "fast": "200ms", "base": "400ms", "hero": "800ms", "easing": "cubic-bezier(0.25,0.1,0.25,1)" },
  "gradients": { "woodSheen": "linear-gradient(135deg, #1C1A17, #3A342C)" },
  "borders": { "brassHairline": "1px solid #B08D45" }
}
```

## 15. Premium Features
- **Interactive Opening Explorer:** A real playable mini-board on the homepage/PDPs letting users step through famous openings (Ruy Lopez, Sicilian, Queen's Gambit) move by move — genuinely useful, not just decorative, and a natural bridge to merchandise (e.g., "shop the set used in this opening").
- **Piece Provenance Cards:** Each set's product page includes a short editorial on the carving tradition/material origin, styled like a museum wall label.
- **Puzzle-of-the-Day Widget:** A daily tactics puzzle embedded on the homepage, solvable in-browser, subtly reinforcing brand authority among serious players.
- **Engraving/Personalization Preview:** Live preview of a name or motto engraved on a board's edge or piece base before purchase.

## 16. Performance Considerations
- Hero photography is served as responsive, art-directed images (AVIF/WebP with fallbacks) sized per breakpoint — the photographic hero is the LCP element, so it must be pre-optimized and preloaded, not lazy.
- The interactive opening-explorer board's chess engine/logic (if using a JS chess library) is lazy-loaded only when the widget scrolls into view, keeping initial JS payload minimal.
- Wood-grain and felt textures are small tileable images (<20KB) reused via CSS `background-repeat`, not full-bleed unique photos per surface.
- Because this World intentionally has almost no motion/particles, it naturally carries the lightest JS footprint of all six — a performance strength to lean into, not compensate for.

---

# Master Comparison Table

| Dimension | Tech | Anime | Arabic Poetry | Football | Gaming | Chess |
|---|---|---|---|---|---|---|
| **Codename** | The Instrument Panel | Cel-Shaded Dusk | The Living Diwan | Matchday | Rig & Rank | The Board Room |
| **Core emotion** | Calm precision | Kinetic wonder | Reverent intimacy | Tribal adrenaline | Competitive charge | Composed mastery |
| **Personality (3 words)** | Precise · Calibrated · Understated | Vivid · Kinetic · Emotional | Reverent · Elegant · Timeless | Electric · Tribal · Triumphant | Charged · Competitive · Rewarding | Composed · Deliberate · Masterly |
| **Base mode** | Dark | Dark | Dark (parchment cards) | Dark | Dark | Light |
| **Primary color** | Graphite `#1A1D24` | Sunset red `#FF4E6E` | Ink `#0E1B1A` | Pitch green `#0B2E1A` | Chassis black `#0D0F14` | Ebony `#1C1A17` |
| **Signature accent** | Phosphor green `#7CFF9E` | Sunset gold `#FFD84A` | Gold leaf `#C9A24B` | Floodlight gold `#F2C94C` | Electric violet `#7B5CFF` | Burgundy `#7A1E2C` |
| **Display type** | Neue Montreal + Mono | Bold condensed (Anton) | Naskh calligraphy + Fraunces | Condensed italic (Druk) | Angular geometric (Rajdhani) | Transitional serif (Canela) |
| **Radius language** | 2–4px, machined | Diagonal-cut asymmetry | 0px sharp + 1 arch | 0–4px sharp | Chamfered 8px cuts | 2–6px minimal |
| **Depth cue** | Hairline border | Hard offset shadow | Border + texture only | Floodlight hard shadow | Violet glow shadow | Soft warm shadow |
| **Glass vs flat** | Flat (1 glass HUD strip) | Flat | Flat (matte parchment) | Flat (1 glass scoreboard) | Glass HUD overlays | Flat, tactile |
| **Motion character** | Mechanical, restrained | Punchy, exaggerated | Slow, calligraphic | Sharp, broadcast-energy | Snappy, 120fps-feel | Slow, weighted |
| **Hero signature moment** | Wireframe → render scroll-scrub | Manga impact-frame burst entrance | Live calligraphy stroke-draw | Floodlight walkout reveal | RGB unlock sequence | Photographic parallax pan |
| **Cart CTA** | Add to Rig | Claim This Drop | Add to My Diwan | Join the Squad | Unlock This Item | Add to My Collection |
| **Checkout CTA** | Finalize Build | Finish the Chapter | Bind My Collection | Confirm the Lineup | Confirm Loadout | Confirm the Move |
| **Wishlist name** | Queue | Bookmark | My Anthology | The Bench | Loadout | Study List |
| **Sold-out phrase** | Production Halted | Arc Concluded | Edition Has Closed | Full Time — Gone | Respawning Soon | Set Retired |
| **Icon style** | Thin technical outline | Hand-drawn ink | Calligraphic flourish | Bold solid athletic | Angular HUD geometric | Piece-silhouette line |
| **Illustration style** | Blueprint/schematic | Manga cel-shade | Ink & gold illumination | Photographic + flat crest | Semi-real 3D render | Photographic realism |
| **Sound signature** | Power-on hum, relay click | Page-flip swish, orchestral sting | Reed-pen scratch, oud pluck | Crowd roar, whistle chirp | Synth blip, achievement chime | Wood tap, chess-clock thock |
| **Premium signature feature** | Terminal easter egg + exploded-view viewer | Manga panel gallery + AR poster mode | Live calligraphy engine + verse pairing | Fixture-linked drops + stadium mode | Rarity tier system + loadout builder | Interactive opening explorer |
| **Heaviest performance risk** | 3D wireframe hero | Particle bursts, screentone assets | Arabic font subsetting, RTL layout | Ambient audio, confetti canvas | 3D product render, RGB animation | Large hero photography (LCP) |
| **Closest reference points** | Braun · Teenage Engineering · Arc | Shinkai · Ghibli · Shonen Jump | Ottoman manuscripts · Aga Khan Museum | Nike Football · Sky Sports · Tifo culture | Riot Games · Steam · Razer | The Queen's Gambit · Hermès · Chess.com |

---

## Cross-World Governance Notes (for the design system architect)

1. **The airlock stays neutral, always.** Header, cart drawer icon shell, checkout, and account pages use the shared neutral tokens (`#0B0D12` / `#F7F7F8`, Inter) in every World. Only the *content* inside category/PDP/home pages is themed. This is what makes six radically different Worlds feel like one trustworthy platform rather than six different companies.
2. **Token contract, not token clone.** Every World must implement the same token *shape* (`colors.primary/secondary/background/surface/accent`, `typography.display/body`, `spacing[]`, `radius`, `shadows`, `motionProfile`, `gradients`, `borders`) so the frontend can swap themes via a single `theme.json` swap without component rewrites — but the *values* must never be interpolated from a shared base palette. Each World's palette was chosen independently against its own reference mood board, not generated by shifting hues of one master palette.
3. **One signature motion per World, not six.** Every World gets exactly one "hero signature moment" (see table row above) that a user will remember and describe to a friend. Resist the urge to add a second big moment elsewhere on the page — restraint is what makes the signature moment land.
4. **Accessibility floor is shared, non-negotiable, per World:** WCAG AA contrast minimum on all text/background pairs (test the parchment-on-ink and gold-on-black pairs specifically), visible keyboard focus rings styled per-World (not removed), `prefers-reduced-motion` disables all parallax/particle/hero-scrub effects platform-wide and falls back to a static hero image.
5. **Never mix World iconography.** A knight silhouette belongs to Chess; a crosshair belongs to Gaming. If a cross-sell module surfaces a Chess product inside the Gaming World (e.g., "gamers who also collect"), render it using Gaming's card component with Gaming's copy — the product travels, the theme does not.
