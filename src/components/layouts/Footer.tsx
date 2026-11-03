import React from "react";

/**
 * Site Navigation Footer.
 *
 * Why this exists (PROJECT_STRUCTURE.md layouts/Footer.tsx):
 * Displays prototype notice, attribution, and architecture credit.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-line py-6 text-center text-sm text-muted">
      <div className="mx-auto max-w-6xl px-5">
        UIRevive prototype. Audits powered by Standalone Express MVC Backend &amp; Neon.tech PostgreSQL.
      </div>
    </footer>
  );
};

