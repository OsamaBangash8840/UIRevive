const { z } = require("zod");
const { BLOCKED_HOST_PATTERNS } = require("../config/constants");

/**
 * Normalizes a raw user URL string by prepending https:// if missing
 * and validating hostname structure and SSRF constraints.
 *
 * Why this exists (Single Responsibility & Security):
 * Ensures both user input validation and SSRF protection are enforced
 * deterministically via Zod before any network or browser call occurs.
 *
 * @param {string} rawInput - Raw URL string submitted by the client
 * @returns {{ ok: boolean, url?: string, domain?: string, error?: string }}
 */
function parseAndValidateUrl(rawInput) {
  const trimmed = String(rawInput || "").trim();
  if (!trimmed) {
    return { ok: false, error: "Please enter a website URL." };
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { ok: false, error: "Only HTTP and HTTPS URLs are supported." };
    }

    const hostname = parsed.hostname.toLowerCase();
    if (!hostname.includes(".") || hostname.endsWith(".")) {
      return {
        ok: false,
        error: "That doesn't look like a valid domain, e.g. example.com.",
      };
    }

    const isBlocked = BLOCKED_HOST_PATTERNS.some((pattern) =>
      pattern.test(hostname)
    );
    if (isBlocked) {
      return {
        ok: false,
        error: "Internal or private network addresses cannot be scanned.",
      };
    }

    return {
      ok: true,
      url: parsed.toString(),
      domain: hostname.replace(/^www\./, ""),
    };
  } catch {
    return {
      ok: false,
      error: "That doesn't look like a valid URL, e.g. example.com.",
    };
  }
}

/**
 * Zod schema for POST /api/analyze request body.
 */
const AnalyzeRequestSchema = z
  .object({
    url: z.string().min(1, "Please enter a website URL."),
  })
  .transform((data, ctx) => {
    const result = parseAndValidateUrl(data.url);
    if (!result.ok) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error || "Invalid URL.",
        path: ["url"],
      });
      return z.NEVER;
    }
    return {
      url: result.url,
      domain: result.domain,
    };
  });

/**
 * Zod schema validating the structured UI audit output returned by the AI model.
 * Guarantees runtime type safety before inserting rows into Neon.tech PostgreSQL.
 */
const CategoryScoreSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  score: z.number().min(0).max(100),
  summary: z.string().min(1),
});

const UIIssueSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  area: z.string().min(1),
  problem: z.string().min(1),
  whyItMatters: z.string().min(1),
  severity: z.enum(["Low", "Medium", "High"]),
  suggestion: z.string().min(1),
});

const BeforeAfterSchema = z.object({
  section: z.string().min(1),
  beforeTitle: z.string().min(1),
  beforeBody: z.string().min(1),
  beforeCta: z.string().min(1),
  afterTitle: z.string().min(1),
  afterBody: z.string().min(1),
  afterCta: z.string().min(1),
  changes: z.array(z.string().min(1)).min(1),
});

const AiReportOutputSchema = z.object({
  overallScore: z.number().min(0).max(100),
  summary: z.string().min(1),
  categories: z.array(CategoryScoreSchema).min(1),
  issues: z.array(UIIssueSchema).min(1),
  beforeAfter: BeforeAfterSchema,
});

module.exports = {
  parseAndValidateUrl,
  AnalyzeRequestSchema,
  AiReportOutputSchema,
};

