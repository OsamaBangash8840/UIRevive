import type { AnalysisReport } from "./types";

export function getMockReport(url: string): AnalysisReport {
  return {
    url,
    source: "mock",
    overallScore: 68,
    summary:
      "Sample report. The structure is solid, but hierarchy, typography and spacing are inconsistent in ways that weaken clarity.",
    categories: [
      { key: "hierarchy", label: "Visual hierarchy", score: 62, summary: "Headings and calls to action compete for attention." },
      { key: "typography", label: "Typography", score: 70, summary: "Too many sizes and weights; body text is slightly small." },
      { key: "color", label: "Color consistency", score: 74, summary: "Accent colors vary between sections." },
      { key: "spacing", label: "Spacing & alignment", score: 59, summary: "Section padding and card gaps are uneven." },
      { key: "layout", label: "Layout clarity", score: 72, summary: "Content flow is logical but dense in places." },
      { key: "mobile", label: "Mobile responsiveness", score: 71, summary: "Navigation and tables need small-screen work." },
    ],
    issues: [
      {
        id: "1",
        area: "Hero section",
        problem: "Two equally weighted buttons compete for attention.",
        whyItMatters: "Visitors hesitate when the primary action is unclear.",
        severity: "High",
        suggestion: "Make one button primary and render the other as a text link.",
      },
      {
        id: "2",
        area: "Body text",
        problem: "Body copy is 13px with low contrast gray.",
        whyItMatters: "Hard to read, especially on mobile and for low-vision users.",
        severity: "High",
        suggestion: "Use at least 16px body text and a contrast ratio of 4.5:1 or higher.",
      },
      {
        id: "3",
        area: "Feature cards",
        problem: "Card gaps vary between 16px and 40px.",
        whyItMatters: "Uneven rhythm looks unpolished and hurts scanning.",
        severity: "Medium",
        suggestion: "Adopt a spacing scale (8/16/24/48) and apply it consistently.",
      },
      {
        id: "4",
        area: "Color palette",
        problem: "Three different blues are used for links and buttons.",
        whyItMatters: "Inconsistent color weakens brand recognition.",
        severity: "Medium",
        suggestion: "Define one primary color token and reuse it.",
      },
      {
        id: "5",
        area: "Navigation (mobile)",
        problem: "Menu items wrap onto two lines on narrow screens.",
        whyItMatters: "Looks broken and is hard to tap.",
        severity: "Medium",
        suggestion: "Collapse into a menu button below 768px.",
      },
      {
        id: "6",
        area: "Footer",
        problem: "Link columns are not aligned to the page grid.",
        whyItMatters: "Minor, but it reduces overall polish.",
        severity: "Low",
        suggestion: "Align footer columns to the same grid as the content.",
      },
    ],
    beforeAfter: {
      section: "Hero section",
      beforeTitle: "Welcome to our company",
      beforeBody: "We offer many services for many customers in many industries and we hope you like our website.",
      beforeCta: "Learn more",
      afterTitle: "Fewer meetings. Faster launches.",
      afterBody: "We help growing teams ship reliable products with a clear process and honest timelines.",
      afterCta: "Book a free consultation",
      changes: [
        "Replaced a generic headline with a specific value proposition.",
        "Shortened body copy and raised it to a readable size.",
        "Single primary call to action with an action-oriented label.",
        "Kept the brand's original colors and shape language.",
      ],
    },
  };
}

