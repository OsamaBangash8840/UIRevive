const crypto = require("crypto");
const { getDb } = require("../config/db");
const logger = require("../utils/logger");

/**
 * Relational SQL Data Access Model for Website UI Audit Reports (Neon.tech PostgreSQL).
 *
 * Why this exists (Single Responsibility & Dependency Inversion):
 * Encapsulates all parameterized SQL queries ($1, $2), relational joins, and
 * ACID transactions (BEGIN / COMMIT / ROLLBACK) across the 4 normalized tables:
 *   1. websites
 *   2. audit_reports
 *   3. category_scores
 *   4. ui_issues
 *
 * Includes a seamless in-memory fallback store so local development works
 * immediately even before DATABASE_URL is added to .env.
 */
const inMemoryReports = [];

/**
 * Persists a complete UI audit report atomically inside a PostgreSQL transaction.
 *
 * @param {object} payload - Complete audit report data to persist
 * @returns {Promise<object>} Saved report record with generated UUID
 */
async function saveReport({
  url,
  domain,
  overallScore,
  summary,
  categories,
  issues,
  beforeAfter,
  extractedTokens,
  screenshotUrl,
  provider,
  source,
}) {
  const { pool, isDbConnected } = getDb();

  if (!isDbConnected || !pool) {
    const fallbackRecord = {
      id: crypto.randomUUID(),
      url,
      domain,
      overallScore,
      summary,
      categories,
      issues,
      beforeAfter,
      extractedTokens: extractedTokens || null,
      screenshotUrl: screenshotUrl || null,
      aiProvider: provider,
      source,
      createdAt: new Date().toISOString(),
    };
    inMemoryReports.unshift(fallbackRecord);
    if (inMemoryReports.length > 50) inMemoryReports.pop();
    return fallbackRecord;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    /**
     * 1. Upsert website record by unique domain name.
     */
    const websiteResult = await client.query(
      `INSERT INTO websites (domain, normalized_url, last_scanned_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (domain)
       DO UPDATE SET normalized_url = EXCLUDED.normalized_url, last_scanned_at = NOW()
       RETURNING id`,
      [domain, url]
    );
    const websiteId = websiteResult.rows[0].id;

    /**
     * 2. Insert parent audit_reports row.
     */
    const reportResult = await client.query(
      `INSERT INTO audit_reports (
         website_id, url, overall_score, summary, ai_provider,
         screenshot_url, before_after, extracted_tokens
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, created_at`,
      [
        websiteId,
        url,
        Math.round(overallScore),
        summary,
        provider,
        screenshotUrl || null,
        JSON.stringify(beforeAfter),
        extractedTokens ? JSON.stringify(extractedTokens) : null,
      ]
    );

    const reportId = reportResult.rows[0].id;
    const createdAt = reportResult.rows[0].created_at;

    /**
     * 3. Insert child category_scores rows.
     */
    for (const cat of categories) {
      await client.query(
        `INSERT INTO category_scores (report_id, category_key, label, score, summary)
         VALUES ($1, $2, $3, $4, $5)`,
        [reportId, cat.key, cat.label, Math.round(cat.score), cat.summary]
      );
    }

    /**
     * 4. Insert child ui_issues rows.
     */
    for (const issue of issues) {
      await client.query(
        `INSERT INTO ui_issues (
           report_id, issue_code, area, problem, why_it_matters, severity, suggestion
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          reportId,
          String(issue.id),
          issue.area,
          issue.problem,
          issue.whyItMatters,
          issue.severity,
          issue.suggestion,
        ]
      );
    }

    await client.query("COMMIT");

    return {
      id: reportId,
      url,
      domain,
      overallScore: Math.round(overallScore),
      summary,
      categories,
      issues,
      beforeAfter,
      extractedTokens: extractedTokens || null,
      screenshotUrl: screenshotUrl || null,
      aiProvider: provider,
      source,
      createdAt,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error("SQL transaction failed in saveReport; returning unpersisted report.", error);
    return {
      id: crypto.randomUUID(),
      url,
      domain,
      overallScore,
      summary,
      categories,
      issues,
      beforeAfter,
      extractedTokens: extractedTokens || null,
      screenshotUrl: screenshotUrl || null,
      aiProvider: provider,
      source,
      createdAt: new Date().toISOString(),
    };
  } finally {
    client.release();
  }
}

/**
 * Retrieves a single audit report by its UUID using relational SQL queries.
 *
 * @param {string} reportId - UUID of the audit report
 * @returns {Promise<object | null>}
 */
async function findReportById(reportId) {
  const { pool, isDbConnected } = getDb();

  if (!isDbConnected || !pool) {
    return inMemoryReports.find((r) => r.id === reportId) || null;
  }

  const reportRes = await pool.query(
    `SELECT r.id, r.url, w.domain, r.overall_score AS "overallScore",
            r.summary, r.ai_provider AS "aiProvider", r.screenshot_url AS "screenshotUrl",
            r.before_after AS "beforeAfter", r.extracted_tokens AS "extractedTokens",
            r.created_at AS "createdAt"
     FROM audit_reports r
     JOIN websites w ON r.website_id = w.id
     WHERE r.id = $1`,
    [reportId]
  );

  if (reportRes.rows.length === 0) return null;
  const row = reportRes.rows[0];

  const [catRes, issueRes] = await Promise.all([
    pool.query(
      `SELECT category_key AS "key", label, score, summary
       FROM category_scores
       WHERE report_id = $1
       ORDER BY id ASC`,
      [reportId]
    ),
    pool.query(
      `SELECT issue_code AS "id", area, problem, why_it_matters AS "whyItMatters",
              severity, suggestion
       FROM ui_issues
       WHERE report_id = $1
       ORDER BY id ASC`,
      [reportId]
    ),
  ]);

  return {
    ...row,
    source: row.aiProvider === "mock" ? "mock" : "ollama",
    categories: catRes.rows,
    issues: issueRes.rows,
  };
}

/**
 * Lists recent audit reports with domain metadata and issue counts via SQL JOIN & GROUP BY.
 *
 * @param {number} [limit=10] - Maximum number of recent reports to return
 * @returns {Promise<Array<object>>}
 */
async function listRecentReports(limit = 10) {
  const { pool, isDbConnected } = getDb();

  if (!isDbConnected || !pool) {
    return inMemoryReports.slice(0, limit).map((r) => ({
      id: r.id,
      url: r.url,
      domain: r.domain,
      overallScore: r.overallScore,
      summary: r.summary,
      aiProvider: r.aiProvider,
      issueCount: r.issues?.length || 0,
      createdAt: r.createdAt,
    }));
  }

  const result = await pool.query(
    `SELECT r.id, r.url, w.domain, r.overall_score AS "overallScore",
            r.summary, r.ai_provider AS "aiProvider", r.created_at AS "createdAt",
            COUNT(i.id)::int AS "issueCount"
     FROM audit_reports r
     JOIN websites w ON r.website_id = w.id
     LEFT JOIN ui_issues i ON i.report_id = r.id
     GROUP BY r.id, w.domain
     ORDER BY r.created_at DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows;
}

module.exports = {
  saveReport,
  findReportById,
  listRecentReports,
};
