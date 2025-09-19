import VideoSurface from "./VideoSurface";
import OverlayCanvas from "./OverlayCanvas";
import Badge from "./Badge";
import ControlBar from "./ControlBar";
import type { ReactNode } from "react";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  running: boolean;
  onStart(): void;
  onStop(): void;
  onCapture(): void;
  canCapture: boolean;
  autoCapture: boolean;
  onToggleAutoCapture(v: boolean): void;
  children?: ReactNode
  childrenBelow?: React.ReactNode; // e.g., error messages
};

export default function Stage(props: Props) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow">
      <VideoSurface videoRef={props.videoRef} />
      <OverlayCanvas canvasRef={props.canvasRef} />
      <Badge running={props.running} />
      <ControlBar
        running={props.running}
        onStart={props.onStart}
        onStop={props.onStop}
        onCapture={props.onCapture}
        canCapture={props.canCapture}
        autoCapture={props.autoCapture}
        onToggleAutoCapture={props.onToggleAutoCapture}
      />
      {props.childrenBelow}
    </div>
  );
}
