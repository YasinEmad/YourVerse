"use client";

import { motion, Variants } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LINE1 = "Choose your verse";
const LINE2 = "in YourVerse";

export function HeroTitle() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className="mb-10">
        <h2 className="font-[var(--font-display)] text-[clamp(1.6rem,4vw,2.4rem)] font-semibold italic tracking-wide text-white">
          {LINE1}
        </h2>
        <p className="font-[var(--font-display)] mt-1 text-[clamp(0.9rem,2vw,1.2rem)] font-medium tracking-widest text-white/60 uppercase">
          {LINE2}
        </p>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.3,
      },
    },
  };

  const charVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -80,
      rotateX: 85,
      rotateZ: 12,
      scale: 1.8,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      rotateZ: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 150,
        mass: 0.8,
        delay: i * 0.03,
      },
    }),
  };

  const line2Variants: Variants = {
    hidden: { opacity: 0, x: -30, skewX: -20 },
    visible: {
      opacity: 1,
      x: 0,
      skewX: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: 1.2,
      },
    },
  };

  const cursorVariants: Variants = {
    blink: {
      opacity: [1, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "steps(1)",
      },
    },
  };

  return (
    <div className="relative mb-10">
      <motion.div
        className="font-[var(--font-display)] text-[clamp(1.6rem,4vw,2.4rem)] font-semibold italic tracking-wide"
        style={{ perspective: "1000px" }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="inline-block" aria-label={`${LINE1} ${LINE2}`}>
          {LINE1.split("").map((char, i) => (
            <motion.span
              key={`l1-${i}`}
              className="relative inline-block origin-bottom text-white"
              style={{ transformStyle: "preserve-3d" }}
              variants={charVariants}
              custom={i}
              whileHover={{
                y: -6,
                rotateZ: (i % 2 === 0 ? -1 : 1) * 4,
                scale: 1.15,
                transition: { type: "spring", stiffness: 400, damping: 15 },
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
          
          {/* Blinking cursor */}
          <motion.span
            className="ml-1 inline-block h-[1em] w-[3px] translate-y-1 bg-white/80"
            variants={cursorVariants}
            animate="blink"
          />
        </h2>
      </motion.div>

      <motion.p
        className="font-[var(--font-display)] mt-2 text-[clamp(0.85rem,1.8vw,1.1rem)] font-medium tracking-[0.2em] text-white/50 uppercase"
        variants={line2Variants}
        initial="hidden"
        animate="visible"
      >
        {LINE2.split("").map((char, i) => (
          <motion.span
            key={`l2-${i}`}
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.4 + i * 0.04,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.p>

      {/* Decorative line that draws itself */}
      <motion.div
        className="mt-4 h-[1px] bg-white/20"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}