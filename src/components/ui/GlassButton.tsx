"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export function GlassButton({ className, variant = 'primary', children, ...props }: GlassButtonProps) {
  const baseStyles = "relative overflow-hidden font-bold tracking-wide rounded-full md:rounded-[28px] px-6 py-4 flex items-center justify-center gap-2 apple-glass-panel before:hidden after:hidden";
  
  const variants = {
    primary: "bg-white/10 text-white shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.5),0_10px_20px_-5px_rgba(0,0,0,0.15)]",
    secondary: "bg-white/5 text-slate-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_10px_rgba(0,0,0,0.1)]",
    danger: "bg-red-500/15 text-red-100 shadow-[inset_0_1.5px_1px_rgba(255,100,100,0.5)]",
    ghost: "bg-transparent text-slate-300 shadow-none border-transparent",
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.02,
        y: -1,
        boxShadow: variant === 'ghost' ? "none" : "inset 0 2px 2px rgba(255, 255, 255, 0.6), 0 15px 30px -10px rgba(0, 0, 0, 0.25)",
        transition: { type: "spring", stiffness: 350, damping: 25, mass: 0.8 }
      }}
      whileTap={{ 
        scale: 0.94, 
        opacity: 0.8,
        boxShadow: variant === 'ghost' ? "none" : "inset 0 3px 6px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 5px 10px -5px rgba(0, 0, 0, 0.1)",
        transition: { type: "spring", stiffness: 400, damping: 20, mass: 0.8 } 
      }}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
