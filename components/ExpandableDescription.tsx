"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const COLLAPSED_HEIGHT = 340;

// The full Lodgify description (see property-description styling in
// globals.css) can run to 40+ short paragraphs for some listings — this
// clips it to a fixed height with a fade-out and a toggle, rather than
// dumping the whole thing into the page by default.
export default function ExpandableDescription({ html }: { html: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className="relative overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: expanded ? 20000 : COLLAPSED_HEIGHT }}
      >
        <div
          className="property-description"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!expanded && (
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-sand-50 to-transparent" />
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-500"
      >
        {expanded ? (
          <>
            Show less <ChevronUp size={15} />
          </>
        ) : (
          <>
            Show more <ChevronDown size={15} />
          </>
        )}
      </button>
    </div>
  );
}
