"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/cart", label: "Cart", badge: 2 },
  { href: "/account", label: "Account" },
];

// Heavy dark palette — deeper than #0e0c17
const HEAVY_DARK = "#0c0a18";
const DEEP_GLOW = "#1e1b33";
const SOFT_VIOLET = "#2d2a4a";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const navPadding = useTransform(scrollY, [0, 100], [28, 16]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-[clamp(1.25rem,4vw,3rem)]"
        style={{ paddingTop: navPadding, paddingBottom: navPadding }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.2 }}
      >
        {/* Glass backdrop */}
        <div
          className={`absolute inset-0 -z-10 border-b transition-all duration-500 ${
            scrolled
              ? "border-white/[0.03] bg-[#06040f]/85 backdrop-blur-2xl"
              : "border-transparent bg-transparent backdrop-blur-none"
          }`}
        />

        {/* Ambient heavy glow behind logo */}
        <div
          className="pointer-events-none absolute left-[clamp(1.25rem,4vw,3rem)] top-1/2 -z-10 h-20 w-20 -translate-y-1/2 rounded-full opacity-20 blur-2xl"
          style={{ background: `radial-gradient(circle, ${DEEP_GLOW} 0%, transparent 70%)` }}
        />

        {/* Logo */}
        <Link
          href="/"
          className="relative flex items-center gap-3 no-underline"
          aria-label="Yourverse — home"
        >
          <motion.div style={{ scale: logoScale }}>
            <Image
              src="/assets/logo.png"
              alt="Yourverse logo"
              width={120}
              height={80}
              className="h-8 w-auto object-contain"
              priority
            />
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Store navigation"
        >
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} badge={link.badge}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <motion.span
            className="block h-[2px] w-6 rounded-full bg-[#b8b3d1]"
            animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
          <motion.span
            className="block h-[2px] w-6 rounded-full bg-[#b8b3d1]"
            animate={menuOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        </button>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.nav
              className="absolute right-0 top-0 flex h-full w-[70vw] max-w-[320px] flex-col justify-center gap-8 border-l border-white/[0.04] bg-[#06040f]/95 p-8 backdrop-blur-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Heavy ambient glow inside drawer */}
              <div
                className="pointer-events-none absolute -left-20 top-1/3 h-64 w-64 rounded-full opacity-15 blur-3xl"
                style={{ background: `radial-gradient(circle, ${DEEP_GLOW} 0%, transparent 70%)` }}
              />

              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className="group relative block text-3xl font-light tracking-wide text-[#e8e6f0] no-underline"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="relative">
                      {link.label}
                      {link.badge && (
                        <span
                          className="absolute -right-7 -top-1 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold text-[#e8e6f0] shadow-lg"
                          style={{
                            background: HEAVY_DARK,
                            borderColor: `${SOFT_VIOLET}60`,
                            boxShadow: `0 0 20px ${DEEP_GLOW}80, inset 0 0 8px ${DEEP_GLOW}40`,
                          }}
                        >
                          {link.badge}
                        </span>
                      )}
                    </span>
                    <span
                      className="absolute -bottom-1 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
                      style={{
                        background: `linear-gradient(90deg, ${HEAVY_DARK}, ${SOFT_VIOLET}, ${HEAVY_DARK})`,
                        boxShadow: `0 0 12px ${DEEP_GLOW}`,
                      }}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Magnetic Link Component ─── */
function NavLink({
  href,
  children,
  badge,
}: {
  href: string;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="group relative px-4 py-2 text-[0.85rem] font-medium tracking-[0.08em] text-[#7a7396] no-underline uppercase transition-colors duration-300 hover:text-[#e8e6f0]"
    >
      {/* Hover glow pill — heavy dark fill */}
      <span
        className="absolute inset-0 -z-10 scale-75 rounded-lg border opacity-0 blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
        style={{
          background: `${HEAVY_DARK}80`,
          borderColor: `${SOFT_VIOLET}30`,
          boxShadow: `0 0 24px ${DEEP_GLOW}60, inset 0 0 12px ${DEEP_GLOW}20`,
        }}
      />

      {/* Text */}
      <span className="relative">
        {children}
        {badge && (
          <span
            className="absolute -right-3.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border text-[9px] font-bold text-[#e8e6f0]"
            style={{
              background: HEAVY_DARK,
              borderColor: `${SOFT_VIOLET}50`,
              boxShadow: `0 0 16px ${DEEP_GLOW}90, inset 0 0 6px ${DEEP_GLOW}30`,
            }}
          >
            {badge}
          </span>
        )}
      </span>

      {/* Animated underline — heavy dark with violet depth */}
      <span
        className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-3/5"
        style={{
          background: `linear-gradient(90deg, transparent, ${SOFT_VIOLET}, transparent)`,
          boxShadow: `0 0 10px ${DEEP_GLOW}, 0 0 20px ${HEAVY_DARK}`,
        }}
      />
    </Link>
  );
}