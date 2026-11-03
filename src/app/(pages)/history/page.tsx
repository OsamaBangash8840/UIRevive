"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar } from "lucide-react";
import { fetchRecentReports } from "@/utils/apiClient";
import { Typography } from "@/components/commnon/typography/Typography";
import { AppLink } from "@/components/commnon/AppLink/AppLink";

/**
 * Past Audits History Page Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md (pages)/history):
 * Showcases reports persisted in Neon.tech PostgreSQL database.
 */
export default function HistoryPage() {
  const [reports, setReports] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentReports()
      .then((data) => setReports(data))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <AppLink href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft size={16} /> Back to Home
      </AppLink>

      <Typography variant="h2" className="mb-2">
        Audit History &amp; Relational SQL Records
      </Typography>
      <Typography variant="muted" className="mb-8 max-w-2xl text-sm">
        UI audit reports stored relationally in Neon.tech PostgreSQL (using normalized tables with foreign keys and indexes).
      </Typography>

      {loading ? (
        <p className="text-muted text-sm">Loading recent audits from Neon.tech PostgreSQL...</p>
      ) : reports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line p-10 text-center">
          <Typography variant="h3" className="mb-2 text-base">
            No audits recorded yet
          </Typography>
          <Typography variant="muted" className="mb-6 text-sm">
            Run an analysis from the home page to persist reports in Neon.tech PostgreSQL.
          </Typography>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-xs font-medium text-background hover:bg-accent hover:text-white"
          >
            Run an Analysis
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((item) => (
            <div key={item.id} className="rounded-xl border border-line bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm truncate max-w-[180px]">{item.domain || item.url}</span>
                <span className="font-display text-xl font-bold text-accent">{item.overallScore}</span>
              </div>
              <p className="text-xs text-muted line-clamp-2 leading-relaxed">{item.summary}</p>
              <div className="flex items-center justify-between pt-2 border-t border-line text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
                </span>
                <span className="text-foreground font-medium flex items-center gap-1">
                  {item.issueCount ?? 6} issues <ExternalLink size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

