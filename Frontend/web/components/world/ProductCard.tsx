"use client";

import type { ProductViewModel } from "@/types/product";
import { useWorldConfig } from "@/hooks/useWorldConfig";
import { RepoCardLayout } from "./cards/RepoCardLayout";
import { CharacterCardLayout } from "./cards/CharacterCardLayout";
import { VerseCardLayout } from "./cards/VerseCardLayout";
import { PlayerCardLayout } from "./cards/PlayerCardLayout";
import { LootCardLayout } from "./cards/LootCardLayout";
import { SquareCardLayout } from "./cards/SquareCardLayout";

export function ProductCard({ product }: { product: ProductViewModel }) {
  const { productCard } = useWorldConfig();
  const labels = productCard.fieldLabels;

  switch (productCard.variant) {
    case "repo":
      return <RepoCardLayout product={product} labels={labels} />;
    case "character":
      return <CharacterCardLayout product={product} labels={labels} />;
    case "verse":
      return <VerseCardLayout product={product} labels={labels} />;
    case "player":
      return <PlayerCardLayout product={product} labels={labels} />;
    case "loot":
      return <LootCardLayout product={product} labels={labels} />;
    default:
      return <SquareCardLayout product={product} labels={labels} />;
  }
}
