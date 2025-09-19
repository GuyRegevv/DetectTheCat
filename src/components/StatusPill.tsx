export type PillKind = "idle" | "starting" | "running" | "denied" | "unavailable" | "error";

export default function StatusPill({ status }: { status: PillKind }) {
  const map: Record<PillKind, { text: string; cls: string }> = {
    idle: { text: "Idle", cls: "bg-zinc-200 text-zinc-700" },
    starting: { text: "Starting…", cls: "bg-amber-500 text-black" },
    running: { text: "Running", cls: "bg-green-600 text-white" },
    denied: { text: "Permission denied", cls: "bg-red-600 text-white" },
    unavailable: { text: "No camera", cls: "bg-red-600 text-white" },
    error: { text: "Error", cls: "bg-red-600 text-white" },
  };
  const { text, cls } = map[status] ?? map.idle;
  return <span className={`rounded-full px-3 py-1 text-sm font-semibold ${cls}`}>{text}</span>;
}
