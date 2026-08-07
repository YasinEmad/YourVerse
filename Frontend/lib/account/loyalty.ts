export interface LoyaltyTierConfig {
  minPoints: number;
  tierKey: string;
}

export interface LoyaltyProgress {
  tierKey: string;
  nextTierKey: string | null;
  pointsToNext: number;
  progress: number;
}

export const LOYALTY_TIERS: readonly LoyaltyTierConfig[] = [
  { minPoints: 0, tierKey: "loyalty.tiers.bronze" },
  { minPoints: 250, tierKey: "loyalty.tiers.silver" },
  { minPoints: 750, tierKey: "loyalty.tiers.gold" },
];

export function getLoyaltyProgress(
  points: number,
  tierConfig: readonly LoyaltyTierConfig[] = LOYALTY_TIERS,
): LoyaltyProgress {
  const tiers = [...tierConfig].sort((a, b) => a.minPoints - b.minPoints);

  let current = tiers[0];
  for (const tier of tiers) {
    if (points >= tier.minPoints) {
      current = tier;
    }
  }

  const nextTier = tiers.find((tier) => tier.minPoints > current.minPoints);
  if (!nextTier) {
    return {
      tierKey: current.tierKey,
      nextTierKey: null,
      pointsToNext: 0,
      progress: 1,
    };
  }

  const range = nextTier.minPoints - current.minPoints;
  const progress = Math.min(1, Math.max(0, (points - current.minPoints) / range));

  return {
    tierKey: current.tierKey,
    nextTierKey: nextTier.tierKey,
    pointsToNext: Math.max(0, nextTier.minPoints - points),
    progress,
  };
}
