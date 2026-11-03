import React, { Suspense } from "react";
import { AnalyzeClient } from "./AnalyzeClient";

/**
 * Analyze Page Container.
 *
 * Why this exists (PROJECT_STRUCTURE.md (pages)/analyze):
 * Suspense-wrapped route handling URL search parameters for scanning.
 */
export default function AnalyzePage() {
  return (
    <Suspense fallback={null}>
      <AnalyzeClient />
    </Suspense>
  );
}

