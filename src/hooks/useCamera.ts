import { useCallback, useEffect, useRef, useState } from "react";

type CamStatus = "idle" | "starting" | "running" | "denied" | "unavailable" | "error";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<CamStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const start = useCallback(async () => {
    if (status === "running" || status === "starting") return;
    setError(null);
    setStatus("starting");
    try {
      // Good default: 1280x720, user-facing for laptops; we’ll add rear cam toggle later
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play(); // user gesture present (button click)
      }
      setStatus("running");
    } catch (err: any) {
      console.error(err);
      if (err?.name === "NotAllowedError") setStatus("denied");
      else if (err?.name === "NotFoundError") setStatus("unavailable");
      else setStatus("error");
      setError(err?.message ?? "Camera error");
    }
  }, [status]);

  const stop = useCallback(() => {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus("idle");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => { try { stop(); } catch {} };
  }, [stop]);

  return {
    videoRef,
    status,
    error,
    hasStream: !!streamRef.current,
    start,
    stop,
  };
}
