import { describe, expect, it } from "vitest";
import { getLoyaltyProgress } from "./loyalty";

describe("getLoyaltyProgress", () => {
  it("assigns the bronze tier to low point totals", () => {
    const result = getLoyaltyProgress(120);
    expect(result.tierKey).toBe("loyalty.tiers.bronze");
    expect(result.nextTierKey).toBe("loyalty.tiers.silver");
    expect(result.pointsToNext).toBe(130);
  });

  it("assigns the silver tier between thresholds", () => {
    const result = getLoyaltyProgress(500);
    expect(result.tierKey).toBe("loyalty.tiers.silver");
    expect(result.nextTierKey).toBe("loyalty.tiers.gold");
    expect(result.pointsToNext).toBe(250);
  });

  it("assigns the gold tier at and beyond the top threshold", () => {
    expect(getLoyaltyProgress(750).tierKey).toBe("loyalty.tiers.gold");
    expect(getLoyaltyProgress(5000).tierKey).toBe("loyalty.tiers.gold");
  });

  it("reports full progress at the top tier", () => {
    const result = getLoyaltyProgress(5000);
    expect(result.nextTierKey).toBeNull();
    expect(result.pointsToNext).toBe(0);
    expect(result.progress).toBe(1);
  });

  it("clamps progress between zero and one", () => {
    expect(getLoyaltyProgress(-100).progress).toBe(0);
    expect(getLoyaltyProgress(0).progress).toBe(0);
    expect(getLoyaltyProgress(0.5).tierKey).toBe("loyalty.tiers.bronze");
  });

  it("is data-driven: a custom tier list changes behaviour without logic changes", () => {
    const tiers = [
      { minPoints: 0, tierKey: "loyalty.tiers.bronze" },
      { minPoints: 100, tierKey: "loyalty.tiers.gold" },
    ];
    const bronze = getLoyaltyProgress(50, tiers);
    expect(bronze.tierKey).toBe("loyalty.tiers.bronze");
    expect(bronze.nextTierKey).toBe("loyalty.tiers.gold");
    expect(bronze.pointsToNext).toBe(50);
    expect(bronze.progress).toBe(0.5);
  });
});
