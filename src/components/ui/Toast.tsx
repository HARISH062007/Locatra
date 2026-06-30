"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  onClose: () => void;
}

export function Toast({ type = 'info', title, message, onClose }: ToastProps) {
  const styles = {
    success: { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
    error: { icon: <AlertCircle className="w-5 h-5 text-red-500" /> },
    info: { icon: <Info className="w-5 h-5 text-blue-500" /> },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="pointer-events-auto w-full max-w-sm backdrop-blur-3xl bg-white/90 border border-white/80 shadow-2xl rounded-2xl p-4 flex gap-4 items-start mx-auto mb-2"
    >
      <div className="shrink-0 mt-0.5">{styles[type].icon}</div>
      <div className="flex-1 flex flex-col">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        {message && <p className="text-xs font-medium text-slate-500 mt-1">{message}</p>}
      </div>
      <button onClick={onClose} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
