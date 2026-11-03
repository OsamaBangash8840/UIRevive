/**
 * Design System Color Constants & Tokens.
 *
 * Why this exists (Single Source of Truth):
 * Aligns severity visual styles and status indicators with CSS custom properties.
 */
export const COLOURS = {
  background: "#f7f4ee",
  foreground: "#1c1a17",
  muted: "#6b665d",
  line: "#e2ddd1",
  card: "#fffdf9",
  accent: "#c2410c",
  accentSoft: "#fdebdd",

  severity: {
    High: "bg-red-100 text-red-800 border-red-200",
    Medium: "bg-amber-100 text-amber-800 border-amber-200",
    Low: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
} as const;

