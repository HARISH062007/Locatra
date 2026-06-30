"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DockItem {
  id: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  return (
    <div className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md", className)}>
      <div className="backdrop-blur-2xl bg-white/20 dark:bg-black/30 border border-white/25 dark:border-white/10 rounded-[36px] shadow-[0_8px_32px_rgba(0,0,0,0.10)] p-2.5 flex items-center justify-around">
        {items.map((item) => (
          <motion.button
            key={item.id}
            onClick={item.onClick}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative flex items-center justify-center w-12 h-12 group"
          >
            {/* Always-visible glass bubble */}
            <div className={cn(
              "absolute inset-0 rounded-2xl backdrop-blur-md border transition-all duration-300",
              item.isActive
                ? "bg-white/60 dark:bg-white/20 border-white/60 dark:border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                : "bg-white/25 dark:bg-white/[0.07] border-white/30 dark:border-white/10"
            )} />
            <div className={cn(
              "relative z-10 transition-all duration-300",
              item.isActive
                ? "text-slate-800 dark:text-white scale-110"
                : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white group-hover:scale-105"
            )}>
              {item.icon}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
