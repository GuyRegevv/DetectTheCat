export interface ModelPanelProps {
  backend: "webgl" | "cpu";
  setBackend(v: "webgl" | "cpu"): void;
  modelStatus: "idle" | "loading" | "ready" | "error";
  modelError?: string | null;
  onLoad(): void;
  onDetectOnce(): void;
  lastSummary?: { cat: boolean; count: number } | null;
}

export default function ModelPanel({
  backend, setBackend, modelStatus, modelError, onLoad, onDetectOnce, lastSummary
}: ModelPanelProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <h3 className="text-base font-semibold">Model</h3>
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
          {modelStatus === "ready" ? "Model Ready" : modelStatus === "loading" ? "Loading…" : "Load Model"}
        </button>

        {modelError && <span className="text-sm text-red-600">{modelError}</span>}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onDetectOnce}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-50"
          disabled={modelStatus !== "ready"}
        >
          Detect once
        </button>
        <span className="text-sm text-zinc-600">
          {lastSummary ? `Cat present: ${lastSummary.cat ? "Yes" : "No"} (${lastSummary.count} preds)` : "No result yet"}
        </span>
      </div>
    </section>
  );
}
