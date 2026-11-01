export type Severity = "Low" | "Medium" | "High";

export interface CategoryScore {
  key: string;
  label: string;
  score: number; // 0-100
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
  url: string;
  overallScore: number;
  summary: string;
  categories: CategoryScore[];
  issues: UIIssue[];
  beforeAfter: BeforeAfter;
  source: "ollama" | "mock";
}

