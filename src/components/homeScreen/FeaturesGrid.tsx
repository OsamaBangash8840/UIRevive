import React from "react";
import { ScanSearch, Wand2, Palette } from "lucide-react";
import { Typography } from "@/components/commnon/typography/Typography";

/**
 * Features Grid Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md homeScreen/FeaturesGrid.tsx):
 * Details the three core pillars of UIRevive's design audit methodology.
 */
const features = [
  {
    icon: ScanSearch,
    title: "Live DOM & CSS Inspection",
    text: "Extracts actual fonts, computed background colors, button hierarchies, and WCAG contrast ratios directly from the live page.",
  },
  {
    icon: Wand2,
    title: "Actionable, Scored Critiques",
    text: "Every flagged issue identifies the affected area, why it matters for user conversion, and provides an exact CSS/design fix.",
  },
  {
    icon: Palette,
    title: "Brand-Respecting Guidance",
    text: "Suggests refined layout rhythms and type scales that celebrate your original visual identity instead of replacing it with a cookie-cutter template.",
  },
];

export const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" className="border-t border-line bg-card py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl p-2">
            <f.icon className="mb-4 text-accent" size={26} />
            <Typography variant="h3" className="mb-2">
              {f.title}
            </Typography>
            <Typography variant="muted">{f.text}</Typography>
          </div>
        ))}
      </div>
    </section>
  );
};

