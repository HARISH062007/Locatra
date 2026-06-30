"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function GlassSwitch({ checked, onChange, className, disabled = false }: GlassSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative flex items-center w-12 h-7 rounded-full transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 shrink-0 border",
        checked 
          ? "bg-emerald-500/80 border-emerald-400/50 shadow-[inset_0_1px_4px_rgba(0,0,0,0.1),0_0_10px_rgba(16,185,129,0.3)]" 
          : "bg-slate-300/40 border-slate-300/50 shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)] backdrop-blur-md hover:bg-slate-300/60",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <motion.div
        className="w-5 h-5 rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_-1px_1px_rgba(0,0,0,0.1)] border border-white/80"
        initial={false}
        animate={{
          x: checked ? 24 : 4,
          scale: 1
        }}
        whileTap={!disabled ? { scale: 0.9, width: 24 } : undefined}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
