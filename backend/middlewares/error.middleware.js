const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

/**
 * Global Express Error Handling Middleware as specified in BACKEND_OVERVIEW.md.
 *
 * Why this exists (Single Responsibility Principle):
 * Guarantees that every thrown ApiError, ZodError, or unexpected runtime exception
 * is serialized into the standardized { statusCode, message, errors, success: false }
 * JSON format without crashing the Express process.
 *
 * @param {Error | ApiError} err - Error forwarded via next(err)
 * @param {import("express").Request} _req - Express request
 * @param {import("express").Response} res - Express response
 * @param {import("express").NextFunction} _next - Express next callback
 */
const errorMiddleware = (err, _req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, [], err.stack);
  }

  logger.error(`[HTTP ${error.statusCode}] ${error.message}`);

  return res.status(error.statusCode).json({
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    success: false,
  });
};

module.exports = errorMiddleware;

