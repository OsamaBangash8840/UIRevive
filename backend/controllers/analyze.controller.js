const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const { scrapeWebsiteContext } = require("../helpers/scraper.helper");
const { generateAiAudit } = require("../helpers/ai.helper");
const {
  saveReport,
  findReportById,
  listRecentReports,
} = require("../models/report.model");

/**
 * Controller handling website UI analysis requests.
 *
 * Why this exists (Single Responsibility Principle):
 * Coordinates the 3-step analysis pipeline (1. Scrape DOM/CSS + Screenshot,
 * 2. Generate Zod-validated AI critique, 3. Persist to Neon.tech PostgreSQL)
 * and formats the HTTP response using ApiResponse.
 */
const analyzeWebsite = asyncHandler(async (req, res) => {
  const { url, domain } = req.validatedBody;

  const { tokens, screenshotUrl } = await scrapeWebsiteContext(url);
  const { reportData, source, provider, warning } = await generateAiAudit(
    url,
    tokens
  );

  const savedReport = await saveReport({
    url,
    domain,
    overallScore: reportData.overallScore,
    summary: reportData.summary,
    categories: reportData.categories,
    issues: reportData.issues,
    beforeAfter: reportData.beforeAfter,
    extractedTokens: tokens,
    screenshotUrl,
    provider,
    source,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        report: savedReport,
        warning: warning || null,
      },
      "Website UI analysis completed successfully"
    )
  );
});

/**
 * Controller fetching a single saved report by UUID from Neon.tech PostgreSQL.
 */
const getReportById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const report = await findReportById(id);

  if (!report) {
    throw new ApiError(404, "Analysis report not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { report }, "Report fetched successfully"));
});

/**
 * Controller listing recent UI audit reports from Neon.tech PostgreSQL.
 */
const getRecentHistory = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const reports = await listRecentReports(limit);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { reports }, "Recent reports fetched successfully")
    );
});

module.exports = {
  analyzeWebsite,
  getReportById,
  getRecentHistory,
};

