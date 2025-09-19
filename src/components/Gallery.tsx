export interface GalleryProps {
  items: { id: string; url: string }[];
  onClear(): void;
}

export default function Gallery({ items, onClear }: GalleryProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Gallery</h2>
        <button onClick={onClear} className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-50">
          Clear Gallery
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {items.length === 0 && <p className="text-sm text-zinc-500">No shots yet.</p>}
        {items.map(item => (
          <figure key={item.id} className="relative overflow-hidden rounded-xl bg-zinc-100">
            <img src={item.url} alt="" className="h-full w-full object-cover" />
            <a href={item.url} download className="absolute bottom-2 right-2 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs">Download</a>
          </figure>
        ))}
      </div>
    </section>
  );
}
