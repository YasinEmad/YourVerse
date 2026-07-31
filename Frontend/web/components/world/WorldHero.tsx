"use client";

import { useWorldConfig } from "@/hooks/useWorldConfig";
import { WorldMotion } from "./WorldMotion";

export function WorldHero() {
  const { name, tagline } = useWorldConfig();

  return (
    <section className="world-hero">
      <WorldMotion />
      <h1 className="world-hero__title">{name.en}</h1>
      <p className="world-hero__tagline">{tagline.en}</p>
    </section>
  );
}
