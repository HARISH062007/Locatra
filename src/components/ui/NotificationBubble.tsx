"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NotificationBubbleProps {
  count: number;
  className?: string;
}

export function NotificationBubble({ count, className }: NotificationBubbleProps) {
  if (count <= 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        "absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center",
        "bg-red-500 text-white text-[10px] font-bold shadow-md border-2 border-white z-10",
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </motion.div>
  );
}
