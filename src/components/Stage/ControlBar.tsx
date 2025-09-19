export interface ControlBarProps {
  running: boolean;
  onStart(): void;
  onStop(): void;
  onCapture(): void;            // will be disabled until detector is ready
  canCapture: boolean;
  autoCapture: boolean;
  onToggleAutoCapture(v: boolean): void;
}

export default function ControlBar({
  running, onStart, onStop, onCapture, canCapture,
  autoCapture, onToggleAutoCapture
}: ControlBarProps) {
  return (
    <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white/90 px-2 py-2 shadow">
      {!running ? (
        <button onClick={onStart} className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-medium hover:bg-zinc-50">
          Start Camera
        </button>
      ) : (
        <button onClick={onStop} className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-medium hover:bg-zinc-50">
          Stop
        </button>
      )}
      <button
        onClick={onCapture}
        disabled={!canCapture}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-medium hover:bg-zinc-50 disabled:opacity-50"
        title={!canCapture ? "Enable after cat detection" : "Capture"}
      >
        Capture
      </button>
      <label className="ml-2 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={autoCapture}
          onChange={(e) => onToggleAutoCapture(e.target.checked)}
        />
        Auto-capture
      </label>
    </div>
  );
}
