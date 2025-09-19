export interface BadgeProps {
  running: boolean;
}

export default function Badge({ running }: BadgeProps) {
  const text = running ? "Camera On - Cat Required" : "Camera Off";
  const cls = running
    ? "bg-[var(--ok)] text-white"
    : "bg-[var(--warn)] text-zinc-800";

  return (
    <div
      className={[
        "absolute left-4 top-4",
        "inline-flex items-center justify-center whitespace-nowrap",
        "rounded-md border border-subtle/70 shadow-sm",
        "px-4 py-1.5 text-sm font-medium",
        cls,
      ].join(" ")}
    >
      {text}
    </div>
  );
}
