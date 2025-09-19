export interface OverlayCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}
export default function OverlayCanvas({ canvasRef }: OverlayCanvasProps) {
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
