"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassPanel({ className, children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={cn(
        "backdrop-blur-3xl bg-white/70 border border-white/80 rounded-[3rem] shadow-2xl p-8",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
