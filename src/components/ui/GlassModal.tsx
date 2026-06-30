"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function GlassModal({ isOpen, onClose, children, className }: GlassModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-200/40 dark:bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "relative w-full max-w-lg overflow-hidden p-6 sm:p-8",
              // Mobile Liquid Glass
              "backdrop-blur-xl bg-white/50 dark:bg-black/50 border border-white/30 dark:border-white/10 rounded-[32px] shadow-[0_16px_40px_rgba(0,0,0,0.2)]",
              // Desktop Spatial UI
              "md:backdrop-blur-3xl md:bg-white/80 md:dark:bg-slate-900/80 md:border-white/80 md:dark:border-white/10 md:rounded-[3rem] md:shadow-2xl",
              className
            )}
          >
            <button
              onClick={onClose}
              className={cn(
                "absolute top-6 right-6 p-2 rounded-full transition-colors",
                // Mobile
                "bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/10 text-slate-700 dark:text-slate-200",
                // Desktop
                "md:bg-slate-100 md:dark:bg-slate-800 md:text-slate-500 md:dark:text-slate-400 hover:md:bg-slate-200 hover:md:dark:bg-slate-700 hover:md:text-slate-900 hover:md:dark:text-white md:border-none md:backdrop-blur-none"
              )}
            >
              <X className="w-5 h-5" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
