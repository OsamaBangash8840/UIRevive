/**
 * Centralized application constants for the Express Backend.
 *
 * Why this exists (Single Responsibility & Open/Closed Principle):
 * Keeps magic numbers, default model identifiers, SSRF private IP patterns,
 * and AWS Free Tier Chromium launch flags in a single source of truth.
 */
const BACKEND_CONSTANTS = {
  DEFAULT_PORT: 6000,
  SCRAPE_TIMEOUT_MS: 12000,
  AI_TIMEOUT_MS: 25000,

  /**
   * Chromium arguments tuned for AWS EC2 t2.micro/t3.micro (1 GB RAM) and
   * containerized environments where /dev/shm is limited.
   */
  CHROMIUM_ARGS: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-first-run",
    "--no-zygote",
    "--disable-extensions",
    "--window-size=1280,800",
  ],

  /**
   * Common Chrome/Edge binary locations across Windows, Linux (AWS EC2), and macOS
   * so puppeteer-core can locate the browser without downloading a 300MB bundle.
   */
  BROWSER_CANDIDATE_PATHS: [
    process.env.CHROME_EXECUTABLE_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ].filter(Boolean),

  /**
   * Private and loopback hostnames/IP prefixes blocked to prevent Server-Side
   * Request Forgery (SSRF), including AWS EC2 instance metadata (169.254.169.254).
   */
  BLOCKED_HOST_PATTERNS: [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^169\.254\./,
    /^0\./,
    /^\[?::1\]?$/,
  ],
};

module.exports = BACKEND_CONSTANTS;

