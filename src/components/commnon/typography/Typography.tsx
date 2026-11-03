import React from "react";

/**
 * Atomic Typography Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md commnon/typography):
 * Ensures consistent heading and body typography throughout the app.
 */
interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "body" | "muted" | "caption";
  className?: string;
  id?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  className = "",
  id,
  children,
}) => {
  switch (variant) {
    case "h1":
      return (
        <h1 id={id} className={`font-display text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight ${className}`}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 id={id} className={`font-display text-2xl sm:text-3xl font-semibold tracking-tight ${className}`}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 id={id} className={`text-lg sm:text-xl font-semibold ${className}`}>
          {children}
        </h3>
      );
    case "muted":
      return <p id={id} className={`text-sm text-muted ${className}`}>{children}</p>;
    case "caption":
      return (
        <span id={id} className={`text-xs uppercase tracking-widest font-medium ${className}`}>
          {children}
        </span>
      );
    case "body":
    default:
      return <p id={id} className={`text-base text-foreground ${className}`}>{children}</p>;
  }
};
