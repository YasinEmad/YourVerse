import { toWorldDetailDto, toWorldSummaryDto } from "./world.mapper";

describe("world mappers", () => {
  const world = {
    slug: "poetry",
    name: { en: "The Living Diwan", ar: "الديوان الحي" },
    tagline: { en: "Ink that outlives empires.", ar: "حبرٌ يعيش أطول من الإمبراطوريات." },
    isActive: true,
  };

  it("maps a WorldSummaryDto", () => {
    expect(toWorldSummaryDto(world)).toEqual({
      slug: "poetry",
      name: { en: "The Living Diwan", ar: "الديوان الحي" },
      tagline: { en: "Ink that outlives empires.", ar: "حبرٌ يعيش أطول من الإمبراطوريات." },
      isActive: true,
    });
  });

  it("nests the world summary with products in WorldDetailDto", () => {
    const products = [{ slug: "verse-laila", title: "سَلَامٌ على الديارِ" } as never];
    const dto = toWorldDetailDto(world, products);
    expect(dto.world.slug).toBe("poetry");
    expect(dto.products).toHaveLength(1);
    expect(Object.keys(dto)).toEqual(["world", "products"]);
  });
});
