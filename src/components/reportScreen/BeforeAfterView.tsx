import React, { useState } from "react";
import type { BeforeAfter } from "@/types/report";
import { Typography } from "@/components/commnon/typography/Typography";

/**
 * Before and After Section Preview Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md reportScreen/BeforeAfterView.tsx):
 * Concept comparison showing tangible before-and-after improvements.
 */
interface BeforeAfterViewProps {
  beforeAfter: BeforeAfter;
}

export const BeforeAfterView: React.FC<BeforeAfterViewProps> = ({ beforeAfter }) => {
  const [tab, setTab] = useState<"before" | "after">("before");

  return (
    <section aria-labelledby="before-after-heading" className="py-6">
      <Typography variant="h2" id="before-after-heading" className="mb-1 text-xl sm:text-2xl">
        Improvement Preview: {beforeAfter.section}
      </Typography>
      <Typography variant="muted" className="mb-6 text-sm">
        A concept refinement respecting the brand&apos;s identity.
      </Typography>

      <div className="mb-4 inline-flex rounded-lg border border-line p-1 lg:hidden" role="tablist">
        {(["before", "after"] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={tab === v}
            onClick={() => setTab(v)}
            className={`rounded-md px-4 py-1.5 text-xs sm:text-sm capitalize font-medium ${
              tab === v ? "bg-foreground text-background" : "text-muted"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={tab === "before" ? "block" : "hidden lg:block"}>
          <Typography variant="caption" className="text-muted mb-2 block">
            Before
          </Typography>
          <div className="rounded-xl border border-line bg-card p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-700">{beforeAfter.beforeTitle}</h3>
            <p className="mt-2 text-xs sm:text-sm text-gray-400 leading-relaxed">{beforeAfter.beforeBody}</p>
            <div className="mt-4 flex gap-2">
              <span className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-500">
                {beforeAfter.beforeCta}
              </span>
              <span className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-500">Contact</span>
            </div>
          </div>
        </div>

        <div className={tab === "after" ? "block" : "hidden lg:block"}>
          <Typography variant="caption" className="text-accent mb-2 block">
            After
          </Typography>
          <div className="rounded-xl border-2 border-accent bg-card p-6 sm:p-8 shadow-sm">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-tight">
              {beforeAfter.afterTitle}
            </h3>
            <p className="mt-3 max-w-md text-sm sm:text-base text-muted leading-relaxed">
              {beforeAfter.afterBody}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="rounded-lg bg-accent px-5 py-2.5 text-xs sm:text-sm font-medium text-white shadow-sm">
                {beforeAfter.afterCta}
              </span>
              <span className="text-xs sm:text-sm underline underline-offset-4 text-foreground">Contact</span>
            </div>
          </div>
        </div>
      </div>

      <ul className="mt-6 list-disc space-y-1.5 pl-5 text-xs sm:text-sm text-muted">
        {beforeAfter.changes.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </section>
  );
};

