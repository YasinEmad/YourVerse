import { describe, expect, it } from "vitest";
import {
  getAllMockProducts,
  getMockProduct,
  getMockProducts,
  getWorldProductSlugs,
  mockProducts,
} from "./mock-catalog";

describe("mock catalog (Product -> ProductWorld model)", () => {
  it("models the same logical product across multiple worlds", () => {
    const hoodie = mockProducts.find((product) => product.slug === "the-one-hoodie");
    expect(hoodie).toBeDefined();
    expect(Object.keys(hoodie!.worlds)).toHaveLength(6);
  });

  it("resolves a product to its world-specific presentation", () => {
    const tech = getMockProduct("the-one-hoodie", "tech");
    const gaming = getMockProduct("the-one-hoodie", "gaming");
    expect(tech?.title).toBe("Mono Hoodie");
    expect(gaming?.title).toBe("Legendary Hoodie");
    expect(tech?.primaryMeta).toBe("4.9k");
    expect(gaming?.primaryMeta).toBe("Legendary");
  });

  it("returns the base presentation when no world is given", () => {
    const base = getMockProduct("the-one-hoodie");
    expect(base?.title).toBe("The One Hoodie");
    expect(base?.primaryMeta).toBeUndefined();
  });

  it("returns undefined for a product not sold in a world", () => {
    expect(getMockProduct("neon-katana", "tech")).toBeUndefined();
  });

  it("returns undefined for an unknown product slug", () => {
    expect(getMockProduct("does-not-exist", "tech")).toBeUndefined();
  });

  it("lists world products and slugs consistently", () => {
    const slugs = getWorldProductSlugs("tech");
    expect(slugs).toContain("the-one-hoodie");
    expect(slugs).not.toContain("neon-katana");
    expect(getMockProducts("tech").map((product) => product.slug)).toEqual(slugs);
  });

  it("flattens every product once for the worldless listing", () => {
    expect(getAllMockProducts()).toHaveLength(mockProducts.length);
  });
});
