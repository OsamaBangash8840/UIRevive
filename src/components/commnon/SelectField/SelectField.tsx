import React from "react";

/**
 * Reusable Select/Filter Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md commnon/SelectField):
 * Allows toggling issue severity filters (All, High, Medium, Low) cleanly.
 */
interface SelectFieldProps<T extends string> {
  options: readonly T[];
  selected: T;
  onSelect: (option: T) => void;
  label?: string;
}

export function SelectField<T extends string>({
  options,
  selected,
  onSelect,
  label,
}: SelectFieldProps<T>) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={label || "Filter options"}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          aria-pressed={selected === opt}
          className={`rounded-full border px-3 py-1 text-xs sm:text-sm font-medium transition-colors ${
            selected === opt
              ? "border-foreground bg-foreground text-background"
              : "border-line bg-card hover:border-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

