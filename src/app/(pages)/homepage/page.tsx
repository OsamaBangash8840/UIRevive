import React from "react";
import { HeroSection } from "@/components/homeScreen/HeroSection";
import { FeaturesGrid } from "@/components/homeScreen/FeaturesGrid";
import { HowItWorks } from "@/components/homeScreen/HowItWorks";

/**
 * Landing Page Component.
 *
 * Why this exists (PROJECT_STRUCTURE.md (pages)/homepage):
 * Aggregates homeScreen modular sections into the primary landing view.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
    </>
  );
}

