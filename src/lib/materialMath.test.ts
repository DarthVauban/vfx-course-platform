import { describe, expect, it } from "vitest";
import {
  evaluateMaterialCurve,
  remap,
  smoothstep,
  type MaterialCurveSettings,
} from "./materialMath";

describe("material math helpers", () => {
  it("remaps values between ranges", () => {
    expect(remap(0.5, 0, 1, -1, 1)).toBeCloseTo(0);
    expect(remap(0.25, 0, 1, 0, 4)).toBeCloseTo(1);
  });

  it("handles a zero-width input range safely", () => {
    expect(remap(0.5, 1, 1, 3, 9)).toBe(3);
  });

  it("smoothstep stays clamped and is symmetric at the midpoint", () => {
    expect(smoothstep(0.2, 0.8, 0)).toBe(0);
    expect(smoothstep(0.2, 0.8, 0.5)).toBeCloseTo(0.5);
    expect(smoothstep(0.2, 0.8, 1)).toBe(1);
  });

  it("evaluates the selected material operation", () => {
    const settings: MaterialCurveSettings = {
      operation: "power",
      inputMin: 0,
      inputMax: 1,
      outputMin: 0,
      outputMax: 1,
      exponent: 2,
      edge0: 0.2,
      edge1: 0.8,
    };

    expect(evaluateMaterialCurve(0.5, settings)).toBeCloseTo(0.25);
  });
});

