// app/page.tsx
import type { Metadata } from "next";
import { Fraunces, Space_Grotesk, Amiri, Aref_Ruqaa } from "next/font/google";
import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { VerseWorlds } from "@/components/home/VerseWorlds";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

/* Arabic faces for RTL worlds (heading + body), matching the poetry config */
const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-arabic-body",
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-arabic-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Choose your universe",
  description: "One portal, five universes. Yourverse is a doorway, not a marketplace.",
};

/* Deterministic starfield — same field every render, no client JS. */
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
    size: (random() * 1.5 + 0.6).toFixed(2),
    delay: `${(random() * 8).toFixed(2)}s`,
    duration: `${(5 + random() * 6).toFixed(2)}s`,
  }));
}


export default function HomePage() {
  const stars = generateStars(80);

  return (
    <div
      className={`${fraunces.variable} ${grotesk.variable} ${amiri.variable} ${arefRuqaa.variable} relative flex min-h-dvh flex-col overflow-x-hidden bg-[radial-gradient(120%_90%_at_50%_-12%,#14101f_0%,#0a0912_52%,#050508_100%)] font-[var(--font-body)] text-[#ece8fb]`}
    >
      {/* ── ambient keyframes, scoped to this page, no tailwind config needed ── */}
      <style>{`
        @keyframes twinkle { 0%,100% { opacity: .15; } 50% { opacity: .8; } }
        @keyframes rise { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slower { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes pulse-glow { 0%,100% { opacity: .55; transform: scale(1); } 50% { opacity: .9; transform: scale(1.04); } }
        @keyframes drift { 0% { transform: translate(0,0); } 50% { transform: translate(6px,-10px); } 100% { transform: translate(0,0); } }
        @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        .animate-twinkle { animation: twinkle var(--dur,7s) ease-in-out infinite; }
        .animate-rise { animation: rise .7s cubic-bezier(.16,1,.3,1) both; }
        .animate-spin-slow { animation: spin-slow 34s linear infinite; }
        .animate-spin-slower { animation: spin-slower 48s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 5s ease-in-out infinite; }
        .animate-drift { animation: drift 6s ease-in-out infinite; }
        .shimmer-text {
          background-image: linear-gradient(90deg, #f3effe 0%, #b9a8f7 25%, #f3effe 50%, #b9a8f7 75%, #f3effe 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 6s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-twinkle, .animate-rise, .animate-spin-slow, .animate-spin-slower, .animate-pulse-glow, .animate-drift, .shimmer-text {
            animation: none !important;
          }
        }
      `}</style>

      {/* starfield */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {stars.map((star) => (
          <span
            key={star.id}
            className="animate-twinkle absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
              // @ts-expect-error custom property
              "--dur": star.duration,
            }}
          />
        ))}
      </div>

      <Navbar />

      <main
        id="main-content"
        className="relative z-10 mx-auto w-full max-w-[80rem] flex-1 px-[clamp(1.25rem,6vw,4rem)] py-[clamp(1.5rem,6vw,4rem)]"
      >
        {/* ── HERO: the wormhole is the thesis — one gate, five colored paths ── */}
        <Hero />

        {/* ── VERSE SHOWCASE SLIDER — worlds live in components/home/verse-worlds.ts ── */}
        <VerseWorlds />
      </main>

      <footer className="relative z-10 border-t border-[#8b7cf6]/15 px-[clamp(1.25rem,6vw,4rem)] pt-8 pb-12">
        <p className="text-center text-[0.85rem] italic text-[#9a90bd]">
          Yourverse — five worlds behind one door.
        </p>
      </footer>
    </div>
  );
}