"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-5 py-4 rounded-2xl backdrop-blur-md bg-white/40 border border-white/60",
            "text-slate-900 placeholder:text-slate-400 font-medium",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/60 transition-all shadow-sm",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
GlassInput.displayName = "GlassInput";
