const express = require("express");
const {
  analyzeWebsite,
  getReportById,
  getRecentHistory,
} = require("../controllers/analyze.controller");
const { validateRequest } = require("../middlewares/validate.middleware");
const { AnalyzeRequestSchema } = require("../helpers/zod.schemas");

/**
 * Express Router for /api/analyze endpoints.
 *
 * Why this exists (Single Responsibility Principle):
 * Maps HTTP verbs and paths to their respective validation middlewares and
 * controllers without embedding business logic inside route definitions.
 */
const router = express.Router();

router.post("/", validateRequest(AnalyzeRequestSchema), analyzeWebsite);
router.get("/history", getRecentHistory);
router.get("/:id", getReportById);

module.exports = router;

