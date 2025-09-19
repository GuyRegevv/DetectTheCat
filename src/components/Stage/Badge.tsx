export interface BadgeProps {
  running: boolean;
}

export default function Badge({ running }: BadgeProps) {
  const text = running ? "Camera On" : "Cat Required";
  const cls = running ? "bg-green-600 text-white" : "bg-amber-500/95 text-black";
  return (
    <div className={`absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-semibold ${cls}`}>
      {text}
    </div>
  );
}