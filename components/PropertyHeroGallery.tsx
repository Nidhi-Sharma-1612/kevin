"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid2x2, X } from "lucide-react";
import { useEffect, useState } from "react";

function Lightbox({
  images,
  alt,
  startIndex,
  onClose,
}: {
  images: string[];
  alt: string;
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [images.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col bg-ink-950/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-5 py-4 text-sand-50 sm:px-8">
        <span className="text-sm font-medium">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
        >
          <X size={18} />
        </button>
      </div>

      <div className="relative flex-1 px-3 pb-3 sm:px-8 sm:pb-8">
        <div className="relative h-full w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image
                src={images[index]}
                alt={`${alt} — photo ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute top-1/2 left-4 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-sand-50 transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              className="absolute top-1/2 right-4 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-sand-50 transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-5 pb-5 sm:px-8">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-opacity ${
                i === index ? "opacity-100 ring-2 ring-amber-400" : "opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Airbnb-style hero grid: one large photo on the left, two stacked on the
// right, with a "show all photos" affordance so every photo Lodgify returns
// (a listing can easily have 30-40) is actually reachable, not just the
// first 3. Any photo in the grid opens the full lightbox at that index.
export default function PropertyHeroGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length < 3) {
    return (
      <>
        <button
          type="button"
          onClick={() => images[0] && setLightboxIndex(0)}
          className="relative block h-72 w-full overflow-hidden rounded-2xl shadow-soft sm:h-[28rem] lg:rounded-3xl"
        >
          <Image
            src={images[0]}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover"
            priority
          />
        </button>
        {lightboxIndex !== null && (
          <AnimatePresence>
            <Lightbox
              images={images}
              alt={alt}
              startIndex={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
            />
          </AnimatePresence>
        )}
      </>
    );
  }

  const [primary, second, third] = images;

  return (
    <>
      <div className="relative grid grid-cols-2 grid-rows-2 gap-3 overflow-hidden rounded-2xl lg:h-[32rem] lg:rounded-3xl">
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="relative col-span-2 row-span-2 h-72 sm:h-96 lg:col-span-1 lg:h-full"
        >
          <Image
            src={primary}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 700px"
            className="object-cover"
            priority
          />
        </button>

        <button
          type="button"
          onClick={() => setLightboxIndex(1)}
          className="relative h-36 sm:h-44 lg:h-full"
        >
          <Image
            src={second}
            alt={`${alt} — additional view`}
            fill
            sizes="(max-width: 1024px) 50vw, 350px"
            className="object-cover"
          />
        </button>

        <button
          type="button"
          onClick={() => setLightboxIndex(2)}
          className="relative h-36 sm:h-44 lg:h-full"
        >
          <Image
            src={third}
            alt={`${alt} — additional view`}
            fill
            sizes="(max-width: 1024px) 50vw, 350px"
            className="object-cover"
          />
          {images.length > 3 && (
            <span className="absolute inset-0 flex items-center justify-center bg-ink-950/45 text-sm font-semibold text-sand-50">
              +{images.length - 3} more
            </span>
          )}
        </button>

        {images.length > 1 && (
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            className="absolute right-3 bottom-3 z-10 hidden items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-ink-800 shadow-soft transition-colors hover:bg-white sm:flex"
          >
            <Grid2x2 size={15} />
            Show all {images.length} photos
          </button>
        )}
      </div>

      {images.length > 1 && (
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-ink-100 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 shadow-soft sm:hidden"
        >
          <Grid2x2 size={15} />
          Show all {images.length} photos
        </button>
      )}

      {lightboxIndex !== null && (
        <AnimatePresence>
          <Lightbox
            images={images}
            alt={alt}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        </AnimatePresence>
      )}
    </>
  );
}
