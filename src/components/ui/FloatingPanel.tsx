"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function FloatingPanel({ isOpen, onClose, children, className }: FloatingPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-0 left-0 w-full z-50 rounded-t-[3rem] backdrop-blur-3xl bg-white/80 border-t border-white/80 shadow-[0_-20px_60px_rgba(0,0,0,0.1)] p-6 pb-safe",
              className
            )}
          >
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-8" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
