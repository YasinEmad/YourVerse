import { PresentationRow, ProductRow, resolveTitle, toBaseProductDetailDto, toProductListItemDto } from "./product.mapper";

const presentationRow: PresentationRow = {
  title: { en: "Mono Hoodie", ar: "مونو هودي" },
  subtitle: "240gsm graphite fleece",
  primaryValue: "4.9k",
  secondaryValue: "2d ago",
  imageUrl: "https://example.com/mono.png",
  accentColor: "#7CFF9E",
  badge: "New Build",
  isAvailable: true,
  product: { slug: "the-one-hoodie", basePrice: 8900, currency: "USD" },
};

describe("resolveTitle", () => {
  it("defaults to the en value", () => {
    expect(resolveTitle({ en: "Mono Hoodie", ar: "مونو هودي" })).toBe("Mono Hoodie");
  });

  it("returns the ar value when requested", () => {
    expect(resolveTitle({ en: "Mono Hoodie", ar: "مونو هودي" }, "ar")).toBe("مونو هودي");
  });

  it("survives a missing/invalid Json title", () => {
    expect(resolveTitle(null)).toBe("");
    expect(resolveTitle("not-an-object")).toBe("");
  });
});

describe("toProductListItemDto", () => {
  it("maps every ProductViewModel field", () => {
    expect(toProductListItemDto(presentationRow)).toEqual({
      slug: "the-one-hoodie",
      title: "Mono Hoodie",
      subtitle: "240gsm graphite fleece",
      primaryMeta: "4.9k",
      secondaryMeta: "2d ago",
      price: 89,
      currency: "USD",
      badge: "New Build",
      imageUrl: "https://example.com/mono.png",
      accentColor: "#7CFF9E",
      available: true,
    });
  });

  it("converts basePrice from minor units (cents) to major units", () => {
    const dto = toProductListItemDto(presentationRow);
    expect(dto.price).toBe(89);
  });

  it("honours the ar locale for the title", () => {
    expect(toProductListItemDto(presentationRow, "ar").title).toBe("مونو هودي");
  });

  it("maps null presentation fields to undefined (omitted in JSON)", () => {
    const sparse: PresentationRow = {
      ...presentationRow,
      subtitle: null,
      secondaryValue: null,
      imageUrl: null,
      accentColor: null,
      badge: null,
    };
    const dto = toProductListItemDto(sparse);
    expect(dto.subtitle).toBeUndefined();
    expect(dto.secondaryMeta).toBeUndefined();
    expect(dto.imageUrl).toBeUndefined();
    expect(dto.accentColor).toBeUndefined();
    expect(dto.badge).toBeUndefined();
  });
});

describe("toBaseProductDetailDto", () => {
  const product: ProductRow = {
    slug: "hyperion-runtime",
    baseTitle: "Hyperion Runtime",
    basePrice: 9900,
    currency: "USD",
  };

  it("returns the no-world view-model", () => {
    expect(toBaseProductDetailDto(product)).toEqual({
      slug: "hyperion-runtime",
      title: "Hyperion Runtime",
      price: 99,
      currency: "USD",
      available: true,
    });
  });
});
