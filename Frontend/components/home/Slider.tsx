"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";

export type SlideItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type SliderProps = {
  items: SlideItem[];
  ariaLabel?: string;
  className?: string;
  /** Auto-advance interval in ms. Omit or 0 to disable. */
  autoPlayMs?: number;
  /** Show the "01 / 05" counter next to the controls. */
  showCounter?: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

const panelVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 48 : -48, opacity: 0, scale: 0.98 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? -48 : 48, opacity: 0, scale: 0.98 }),
};

const SWIPE_THRESHOLD = 60;

function ArrowIcon({ flipped }: { flipped?: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={flipped ? "rotate-180" : ""}
      aria-hidden="true"
    >
      <path
        d="M6 3.5 10.5 8 6 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Generic, content-agnostic carousel — pass any sections as `items` */
export function Slider({
  items,
  ariaLabel = "carousel",
  className,
  autoPlayMs = 0,
  showCounter = true,
}: SliderProps) {
  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const count = items.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const paginate = useCallback(
    (dir: number) => setPage(([i]) => [(i + dir + count) % count, dir]),
    [count]
  );

  const goTo = (target: number) =>
    setPage(([i]) => (target === i ? [i, 0] : [target, target > i ? 1 : -1]));

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
    else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
  };

  // Autoplay, paused on hover/focus and cancelled entirely if the user
  // prefers reduced motion or there's nothing to cycle through.
  useEffect(() => {
    if (!autoPlayMs || count <= 1 || isPaused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    timerRef.current = setInterval(() => paginate(1), autoPlayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlayMs, count, isPaused, paginate]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") paginate(1);
    if (event.key === "ArrowLeft") paginate(-1);
  };

  if (count === 0) return null;

  const current = items[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={className}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
    >
      <div className="relative overflow-hidden rounded-[20px]">
        {/* edge fade so slides feel like they emerge from the frame, not clip against it */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#050508] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#050508] to-transparent" />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}: ${current.label}`}
            className="cursor-grab select-none active:cursor-grabbing"
          >
            {current.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* live region for screen readers — silent for sighted users */}
      <span className="sr-only" role="status" aria-live="polite">
        {`Showing ${index + 1} of ${count}: ${current.label}`}
      </span>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label="Previous slide"
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:scale-90"
        >
          <ArrowIcon flipped />
        </button>

        <div className="flex items-center gap-2.5">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${item.label} slide`}
              aria-current={i === index}
              className="group flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all duration-500 ${
                  i === index
                    ? "h-1.5 w-6 bg-white/80"
                    : "h-1.5 w-1.5 bg-white/20 group-hover:bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label="Next slide"
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:scale-90"
        >
          <ArrowIcon />
        </button>

        {showCounter && (
          <span className="ml-1 font-mono text-[0.75rem] tabular-nums text-white/35">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        )}
      </div>

      {autoPlayMs > 0 && count > 1 && (
        <div className="mx-auto mt-3 h-[2px] w-24 overflow-hidden rounded-full bg-white/10">
          {!isPaused && (
            <motion.div
              key={index}
              className="h-full rounded-full bg-white/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: autoPlayMs / 1000, ease: "linear" }}
              style={{ transformOrigin: "left" }}
            />
          )}
        </div>
      )}
    </section>
  );
}