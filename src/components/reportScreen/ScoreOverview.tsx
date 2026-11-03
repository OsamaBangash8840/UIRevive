import React from "react";
import { AlertCircle } from "lucide-react";
import { Typography } from "@/components/commnon/typography/Typography";

/**
 * Score Overview Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md reportScreen/ScoreOverview.tsx):
 * Visual score dial, overall verdict summary, and provenance badge.
 */
interface ScoreOverviewProps {
  url: string;
  overallScore: number;
  summary: string;
  source: string;
  warning?: string | null;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({
  url,
  overallScore,
  summary,
  source,
  warning,
}) => {
  return (
    <div>
      <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-line bg-accent-soft p-4 text-sm" role="note">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-accent" />
        <div>
          <p className="font-medium text-foreground">
            {source === "ollama"
              ? "Live AI Analysis completed via Express Backend & Neon.tech PostgreSQL."
              : "Demo sample report generated with deterministic heuristics."}
          </p>
          {warning && <p className="mt-1 text-xs text-muted">{warning}</p>}
        </div>
      </div>

      <header className="grid gap-8 py-6 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 border-accent bg-card shadow-sm">
          <span className="font-display text-5xl font-semibold">{Math.round(overallScore)}</span>
          <span className="text-xs uppercase tracking-widest text-muted">of 100</span>
        </div>
        <div>
          <Typography variant="h2" className="break-all mb-2 text-2xl sm:text-3xl">
            {url}
          </Typography>
          <Typography variant="body" className="max-w-2xl text-muted text-base leading-relaxed">
            {summary}
          </Typography>
        </div>
      </header>
    </div>
  );
};

