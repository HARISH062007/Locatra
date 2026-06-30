"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScannerHUDProps {
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ScannerHUD({ onClose, title, subtitle, children, className }: ScannerHUDProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-50 flex flex-col font-sans text-slate-900 pointer-events-none",
        className
      )}
    >
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center p-6 relative z-50 pointer-events-auto">
        <div className="flex flex-col">
          {title && <h2 className="text-xl font-bold text-slate-900">{title}</h2>}
          {subtitle && <p className="text-sm font-bold text-slate-500">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/70 border border-white/80 hover:bg-white text-slate-900 transition-all shadow-md"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Viewport Overlay Content */}
      <div className="flex-1 w-full flex flex-col items-center justify-center p-6 relative z-10 pointer-events-none">
        {children}
      </div>
    </motion.div>
  );
}
