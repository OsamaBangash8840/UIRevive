"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { normalizeUrl } from "@/lib/validate";

export function UrlForm({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = normalizeUrl(value);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    router.push(`/analyze?url=${encodeURIComponent(result.url)}`);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-xl">
      <label htmlFor="url" className="sr-only">
        Website URL
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="url"
          type="text"
          inputMode="url"
          placeholder="yourwebsite.com"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          aria-invalid={!!error}
          aria-describedby={error ? "url-error" : undefined}
          className={`h-12 flex-1 rounded-lg border bg-card px-4 text-base outline-none transition-colors focus:border-foreground ${
            error ? "border-red-600" : "border-line"
          }`}
        />
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-foreground px-6 font-medium text-background transition-transform hover:bg-accent active:scale-[0.98]"
        >
          Analyze Website <ArrowRight size={18} />
        </button>
      </div>
      {error && (
        <p id="url-error" role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}

