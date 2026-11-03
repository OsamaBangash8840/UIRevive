/**
 * Higher-order wrapper for asynchronous Express route controllers.
 *
 * Why this exists (DRY & KISS Principles):
 * Express 4 does not automatically forward rejected promises to the error-handling
 * middleware. Wrapping controllers in asyncHandler eliminates repetitive try-catch
 * blocks across controllers and guarantees unhandled promise rejections reach
 * error.middleware.js.
 *
 * @param {Function} requestHandler - Async Express controller (req, res, next)
 * @returns {Function} Express middleware function
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = asyncHandler;

