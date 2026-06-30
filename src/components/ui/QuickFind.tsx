"use client";

import { motion } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickFindCategory {
  id: string;
  icon: string;
  label: string;
  color: string; // bg color for icon container
}

export const QUICK_FIND_CATEGORIES: QuickFindCategory[] = [
  { id: 'boxes',     icon: '📦', label: 'Boxes',     color: 'bg-orange-400/20' },
  { id: 'furniture', icon: '🛋️', label: 'Furniture', color: 'bg-purple-400/20' },
  { id: 'keys',      icon: '🔑', label: 'Keys',      color: 'bg-yellow-400/20' },
  { id: 'documents', icon: '📄', label: 'Documents', color: 'bg-blue-400/20'   },
  { id: 'clothes',   icon: '👕', label: 'Clothes',   color: 'bg-green-400/20'  },
];

interface QuickFindProps {
  onSelect: (category: QuickFindCategory) => void;
  className?: string;
}

export function QuickFind({ onSelect, className }: QuickFindProps) {
  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white drop-shadow-sm px-1">
        Quick Find
      </h3>

      <div className="flex flex-col gap-2">
        {QUICK_FIND_CATEGORIES.map((category, i) => (
          <motion.button
            key={category.id}
            onClick={() => onSelect(category)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/20 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:bg-white/30 dark:hover:bg-white/[0.10] active:scale-[0.98] transition-all duration-200 group text-left"
          >
            {/* Icon bubble */}
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/40 dark:bg-white/10 backdrop-blur-md"
            )}>
              <span className="text-xl leading-none">{category.icon}</span>
            </div>

            {/* Label */}
            <span className="flex-1 text-base font-semibold text-slate-800 dark:text-white">
              {category.label}
            </span>

            {/* Right side — search + chevron */}
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
              <Search className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
