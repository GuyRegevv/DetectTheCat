/**
 * Capture the current video frame + overlay into a PNG data URL.
 * Returns null if capture failed.
 */
export function captureShot(videoEl: HTMLVideoElement, overlayEl?: HTMLCanvasElement | null): string | null {
    const rect = videoEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));

    const tmp = document.createElement("canvas");
    tmp.width = w;
    tmp.height = h;
    const tctx = tmp.getContext("2d");
    if (!tctx) return null;

    tctx.save();
    tctx.scale(dpr, dpr);
    tctx.drawImage(videoEl, 0, 0, rect.width, rect.height);

    if (overlayEl) {
      tctx.drawImage(overlayEl, 0, 0, w, h);
    }
    tctx.restore();

    return tmp.toDataURL("image/png");
}
