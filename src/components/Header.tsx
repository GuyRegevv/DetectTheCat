import { Camera } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-subtle/50 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-subtle/70 bg-white shadow-sm">
            <Camera className="h-5 w-5 text-zinc-700" />
          </div>
          <div className="leading-tight">
            <h1 className="text-[17px] font-semibold tracking-[-0.01em]">
              Cat-Only Photobooth
            </h1>
            <p className="text-xs text-muted">
              Minimal, on-device computer vision
            </p>
          </div>
        </div>
        {/* right side reserved for future links/buttons */}
        <div className="h-6" />
      </div>
    </header>
  );
}
