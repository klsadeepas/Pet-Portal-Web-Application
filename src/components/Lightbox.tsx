import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

export function Lightbox({
  images,
  startIndex = 0,
  open,
  onClose,
}: {
  images: string[];
  startIndex?: number;
  open: boolean;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (open) {
      setIndex(startIndex);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [open, startIndex]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 4));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.25, 1));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, prev, next, onClose]);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.5, 4));
  const zoomOut = () =>
    setZoom((z) => {
      const nz = Math.max(z - 0.5, 1);
      if (nz === 1) setPan({ x: 0, y: 0 });
      return nz;
    });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
        >
          {/* Top controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={zoomOut}
              aria-label="Zoom out"
              className="grid place-items-center h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={zoomIn}
              aria-label="Zoom in"
              className="grid place-items-center h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid place-items-center h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Counter */}
          <div className="absolute top-4 left-4 z-10 text-white/80 text-sm px-3 py-1.5 rounded-full bg-white/10">
            {index + 1} / {images.length}
          </div>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-4 md:left-8 z-10 grid place-items-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="max-w-[90vw] max-h-[85vh] overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => zoom > 1 && setDragging({ x: e.clientX - pan.x, y: e.clientY - pan.y })}
            onMouseMove={(e) => dragging && setPan({ x: e.clientX - dragging.x, y: e.clientY - dragging.y })}
            onMouseUp={() => setDragging(null)}
            onMouseLeave={() => setDragging(null)}
            style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
          >
            <img
              src={images[index]}
              alt={`Image ${index + 1}`}
              draggable={false}
              className="max-w-[90vw] max-h-[85vh] object-contain select-none transition-transform"
              style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
              onDoubleClick={() => (zoom === 1 ? zoomIn() : (setZoom(1), setPan({ x: 0, y: 0 })))}
            />
          </motion.div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-4 md:right-8 z-10 grid place-items-center h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur max-w-[90vw] overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIndex(i);
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  }}
                  className={`h-12 w-12 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                    i === index ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
