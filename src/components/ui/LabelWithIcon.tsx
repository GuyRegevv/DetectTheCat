import React from "react";

export default function LabelWithIcon({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="inline-flex items-center gap-1.5 rounded-md border border-subtle/70 bg-white px-2 py-1 text-zinc-700 shadow-sm">
        {icon}
        <span className="text-[12px] uppercase tracking-wide text-muted">{label}</span>
      </span>
      {children}
    </label>
  );
}
