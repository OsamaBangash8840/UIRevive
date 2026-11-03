const { Pool } = require("pg");
const logger = require("../utils/logger");

/**
 * Neon.tech Serverless PostgreSQL Connection Pool & Schema Initializer.
 *
 * Why this exists (Single Responsibility & Dependency Inversion):
 * Manages the PostgreSQL connection pool and ensures the 4 normalized relational
 * tables (websites, audit_reports, category_scores, ui_issues) exist on startup.
 * If DATABASE_URL is not configured yet, it degrades gracefully so the server
 * remains functional using an in-memory store during local development.
 */
let pool = null;
let isDbConnected = false;

/**
 * SQL DDL statements defining a normalized 3NF relational schema on Neon.tech PostgreSQL.
 * Uses UUIDs, Foreign Keys with ON DELETE CASCADE, CHECK constraints, and indexes.
 */
const INIT_SCHEMA_SQL = `
  CREATE EXTENSION IF NOT EXISTS "pgcrypto";

  CREATE TABLE IF NOT EXISTS websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(255) NOT NULL UNIQUE,
    normalized_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_websites_domain ON websites(domain);

  CREATE TABLE IF NOT EXISTS audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    summary TEXT NOT NULL,
    ai_provider VARCHAR(50) NOT NULL DEFAULT 'mock',
    screenshot_url TEXT,
    before_after JSONB NOT NULL,
    extracted_tokens JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_audit_reports_website_id ON audit_reports(website_id);
  CREATE INDEX IF NOT EXISTS idx_audit_reports_created_at ON audit_reports(created_at DESC);

  CREATE TABLE IF NOT EXISTS category_scores (
    id SERIAL PRIMARY KEY,
    report_id UUID NOT NULL REFERENCES audit_reports(id) ON DELETE CASCADE,
    category_key VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    summary TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_category_scores_report_id ON category_scores(report_id);

  CREATE TABLE IF NOT EXISTS ui_issues (
    id SERIAL PRIMARY KEY,
    report_id UUID NOT NULL REFERENCES audit_reports(id) ON DELETE CASCADE,
    issue_code VARCHAR(50) NOT NULL,
    area VARCHAR(150) NOT NULL,
    problem TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')),
    suggestion TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_ui_issues_report_id ON ui_issues(report_id);
  CREATE INDEX IF NOT EXISTS idx_ui_issues_severity ON ui_issues(severity);
`;

/**
 * Connects to Neon.tech PostgreSQL and initializes the relational tables.
 * @returns {Promise<void>}
 */
async function connectDB() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    logger.warn(
      "DATABASE_URL is not set in .env. Running with in-memory SQL fallback store. Add your Neon.tech PostgreSQL URL to persist reports."
    );
    return;
  }

  try {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    const client = await pool.connect();
    try {
      await client.query(INIT_SCHEMA_SQL);
      isDbConnected = true;
      logger.info("Connected to Neon.tech PostgreSQL & verified relational SQL schema.");
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error("Failed to connect to Neon.tech PostgreSQL. Using fallback store.", error);
    pool = null;
    isDbConnected = false;
  }
}

/**
 * Returns the active PostgreSQL Pool instance if connected.
 * @returns {{ pool: Pool | null, isDbConnected: boolean }}
 */
function getDb() {
  return { pool, isDbConnected };
}

module.exports = {
  connectDB,
  getDb,
};

