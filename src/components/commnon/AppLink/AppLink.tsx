import React from "react";
import Link from "next/link";

/**
 * Standardized AppLink Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md commnon/AppLink):
 * Wraps Next.js Link with consistent hover states and external link handling.
 */
interface AppLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
  className?: string;
}

export const AppLink: React.FC<AppLinkProps> = ({
  href,
  children,
  className = "",
  ...props
}) => {
  const isExternal = typeof href === "string" && (href.startsWith("http://") || href.startsWith("https://"));

  if (isExternal) {
    return (
      <a
        href={href as string}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-muted hover:text-foreground transition-colors ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`text-muted hover:text-foreground transition-colors ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

