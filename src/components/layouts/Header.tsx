"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/utils/constants";
import { AppLink } from "@/components/commnon/AppLink/AppLink";

/**
 * Site Navigation Header.
 *
 * Why this exists (PROJECT_STRUCTURE.md layouts/Header.tsx):
 * Responsive header with branding and navigation drawer for mobile.
 */
export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="font-display text-xl font-semibold">
          UI<span className="text-accent">Revive</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <AppLink key={link.href} href={link.href}>
              {link.label}
            </AppLink>
          ))}
        </nav>
        <button
          type="button"
          className="rounded-md p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-line px-5 py-3 md:hidden bg-card">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

