"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export type VerseShowcaseProps = {
  id: string;
  /** Lottie animation URL — used when imageSrc is not set */
  lottieSrc?: string;
  /** Static image path (from /public) — renders instead of the lottie when set */
  imageSrc?: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  accentDotClassName: string;
  glowColor: string;
  /** Right-to-left layout for Arabic worlds */
  rtl?: boolean;
  /** Font class for the title, e.g. an Arabic display face (defaults to --font-display) */
  headingFontClassName?: string;
  /** Font class for body copy + CTA (defaults to the page's --font-body) */
  bodyFontClassName?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/* One showcase section — fully prop-driven so any world can reuse it.
   Split "stage" layout: the lottie gets a real stage (rings, halo, floating
   accent dots) on one side, the copy gets room to breathe on the other.
   Stacks on small screens, sits side by side from lg up. */
export function VerseShowcase({
  id,
  lottieSrc,
  imageSrc,
  eyebrow,
  title,
  description,
  ctaHref,
  ctaLabel,
  accentDotClassName,
  glowColor,
  rtl = false,
  headingFontClassName = "font-[var(--font-display)]",
  bodyFontClassName,
}: VerseShowcaseProps) {
  return (
    <div
      dir={rtl ? "rtl" : undefined}
      className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-6 py-20 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16 lg:py-28"
    >
      {/* ── STAGE: the lottie's own little world, not just an icon ── */}
      <motion.div
        className="relative mx-auto flex h-[clamp(14rem,32vw,20rem)] w-[clamp(14rem,32vw,20rem)] items-center justify-center"
        initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {/* outer halo — big, soft, sets the color mood for the whole section */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 scale-[2.1] rounded-full opacity-25 blur-3xl"
          style={{ background: `radial-gradient(circle, ${glowColor}, transparent 70%)` }}
          aria-hidden="true"
        />

        {/* accent dots floating near the lottie, gently pulsing — tie back to
           the world's color and to the CTA's accent dot below */}
        {[0, 120, 240].map((angle, i) => {
          const radius = 50; // % of stage radius, sits just on the outer ring
          const x = 50 + radius * Math.cos((angle * Math.PI) / 180) * 0.5;
          const y = 50 + radius * Math.sin((angle * Math.PI) / 180) * 0.5;
          return (
            <motion.span
              key={angle}
              className={`absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${accentDotClassName}`}
              style={{ top: `${y}%`, left: `${x}%` }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
              aria-hidden="true"
            />
          );
        })}

        <motion.div
          className="relative flex h-[70%] w-[70%] items-center justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              sizes="(min-width: 1024px) 14rem, 32vw"
              className="rounded-full object-cover shadow-[0_0_40px_rgba(0,0,0,0.45)] ring-1 ring-white/10"
            />
          ) : (
            <DotLottieReact
              src={lottieSrc}
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
              renderConfig={{ freezeOnOffscreen: true }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* ── COPY ── */}
      <div className={`text-center ${rtl ? "lg:text-right" : "lg:text-left"}`}>
        <motion.p
          className={`mb-3 text-xs font-semibold text-white/30 ${
            rtl ? "" : "uppercase tracking-[0.32em]"
          }`}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {eyebrow}
        </motion.p>

        <h2
          className={`${headingFontClassName} text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.05]`}
        >
          {title.split(" ").map((word, i) => (
            <motion.span
              key={`${id}-${i}`}
              className="me-[0.28em] inline-block"
              initial={{ opacity: 0, y: 28, rotateX: -50 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.1 + i * 0.09,
                type: "spring",
                damping: 15,
                stiffness: 110,
              }}
              style={{ transformPerspective: 600 }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          className={`mx-auto mt-5 max-w-md text-[1.05rem] leading-loose text-white/40 lg:mx-0 ${bodyFontClassName ?? ""}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
        >
          <Link
            href={ctaHref}
            draggable={false}
            className={`group relative mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-7 py-3 text-[0.85rem] font-medium tracking-wide text-white/75 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.09] hover:text-white ${bodyFontClassName ?? ""}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${accentDotClassName}`} />
            {ctaLabel}
            <span
              className={`inline-block transition-transform duration-300 ${
                rtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
              }`}
            >
              {rtl ? "←" : "→"}
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}