export interface VideoSurfaceProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function VideoSurface({ videoRef }: VideoSurfaceProps) {
  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      playsInline
      muted
    />
  );
}
