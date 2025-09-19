import type { CocoPrediction } from "../hooks/useDetector";

export function drawDetectionsOverlay(
  canvas: HTMLCanvasElement,
  preds: CocoPrediction[],
  threshold: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const { width: cssW, height: cssH } = canvas.getBoundingClientRect();

  // ensure crisp rendering
  if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
  }

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssW, cssH);

  preds.forEach((p) => {
    const isCat = p.class === "cat";
    const confident = p.score >= threshold;

    // If it's a cat: require threshold; for non-cat we’ll draw regardless (so you see “not a cat” detections).
    if (isCat && !confident) return;

    const [x, y, w, h] = p.bbox;

    if (isCat) {
      // GREEN for cat
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(46,204,113,0.95)";
      ctx.fillStyle = "rgba(46,204,113,0.15)";
      ctx.strokeRect(x, y, w, h);
      ctx.fillRect(x, y, w, h);

      const label = `cat ${(p.score * 100).toFixed(0)}%`;
      drawLabel(ctx, x, y, label);
    } else {
      // RED for non-cat
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(220,38,38,0.95)";   // red-600
      ctx.fillStyle = "rgba(220,38,38,0.12)";
      ctx.strokeRect(x, y, w, h);
      ctx.fillRect(x, y, w, h);

      const label = `not a cat: ${p.class} ${(p.score * 100).toFixed(0)}%`;
      drawLabel(ctx, x, y, label);
    }
  });

  ctx.restore();
}

/** Back-compat: old function now just draws "cats above threshold" using the new renderer. */
export function drawCatsOnOverlay(
  canvas: HTMLCanvasElement,
  preds: CocoPrediction[],
  threshold: number
) {
  // Filter to cats first, then draw using the unified renderer
  const cats = preds.filter((p) => p.class === "cat" && p.score >= threshold);
  drawDetectionsOverlay(canvas, cats, threshold);
}

/** Helper to draw a dark label above the box */
function drawLabel(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.save();
  ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto";
  const paddingX = 8;
  const paddingY = 4;
  const textW = ctx.measureText(text).width;
  const boxW = Math.ceil(textW + paddingX * 2);
  const boxH = 20;

  // keep label inside the canvas (if near top)
  const labelY = y - boxH - 2 < 0 ? y + boxH + 2 : y - 2;

  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(x, labelY - boxH, boxW, boxH);
  ctx.fillStyle = "#fff";
  ctx.fillText(text, x + paddingX, labelY - paddingY);
  ctx.restore();
}
