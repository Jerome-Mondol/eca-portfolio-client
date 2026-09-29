"use client";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getImageUrl } from "@/lib/upload";

export function ImageSlider({ images, onRemove, editable = false }: { images: string[]; onRemove?: (idx: number) => void; editable?: boolean }) {
  const [idx, setIdx] = useState(0);
  const touchStart = useRef<number | null>(null);

  if (!images || images.length === 0) return null;

  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStart.current = null;
  };

  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface-2 aspect-[16/10]" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <img src={getImageUrl(images[idx])} alt={`ECA image ${idx + 1}`} className="h-full w-full object-cover" />
        {editable && onRemove && (
          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(idx); }} className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer backdrop-blur-sm" aria-label="Remove image">
            <X size={12} />
          </button>
        )}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          {idx + 1} / {images.length}
        </div>
        {images.length > 1 && (
          <>
            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/90 border border-border shadow-sm flex items-center justify-center hover:bg-card cursor-pointer opacity-0 group-hover:opacity-100 transition" aria-label="Previous">
              <ChevronLeft size={14} />
            </button>
            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-card/90 border border-border shadow-sm flex items-center justify-center hover:bg-card cursor-pointer opacity-0 group-hover:opacity-100 transition" aria-label="Next">
              <ChevronRight size={14} />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {images.map((_, i) => (
            <button key={i} type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdx(i); }} className={`h-1.5 rounded-full transition cursor-pointer ${i === idx ? "bg-primary-strong w-4" : "bg-[#e8e8ea] w-1.5 hover:bg-[#d0d0d6]"}`} aria-label={`Go to ${i + 1}`} />
          ))}
        </div>
      )}
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <div key={i} className="relative group/thumb shrink-0">
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdx(i); }} className={`h-12 w-16 rounded-lg border overflow-hidden cursor-pointer block ${i === idx ? "border-primary-strong ring-1 ring-primary-strong" : "border-border hover:border-border-strong"}`}>
                <img src={getImageUrl(img)} alt={`thumb ${i + 1}`} className="h-full w-full object-cover" />
              </button>
              {editable && onRemove && (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(i); }}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary-strong text-white border border-white shadow-sm flex items-center justify-center hover:bg-red-600 cursor-pointer transition opacity-100 sm:opacity-0 sm:group-hover/thumb:opacity-100"
                  aria-label={`Remove image ${i + 1}`}
                >
                  <X size={10} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ImageGridPreview({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;
  if (images.length === 1) {
    return <img src={getImageUrl(images[0])} alt="ECA" className="h-32 w-full object-cover rounded-xl border border-border" />;
  }
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {images.slice(0, 3).map((img, i) => (
        <div key={i} className={`relative overflow-hidden rounded-xl border border-border ${i === 0 ? "col-span-2 row-span-2 h-32" : "h-[62px]"}`}>
          <img src={getImageUrl(img)} alt={`ECA ${i + 1}`} className="h-full w-full object-cover" />
          {i === 2 && images.length > 3 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-medium">+{images.length - 3}</div>
          )}
        </div>
      ))}
    </div>
  );
}
