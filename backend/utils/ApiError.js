/**
 * Standardized operational error class as specified in BACKEND_OVERVIEW.md.
 *
 * Why this exists (Liskov Substitution & Single Responsibility):
 * Extends the native Error object with HTTP status codes and structured validation
 * error arrays so the global error middleware can serialize predictable error
 * payloads ({ statusCode, message, errors, success: false }) without leaking
 * internal stack traces in production.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
   * @param {string} [message="Something went wrong"] - Error summary
   * @param {Array<unknown>} [errors=[]] - Detailed validation or field errors
   * @param {string} [stack=""] - Optional custom stack trace
   */
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;

