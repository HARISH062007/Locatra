"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features",  href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing",   href: "#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 z-50 w-full transition-all duration-300 border-b border-[var(--color-border-glass)]"
      style={{
        background: scrolled
          ? "rgba(10, 14, 26, 0.85)"
          : "rgba(10, 14, 26, 0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <nav className="w-full flex h-20 max-w-7xl items-center justify-between px-6" style={{ marginLeft: "auto", marginRight: "auto" }}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label="Locatra Home">
          {/* Inline SVG logo matching Stitch design */}
          <svg width="36" height="36" viewBox="0 0 100 100" fill="none" aria-hidden>
            <rect width="100" height="100" rx="16" fill="url(#logoGrad)" />
            <path
              d="M30 70 L50 30 L70 70"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="52" r="7" fill="var(--color-accent-cyan)" />
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-heading text-xl font-bold text-[var(--color-on-surface)]">Locatra</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-accent-cyan)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">Get Started Free</Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "block h-0.5 w-6 rounded-full bg-[var(--color-on-surface)] transition-all duration-300",
                menuOpen && i === 0 && "translate-y-2 rotate-45",
                menuOpen && i === 1 && "opacity-0",
                menuOpen && i === 2 && "-translate-y-2 -rotate-45",
              )}
            />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="glass border-t border-[var(--color-border-glass)] px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-accent-cyan)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/login"><Button variant="ghost" className="w-full">Sign In</Button></Link>
            <Link href="/signup"><Button variant="primary" className="w-full">Get Started Free</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
}
