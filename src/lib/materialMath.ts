import { clamp } from "./format";

export type MaterialOperation = "remap" | "power" | "smoothstep";

export interface MaterialCurveSettings {
  operation: MaterialOperation;
  inputMin: number;
  inputMax: number;
  outputMin: number;
  outputMax: number;
  exponent: number;
  edge0: number;
  edge1: number;
}

export function remap(
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
) {
  if (inputMin === inputMax) return outputMin;
  const normalized = (value - inputMin) / (inputMax - inputMin);
  return outputMin + normalized * (outputMax - outputMin);
}

export function smoothstep(edge0: number, edge1: number, value: number) {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const normalized = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
}

export function evaluateMaterialCurve(
  value: number,
  settings: MaterialCurveSettings,
) {
  if (settings.operation === "power") {
    return Math.pow(clamp(value, 0, 1), settings.exponent);
  }

  if (settings.operation === "smoothstep") {
    return smoothstep(settings.edge0, settings.edge1, value);
  }

  return remap(
    value,
    settings.inputMin,
    settings.inputMax,
    settings.outputMin,
    settings.outputMax,
  );
}

