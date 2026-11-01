"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { UrlForm } from "@/components/UrlForm";
import { normalizeUrl } from "@/lib/validate";
import { getMockReport } from "@/lib/mock-report";

const STEPS = [
  "Preparing the request",
  "Reviewing visual hierarchy",
  "Checking typography and color",
  "Evaluating spacing and layout",
  "Drafting recommendations",
];

export function AnalyzeClient() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("url") ?? "";
  const parsed = raw ? normalizeUrl(raw) : null;
  const url = parsed?.ok ? parsed.url : null;

  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!url || started.current) return;
    started.current = true;

    const timer = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1100);
    const minDelay = new Promise((r) => setTimeout(r, 4500));

    const request = fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.report) throw new Error(data.error || "Request failed");
        return data as { report: unknown; warning?: string };
      })
      .catch(() => ({ report: getMockReport(url), warning: "Could not reach the analysis service. Showing sample data." }));

    Promise.all([request, minDelay]).then(([data]) => {
      clearInterval(timer);
      setStep(STEPS.length);
      sessionStorage.setItem("uirevive:report", JSON.stringify(data.report));
      if (data.warning) sessionStorage.setItem("uirevive:warning", data.warning);
      else sessionStorage.removeItem("uirevive:warning");
      router.push("/report");
    });

    return () => clearInterval(timer);
  }, [url, router]);

  if (!url) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-20">
        <h1 className="font-display text-3xl font-semibold">Analyze a website</h1>
        <p className="mb-8 mt-3 text-muted">
          {raw ? "That URL doesn't look valid. Please try again." : "Enter a URL to generate a UI report."}
        </p>
        <UrlForm initial={raw} />
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
      <div>
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">Analyzing</p>
        <h1 className="font-display break-all text-3xl font-semibold">{url}</h1>
        <p className="mt-3 text-muted">
          Prototype: this is an AI-generated estimate from the URL. Your site isn&apos;t actually fetched or scanned.
        </p>
        <ul className="mt-8 space-y-3" aria-live="polite">
          {STEPS.map((label, i) => (
            <li key={label} className={`flex items-center gap-3 transition-opacity ${i > step ? "opacity-40" : ""}`}>
              {i < step ? (
                <Check size={18} className="text-accent" />
              ) : i === step ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <span className="h-[18px] w-[18px] rounded-full border border-line" />
              )}
              {label}
            </li>
          ))}
        </ul>
        {notice && <p className="mt-4 text-sm text-muted">{notice}</p>}
      </div>

      <div className="relative hidden overflow-hidden rounded-xl border border-line bg-card p-6 md:block" aria-hidden>
        <div className="space-y-4">
          <div className="h-6 w-1/2 rounded bg-line" />
          <div className="h-3 w-full rounded bg-line" />
          <div className="h-3 w-5/6 rounded bg-line" />
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="h-24 rounded bg-line" />
            <div className="h-24 rounded bg-line" />
            <div className="h-24 rounded bg-line" />
          </div>
          <div className="h-3 w-2/3 rounded bg-line" />
          <div className="h-10 w-32 rounded bg-line" />
        </div>
        <div className="scan-line absolute left-0 right-0 h-0.5 bg-accent" />
      </div>
    </section>
  );
}

