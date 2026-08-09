"use client";

import { useWorldConfig } from "@/hooks/useWorldConfig";
import { WorldMotion } from "./WorldMotion";

export function WorldHero() {
  const { name, tagline } = useWorldConfig();

  return (
    <section className="relative overflow-hidden border-b border-world-border bg-world-bg-alt px-6 py-16 text-center">
      <WorldMotion />
      <h1 className="relative font-world-heading text-5xl leading-tight text-world-text">
        {name.en}
      </h1>
      <p className="relative mx-auto mt-4 max-w-[40rem] text-xl text-world-text-muted">
        {tagline.en}
      </p>
    </section>
  );
}
