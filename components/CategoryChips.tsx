"use client";

import { EVENT_CATEGORY_LIST } from "@/lib/eventCategories";
import type { EventCategoryKey } from "@/lib/eventCategories";

interface CategoryChipsProps {
  selected: EventCategoryKey[];
  onChange: (categories: EventCategoryKey[]) => void;
  compact?: boolean;
}

export function CategoryChips({ selected, onChange, compact }: CategoryChipsProps) {
  const toggle = (key: EventCategoryKey) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "" : "p-1"}`} role="group" aria-label="Filter by event type">
      {EVENT_CATEGORY_LIST.map((cat) => {
        const active = selected.includes(cat.key);
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => toggle(cat.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
              active
                ? "scale-105 text-white shadow-md"
                : "border border-teal-100 bg-white/95 text-charcoal/70 hover:border-teal/30"
            }`}
            style={active ? { backgroundColor: cat.color } : undefined}
          >
            {cat.label}
          </button>
        );
      })}
      {selected.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="rounded-full px-3 py-1.5 text-xs font-semibold text-charcoal/50 underline-offset-2 hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}
