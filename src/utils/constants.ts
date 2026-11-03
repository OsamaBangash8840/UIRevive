/**
 * Application Constants and Default Scan Steps.
 *
 * Why this exists (KISS):
 * Standardizes scanning animation steps and navigation links.
 */
export const SCAN_STEPS = [
  "Connecting to Express API",
  "Capturing viewport screenshot",
  "Extracting computed typography & color tokens",
  "Evaluating visual hierarchy & spacing rhythm",
  "Generating brand-aware UI recommendations",
] as const;

export const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how", label: "How it works" },
  { href: "/analyze", label: "Analyze" },
  { href: "/history", label: "Past Audits" },
] as const;

