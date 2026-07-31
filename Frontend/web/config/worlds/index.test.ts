import { describe, expect, it } from "vitest";
import { getAllWorldSlugs, getActiveWorldConfigs, getWorldConfig } from "./index";

describe("world config registry", () => {
  it("getAllWorldSlugs returns every world slug", () => {
    expect(getAllWorldSlugs()).toEqual(["tech", "gaming", "anime", "poetry", "football", "chess"]);
  });

  it("getWorldConfig returns the config for a known slug", () => {
    const config = getWorldConfig("chess");
    expect(config).toBeDefined();
    expect(config?.slug).toBe("chess");
    expect(config?.productCard.variant).toBe("square");
  });

  it("getWorldConfig returns undefined for an unknown slug", () => {
    expect(getWorldConfig("narnia")).toBeUndefined();
  });

  it("getActiveWorldConfigs returns only active worlds", () => {
    const active = getActiveWorldConfigs();
    expect(active).toHaveLength(6);
    expect(active.every((config) => config.isActive)).toBe(true);
  });
});
