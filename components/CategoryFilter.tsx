"use client";

import { CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected: string[];
  onChange: (categories: string[]) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  function toggle(category: string) {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-charcoal">Filter by category</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange([])}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            selected.length === 0
              ? "bg-teal text-white"
              : "bg-white text-charcoal border border-teal-100 hover:border-teal/40"
          )}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => toggle(category)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              selected.includes(category)
                ? "bg-teal text-white"
                : "bg-white text-charcoal border border-teal-100 hover:border-teal/40"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
