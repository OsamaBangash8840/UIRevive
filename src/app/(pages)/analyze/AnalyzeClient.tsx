"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { normalizeUrl } from "@/utils/validate";
import { useAnalyze } from "@/hooks/useAnalyze";
import { ScanningChecklist } from "@/components/analyzeScreen/ScanningChecklist";
import { WireframeScanner } from "@/components/analyzeScreen/WireframeScanner";
import { HeroSection } from "@/components/homeScreen/HeroSection";

/**
 * Analyze Client Component.
 *
 * Why this exists:
 * Consumes useAnalyze hook and presents the scanning progress.
 */
export const AnalyzeClient: React.FC = () => {
  const params = useSearchParams();
  const rawUrl = params.get("url") ?? "";
  const parsed = rawUrl ? normalizeUrl(rawUrl) : null;
  const targetUrl = parsed?.ok ? parsed.url : null;

  const { step, error } = useAnalyze(targetUrl);

  if (!targetUrl) {
    return <HeroSection />;
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
      <div>
        <ScanningChecklist currentStep={step} url={targetUrl} />
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-xs text-red-700 border border-red-200" role="alert">
            {error} (Check if the standalone Express backend is running on port 6000).
          </div>
        )}
      </div>
      <WireframeScanner />
    </section>
  );
};

