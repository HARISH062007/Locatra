"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface StatusChipProps {
  status: 'success' | 'warning' | 'pending' | 'offline';
  label: string;
  className?: string;
}

export function StatusChip({ status, label, className }: StatusChipProps) {
  const styles = {
    success: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" /> },
    warning: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: <AlertCircle className="w-3 h-3 text-amber-500" /> },
    pending: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: <Clock className="w-3 h-3 text-blue-500" /> },
    offline: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", icon: <div className="w-2 h-2 rounded-full bg-slate-400" /> },
  };

  const current = styles[status];

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border backdrop-blur-sm",
      current.bg, current.text, current.border,
      className
    )}>
      {current.icon}
      {label}
    </div>
  );
}
