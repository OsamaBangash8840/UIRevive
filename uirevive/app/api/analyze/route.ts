import { NextResponse } from "next/server";
import { getMockReport } from "@/lib/mock-report";
import { normalizeUrl } from "@/lib/validate";
import type { AnalysisReport } from "@/lib/types";

const SYSTEM_PROMPT = `You are a senior UI/UX reviewer. You are given only a website URL; you cannot see the page.
Produce a plausible, honest UI improvement estimate based on the URL/domain and common UI problems.
Respect the site's likely brand identity; do not suggest a generic AI template look.
Respond with ONLY valid JSON in exactly this shape:
{
 "overallScore": number 0-100,
 "summary": string,
 "categories": [ {"key": "hierarchy"|"typography"|"color"|"spacing"|"layout"|"mobile", "label": string, "score": number 0-100, "summary": string} ] (exactly 6, one per key),
 "issues": [ {"id": string, "area": string, "problem": string, "whyItMatters": string, "severity": "Low"|"Medium"|"High", "suggestion": string} ] (5 to 7 items),
 "beforeAfter": {"section": string, "beforeTitle": string, "beforeBody": string, "beforeCta": string, "afterTitle": string, "afterBody": string, "afterCta": string, "changes": [string] (3 to 5 items)}
}`;

function isValidReport(r: unknown): r is Omit<AnalysisReport, "url" | "source"> {
  if (!r || typeof r !== "object") return false;
  const o = r as Record<string, unknown>;
  const ba = o.beforeAfter as Record<string, unknown> | undefined;
  return (
    typeof o.overallScore === "number" &&
    typeof o.summary === "string" &&
    Array.isArray(o.categories) &&
    o.categories.length > 0 &&
    o.categories.every(
      (c) => c && typeof c.label === "string" && typeof c.score === "number" && typeof c.summary === "string",
    ) &&
    Array.isArray(o.issues) &&
    o.issues.length > 0 &&
    o.issues.every(
      (i) =>
        i &&
        typeof i.area === "string" &&
        typeof i.problem === "string" &&
        typeof i.whyItMatters === "string" &&
        typeof i.suggestion === "string" &&
        ["Low", "Medium", "High"].includes(i.severity),
    ) &&
    !!ba &&
    typeof ba.beforeTitle === "string" &&
    typeof ba.afterTitle === "string" &&
    Array.isArray(ba.changes)
  );
}

function cleanJsonString(raw: string): string {
  // Strip Markdown code blocks if any
  const cleaned = raw.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  return cleaned;
}

export async function POST(req: Request) {
  let raw = "";
  try {
    const body = await req.json();
    raw = String(body?.url ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = normalizeUrl(raw);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  // Check providers in order: GROQ, GEMINI, OLLAMA
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const ollamaKey = process.env.OLLAMA_API_KEY;

  if (!groqKey && !geminiKey && !ollamaKey) {
    return NextResponse.json({
      report: getMockReport(parsed.url),
      warning: "No AI API key found. Add GROQ_API_KEY or GEMINI_API_KEY to .env.local. Showing sample data.",
    });
  }

  try {
    let content = "";

    // 1. Groq (Free, ultra-fast OpenAI-compatible)
    if (groqKey) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Website URL: ${parsed.url}` },
          ],
        }),
        signal: AbortSignal.timeout(30_000),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Groq API responded with ${res.status}: ${text}`);
      }
      const data = await res.json();
      content = data?.choices?.[0]?.message?.content ?? "";
    }
    // 2. Gemini API (Free tier from Google AI Studio)
    else if (geminiKey) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${SYSTEM_PROMPT}\n\nWebsite URL: ${parsed.url}` }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
          signal: AbortSignal.timeout(30_000),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Gemini API responded with ${res.status}: ${text}`);
      }
      const data = await res.json();
      content = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    }
    // 3. Ollama (if configured)
    else if (ollamaKey) {
      const base = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
      const model = process.env.OLLAMA_MODEL || "llama3";

      const res = await fetch(`${base}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ollamaKey}` },
        body: JSON.stringify({
          model,
          stream: false,
          format: "json",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Website URL: ${parsed.url}` },
          ],
        }),
        signal: AbortSignal.timeout(15_000),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ollama responded with ${res.status}: ${text}`);
      }
      const data = await res.json();
      content = data?.message?.content ?? "";
    }

    const json = JSON.parse(cleanJsonString(content));
    if (!isValidReport(json)) throw new Error("Model returned unexpected JSON shape");
    const report: AnalysisReport = { ...json, url: parsed.url, source: "ollama" };
    return NextResponse.json({ report });
  } catch (e) {
    console.error("AI analysis failed:", e instanceof Error ? e.message : e);
    return NextResponse.json({
      report: getMockReport(parsed.url),
      warning: `AI request failed (${e instanceof Error ? e.message : "Error"}). Showing sample data.`,
    });
  }
}
