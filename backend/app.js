require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB, getDb } = require("./config/db");
const { DEFAULT_PORT } = require("./config/constants");
const analyzeRoutes = require("./routes/analyze.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const ApiResponse = require("./utils/ApiResponse");
const logger = require("./utils/logger");

/**
 * Standalone Express Application Entry Point as specified in BACKEND_OVERVIEW.md.
 *
 * Responsibilities:
 * 1. Initializes Express and connects to Neon.tech Serverless PostgreSQL.
 * 2. Configures global middlewares (CORS, JSON parser, cookie-parser, /uploads static files).
 * 3. Mounts API routes under /api/analyze and exposes /api/health.
 * 4. Registers the global ApiError handling middleware.
 */
const app = express();
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

const allowedOrigins = (
  process.env.CORS_ORIGIN ||
  "http://localhost:3000,https://ui-revive.vercel.app"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Serve captured website screenshots from the local /uploads directory.
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * Health check endpoint reporting server & Neon.tech PostgreSQL status.
 */
app.get("/api/health", (_req, res) => {
  const { isDbConnected } = getDb();
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        status: "ok",
        database: isDbConnected ? "neon-postgresql-connected" : "in-memory-fallback",
        uptimeSeconds: Math.round(process.uptime()),
      },
      "UIRevive Express Backend is running"
    )
  );
});

/**
 * Mount main API routes under /api prefix per BACKEND_OVERVIEW.md.
 */
app.use("/api/analyze", analyzeRoutes);

/**
 * Global error handling middleware (must be registered last).
 */
app.use(errorMiddleware);

/**
 * Bootstrap database connection and start listening on configured PORT.
 */
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`UIRevive Express Backend listening on http://localhost:${PORT}`);
  });
});

module.exports = app;

