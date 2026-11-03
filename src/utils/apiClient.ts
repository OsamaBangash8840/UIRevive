import type { AnalysisReport, ApiResponseEnvelope } from "@/types/report";

/**
 * Express Backend API Client.
 *
 * Why this exists (Single Responsibility & Dependency Inversion):
 * All communication with the standalone Express server (port 6000 or production AWS)
 * is encapsulated here, completely decoupling Next.js from backend logic.
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:6000/api/analyze";

export async function submitWebsiteAnalysis(
  url: string
): Promise<{ report: AnalysisReport; warning: string | null }> {
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const body: ApiResponseEnvelope<{ report: AnalysisReport; warning: string | null }> =
      await res.json();

    if (!res.ok || !body.success) {
      throw new Error(body.message || `Request failed with status ${res.status}`);
    }

    return {
      report: body.data.report,
      warning: body.data.warning || null,
    };
  } catch (error) {
    throw error;
  }
}

export async function fetchReportById(
  id: string
): Promise<AnalysisReport> {
  const res = await fetch(`${API_BASE}/${id}`);
  const body: ApiResponseEnvelope<{ report: AnalysisReport }> = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.message || "Failed to fetch report");
  }
  return body.data.report;
}

export async function fetchRecentReports(): Promise<Array<{ id: string; url: string; domain: string; overallScore: number; summary: string; createdAt: string }>> {
  const res = await fetch(`${API_BASE}/history`);
  const body: ApiResponseEnvelope<{ reports: Array<any> }> = await res.json();
  if (!res.ok || !body.success) {
    return [];
  }
  return body.data.reports;
}

