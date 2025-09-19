import React from "react";
import type { MouseEvent } from "react";

export default function Button({
  children,
  onClick,
  disabled,
  emphasis,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  emphasis?: boolean;
  ariaLabel?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors shadow-sm";
  const palette =
    "border-subtle/70 bg-white text-zinc-800 hover:bg-zinc-50 disabled:opacity-50";
  const accent = emphasis ? "ring-1 ring-[var(--ok)]/20" : "";

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={[base, palette, accent].join(" ")}
    >
      {children}
    </button>
  );
}
