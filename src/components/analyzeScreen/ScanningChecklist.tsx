import React from "react";
import { Check, Loader2 } from "lucide-react";
import { SCAN_STEPS } from "@/utils/constants";
import { Typography } from "@/components/commnon/typography/Typography";

/**
 * Scanning Checklist Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md analyzeScreen/ScanningChecklist.tsx):
 * Visually displays the live progression through the backend analysis stages.
 */
interface ScanningChecklistProps {
  currentStep: number;
  url: string;
}

export const ScanningChecklist: React.FC<ScanningChecklistProps> = ({
  currentStep,
  url,
}) => {
  return (
    <div>
      <Typography variant="caption" className="text-accent mb-2 block">
        Analyzing Target
      </Typography>
      <Typography variant="h2" className="break-all mb-3 text-2xl sm:text-3xl">
        {url}
      </Typography>
      <Typography variant="muted" className="mb-8">
        Inspecting live layout, computed CSS properties, and brand heuristics via the Express backend.
      </Typography>

      <ul className="space-y-3.5" aria-live="polite">
        {SCAN_STEPS.map((label, idx) => (
          <li
            key={label}
            className={`flex items-center gap-3 transition-opacity ${
              idx > currentStep ? "opacity-35" : ""
            }`}
          >
            {idx < currentStep ? (
              <Check size={18} className="text-accent shrink-0" />
            ) : idx === currentStep ? (
              <Loader2 size={18} className="animate-spin text-accent shrink-0" />
            ) : (
              <span className="h-[18px] w-[18px] rounded-full border border-line shrink-0" />
            )}
            <span className="text-sm font-medium">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

