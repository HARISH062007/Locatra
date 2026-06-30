"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FABProps {
  icon: ReactNode;
  onClick: () => void;
  className?: string;
}

export function FloatingActionButton({ icon, onClick, className }: FABProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center",
        "bg-blue-600 text-white shadow-[0_8px_32px_rgba(37,99,235,0.4)]",
        "hover:bg-blue-700 transition-colors border border-blue-500",
        className
      )}
    >
      {icon}
    </motion.button>
  );
}
