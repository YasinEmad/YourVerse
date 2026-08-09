import { clampLimit } from "./pagination";

describe("clampLimit", () => {
  it("defaults to 50 when absent", () => {
    expect(clampLimit(undefined)).toBe(50);
    expect(clampLimit(null)).toBe(50);
    expect(clampLimit(Number.NaN)).toBe(50);
  });

  it("clamps to the 1-100 range", () => {
    expect(clampLimit(0)).toBe(1);
    expect(clampLimit(-5)).toBe(1);
    expect(clampLimit(101)).toBe(100);
    expect(clampLimit(1000)).toBe(100);
  });

  it("truncates non-integers and passes through valid limits", () => {
    expect(clampLimit(12.9)).toBe(12);
    expect(clampLimit(42)).toBe(42);
  });
});
