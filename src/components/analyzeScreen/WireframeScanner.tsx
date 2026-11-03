import React from "react";

/**
 * Wireframe Scanner Visual Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md analyzeScreen/WireframeScanner.tsx):
 * Provides an animated wireframe preview simulating scanning radar lines.
 */
export const WireframeScanner: React.FC = () => {
  return (
    <div
      className="relative hidden overflow-hidden rounded-xl border border-line bg-card p-6 md:block shadow-sm"
      aria-hidden
    >
      <div className="space-y-4">
        <div className="h-6 w-1/2 rounded bg-line/80" />
        <div className="h-3 w-full rounded bg-line/60" />
        <div className="h-3 w-5/6 rounded bg-line/60" />
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="h-24 rounded bg-line/70" />
          <div className="h-24 rounded bg-line/70" />
          <div className="h-24 rounded bg-line/70" />
        </div>
        <div className="h-3 w-2/3 rounded bg-line/60 mt-4" />
        <div className="h-10 w-32 rounded bg-line/80" />
      </div>
      <div className="scan-line absolute left-0 right-0 h-0.5 bg-accent" />
    </div>
  );
};

