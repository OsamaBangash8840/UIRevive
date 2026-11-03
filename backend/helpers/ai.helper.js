const { AiReportOutputSchema } = require("./zod.schemas");
const { AI_TIMEOUT_MS } = require("../config/constants");
const logger = require("../utils/logger");

/**
 * System prompt instructing the AI model to return deterministic UI/UX audit JSON
 * while respecting the website's existing brand identity.
 */
const SYSTEM_PROMPT = `You are a senior UI/UX reviewer for UIRevive.
You are given a website URL and, when available, extracted DOM/CSS design tokens from the live page.
Produce an actionable, honest UI improvement report that respects the website's existing brand identity rather than replacing it with a generic AI template.
Respond with ONLY valid JSON matching this exact structure:
{
  "overallScore": number (0-100),
  "summary": string,
  "categories": [
    { "key": "hierarchy"|"typography"|"color"|"spacing"|"layout"|"mobile", "label": string, "score": number (0-100), "summary": string }
  ] (exactly 6 items, one per key),
  "issues": [
    { "id": string, "area": string, "problem": string, "whyItMatters": string, "severity": "Low"|"Medium"|"High", "suggestion": string }
  ] (5 to 7 items),
  "beforeAfter": {
    "section": string,
    "beforeTitle": string,
    "beforeBody": string,
    "beforeCta": string,
    "afterTitle": string,
    "afterBody": string,
    "afterCta": string,
    "changes": [string] (3 to 5 items)
  }
}`;

/**
 * Builds a deterministic fallback report when no AI key is configured or an upstream API fails.
 * Incorporates real scraped hero text if available so the user still gets contextual value.
 *
 * @param {string} url - Normalized website URL
 * @param {Record<string, unknown> | null} tokens - Optional scraped DOM tokens
 * @returns {object}
 */
function buildMockReport(url, tokens = null) {
  const beforeTitle =
    (tokens && tokens.heroHeadline) || "Welcome to our company";
  const beforeBody =
    (tokens && tokens.heroSubheadline) ||
    "We offer many services for many customers in many industries and we hope you like our website.";
  const beforeCta = (tokens && tokens.heroPrimaryCta) || "Learn more";

  return {
    overallScore: 68,
    summary:
      "The structural foundation is solid, but visual hierarchy, typography sizing, and spacing rhythm can be tightened to improve clarity and conversion.",
    categories: [
      {
        key: "hierarchy",
        label: "Visual hierarchy",
        score: 62,
        summary: "Headings and calls to action compete for primary attention.",
      },
      {
        key: "typography",
        label: "Typography",
        score: 70,
        summary: "Multiple font weights and small body copy reduce scannability.",
      },
      {
        key: "color",
        label: "Color consistency",
        score: 74,
        summary: "Accent colors vary across interactive sections.",
      },
      {
        key: "spacing",
        label: "Spacing & alignment",
        score: 59,
        summary: "Section padding and card gaps are uneven across breakpoints.",
      },
      {
        key: "layout",
        label: "Layout clarity",
        score: 72,
        summary: "Content flow is logical but visually dense in key areas.",
      },
      {
        key: "mobile",
        label: "Mobile responsiveness",
        score: 71,
        summary: "Navigation and interactive touch targets need small-screen spacing.",
      },
    ],
    issues: [
      {
        id: "1",
        area: "Hero section",
        problem: "Competing calls to action dilute primary user focus.",
        whyItMatters: "Visitors hesitate when the primary action is unclear.",
        severity: "High",
        suggestion:
          "Designate one high-contrast primary button and style secondary links subtly.",
      },
      {
        id: "2",
        area: "Body typography",
        problem: "Body copy contrast and line-height are below optimal reading comfort.",
        whyItMatters: "Low readability increases bounce rates on both desktop and mobile.",
        severity: "High",
        suggestion:
          "Use at least 16px body text with 1.5–1.6 line-height and 4.5:1 WCAG contrast.",
      },
      {
        id: "3",
        area: "Section spacing",
        problem: "Inconsistent vertical padding between content blocks.",
        whyItMatters: "Uneven rhythm makes related content harder to group visually.",
        severity: "Medium",
        suggestion:
          "Adopt a strict 8px spacing scale (16/24/48/80px) across all sections.",
      },
      {
        id: "4",
        area: "Color palette",
        problem: "Multiple accent shades are used for interactive links and buttons.",
        whyItMatters: "Inconsistent interactive color weakens brand recognition.",
        severity: "Medium",
        suggestion:
          "Consolidate interactive states around a single primary brand accent token.",
      },
      {
        id: "5",
        area: "Mobile navigation",
        problem: "Tap targets in navigation sit closer than 44x44px on narrow viewports.",
        whyItMatters: "Tightly packed links cause mis-taps on touch devices.",
        severity: "Low",
        suggestion:
          "Increase vertical link padding on viewports below 768px.",
      },
    ],
    beforeAfter: {
      section: "Hero section",
      beforeTitle,
      beforeBody,
      beforeCta,
      afterTitle: "Clearer hierarchy. Stronger conversions.",
      afterBody:
        "We help growing teams ship reliable digital products with a clear process, measurable outcomes, and honest timelines.",
      afterCta: "Start your project",
      changes: [
        "Focused the headline on a specific, outcome-driven value proposition.",
        "Tightened body copy width to 60–65 characters per line for effortless scanning.",
        "Established a single primary CTA button while keeping the original brand palette.",
      ],
    },
  };
}

