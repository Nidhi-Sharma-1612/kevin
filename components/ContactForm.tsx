"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({ replyNote }: { replyNote: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          dates: data.get("dates"),
          message: data.get("message"),
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error ?? "Could not send your message");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not send your message");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-10 text-center shadow-card sm:p-12">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-cyan-50 text-cyan-600">
          <CheckCircle2 size={24} />
        </span>
        <p className="mt-4 font-display text-lg font-semibold text-ink-800">
          Message sent
        </p>
        <p className="mt-1.5 max-w-sm text-sm text-ink-500">{replyNote}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold text-amber-600 hover:text-amber-500"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-ink-500">Name</label>
          <input
            type="text"
            name="name"
            required
            className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-amber-400"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-amber-400"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-ink-500">
            Phone (optional)
          </label>
          <input
            type="tel"
            name="phone"
            className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-amber-400"
            placeholder="+34 ..."
          />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-500">
            Dates of stay (optional)
          </label>
          <input
            type="text"
            name="dates"
            className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-amber-400"
            placeholder="e.g. 12–19 July"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-ink-500">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-amber-400"
          placeholder="Tell us about your trip..."
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Send size={15} />
        )}
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-xs text-ink-400">{replyNote}</p>
    </form>
  );
}
