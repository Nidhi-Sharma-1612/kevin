"use client";

import { useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { PARTNER_CONTENT, type PartnerContent } from "@/lib/partner-content";
import { PARTNER_WHATSAPP, whatsappLink, type PartnerLang } from "@/lib/partner-pages";

// The admin-editable form copy. The greeting and "interested in" wording of
// the drafted message stay in code (functions can't cross to the client).
export type PartnerFormText = Pick<
  PartnerContent["form"],
  "heading" | "options" | "nameLabel" | "agencyLabel" | "messageLabel" | "submit" | "fine"
>;

// Nothing is submitted to the server: the form only drafts a WhatsApp
// message from what was ticked and typed, as the client's brief specifies
// ("aucune donnée n'est enregistrée sur cette page").
export default function PartnerContactForm({
  lang,
  text,
}: {
  lang: PartnerLang;
  text: PartnerFormText;
}) {
  const t = { ...PARTNER_CONTENT[lang].form, ...text };
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [agency, setAgency] = useState("");
  const [message, setMessage] = useState("");

  function toggle(value: string) {
    setSelected((current) =>
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    );
  }

  function send() {
    // Keep the options in the order they're listed, not the order ticked.
    const options = t.options.filter((o) => selected.includes(o.value)).map((o) => `- ${o.value}`);
    let text = t.greeting(name.trim(), agency.trim());
    if (options.length) text += `\n${t.interestedIn}\n${options.join("\n")}`;
    if (message.trim()) text += `\n\n${message.trim()}`;
    window.open(whatsappLink(PARTNER_WHATSAPP[lang], text), "_blank", "noopener");
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-ink-100 px-4 py-2.5 text-sm text-ink-800 outline-none focus:border-amber-400";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-card sm:p-8"
    >
      <fieldset>
        <legend className="font-display text-lg font-semibold text-ink-800">{t.heading}</legend>
        <div className="mt-4 grid gap-2">
          {t.options.map((option) => {
            const checked = selected.includes(option.value);
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                  checked
                    ? "border-amber-300 bg-amber-50 text-ink-800"
                    : "border-ink-100 text-ink-600 hover:border-amber-200 hover:bg-sand-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(option.value)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${
                    checked ? "border-amber-400 bg-amber-400 text-ink-900" : "border-ink-200 bg-white"
                  }`}
                >
                  {checked && <Check size={13} strokeWidth={3} />}
                </span>
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`partner-${lang}-name`} className="text-xs font-medium text-ink-500">
            {t.nameLabel}
          </label>
          <input
            id={`partner-${lang}-name`}
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`partner-${lang}-agency`} className="text-xs font-medium text-ink-500">
            {t.agencyLabel}
          </label>
          <input
            id={`partner-${lang}-agency`}
            type="text"
            autoComplete="organization"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`partner-${lang}-message`} className="text-xs font-medium text-ink-500">
          {t.messageLabel}
        </label>
        <textarea
          id={`partner-${lang}-message`}
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-ink-900 shadow-soft transition-colors hover:bg-amber-300"
      >
        <MessageCircle size={16} />
        {t.submit}
      </button>
      <p className="text-xs text-ink-400">{t.fine}</p>
    </form>
  );
}
