import { Trash2, Download } from "lucide-react";

export interface GalleryItem {
  id: string;
  url: string;
}

export interface GalleryProps {
  items: GalleryItem[];
  onClear(): void;
}

export default function Gallery({ items, onClear }: GalleryProps) {
  if (items.length === 0) {
    return (
      <section className="card p-5 text-center text-sm text-muted">
        No photos captured yet
      </section>
    );
  }

  return (
    <section className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-medium tracking-[-0.01em]">
          Captured Photos
        </h3>
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-md border border-subtle/70 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          <Trash2 className="h-4 w-4" />
          Clear all
        </button>
      </div>

      {/* Square grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-xl border border-subtle/70 bg-white shadow-sm"
          >
            <img
              src={item.url}
              alt="Captured cat"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <a
              href={item.url}
              download={`cat-${item.id}.png`}
              className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-md border border-subtle/70 bg-white/90 px-2.5 py-1 text-xs font-medium text-zinc-700 opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
