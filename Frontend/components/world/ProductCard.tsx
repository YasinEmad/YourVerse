"use client";

import type { ProductViewModel } from "@/types/product";
import { useWorldConfig } from "@/hooks/useWorldConfig";
import { useCart } from "@/hooks/useCart";
import { RepoCardLayout } from "./cards/RepoCardLayout";
import { CharacterCardLayout } from "./cards/CharacterCardLayout";
import { VerseCardLayout } from "./cards/VerseCardLayout";
import { PlayerCardLayout } from "./cards/PlayerCardLayout";
import { LootCardLayout } from "./cards/LootCardLayout";
import { SquareCardLayout } from "./cards/SquareCardLayout";

export function ProductCard({ product }: { product: ProductViewModel }) {
  const { productCard } = useWorldConfig();
  const { addItem } = useCart();
  const labels = productCard.fieldLabels;

  const handleAddToCart = () => {
    void addItem({ productSlug: product.slug, quantity: 1 });
  };

  const layoutProps = {
    product,
    labels,
    onAddToCart: product.available ? handleAddToCart : undefined,
  };

  switch (productCard.variant) {
    case "repo":
      return <RepoCardLayout {...layoutProps} />;
    case "character":
      return <CharacterCardLayout {...layoutProps} />;
    case "verse":
      return <VerseCardLayout {...layoutProps} />;
    case "player":
      return <PlayerCardLayout {...layoutProps} />;
    case "loot":
      return <LootCardLayout {...layoutProps} />;
    default:
      return <SquareCardLayout {...layoutProps} />;
  }
}
