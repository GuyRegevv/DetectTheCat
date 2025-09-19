import { Circle, Ban, WebcamIcon as Webcam, AlertCircle, PauseCircle } from "lucide-react";

export type PillKind = "idle" | "starting" | "running" | "denied" | "unavailable" | "error";

const styles: Record<PillKind, { label: string; icon: any; cls: string }> = {
  idle:         { label: "Idle",               icon: Circle,      cls: "border-subtle text-muted bg-white" },
  starting:     { label: "Starting",           icon: PauseCircle, cls: "border-subtle text-zinc-700 bg-white" },
  running:      { label: "Live",               icon: Webcam,      cls: "border-subtle bg-white text-teal-700" },
  denied:       { label: "Permission denied",  icon: Ban,         cls: "border-red-200 bg-white text-red-700" },
  unavailable:  { label: "No camera",          icon: AlertCircle, cls: "border-red-200 bg-white text-red-700" },
  error:        { label: "Error",              icon: AlertCircle, cls: "border-red-200 bg-white text-red-700" },
};

export default function StatusPill({ status }: { status: PillKind }) {
  const s = styles[status] ?? styles.idle;
  const Icon = s.icon;
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        "shadow-sm", s.cls,
      ].join(" ")}
    >
      <Icon className="h-3.5 w-3.5" />
      {s.label}
    </span>
  );
}
