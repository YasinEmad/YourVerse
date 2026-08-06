import { describe, expect, it } from "vitest";
import { worldConfigs } from "./index";
import {
  contrastRatio,
  MIN_CONTRAST_RATIO,
  relativeLuminance,
  worldConfigSchema,
} from "./world-config.schema";
import { techWorldConfig } from "./tech.config";

describe("worldConfigSchema", () => {
  it("validates all six world configs against the schema", () => {
    expect(worldConfigs).toHaveLength(6);
    for (const config of worldConfigs) {
      const result = worldConfigSchema.safeParse(config);
      expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
    }
  });

  it("enforces the WCAG 2.1 AA contrast refinement for every config", () => {
    for (const config of worldConfigs) {
      const textRatio = contrastRatio(config.theme.textColor, config.theme.colors.bg);
      const mutedRatio = contrastRatio(config.theme.textMutedColor, config.theme.colors.bg);
      expect(textRatio, `${config.slug} textColor`).toBeGreaterThanOrEqual(MIN_CONTRAST_RATIO);
      expect(mutedRatio, `${config.slug} textMutedColor`).toBeGreaterThanOrEqual(MIN_CONTRAST_RATIO);
    }
  });

  it("rejects a config whose textColor fails contrast against its background", () => {
    const invalid = {
      ...techWorldConfig,
      theme: {
        ...techWorldConfig.theme,
        textColor: techWorldConfig.theme.colors.bg,
      },
    };
    const result = worldConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    const issue = result.success ? undefined : result.error.issues[0];
    expect(issue?.path.join(".")).toBe("theme.textColor");
    expect(issue?.message).toContain("WCAG 2.1 AA");
  });

  it("checks every text color against every background surface", () => {
    for (const config of worldConfigs) {
      for (const textColorKey of ["textColor", "textMutedColor"] as const) {
        for (const bgColorKey of ["bg", "bgAlt", "surface"] as const) {
          const ratio = contrastRatio(config.theme[textColorKey], config.theme.colors[bgColorKey]);
          expect(ratio, `${config.slug} ${textColorKey} on ${bgColorKey}`).toBeGreaterThanOrEqual(
            MIN_CONTRAST_RATIO,
          );
        }
      }
    }
  });

  it("rejects a muted color that passes against bg but fails against surface", () => {
    const invalid = {
      ...techWorldConfig,
      theme: {
        ...techWorldConfig.theme,
        textMutedColor: "#7E7E7E",
      },
    };
    const result = worldConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    const issue = result.success
      ? undefined
      : result.error.issues.find((i) => i.path.join(".") === "theme.textMutedColor");
    expect(issue).toBeDefined();
    expect(issue?.message).toContain("against surface");
    expect(issue?.message).toMatch(/contrast ratio \d+\.\d+:1/);
  });
});

describe("contrast helpers", () => {
  it("computes relative luminance per WCAG", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#FFFFFF")).toBe(1);
  });

  it("computes contrast ratios correctly", () => {
    expect(contrastRatio("#FFFFFF", "#000000")).toBe(21);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBe(1);
  });
});
