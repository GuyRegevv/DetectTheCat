import type { MouseEvent } from "react";
import { Play, StopCircle, Camera as CameraIcon, Check } from "lucide-react";

export interface ControlBarProps {
  running: boolean;
  onStart(): void;
  onStop(): void;
  onCapture(): void;
  canCapture: boolean;
  autoCapture: boolean;
  onToggleAutoCapture(v: boolean): void;
}

export default function ControlBar({
  running,
  onStart,
  onStop,
  onCapture,
  canCapture,
  autoCapture,
  onToggleAutoCapture,
}: ControlBarProps) {
  return (
    <div
      className={[
        "absolute bottom-3 left-3 right-3",
        "flex items-center justify-between",
        "rounded-xl border border-subtle/70 bg-white/85 px-3 py-2",
        "backdrop-blur shadow-sm",
      ].join(" ")}
      role="group"
      aria-label="Camera controls"
    >
      {/* Left cluster: start/stop */}
      <div className="flex items-center gap-2">
        {!running ? (
          <Button onClick={onStart} ariaLabel="Start camera">
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">Start</span>
          </Button>
        ) : (
          <Button onClick={onStop} ariaLabel="Stop camera" variant="ghost">
            <StopCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Stop</span>
          </Button>
        )}
      </div>

      {/* Center: Capture */}
      <div className="flex items-center">
        <Button
          onClick={onCapture}
          disabled={!canCapture}
          ariaLabel={canCapture ? "Capture photo" : "Capture disabled until a cat is detected"}
          emphasis
        >
          <CameraIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Capture</span>
        </Button>
      </div>

      {/* Right cluster: Auto-capture toggle (kept for future, minimal visual) */}
      <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-muted">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={autoCapture}
          onChange={(e) => onToggleAutoCapture(e.target.checked)}
        />
        <span
          className={[
            "inline-flex h-5 w-9 items-center rounded-full border border-subtle/70 bg-white",
            "shadow-sm transition-colors peer-checked:bg-teal-600/90 peer-checked:border-teal-600/40",
          ].join(" ")}
          aria-hidden="true"
        >
          <span
            className={[
              "mx-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
              "peer-checked:translate-x-4",
            ].join(" ")}
          />
        </span>
        <span className="hidden sm:inline">Auto</span>
        {autoCapture && <Check className="h-3.5 w-3.5 text-teal-700" />}
      </label>
    </div>
  );
}

/* ---------- tiny button primitive, minimalist ---------- */

function Button({
  children,
  onClick,
  disabled,
  ariaLabel,
  emphasis = false,
  variant = "solid",
}: {
  children: React.ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  ariaLabel?: string;
  emphasis?: boolean;
  variant?: "solid" | "ghost";
}) {
  const base =
    "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors";
  const paletteSolid =
    "border-subtle bg-white hover:bg-zinc-50 text-zinc-800 disabled:opacity-50 disabled:hover:bg-white";
  const paletteGhost =
    "border-transparent bg-transparent hover:bg-zinc-50 text-zinc-700 disabled:opacity-50";
  const accent = emphasis ? "ring-1 ring-teal-600/20" : "";

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={[base, variant === "ghost" ? paletteGhost : paletteSolid, accent].join(" ")}
    >
      {children}
    </button>
  );
}
