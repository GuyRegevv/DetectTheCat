// src/utils/draw.ts
import type { CocoPrediction } from "../hooks/useDetector";

/**
 * Draw green boxes for cats above the given threshold onto the overlay canvas.
 */

export function drawCatsOnOverlay(
  canvas: HTMLCanvasElement,
  preds: CocoPrediction[],
  threshold: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const { width: cssW, height: cssH } = canvas.getBoundingClientRect();

  // Ensure crisp rendering at current CSS size
  if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
  }

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssW, cssH);

  preds.forEach(p => {
    if (p.class !== "cat" || p.score < threshold) return;
    const [x, y, w, h] = p.bbox;

    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(46,204,113,0.95)";
    ctx.fillStyle = "rgba(46,204,113,0.15)";
    ctx.strokeRect(x, y, w, h);
    ctx.fillRect(x, y, w, h);

    const label = `cat ${(p.score * 100).toFixed(0)}%`;
    ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto";
    const textW = ctx.measureText(label).width + 10;
    ctx.fillStyle = "rgba(0,0,0,0.75)";
    ctx.fillRect(x, y - 22, textW, 20);
    ctx.fillStyle = "#fff";
    ctx.fillText(label, x + 5, y - 7);
  });

  ctx.restore();
}
