import React from "react";
import { LayoutGrid, Type, Smartphone } from "lucide-react";
import { Typography } from "@/components/commnon/typography/Typography";

/**
 * How It Works Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md homeScreen/HowItWorks.tsx):
 * Clearly explains the 3-step audit process for new visitors.
 */
const steps = [
  {
    icon: LayoutGrid,
    title: "Submit Target URL",
    text: "Enter any live public website domain for immediate evaluation.",
  },
  {
    icon: Type,
    title: "Live Scraping & AI Review",
    text: "Headless Chromium measures visual hierarchy, typography, colors, and accessibility.",
  },
  {
    icon: Smartphone,
    title: "Explore Actionable Report",
    text: "Review severity breakdowns, view live screenshots, and compare Before & After section concepts.",
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how" className="py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Typography variant="h2" className="mb-10">
          How it works
        </Typography>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-line bg-card p-6">
              <span className="font-display text-3xl text-accent">0{i + 1}</span>
              <Typography variant="h3" className="mt-3 mb-1 text-base">
                {s.title}
              </Typography>
              <Typography variant="muted">{s.text}</Typography>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

