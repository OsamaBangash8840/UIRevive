import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Standard Primary Action Button.
 *
 * Why this exists (PROJECT_STRUCTURE.md commnon/primaryBtn):
 * Reusable action button with integrated loading state and accessible focus rings.
 */
interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  isLoading = false,
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-foreground text-background hover:bg-accent hover:text-white",
    secondary: "bg-accent-soft text-accent hover:bg-accent hover:text-white",
    outline: "border border-line bg-card text-foreground hover:border-foreground",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
};

