"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function AnimeShowcase() {
  return (
    <section className="relative mx-auto max-w-lg px-6 py-16">
      {/* Tiny floating Lottie — no box, no bg */}
      <motion.div
        className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <DotLottieReact
          src="https://lottie.host/30278734-5a3b-45c0-acf6-9c45ed18bc86/YBW9jG3SVA.lottie"
          loop
          autoplay
          style={{ width: 96, height: 96 }}
          renderConfig={{ freezeOnOffscreen: true }}
        />
        {/* Soft ambient halo behind — not a bg, just a glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 scale-150 rounded-full opacity-20 blur-2xl"
          style={{ background: "radial-gradient(circle, #b9a8f7, transparent 70%)" }}
        />
      </motion.div>

      {/* Text — staggered word reveal */}
      <div className="text-center">
        <motion.p
          className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/25"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Episode 001
        </motion.p>

        <h2 className="font-[var(--font-display)] text-[clamp(1.4rem,3.5vw,1.9rem)] font-medium leading-tight">
          {"Choose your verse".split(" ").map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.3em]"
              initial={{ opacity: 0, y: 20, rotateX: -40 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2 + i * 0.12,
                type: "spring",
                damping: 14,
                stiffness: 100,
              }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          className="mx-auto mt-3 max-w-xs text-[0.85rem] leading-relaxed text-white/35"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          Hand-picked stories that hit different. Your next obsession is one click away.
        </motion.p>

        {/* Minimal pill CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/anime"
            className="group relative mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-6 py-2.5 text-[0.8rem] font-medium tracking-wide text-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.07] hover:text-white"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
            Explore anime
            <motion.span
              className="inline-block"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}