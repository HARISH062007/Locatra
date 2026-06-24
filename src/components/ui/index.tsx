"use client";

import { cn } from "@/lib/utils";
import React from "react";

/* ─── Button ─────────────────────────────────────────────────────────────── */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-cyan)] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "btn-primary text-white px-6",
    ghost: "btn-ghost text-[var(--color-on-surface)]",
    outline:
      "border border-[var(--color-border-glass)] text-[var(--color-on-surface)] hover:border-[var(--color-accent-purple)] hover:glow-purple transition-all",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-sm",
    lg: "h-12 px-8 text-base",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

/* ─── Badge ──────────────────────────────────────────────────────────────── */

interface BadgeProps {
  label: string;
  variant?: "purple" | "cyan" | "glass";
  className?: string;
}

export function Badge({ label, variant = "glass", className }: BadgeProps) {
  const variants = {
    purple:
      "bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)] border-[var(--color-accent-purple)]/30",
    cyan: "bg-[var(--color-accent-cyan)]/20 text-[var(--color-accent-cyan)] border-[var(--color-accent-cyan)]/30",
    glass:
      "bg-[var(--color-surface-glass)] text-[var(--color-on-surface-variant)] border-[var(--color-border-glass)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        variants[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}

/* ─── Card ───────────────────────────────────────────────────────────────── */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "purple" | "cyan" | "none";
}

export function Card({
  children,
  className,
  hover = false,
  glow = "none",
  ...props
}: CardProps) {
  const glowMap = {
    purple: "hover:glow-purple hover:border-[var(--color-accent-purple)]",
    cyan:   "hover:glow-cyan hover:border-[var(--color-accent-cyan)]",
    none:   "",
  };
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 transition-all duration-300",
        hover && "card-hover cursor-pointer",
        glowMap[glow],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── SectionHeading ─────────────────────────────────────────────────────── */

interface SectionHeadingProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: string;
  center?: boolean;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  center = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-4", center && "items-center text-center")}>
      {badge && <Badge label={badge} variant="purple" className="mb-2" />}
      <h2 className="font-heading text-4xl font-bold leading-tight text-[var(--color-on-surface)] lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-lg text-[var(--color-on-surface-variant)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ─── StatCard ───────────────────────────────────────────────────────────── */

interface StatCardProps {
  value: string;
  label: string;
  accent?: "purple" | "cyan";
}

export function StatCard({ value, label, accent = "purple" }: StatCardProps) {
  const colors = {
    purple: "text-[var(--color-accent-purple)]",
    cyan:   "text-[var(--color-accent-cyan)]",
  };
  return (
    <div className="glass rounded-xl px-6 py-5 text-center">
      <div className={cn("font-heading text-4xl font-bold", colors[accent])}>{value}</div>
      <div className="mt-1 text-sm text-[var(--color-on-surface-variant)]">{label}</div>
    </div>
  );
}

/* ─── StepIndicator ──────────────────────────────────────────────────────── */

interface StepIndicatorProps {
  step: number;
  label: string;
  description: string;
  active?: boolean;
}

export function StepIndicator({ step, label, description, active }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-start gap-4 p-4 rounded-xl transition-all duration-300", active && "glass")}>
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          active
            ? "bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-cyan)] text-white"
            : "border border-[var(--color-border-glass)] text-[var(--color-on-surface-variant)]",
        )}
      >
        {step}
      </div>
      <div>
        <div className="font-heading text-base font-semibold text-[var(--color-on-surface)]">{label}</div>
        <div className="mt-1 text-sm text-[var(--color-on-surface-variant)]">{description}</div>
      </div>
    </div>
  );
}
