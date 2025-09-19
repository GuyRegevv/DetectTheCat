import Button from "./ui/Button";
import Divider from "./ui/Divider";
import LabelWithIcon from "./ui/LabelWithIcon";
import { Cpu, ScanLine, Power, Gauge, Activity } from "lucide-react";

export interface ModelPanelProps {
  backend: "webgl" | "cpu";
  setBackend(v: "webgl" | "cpu"): void;

  modelStatus: "idle" | "loading" | "ready" | "error";
  modelError?: string | null;

  onLoad(): void;
  onDetectOnce(): void;
  lastSummary?: { cat: boolean; count: number } | null;

  threshold: number;
  onThreshold(v: number): void;
  live: boolean;
  onToggleLive(): void;
  fps?: number;
}

export default function ModelPanel({
  backend, setBackend,
  modelStatus, modelError,
  onLoad, onDetectOnce, lastSummary,
  threshold, onThreshold,
  live, onToggleLive, fps,
}: ModelPanelProps) {
  const loadLabel =
    modelStatus === "ready" ? "Model Ready" :
    modelStatus === "loading" ? "Loading…" :
    "Load Model";

  return (
    <section className="card p-5">
      {/* Title */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-medium tracking-[-0.01em]">Model Controls</h3>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <LabelWithIcon icon={<Cpu className="h-4 w-4 text-zinc-600" />} label="Backend">
          <select
            className="rounded-md border border-subtle/70 bg-white px-2.5 py-1.5 text-sm shadow-sm"
            value={backend}
            onChange={(e) => setBackend(e.target.value as "webgl" | "cpu")}
          >
            <option value="webgl">webgl (GPU)</option>
            <option value="cpu">cpu (debug)</option>
          </select>
        </LabelWithIcon>

        <Button onClick={onLoad} disabled={modelStatus === "loading" || modelStatus === "ready"}>
          <Power className="h-4 w-4" />
          {loadLabel}
        </Button>

        {modelError && (
          <span className="text-sm text-red-600">{modelError}</span>
        )}
      </div>

      <Divider />

      {/* Row 2: one-shot + summary */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onDetectOnce} disabled={modelStatus !== "ready"}>
          <ScanLine className="h-4 w-4" />
          Detect once
        </Button>

        <span className="text-sm text-muted">
          {lastSummary
            ? `Cat present: ${lastSummary.cat ? "Yes" : "No"} (${lastSummary.count} preds)`
            : "No result yet"}
        </span>
      </div>

      <Divider />

      <div className="flex flex-wrap items-center gap-3">
        <LabelWithIcon icon={<Gauge className="h-4 w-4 text-zinc-600" />} label="Threshold">
          <div className="flex items-center gap-2">
            <span className="w-10 text-right text-sm tabular-nums">
              {Math.round(threshold * 100)}%
            </span>
            <input
              className="h-1.5 w-40 appearance-none rounded-full bg-zinc-200 outline-none"
              type="range"
              min={0.3}
              max={0.9}
              step={0.05}
              value={threshold}
              onChange={(e) => onThreshold(parseFloat(e.target.value))}
            />
          </div>
        </LabelWithIcon>

        <Button onClick={onToggleLive} disabled={modelStatus !== "ready"} emphasis>
          <Activity className="h-4 w-4" />
          {live ? "Stop Live" : "Start Live"}
        </Button>

        {!!fps && fps > 0 && (
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-subtle/70 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 shadow-sm">
            <Activity className="h-3.5 w-3.5" />
            FPS: {fps.toFixed(1)}
          </span>
        )}
      </div>
    </section>
  );
}