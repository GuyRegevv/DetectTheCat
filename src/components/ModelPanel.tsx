export interface ModelPanelProps {
  backend: "webgl" | "cpu";
  setBackend(v: "webgl" | "cpu"): void;

  modelStatus: "idle" | "loading" | "ready" | "error";
  modelError?: string | null;

  onLoad(): void;
  onDetectOnce(): void;
  lastSummary?: { cat: boolean; count: number } | null;

  // NEW controls for live mode + threshold + fps
  threshold: number;                 // 0.30 .. 0.90
  onThreshold(v: number): void;
  live: boolean;                     // whether live detection is running
  onToggleLive(): void;              // start/stop live loop
  fps?: number;                      // optional; show when > 0
}

export default function ModelPanel({
  backend, setBackend,
  modelStatus, modelError,
  onLoad, onDetectOnce, lastSummary,
  threshold, onThreshold,
  live, onToggleLive,
  fps
}: ModelPanelProps) {
  
  const loadLabel =
    modelStatus === "ready" ? "Model Ready" :
    modelStatus === "loading" ? "Loading…" :
    "Load Model";

  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <h3 className="text-base font-semibold">Model</h3>

      {/* Row 1: backend + load */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm">
          Backend:
          <select
            className="rounded-md border border-zinc-200 bg-white px-2 py-1"
            value={backend}
            onChange={(e) => setBackend(e.target.value as "webgl" | "cpu")}
          >
            <option value="webgl">webgl (GPU)</option>
            <option value="cpu">cpu (debug)</option>
          </select>
        </label>

        <button
          onClick={onLoad}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
          disabled={modelStatus === "loading" || modelStatus === "ready"}
        >
          {loadLabel}
        </button>

        {modelError && <span className="text-sm text-red-600">{modelError}</span>}
      </div>

      {/* Row 2: one-shot detect + summary */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={onDetectOnce}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
          disabled={modelStatus !== "ready"}
        >
          Detect once
        </button>

        <span className="text-sm text-zinc-600">
          {lastSummary
            ? `Cat present: ${lastSummary.cat ? "Yes" : "No"} (${lastSummary.count} preds)`
            : "No result yet"}
        </span>
      </div>

      {/* Row 3: threshold slider + live toggle + fps */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="text-sm">
          Threshold:{" "}
          <span className="font-medium">{Math.round(threshold * 100)}%</span>
          <input
            className="ml-2 align-middle"
            type="range"
            min={0.3}
            max={0.9}
            step={0.05}
            value={threshold}
            onChange={(e) => onThreshold(parseFloat(e.target.value))}
          />
        </label>

        <button
          onClick={onToggleLive}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
          disabled={modelStatus !== "ready"}
        >
          {live ? "Stop Live" : "Start Live"}
        </button>

        {!!fps && fps > 0 && (
          <span className="text-sm text-zinc-600">FPS: {fps.toFixed(1)}</span>
        )}
      </div>
    </section>
  );
}
