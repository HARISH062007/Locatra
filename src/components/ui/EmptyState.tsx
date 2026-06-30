"use client";

import { ReactNode } from "react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <GlassCard className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6 text-slate-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm font-medium text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action}
    </GlassCard>
  );
}
