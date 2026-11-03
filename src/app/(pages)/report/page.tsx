"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { AnalysisReport, Severity } from "@/types/report";
import { ScoreOverview } from "@/components/reportScreen/ScoreOverview";
import { CategoryGrid } from "@/components/reportScreen/CategoryGrid";
import { IssueCardList } from "@/components/reportScreen/IssueCardList";
import { BeforeAfterView } from "@/components/reportScreen/BeforeAfterView";
import { ExtractedTokensCard } from "@/components/reportScreen/ExtractedTokensCard";
import { Typography } from "@/components/commnon/typography/Typography";
import { AppLink } from "@/components/commnon/AppLink/AppLink";

/**
 * Report Page Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md (pages)/report):
 * Displays the complete audit results, including live browser inspection facts,
 * category scores, filterable UI critique issues, and section Before/After preview.
 */
export default function ReportPage() {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<Severity | "All">("All");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("uirevive:report");
      if (stored) {
        setReport(JSON.parse(stored));
      }
      setWarning(sessionStorage.getItem("uirevive:warning"));
    } catch {
      // Ignore sessionStorage parsing errors
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!report) {
    return (
      <section className="mx-auto max-w-xl px-5 py-24 text-center">
        <Typography variant="h2" className="mb-3">
          No Report Found
        </Typography>
        <Typography variant="muted" className="mb-8">
          Analyze a website from the homepage to generate a UI review.
        </Typography>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background hover:bg-accent hover:text-white transition-colors"
        >
          Analyze a Website <ArrowRight size={18} />
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <AppLink href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={16} /> New Analysis
      </AppLink>

      <ScoreOverview
        url={report.url}
        overallScore={report.overallScore}
        summary={report.summary}
        source={report.source}
        warning={warning}
      />

      <ExtractedTokensCard
        tokens={report.extractedTokens}
        screenshotUrl={report.screenshotUrl}
      />

      <CategoryGrid categories={report.categories} />

      <IssueCardList
        issues={report.issues}
        filter={filter}
        onFilterChange={setFilter}
      />

      <BeforeAfterView beforeAfter={report.beforeAfter} />
    </div>
  );
}

