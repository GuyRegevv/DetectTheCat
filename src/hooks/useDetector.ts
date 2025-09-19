import { useCallback, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

type LoadStatus = "idle" | "loading" | "ready" | "error";
export type CocoPrediction = cocoSsd.DetectedObject;

export function useDetector() {
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [backend, setBackend] = useState<"webgl" | "cpu">("webgl");

  // realtime loop internals
  const rafIdRef = useRef<number | null>(null);
  const [fps, setFps] = useState<number>(0);
  const lastTsRef = useRef<number>(0);
  const emaRef = useRef<number | null>(null);

  const load = useCallback(async () => {
    if (status === "ready" && modelRef.current) return;
    setStatus("loading");
    setError(null);
    try {
      console.log("0/3 started loading model")
      await tf.setBackend(backend);
      console.log("1/3 backend is ready")
      await tf.ready();
      console.log("2/3 tf is ready")
      const model = await cocoSsd.load({ base: "lite_mobilenet_v2" }); // fast backbone
      console.log("3/3 model is ready")
      modelRef.current = model;
      setStatus("ready");
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Model load failed");
      setStatus("error");
    }
  }, [backend, status]);

  const detectOnce = useCallback(async (videoEl: HTMLVideoElement, maxResults = 10) => {
    if (!modelRef.current) throw new Error("Model not loaded");
    const preds = await modelRef.current.detect(videoEl, maxResults);
    return preds as CocoPrediction[];
  }, []);

    // Start a simple rAF loop: call onResult(preds) each frame (or every other frame if you want)
    const startLive = useCallback((
      videoEl: HTMLVideoElement,
      onResult: (preds: CocoPrediction[]) => void,
      maxResults = 10,
      throttleEveryNFrames = 1
    ) => {
      if (!modelRef.current) throw new Error("Model not loaded");
      if (rafIdRef.current) return; // already running
  
      let frame = 0;
  
      const tick = async (ts: number) => {
        // FPS calc (EMA)
        if (lastTsRef.current) {
          const dt = ts - lastTsRef.current;
          const inst = 1000 / dt;
          emaRef.current = emaRef.current == null ? inst : 0.9 * emaRef.current + 0.1 * inst;
          setFps(Number(emaRef.current.toFixed(1)));
        }
        lastTsRef.current = ts;
  
        try {
          if (frame % throttleEveryNFrames === 0) {
            const preds = await modelRef.current!.detect(videoEl, maxResults);
            onResult(preds as CocoPrediction[]);
          }
          frame++;
        } catch (e) {
          console.error("live detect error:", e);
        }
        rafIdRef.current = requestAnimationFrame(tick);
      };
  
      rafIdRef.current = requestAnimationFrame(tick);
    }, []);

      /** Stop the real-time loop and reset FPS. */
    const stopLive = useCallback(() => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      setFps(0);
      lastTsRef.current = 0;
      emaRef.current = null;
    }, []);


  return { 
    // model + one-shot
    status, error, backend, setBackend, load, detectOnce,
    // live loop
    startLive, stopLive, fps,
  };
}
