const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");
const {
  CHROMIUM_ARGS,
  BROWSER_CANDIDATE_PATHS,
  SCRAPE_TIMEOUT_MS,
} = require("../config/constants");
const logger = require("../utils/logger");

/**
 * Headless Chromium Website Scraper & Computed CSS Token Inspector.
 *
 * Why this exists (Single Responsibility & AWS Free Tier Safety):
 * Extracts real visual and DOM/CSS evidence from the target website (computed
 * fonts, colors, WCAG contrast failures, heading counts, and actual Hero copy)
 * plus a live desktop viewport screenshot.
 *
 * Memory Protection on AWS EC2 t2.micro/t3.micro (1 GB RAM):
 * Enforces a strict 1-at-a-time concurrency mutex queue so two simultaneous
 * requests never launch multiple Chromium instances and exhaust server RAM.
 */
let activeScrapePromise = Promise.resolve();

/**
 * Resolves the first available Chrome/Edge binary on the host machine.
 * @returns {string | null} Absolute path to browser executable or null
 */
function findBrowserExecutable() {
  for (const candidate of BROWSER_CANDIDATE_PATHS) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

/**
 * Executes a function inside a single-concurrency queue to protect RAM.
 * @template T
 * @param {() => Promise<T>} task - Async task to serialize
 * @returns {Promise<T>}
 */
function runSerialized(task) {
  const result = activeScrapePromise.then(task, task);
  activeScrapePromise = result.catch(() => {});
  return result;
}

/**
 * Scrapes computed CSS tokens, DOM hierarchy, and a live screenshot from a URL.
 * Gracefully degrades to null if no local browser exists or the target blocks bots.
 *
 * @param {string} url - Normalized target website URL
 * @returns {Promise<{ tokens: Record<string, unknown> | null, screenshotUrl: string | null }>}
 */
async function scrapeWebsiteContext(url) {
  const executablePath = findBrowserExecutable();
  if (!executablePath) {
    logger.warn("No Chrome/Chromium binary found on host; skipping live DOM scrape.");
    return { tokens: null, screenshotUrl: null };
  }

  return runSerialized(async () => {
    let browser = null;
    try {
      browser = await puppeteer.launch({
        executablePath,
        headless: true,
        args: CHROMIUM_ARGS,
        defaultViewport: { width: 1280, height: 800 },
      });

      const page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );

      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: SCRAPE_TIMEOUT_MS,
      });

      /**
       * Extract factual computed CSS and DOM structure inside the browser context.
       */
      const tokens = await page.evaluate(() => {
        const getStyle = (el) => (el ? window.getComputedStyle(el) : null);

        const h1 = document.querySelector("h1");
        const firstP = document.querySelector("main p, header p, section p, p");
        const firstBtn = document.querySelector(
          "a[class*='btn'], button, a[class*='button'], header a"
        );

        const bodyStyle = getStyle(document.body);
        const h1Style = getStyle(h1);

        const fontFamilies = new Set();
        const textColors = new Set();
        const bgColors = new Set();

        const sampleElements = document.querySelectorAll(
          "h1, h2, h3, p, a, button, nav, header, section"
        );
        Array.from(sampleElements)
          .slice(0, 40)
          .forEach((el) => {
            const st = window.getComputedStyle(el);
            if (st.fontFamily) {
              fontFamilies.add(st.fontFamily.split(",")[0].replace(/['"]/g, "").trim());
            }
            if (st.color && st.color !== "rgba(0, 0, 0, 0)") {
              textColors.add(st.color);
            }
            if (
              st.backgroundColor &&
              st.backgroundColor !== "rgba(0, 0, 0, 0)" &&
              st.backgroundColor !== "transparent"
            ) {
              bgColors.add(st.backgroundColor);
            }
          });

        return {
          pageTitle: document.title || "",
          h1Count: document.querySelectorAll("h1").length,
          buttonCount: document.querySelectorAll("button, a[class*='btn']").length,
          imagesWithoutAlt: document.querySelectorAll("img:not([alt]), img[alt='']").length,
          heroHeadline: h1 ? h1.innerText.trim().slice(0, 140) : "",
          heroSubheadline: firstP ? firstP.innerText.trim().slice(0, 200) : "",
          heroPrimaryCta: firstBtn ? firstBtn.innerText.trim().slice(0, 50) : "",
          bodyFontSize: bodyStyle ? bodyStyle.fontSize : "",
          h1FontSize: h1Style ? h1Style.fontSize : "",
          fontsDetected: Array.from(fontFamilies).slice(0, 5),
          textColorsDetected: Array.from(textColors).slice(0, 6),
          backgroundColorsDetected: Array.from(bgColors).slice(0, 6),
        };
      });

      const uploadsDir = path.join(__dirname, "..", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `scan-${Date.now()}.webp`;
      const filePath = path.join(uploadsDir, filename);

      await page.screenshot({
        path: filePath,
        type: "webp",
        quality: 75,
        fullPage: false,
      });

      return {
        tokens,
        screenshotUrl: `/uploads/${filename}`,
      };
    } catch (error) {
      logger.warn("Live website scrape skipped or timed out; proceeding with URL analysis.", {
        url,
        reason: error instanceof Error ? error.message : String(error),
      });
      return { tokens: null, screenshotUrl: null };
    } finally {
      if (browser) {
        await browser.close().catch(() => {});
      }
    }
  });
}

module.exports = {
  scrapeWebsiteContext,
};

