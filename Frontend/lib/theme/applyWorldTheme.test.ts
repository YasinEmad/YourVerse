import { describe, expect, it } from "vitest";
import { applyWorldTheme } from "./applyWorldTheme";
import { techWorldConfig } from "@/config/worlds/tech.config";
import { animeWorldConfig } from "@/config/worlds/anime.config";
import { chessWorldConfig } from "@/config/worlds/chess.config";

describe("applyWorldTheme", () => {
  it("maps every theme color to a --world-* custom property", () => {
    const vars = applyWorldTheme(techWorldConfig.theme);
    expect(vars["--world-bg"]).toBe("#101216");
    expect(vars["--world-text"]).toBe("#F2F3F5");
    expect(vars["--world-primary"]).toBe("#7CFF9E");
  });

  it("maps fonts, falling back to the body font for mono", () => {
    const vars = applyWorldTheme(techWorldConfig.theme);
    expect(vars["--world-font-heading"]).toBe("JetBrains Mono");
    expect(vars["--world-font-mono"]).toBe("JetBrains Mono");
  });

  it("maps radius scales to concrete values", () => {
    expect(applyWorldTheme(techWorldConfig.theme)["--world-radius"]).toBe("0px");
    expect(applyWorldTheme(animeWorldConfig.theme)["--world-radius"]).toBe("16px");
  });

  it("sets the color scheme from background luminance", () => {
    expect(applyWorldTheme(techWorldConfig.theme)["--world-color-scheme"]).toBe("dark");
    expect(applyWorldTheme(chessWorldConfig.theme)["--world-color-scheme"]).toBe("light");
  });
});
