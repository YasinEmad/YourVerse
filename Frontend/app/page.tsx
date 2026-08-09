// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces } from "next/font/google";
import { getActiveWorldConfigs } from "@/config/worlds";
import { getLocaleFromHeaders, getServerDictionary } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/translate";
import type { LocalizedText } from "@/types/world-config";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Choose your universe",
  description: "One brand, six universes. Yourverse is a portal, not a marketplace.",
};

// Deterministic star positions — no client JS, no hydration mismatch, same
// field every render. This is the page's one ambient motion layer.
function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateStars(count: number, seed = 7) {
  const random = mulberry32(seed);
  return Array.from({ length: count }, (_, id) => ({
    id,
    top: `${(random() * 100).toFixed(2)}%`,
    left: `${(random() * 100).toFixed(2)}%`,
    size: (random() * 1.4 + 0.6).toFixed(2),
    delay: `${(random() * 9).toFixed(2)}s`,
    duration: `${(6 + random() * 6).toFixed(2)}s`,
  }));
}

// The airlock: a neutral, un-themed shell where visitors pick a universe.
// Per the master creative direction, this page never borrows from any
// world's visual language — the "verse" identity here (night sky, table of
// contents, literary serif) belongs to the portal alone, not to Poetry world
// or any other single world. The only per-world signal is the swatch trio.
export default async function HomePage() {
  const locale = getLocaleFromHeaders();
  const dict = await getServerDictionary();
  const t = createTranslator(dict);
  const worlds = getActiveWorldConfigs();
  const stars = generateStars(70);

  const pick = (text: LocalizedText): string => (locale === "ar" ? text.ar : text.en);

  // Dictionary strings may contain a literal "\n" to separate hero stanza
  // lines — see the copy notes below. Falls back to one line if absent.
  const titleLines = t("portal.title").split("\n");

  return (
    <div
      className={`${fraunces.variable} relative flex min-h-dvh flex-col overflow-x-hidden bg-[radial-gradient(120%_90%_at_50%_-10%,#14121f_0%,#0a0a12_55%,#050507_100%)] text-portal-ink`}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {stars.map((star) => (
          <span
            key={star.id}
            className="portal-star absolute rounded-full bg-portal-ink opacity-35"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 flex items-center justify-between py-7 px-[clamp(1.25rem,4vw,3rem)]">
        <Link href="/" className="font-display text-xl tracking-[0.01em] text-portal-ink no-underline">
          <span>Your</span>
          <span className="italic text-portal-accent">verse</span>
        </Link>
        <nav
          className="flex gap-[clamp(1rem,3vw,2rem)]"
          aria-label={t("nav.storeNavigation")}
        >
          <Link
            href="/cart"
            className="text-[0.9rem] tracking-[0.02em] text-portal-muted no-underline transition-colors duration-200 hover:text-portal-ink focus-visible:text-portal-ink"
          >
            {t("nav.cart")}
          </Link>
          <Link
            href="/account"
            className="text-[0.9rem] tracking-[0.02em] text-portal-muted no-underline transition-colors duration-200 hover:text-portal-ink focus-visible:text-portal-ink"
          >
            {t("nav.account")}
          </Link>
        </nav>
      </header>

      <main
        id="main-content"
        className="relative z-10 w-full max-w-[78rem] flex-1 px-[clamp(1.25rem,6vw,4rem)] py-[clamp(2rem,8vw,6rem)] mx-auto"
      >
        <section className="mb-[clamp(3.5rem,10vw,6rem)] max-w-[44rem]">
          <p className="mb-5 text-xs uppercase tracking-[0.16em] text-portal-muted">
            {t("portal.eyebrow")}
          </p>
          <h1 className="font-display mb-6 font-medium text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.12]">
            {titleLines.map((line, i) => (
              <span
                key={line}
                className={
                  i === titleLines.length - 1
                    ? "block italic text-portal-accent"
                    : "block"
                }
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="max-w-[34rem] text-[1.05rem] leading-[1.6] text-portal-muted">
            {t("portal.tagline")}
          </p>
        </section>

        <section className="portal-toc" aria-labelledby="portal-toc-title">
          <p className="mb-2 text-xs uppercase tracking-[0.16em] text-portal-muted">
            {t("portal.contentsEyebrow")}
          </p>
          <h2
            id="portal-toc-title"
            className="font-display mb-8 font-medium text-[clamp(1.4rem,3vw,1.9rem)]"
          >
            {t("portal.worldsLabel")}
          </h2>

          <ul className="m-0 list-none border-t border-portal-hair p-0">
            {worlds.map((world, index) => (
              <li
                key={world.slug}
                className="toc-row border-b border-portal-hair py-[1.35rem]"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <Link href={`/${world.slug}`} className="group flex flex-wrap items-baseline gap-[0.9rem] text-portal-ink no-underline">
                  <span className="font-display whitespace-nowrap font-medium text-[clamp(1.15rem,2.4vw,1.5rem)]">
                    {pick(world.name)}
                  </span>
                  <span className="ms-1 inline-flex gap-[0.3rem]" aria-hidden="true">
                    <i className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: world.theme.colors.primary }} />
                    <i className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: world.theme.colors.accent }} />
                    <i className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: world.theme.colors.bg }} />
                  </span>
                  <span
                    className="mb-[0.4rem] min-w-8 flex-[1_1_4rem] self-end border-b border-dotted border-portal-hair"
                    aria-hidden="true"
                  />
                  <span className="inline-flex items-center gap-[0.4rem] whitespace-nowrap text-[0.9rem] text-portal-muted transition-colors duration-200 group-hover:text-portal-accent group-focus-visible:text-portal-accent">
                    {t("portal.enter")}
                    <span
                      className="inline-block transition-transform duration-[250ms] rtl:scale-x-[-1] group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </span>
                </Link>
                <p className="mt-[0.4rem] max-w-[34rem] text-[0.9rem] italic text-portal-muted">
                  {pick(world.tagline)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-portal-hair px-[clamp(1.25rem,6vw,4rem)] pt-8 pb-12">
        <p className="text-center text-[0.85rem] italic text-portal-muted">{t("portal.footer")}</p>
      </footer>
    </div>
  );
}
