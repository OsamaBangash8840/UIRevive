import React from "react";

/**
 * Reusable Validated Input Field.
 *
 * Why this exists (PROJECT_STRUCTURE.md commnon/inputField):
 * Encapsulates input label, placeholder, error message rendering,
 * and accessibility ARIA attributes.
 */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  id,
  className = "",
  ...props
}) => {
  const inputId = id || "url-input";

  return (
    <div className="flex-1 w-full">
      {label && (
        <label htmlFor={inputId} className="block mb-1.5 text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`h-12 w-full rounded-lg border bg-card px-4 text-base outline-none transition-colors focus:border-foreground ${
          error ? "border-red-600 focus:border-red-600" : "border-line"
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

