"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const starContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const starItem = {
  hidden: { opacity: 0, scale: 0, rotate: -45 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 400, damping: 15 },
  },
} as const;

export default function TestimonialCard({
  quote,
  name,
  detail,
}: {
  quote: string;
  name: string;
  detail: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-sand-50 p-6 shadow-card transition-shadow duration-300 hover:shadow-soft"
    >
      <Quote
        size={64}
        className="absolute -top-2 -right-2 text-amber-400/10 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
        fill="currentColor"
        strokeWidth={0}
      />

      <motion.div
        variants={starContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative flex gap-0.5 text-amber-400"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span key={i} variants={starItem}>
            <Star size={14} fill="currentColor" strokeWidth={0} />
          </motion.span>
        ))}
      </motion.div>

      <p className="relative mt-4 flex-1 text-sm text-ink-600 italic">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="relative mt-5 flex items-center gap-3 border-t border-ink-100 pt-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-100 font-display text-sm font-semibold text-amber-700 transition-colors duration-300 group-hover:bg-amber-400 group-hover:text-white">
          {name.charAt(0)}
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-ink-800">
            {name}
          </span>
          <span className="block text-xs text-ink-500">{detail}</span>
        </span>
      </div>
    </motion.div>
  );
}
