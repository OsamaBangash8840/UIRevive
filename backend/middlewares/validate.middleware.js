const ApiError = require("../utils/ApiError");

/**
 * Reusable Zod request validation middleware factory.
 *
 * Why this exists (Single Responsibility & Open/Closed Principle):
 * Decouples schema validation from Express controllers. Any route can pass a
 * Zod schema to validate(schema) and receive a sanitized, normalized req.validatedBody
 * or immediately forward a 400 ApiError to the global error handler.
 *
 * @param {import("zod").ZodSchema} schema - Zod schema to validate req.body against
 * @returns {import("express").RequestHandler}
 */
const validateRequest = (schema) => {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body || {});
    if (!parsed.success) {
      const firstMessage =
        parsed.error.issues[0]?.message || "Invalid request payload.";
      return next(new ApiError(400, firstMessage, parsed.error.issues));
    }

    req.validatedBody = parsed.data;
    return next();
  };
};

module.exports = {
  validateRequest,
};

