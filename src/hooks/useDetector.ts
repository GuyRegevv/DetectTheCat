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

  return { status, error, backend, setBackend, load, detectOnce };
}
