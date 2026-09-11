"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

const HERO_IMAGES = [
  "https://l.icdbcdn.com/oh/278e0421-df18-464d-bc8e-9d3a01abead3.jpg?w=2080",
  "https://l.icdbcdn.com/oh/e93ed229-7334-408b-aedb-4066ad603281.jpg?w=2080",
  "https://l.icdbcdn.com/oh/972fb81b-223c-4f69-a7f5-2fabf2139599.jpg?w=2080",
];

const SLIDE_DURATION = 6000;

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative -mt-18 flex h-screen min-h-[640px] items-center justify-center overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.12 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: SLIDE_DURATION / 1000 + 1.2, ease: "easeOut" },
          }}
        >
          <Image
            src={HERO_IMAGES[index]}
            alt="Sunlit Andalusian apartment in Torremolinos"
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/25 to-ink-950/20" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-950/55 to-transparent" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 42%, rgb(15 17 19 / 0.45) 0%, rgb(15 17 19 / 0.15) 60%, transparent 100%)",
        }}
      />

      <div className="absolute right-0 bottom-6 left-0 z-20 hidden justify-center gap-2 sm:flex sm:bottom-8">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className="group py-2"
          >
            <span
              className={`block h-1 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-amber-400" : "w-4 bg-white/50 group-hover:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-5 text-center sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-950/40 px-3 py-1.5 text-xs font-semibold tracking-[0.15em] text-amber-300 uppercase backdrop-blur-sm text-shadow-hero sm:px-4 sm:text-sm sm:tracking-[0.2em]"
        >
          Torremolinos · Costa del Sol · Spain
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-5 font-display text-3xl leading-tight font-semibold text-sand-50 text-shadow-hero sm:text-6xl"
        >
          Book your holidays under the Andalusian sun
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-xl text-sm text-sand-50 text-shadow-hero sm:mt-5 sm:text-lg"
        >
          Curated apartments with sea views, private pools and a dedicated
          concierge team — the heart of vibrant, seaside Torremolinos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 w-full"
        >
          <SearchBar />
        </motion.div>
      </div>
    </section>
  );
}
