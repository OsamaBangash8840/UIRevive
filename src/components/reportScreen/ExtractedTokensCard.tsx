import React from "react";
import { Typography } from "@/components/commnon/typography/Typography";

/**
 * Extracted Tokens and Live Screenshot Card.
 *
 * Why this exists:
 * Showcases the real evidence extracted by the Express Headless Chromium backend.
 */
interface ExtractedTokensCardProps {
  tokens: Record<string, unknown> | null | undefined;
  screenshotUrl: string | null | undefined;
}

export const ExtractedTokensCard: React.FC<ExtractedTokensCardProps> = ({
  tokens,
  screenshotUrl,
}) => {
  if (!tokens && !screenshotUrl) return null;

  const backendHost =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/analyze\/?$/, "") ||
    "http://localhost:6000";

  return (
    <section aria-labelledby="live-scraped-heading" className="py-6 border-b border-line pb-8">
      <Typography variant="h2" id="live-scraped-heading" className="mb-2 text-xl sm:text-2xl">
        Live Browser Inspection Evidence
      </Typography>
      <Typography variant="muted" className="mb-6 text-sm">
        Captured in real-time by Headless Chromium on the Express backend.
      </Typography>

      <div className="grid gap-6 md:grid-cols-2">
        {tokens && (
          <div className="rounded-xl border border-line bg-card p-5 space-y-3 text-xs sm:text-sm">
            <h4 className="font-semibold text-foreground">Extracted DOM &amp; CSS Metrics:</h4>
            <div className="grid grid-cols-2 gap-2 text-muted">
              <div>
                <span className="font-medium text-foreground">H1 Elements:</span>{" "}
                {String(tokens.h1Count ?? 0)}
              </div>
              <div>
                <span className="font-medium text-foreground">Buttons Found:</span>{" "}
                {String(tokens.buttonCount ?? 0)}
              </div>
              <div>
                <span className="font-medium text-foreground">Body Font Size:</span>{" "}
                {String(tokens.bodyFontSize || "N/A")}
              </div>
              <div>
                <span className="font-medium text-foreground">Missing Alt Tags:</span>{" "}
                {String(tokens.imagesWithoutAlt ?? 0)}
              </div>
            </div>

            {Array.isArray(tokens.fontsDetected) && tokens.fontsDetected.length > 0 && (
              <div>
                <span className="font-medium text-foreground">Fonts Detected:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {tokens.fontsDetected.map((f: string) => (
                    <span key={f} className="rounded bg-line/60 px-2 py-0.5 text-xs">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {screenshotUrl && (
          <div className="rounded-xl border border-line bg-card p-3 overflow-hidden shadow-sm">
            <p className="text-xs font-medium text-muted mb-2">Live Viewport Screenshot:</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshotUrl.startsWith("http") ? screenshotUrl : `${backendHost}${screenshotUrl}`}
              alt="Live website screenshot"
              className="w-full h-auto rounded border border-line object-cover max-h-56"
            />
          </div>
        )}
      </div>
    </section>
  );
};

