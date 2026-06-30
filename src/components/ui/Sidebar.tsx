"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DockItem } from "./FloatingDock";

interface SidebarProps {
  items: DockItem[];
  className?: string;
}

export function Sidebar({ items, className }: SidebarProps) {
  return (
    <div className={cn("hidden md:flex flex-col h-full justify-center z-40", className)}>
      <div className="backdrop-blur-2xl bg-white/20 dark:bg-[#0f1114]/40 border-0 dark:border dark:border-white/[0.08] rounded-[36px] shadow-[0_8px_32px_rgba(0,0,0,0.10)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_12px_35px_rgba(0,0,0,0.3)] px-2.5 py-4 flex flex-col items-center justify-center gap-2 h-fit w-16 transition-colors duration-500">
        {items.map((item) => (
          <motion.button
            key={item.id}
            onClick={item.onClick}
            whileTap={{ scale: 0.88 }}
            className="relative flex items-center justify-center w-11 h-11 group"
            title={item.label}
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

