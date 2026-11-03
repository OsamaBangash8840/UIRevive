import React from "react";
import type { UIIssue, Severity } from "@/types/report";
import { COLOURS } from "@/utils/colours";
import { SelectField } from "@/components/commnon/SelectField/SelectField";
import { Typography } from "@/components/commnon/typography/Typography";

/**
 * Issue Card List Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md reportScreen/IssueCardList.tsx):
 * Filterable list of UI critique cards organized by severity.
 */
interface IssueCardListProps {
  issues: UIIssue[];
  filter: Severity | "All";
  onFilterChange: (filter: Severity | "All") => void;
}

const FILTER_OPTIONS = ["All", "High", "Medium", "Low"] as const;

export const IssueCardList: React.FC<IssueCardListProps> = ({
  issues,
  filter,
  onFilterChange,
}) => {
  const filtered = issues.filter((i) => filter === "All" || i.severity === filter);

  return (
    <section aria-labelledby="issues-list-heading" className="py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Typography variant="h2" id="issues-list-heading" className="text-xl sm:text-2xl">
          Issues &amp; Recommendations
        </Typography>
        <SelectField
          options={FILTER_OPTIONS}
          selected={filter}
          onSelect={onFilterChange}
          label="Filter issues by severity"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">
          No {filter.toLowerCase()} severity issues identified.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {filtered.map((item, idx) => (
            <li
              key={`${item.id}-${idx}`}
              className="rounded-xl border border-line bg-card p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="font-semibold text-sm sm:text-base">{item.area}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                    COLOURS.severity[item.severity]
                  }`}
                >
                  {item.severity}
                </span>
              </div>
              <p className="mb-2 text-sm text-foreground">{item.problem}</p>
              <p className="mb-3 text-xs sm:text-sm text-muted">
                <strong className="font-medium text-foreground">Why it matters: </strong>
                {item.whyItMatters}
              </p>
              <p className="rounded-lg bg-accent-soft p-3 text-xs sm:text-sm border border-line/60">
                <strong className="font-medium text-foreground">Suggestion: </strong>
                {item.suggestion}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

