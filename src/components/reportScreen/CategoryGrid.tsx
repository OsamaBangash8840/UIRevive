import React from "react";
import type { CategoryScore } from "@/types/report";
import { Typography } from "@/components/commnon/typography/Typography";

/**
 * Category Breakdown Grid Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md reportScreen/CategoryGrid.tsx):
 * Renders the 6 core design pillars with progress bars and score badges.
 */
interface CategoryGridProps {
  categories: CategoryScore[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <section aria-labelledby="category-breakdown-heading" className="py-6">
      <Typography variant="h2" id="category-breakdown-heading" className="mb-6 text-xl sm:text-2xl">
        Score Breakdown
      </Typography>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <div key={c.key || c.label} className="rounded-xl border border-line bg-card p-5 shadow-sm">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-semibold text-sm sm:text-base">{c.label}</h3>
              <span className="font-display text-2xl font-bold">{Math.round(c.score)}</span>
            </div>
            <div
              className="my-3 h-1.5 rounded-full bg-line"
              role="progressbar"
              aria-valuenow={c.score}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{ width: `${Math.max(0, Math.min(100, c.score))}%` }}
              />
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">{c.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

