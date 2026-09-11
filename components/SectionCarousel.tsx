"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function SectionCarousel({
  images,
  className = "",
  rounded = "rounded-2xl",
}: {
  images: { src: string; alt: string }[];
  className?: string;
  rounded?: string;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  function go(delta: number) {
    setDirection(delta);
    setIndex((i) => (i + delta + images.length) % images.length);
  }

  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden ${rounded} bg-ink-100 shadow-soft ${className}`}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 40 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={images[index].src}
            alt={images[index].alt}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous image"
        className="absolute top-1/2 left-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-800 shadow-soft transition-colors hover:bg-cyan-200"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next image"
        className="absolute top-1/2 right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-800 shadow-soft transition-colors hover:bg-cyan-200"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to image ${i + 1}`}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-amber-400" : "w-1.5 bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
