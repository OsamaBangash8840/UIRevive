/**
 * Lightweight structured logger utility.
 *
 * Why this exists (Single Responsibility & Empirical Diagnostics):
 * Centralizes timestamped server logging so diagnostic events (database queries,
 * scraper timings, AI provider fallbacks) are formatted consistently without
 * adding heavy third-party logging dependencies (YAGNI).
 */
const logger = {
  /**
   * Logs informational operational milestones.
   * @param {string} message - Primary log message
   * @param {Record<string, unknown>} [meta] - Optional structured metadata
   */
  info(message, meta) {
    const timestamp = new Date().toISOString();
    if (meta) {
      console.log(`[${timestamp}] [INFO] ${message}`, JSON.stringify(meta));
    } else {
      console.log(`[${timestamp}] [INFO] ${message}`);
    }
  },

  /**
   * Logs non-fatal warnings (e.g., falling back to mock data or in-memory store).
   * @param {string} message - Warning description
   * @param {Record<string, unknown>} [meta] - Optional structured metadata
   */
  warn(message, meta) {
    const timestamp = new Date().toISOString();
    if (meta) {
      console.warn(`[${timestamp}] [WARN] ${message}`, JSON.stringify(meta));
    } else {
      console.warn(`[${timestamp}] [WARN] ${message}`);
    }
  },

  /**
   * Logs operational or unexpected errors.
   * @param {string} message - Error context description
   * @param {unknown} [error] - Error object or message
   */
  error(message, error) {
    const timestamp = new Date().toISOString();
    const detail = error instanceof Error ? error.message : error;
    console.error(`[${timestamp}] [ERROR] ${message}`, detail || "");
  },
};

module.exports = logger;

