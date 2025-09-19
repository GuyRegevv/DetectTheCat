import Header from "./components/Header";
import StatusPill from "./components/StatusPill"
import Stage from "./components/Stage/Stage";
import ModelPanel from "./components/ModelPanel";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";

import { useRef, useState } from "react";
import { useCamera } from "./hooks/useCamera";
import { useDetector } from "./hooks/useDetector";
import type { CocoPrediction } from "./hooks/useDetector";

export default function App() {
    // camera
    const { videoRef, status: camStatus, error: camError, start, stop } = useCamera();
    const running = camStatus === "running";
    // model
    const { status: mdlStatus, error: mdlError, backend, setBackend, load, detectOnce } = useDetector();
    //overlay (detections)
    const overlayRef = useRef<HTMLCanvasElement | null>(null)
    const [lastResult, setLastResult] = useState<{
        cat: boolean;
        count: number;
      } | null>(null);
    const [shots, setShots] = useState<{ id: string; url: string }[]>([]);

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
          <Header />
    
          {/* status bar */}
          <div className="mx-auto max-w-6xl p-4 flex items-center justify-end">
            <StatusPill status={camStatus as any} />
          </div>
    
          <main className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-3">
            {/* left: stage */}
            <div className="lg:col-span-2">
            <Stage
                videoRef={videoRef}
                canvasRef={overlayRef}
                running={running}
                onStart={start}
                onStop={stop}
                onCapture={() => {
                    // later: implement capture → add to shots[]
                    alert("Capture pressed (stub)");
                }}
                canCapture={false} // disabled until we hook detection
                autoCapture={false}
                onToggleAutoCapture={() => {}}
                >
                {/* childrenBelow slot */}
                {camError && (
                    <p className="mt-2 text-sm text-red-600">
                    {camError} — Ensure HTTPS/localhost and that no other app uses the
                    camera.
                    </p>
                )}
                </Stage>
            </div>
    
            {/* right column: model + gallery */}
            <div className="space-y-4">
              <ModelPanel
                backend={backend}
                setBackend={setBackend}
                modelStatus={mdlStatus}
                modelError={mdlError}
                onLoad={load}
                onDetectOnce={async () => {
                  if (!videoRef.current) return;
                  const preds: CocoPrediction[] = await detectOnce(videoRef.current);
                  const cat = preds.some(
                    (p) => p.class === "cat" && p.score >= 0.55
                  );
                  setLastResult({ cat, count: preds.length });
                  console.log("predictions", preds);
                  console.log(preds.map(p => `${p.class} (${(p.score * 100).toFixed(1)}%)`));
                }}
                lastSummary={lastResult}
              />
    
              <Gallery items={shots} onClear={() => setShots([])} />
            </div>
          </main>
    
          <Footer />
        </div>
      );
}
