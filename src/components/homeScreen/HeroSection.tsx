"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { normalizeUrl } from "@/utils/validate";
import { InputField } from "@/components/commnon/inputField/InputField";
import { PrimaryButton } from "@/components/commnon/primaryBtn/PrimaryButton";
import { Typography } from "@/components/commnon/typography/Typography";

/**
 * Hero Section Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md homeScreen/HeroSection.tsx):
 * Showcases primary value proposition and immediate URL input call-to-action.
 */
export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = normalizeUrl(value);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    router.push(`/analyze?url=${encodeURIComponent(result.url)}`);
  };

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
      <Typography variant="caption" className="text-accent mb-4 block">
        UI Review, with Taste
      </Typography>
      <Typography variant="h1" className="max-w-3xl mb-6">
        Make your website better without making it look like everyone else&apos;s.
      </Typography>
      <Typography variant="body" className="max-w-xl text-lg text-muted mb-8">
        Paste a URL to get an actionable, brand-respecting UI improvement report powered by live DOM inspection and multi-LLM critique.
      </Typography>

      <form onSubmit={handleSubmit} noValidate className="w-full max-w-xl mb-4">
        <div className="flex flex-col gap-3 sm:flex-row items-start">
          <InputField
            placeholder="yourwebsite.com"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            error={error}
          />
          <PrimaryButton type="submit" className="w-full sm:w-auto shrink-0">
            Analyze Website <ArrowRight size={18} />
          </PrimaryButton>
        </div>
      </form>

      <Typography variant="muted" className="text-xs">
        Powered by a decoupled Express backend with Headless Chromium screenshot &amp; CSS token extraction.
      </Typography>
    </section>
  );
};

