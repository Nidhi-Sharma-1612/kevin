"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    question: "What time is check-in and check-out?",
    answer:
      "Check-in is from 3:00 PM and check-out by 11:00 AM. Early check-in or late check-out can often be arranged with your concierge, subject to availability.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellation terms vary by property and are confirmed at the time of booking. Your concierge will confirm the exact policy for your chosen apartment before you pay.",
  },
  {
    question: "Is there a minimum stay?",
    answer:
      "Most apartments require a minimum stay of 2–3 nights, with some properties requiring a full week during peak summer season.",
  },
  {
    question: "Do you offer airport transfers?",
    answer:
      "Yes — we can arrange private transfers to and from Málaga Airport. Just share your flight details with your concierge ahead of arrival.",
  },
  {
    question: "Are pets allowed?",
    answer:
      "Pet policies vary by apartment. Let us know when enquiring and we'll match you with a pet-friendly stay where possible.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink-100 border-t border-b border-ink-100">
      {FAQS.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-display text-base font-semibold text-ink-800 sm:text-lg">
                {faq.question}
              </span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-amber-500 transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-sm text-ink-500 sm:text-base">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
