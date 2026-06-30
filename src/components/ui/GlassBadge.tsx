"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassBadgeProps {
  children: ReactNode;
  variant?: 'slate' | 'blue' | 'emerald' | 'purple';
  className?: string;
}

export function GlassBadge({ children, variant = 'slate', className }: GlassBadgeProps) {
  const variants = {
    slate: "bg-slate-100/50 text-slate-700 border-slate-200/50",
    blue: "bg-blue-100/50 text-blue-700 border-blue-200/50",
    emerald: "bg-emerald-100/50 text-emerald-700 border-emerald-200/50",
    purple: "bg-purple-100/50 text-purple-700 border-purple-200/50",
  };

  return (
    <span className={cn(
      "inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase backdrop-blur-md border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