/**
 * Strips optional markdown code fences returned by LLMs around JSON output.
 * @param {string} raw - Raw text returned by the LLM
 * @returns {string} Cleaned JSON string
 */
function cleanJsonString(raw) {
  return String(raw || "")
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();
}

/**
 * Formats the user prompt combining the URL and any extracted DOM/CSS evidence.
 * @param {string} url - Normalized website URL
 * @param {Record<string, unknown> | null} tokens - Extracted DOM/CSS tokens
 * @returns {string}
 */
function buildUserPrompt(url, tokens) {
  if (!tokens) {
    return `Website URL: ${url}`;
  }
  return `Website URL: ${url}\nExtracted Live DOM & CSS Tokens:\n${JSON.stringify(tokens, null, 2)}`;
}

/**
 * Strategy implementations for each supported AI provider (Open/Closed Principle).
 * Adding a new provider requires only adding an entry to AI_STRATEGIES.
 */
const AI_STRATEGIES = [
  {
    name: "groq",
    isConfigured: () => Boolean(process.env.GROQ_API_KEY),
    async execute(userPrompt) {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt },
            ],
          }),
          signal: AbortSignal.timeout(AI_TIMEOUT_MS),
        }
      );

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Groq API ${response.status}: ${text}`);
      }
      const data = await response.json();
      return data?.choices?.[0]?.message?.content || "";
    },
  },
  {
    name: "gemini",
    isConfigured: () => Boolean(process.env.GEMINI_API_KEY),
    async execute(userPrompt) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }],
              },
            ],
            generationConfig: { responseMimeType: "application/json" },
          }),
          signal: AbortSignal.timeout(AI_TIMEOUT_MS),
        }
      );

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Gemini API ${response.status}: ${text}`);
      }
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    },
  },
  {
    name: "ollama",
    isConfigured: () => Boolean(process.env.OLLAMA_API_KEY),
    async execute(userPrompt) {
      const base = (
        process.env.OLLAMA_BASE_URL || "http://localhost:11434"
      ).replace(/\/$/, "");
      const model = process.env.OLLAMA_MODEL || "llama3";

      const response = await fetch(`${base}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          stream: false,
          format: "json",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
        }),
        signal: AbortSignal.timeout(AI_TIMEOUT_MS),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Ollama API ${response.status}: ${text}`);
      }
      const data = await response.json();
      return data?.message?.content || "";
    },
  },
];

/**
 * Generates and Zod-validates a UI improvement report using the first configured AI strategy.
 * Falls back cleanly to buildMockReport if no key is set or the upstream request fails.
 *
 * @param {string} url - Normalized website URL
 * @param {Record<string, unknown> | null} tokens - Optional scraped DOM/CSS tokens
 * @returns {Promise<{ reportData: object, source: string, provider: string, warning?: string }>}
 */
async function generateAiAudit(url, tokens = null) {
  const activeStrategy = AI_STRATEGIES.find((s) => s.isConfigured());

  if (!activeStrategy) {
    return {
      reportData: buildMockReport(url, tokens),
      source: "mock",
      provider: "mock",
      warning:
        "No AI API key configured in backend/.env. Showing sample report data.",
    };
  }

  try {
    const userPrompt = buildUserPrompt(url, tokens);
    const rawContent = await activeStrategy.execute(userPrompt);
    const parsedJson = JSON.parse(cleanJsonString(rawContent));

    const validated = AiReportOutputSchema.safeParse(parsedJson);
    if (!validated.success) {
      throw new Error(
        `AI output failed Zod validation: ${validated.error.issues[0]?.message}`
      );
    }

    return {
      reportData: validated.data,
      source: "ollama",
      provider: activeStrategy.name,
    };
  } catch (error) {
    logger.error(`AI provider (${activeStrategy.name}) failed; using fallback.`, error);
    return {
      reportData: buildMockReport(url, tokens),
      source: "mock",
      provider: "mock",
      warning: `AI provider (${activeStrategy.name}) failed (${error instanceof Error ? error.message : "Error"}). Showing sample data.`,
    };
  }
}

module.exports = {
  generateAiAudit,
  buildMockReport,
};

