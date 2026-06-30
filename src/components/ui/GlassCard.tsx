"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hoverable?: boolean;
}

export function GlassCard({ className, hoverable = false, children, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "apple-glass-panel",
        hoverable && "cursor-pointer",
        className
      )}
      whileHover={hoverable ? { 
        y: -2,
        boxShadow: "inset 0 1.5px 1px rgba(255, 255, 255, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 20px 40px -10px rgba(0, 0, 0, 0.25)",
        transition: { type: "spring", stiffness: 350, damping: 25, mass: 0.8 }
      } : undefined}
      whileTap={hoverable ? { 
        scale: 0.95,
        boxShadow: "inset 0 3px 6px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
        transition: { type: "spring", stiffness: 400, damping: 20, mass: 0.8 }
      } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
