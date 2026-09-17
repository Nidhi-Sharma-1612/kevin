"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone } from "lucide-react";

export default function CtaSection({ backgroundImage }: { backgroundImage: string }) {
  return (
    <section className="relative overflow-hidden bg-amber-400 py-20">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        whileInView={{ scale: 1.08 }}
        viewport={{ once: true }}
        transition={{ duration: 8, ease: "easeOut" }}
      >
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-amber-400/95 via-amber-400/90 to-amber-500/95" />

      <motion.div
        aria-hidden
        className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-ink-900/10 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl px-5 text-center sm:px-8"
      >
        <p className="text-sm font-semibold tracking-[0.2em] text-ink-900/70 uppercase">
          Book direct
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-5xl">
          Ready to feel the Andalusian sun?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-800/80">
          Browse our full collection of Torremolinos apartments and find
          your perfect seaside home.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/properties"
              className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-sand-50 shadow-soft transition-colors hover:bg-ink-800"
            >
              Explore all properties
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink-900 px-7 py-3.5 text-sm font-semibold text-ink-900 transition-colors hover:bg-ink-900 hover:text-sand-50"
            >
              Talk to our concierge
            </Link>
          </motion.div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-ink-900/15 pt-6 text-sm text-ink-900/70">
          <a
            href="tel:+34635861443"
            className="flex items-center gap-1.5 transition-colors hover:text-ink-900"
          >
            <Phone size={14} />
            +34 635 861 443
          </a>
          <a
            href="mailto:Contact@laconciergeriedelsol.com"
            className="flex items-center gap-1.5 transition-colors hover:text-ink-900"
          >
            <Mail size={14} />
            Contact@laconciergeriedelsol.com
          </a>
        </div>
      </motion.div>
    </section>
  );
}
