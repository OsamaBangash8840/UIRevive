"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitWebsiteAnalysis } from "@/utils/apiClient";
import { SCAN_STEPS } from "@/utils/constants";
import type { AnalysisReport } from "@/types/report";

/**
 * useAnalyze Hook.
 *
 * Why this exists (Single Responsibility):
 * Encapsulates the async Express API submission, scan step progression timer,
 * and sessionStorage synchronization.
 */
export function useAnalyze(targetUrl: string | null) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!targetUrl || startedRef.current) return;
    startedRef.current = true;

    const timer = setInterval(() => {
      setStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1));
    }, 450);

    const minAnimationDelay = new Promise((resolve) => setTimeout(resolve, 1400));

    const apiCall = submitWebsiteAnalysis(targetUrl)
      .then((data) => {
        sessionStorage.setItem("uirevive:report", JSON.stringify(data.report));
        if (data.warning) {
          sessionStorage.setItem("uirevive:warning", data.warning);
        } else {
          sessionStorage.removeItem("uirevive:warning");
        }
        return data.report;
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to analyze website");
        throw err;
      });

    Promise.all([apiCall, minAnimationDelay])
      .then(([completedReport]) => {
        clearInterval(timer);
        setStep(SCAN_STEPS.length);
        setReport(completedReport);
        router.push("/report");
      })
      .catch(() => {
        clearInterval(timer);
      });

    return () => clearInterval(timer);
  }, [targetUrl, router]);

  return {
    step,
    error,
    report,
  };
}

