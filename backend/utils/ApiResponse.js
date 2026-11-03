/**
 * Standardized API success response envelope as specified in BACKEND_OVERVIEW.md.
 *
 * Why this exists (Single Responsibility Principle):
 * Guarantees that every Express controller returns an identical JSON contract
 * ({ statusCode, data, message, success: true }) so frontend consumers never
 * have to guess the response shape.
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 200, 201)
   * @param {unknown} data - Payload returned to the client
   * @param {string} [message="Success"] - Human-readable outcome description
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

module.exports = ApiResponse;

