import Header from "./components/Header";
import StatusPill from "./components/StatusPill"
import Stage from "./components/Stage/Stage";
import ModelPanel from "./components/ModelPanel";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";

import { useRef, useState } from "react";
import { useCamera } from "./hooks/useCamera";
import { useDetector } from "./hooks/useDetector";
import { drawDetectionsOverlay } from "./utils/draw";
import { hasCat, summarizePreds } from "./utils/predictions";
import { captureShot } from "./utils/capture";
import type { CocoPrediction } from "./hooks/useDetector";


export default function App() {
    // camera
    const { videoRef, status: camStatus, error: camError, start, stop } = useCamera();
    const running = camStatus === "running";
    // model
    const { status: mdlStatus, error: mdlError, backend, setBackend, load, detectOnce, startLive, stopLive, fps } = useDetector();

    const overlayRef = useRef<HTMLCanvasElement | null>(null)
    const [threshold, setThreshold] = useState(0.55);
    const [live, setLive] = useState(false);
    const [shots, setShots] = useState<{ id: string; url: string }[]>([]);
    const [catDetected, setCatDetected] = useState(false);
    const [lastResult, setLastResult] = useState<{cat: boolean; count: number;} | null>(null);

    const handleToggleLive = async () => {
        if (mdlStatus !== "ready" || !videoRef.current) return;
        
        if (!live) {
            // starting live
            startLive(videoRef.current,
            (preds) => {
                const has = hasCat(preds, threshold)
                setCatDetected(has);
                if (overlayRef.current) drawDetectionsOverlay(overlayRef.current, preds, threshold);
            }, 10, 2);
            setLive(true);
        } else {
            // stopping live
            stopLive();
            setLive(false);
            setCatDetected(false);
            // clear overlay
            if (overlayRef.current) {
            const ctx = overlayRef.current.getContext("2d");
            ctx?.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
            }
        }
    };

    const handleDetectOnce = async () => {
        if (!videoRef.current) return;
        const preds: CocoPrediction[] = await detectOnce(videoRef.current);
        console.log("predictions", summarizePreds(preds))
        const cat = hasCat(preds, threshold)
        setLastResult({ cat, count: preds.length });
        // draw overlay for cats only
        if (overlayRef.current) drawDetectionsOverlay(overlayRef.current, preds, threshold);
    }

    const handleCapture = () => {
        if (!videoRef.current) return;
        const url = captureShot(videoRef.current, overlayRef.current);
        if (!url) return;
        setShots(prev => [{ id: String(Date.now()), url }, ...prev]);
      }

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
                onCapture={handleCapture}
                canCapture={catDetected} // disabled until we hook detection
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
                lastSummary={lastResult}
                threshold={threshold}                
                onThreshold={(v) => setThreshold(v)} 
                live={live}                          
                onToggleLive={handleToggleLive}      
                fps={fps}                            
                onDetectOnce={handleDetectOnce}
              />
    
              <Gallery items={shots} onClear={() => setShots([])} />
            </div>
          </main>
    
          <Footer />
        </div>
      );
}
