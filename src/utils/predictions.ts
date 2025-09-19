// src/utils/predictions.ts
import type { CocoPrediction } from "../hooks/useDetector";

export function hasCat(preds: CocoPrediction[], threshold: number): boolean {
  return preds.some((p) => p.class === "cat" && p.score >= threshold);
}

export function summarizePreds(preds: CocoPrediction[]): string[] {
  return preds.map((p) => `${p.class} (${(p.score * 100).toFixed(1)}%)`);
}
