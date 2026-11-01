"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import type { AnalysisReport, Severity } from "@/lib/types";

const severityStyle: Record<Severity, string> = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-emerald-100 text-emerald-800",
};

export default function ReportPage() {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<Severity | "All">("All");
  const [view, setView] = useState<"before" | "after">("before");

  useEffect(() => {
    try {
      const r = sessionStorage.getItem("uirevive:report");
      if (r) setReport(JSON.parse(r));
      setWarning(sessionStorage.getItem("uirevive:warning"));
    } catch {
      /* ignore corrupt data */
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  if (!report) {
    return (
      <section className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">No report yet</h1>
        <p className="mb-8 mt-3 text-muted">Analyze a website to see its UI report.</p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 text-background hover:bg-accent">
          Analyze a website <ArrowRight size={18} />
        </Link>
      </section>
    );
  }

  const issues = report.issues.filter((i) => filter === "All" || i.severity === filter);
  const ba = report.beforeAfter;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={16} /> New analysis
      </Link>

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-line bg-accent-soft p-4 text-sm" role="note">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-accent" />
        <p>
          {report.source === "ollama"
            ? "AI-generated estimate from the URL only. Your site was not fetched or scanned, so treat these as suggestions, not measurements."
            : "Sample data. This is a demo report and was not measured from your website."}
          {warning && <span className="block text-muted">{warning}</span>}
        </p>
      </div>

      <header className="grid gap-8 py-8 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 border-accent bg-card">
          <span className="font-display text-5xl font-semibold">{Math.round(report.overallScore)}</span>
          <span className="text-xs uppercase tracking-widest text-muted">of 100</span>
        </div>
        <div>
          <h1 className="font-display break-all text-3xl font-semibold">{report.url}</h1>
          <p className="mt-2 max-w-2xl text-muted">{report.summary}</p>
        </div>
      </header>

      <section aria-labelledby="cats" className="py-8">
        <h2 id="cats" className="font-display mb-6 text-2xl font-semibold">Score breakdown</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {report.categories.map((c) => (
            <div key={c.label} className="rounded-xl border border-line bg-card p-5">
              <div className="flex items-baseline justify-between">
                <h3 className="font-medium">{c.label}</h3>
                <span className="font-display text-2xl">{Math.round(c.score)}</span>
              </div>
              <div className="my-3 h-1.5 rounded-full bg-line" role="progressbar" aria-valuenow={c.score} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${Math.max(0, Math.min(100, c.score))}%` }} />
              </div>
              <p className="text-sm text-muted">{c.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="issues" className="py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 id="issues" className="font-display text-2xl font-semibold">Issues &amp; recommendations</h2>
          <div className="flex gap-2" role="group" aria-label="Filter by severity">
            {(["All", "High", "Medium", "Low"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  filter === f ? "border-foreground bg-foreground text-background" : "border-line hover:border-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        {issues.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">No {filter.toLowerCase()} severity issues.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {issues.map((i, idx) => (
              <li key={`${i.id}-${idx}`} className="rounded-xl border border-line bg-card p-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="font-semibold">{i.area}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${severityStyle[i.severity]}`}>{i.severity}</span>
                </div>
                <p className="mb-2">{i.problem}</p>
                <p className="mb-3 text-sm text-muted"><strong className="font-medium text-foreground">Why it matters: </strong>{i.whyItMatters}</p>
                <p className="rounded-lg bg-accent-soft p-3 text-sm"><strong className="font-medium">Suggestion: </strong>{i.suggestion}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="ba" className="py-8">
        <h2 id="ba" className="font-display mb-2 text-2xl font-semibold">Improvement preview: {ba.section}</h2>
        <p className="mb-6 text-sm text-muted">A concept example, not a modification of your website.</p>

        <div className="mb-4 inline-flex rounded-lg border border-line p-1 lg:hidden" role="tablist">
          {(["before", "after"] as const).map((v) => (
            <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)}
              className={`rounded-md px-4 py-1.5 text-sm capitalize ${view === v ? "bg-foreground text-background" : ""}`}>
              {v}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className={view === "before" ? "block" : "hidden lg:block"}>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted">Before</p>
            <div className="rounded-xl border border-line bg-card p-8">
              <h3 className="text-xl font-bold text-gray-700">{ba.beforeTitle}</h3>
              <p className="mt-2 text-[13px] text-gray-400">{ba.beforeBody}</p>
              <div className="mt-4 flex gap-2">
                <span className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-500">{ba.beforeCta}</span>
                <span className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-500">Contact</span>
              </div>
            </div>
          </div>
          <div className={view === "after" ? "block" : "hidden lg:block"}>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">After</p>
            <div className="rounded-xl border-2 border-accent bg-card p-8">
              <h3 className="font-display text-3xl font-semibold leading-tight">{ba.afterTitle}</h3>
              <p className="mt-3 max-w-md text-base text-muted">{ba.afterBody}</p>
              <span className="mt-6 inline-block rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white">{ba.afterCta}</span>
              <span className="ml-4 text-sm underline underline-offset-4">Contact</span>
            </div>
          </div>
        </div>

        <ul className="mt-6 list-disc space-y-1 pl-5 text-muted">
          {ba.changes.map((c) => (<li key={c}>{c}</li>))}
        </ul>
      </section>
    </div>
  );
}

