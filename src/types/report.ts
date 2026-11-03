/**
 * UIRevive Core Domain Types.
 *
 * Why this exists (Interface Segregation Principle):
 * Declares focused, client-facing TypeScript models for audit categories,
 * UI critique issues, and section-level before/after transformations.
 */

export type Severity = "Low" | "Medium" | "High";

export interface CategoryScore {
  key: string;
  label: string;
  score: number;
  summary: string;
}

export interface UIIssue {
  id: string;
  area: string;
  problem: string;
  whyItMatters: string;
  severity: Severity;
  suggestion: string;
}

export interface BeforeAfter {
  section: string;
  beforeTitle: string;
  beforeBody: string;
  beforeCta: string;
  afterTitle: string;
  afterBody: string;
  afterCta: string;
  changes: string[];
}

export interface AnalysisReport {
  id?: string;
  url: string;
  domain?: string;
  overallScore: number;
  summary: string;
  categories: CategoryScore[];
  issues: UIIssue[];
  beforeAfter: BeforeAfter;
  extractedTokens?: Record<string, unknown> | null;
  screenshotUrl?: string | null;
  source: "ollama" | "mock";
  createdAt?: string;
}

export interface ApiResponseEnvelope<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

