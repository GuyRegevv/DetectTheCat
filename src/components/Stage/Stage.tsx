import VideoSurface from "./VideoSurface";
import OverlayCanvas from "./OverlayCanvas";
import Badge from "./Badge";
import ControlBar from "./ControlBar";

type Props = {
  className?: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  running: boolean;
  onStart(): void;
  onStop(): void;
  onCapture(): void;
  canCapture: boolean;
  autoCapture: boolean;
  onToggleAutoCapture(v: boolean): void;
  children?: React.ReactNode;       // optional messaging below stage
};

export default function Stage({
  className,
  videoRef,
  canvasRef,
  running,
  onStart,
  onStop,
  onCapture,
  canCapture,
  autoCapture,
  onToggleAutoCapture,
  children,
}: Props) {
  return (
    <section className={["card overflow-hidden", className].filter(Boolean).join(" ")}>
      <div className="flex items-center justify-between border-b border-subtle/60 px-5 py-3">
        <div className="text-[15px] font-medium tracking-[-0.01em]">Live View</div>
        <div className="h-5" />
      </div>

      <div className="relative">
        <div className="relative h-[560px] w-full bg-black">
          <VideoSurface videoRef={videoRef} />
          <OverlayCanvas canvasRef={canvasRef} />
          <div className="absolute left-4 top-4">
            <Badge running={running} />
          </div>

          <ControlBar
            running={running}
            onStart={onStart}
            onStop={onStop}
            onCapture={onCapture}
            canCapture={canCapture}
            autoCapture={autoCapture}
            onToggleAutoCapture={onToggleAutoCapture}
          />
        </div>
      </div>

      {children ? (
        <div className="border-t border-subtle/60 bg-white px-5 py-3 text-sm text-muted">
          {children}
        </div>
      ) : null}
    </section>
  );
}
