"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, InputHTMLAttributes, useEffect } from "react";
import { useSpatial } from "@/contexts/SpatialContext";
import { motion, AnimatePresence } from "framer-motion";

export function GlassSearch({ className, value, onChange, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const { setActiveRoom } = useSpatial();
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value || "");

  // If search value changes externally or internally, try to set active room context
  useEffect(() => {
    if (typeof value === "string") {
      setActiveRoom(value.trim() !== "" ? value : null);
    }
  }, [value, setActiveRoom]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    setActiveRoom(e.target.value.trim() !== "" ? e.target.value : null);
    if (onChange) onChange(e);
  };

  const showLampResult = isFocused && typeof localValue === "string" && localValue.toLowerCase().includes("lamp");

  return (
    <motion.div 
      className={cn("relative w-full group animate-pulse-glow", className)}
      animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Subtle blue ambient tint behind search */}
      <motion.div 
        className="absolute inset-0 bg-blue-500/15 dark:hidden rounded-full blur-[24px] pointer-events-none"
        animate={{ opacity: isFocused ? 1 : 0.6 }}
        transition={{ duration: 0.8 }}
      />
      
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
        <Search className={cn("h-5 w-5 transition-colors duration-500", isFocused ? "text-blue-500 dark:text-white" : "text-slate-500 dark:text-slate-400")} />
      </div>
      
      <input
        type="text"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "block w-full pl-12 pr-6 py-4 backdrop-blur-[40px] dark:backdrop-blur-[20px] backdrop-saturate-[180%] rounded-full text-slate-900 dark:text-white font-medium focus:outline-none transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.5),0_15px_40px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_4px_20px_rgba(0,0,0,0.2)] border",
          isFocused ? "border-blue-400/60 dark:border-white/20 bg-[rgba(255,255,255,0.95)] dark:bg-white/10 placeholder-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6),0_20px_50px_rgba(59,130,246,0.15)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_0_15px_rgba(255,255,255,0.1)]" : "border-[rgba(255,255,255,0.55)] dark:border-white/[0.12] bg-[rgba(255,255,255,0.72)] dark:bg-white/[0.08] placeholder-slate-500/80 dark:placeholder-white/45"
        )}
        placeholder="Search rooms, objects... (Try 'Where is my lamp?')"
        value={value !== undefined ? value : localValue}
        onChange={handleChange}
        {...props}
      />

      <AnimatePresence>
        {showLampResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full mt-2 z-50 pointer-events-auto"
          >
            <div className="w-full bg-[rgba(255,255,255,0.95)] dark:bg-[#1A1D21]/90 backdrop-blur-[40px] border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 mb-3 px-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">AI Result Found</span>
              </div>
              <div className="bg-slate-100 dark:bg-white/[0.05] rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-lg">💡</div>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Found:</span>
                    <span className="text-base font-semibold text-slate-900 dark:text-white">Lamp</span>
                  </div>
                </div>
                <div className="h-px w-full bg-slate-200 dark:bg-white/10" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Inside</span>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <span className="text-blue-500">📦</span> Box 01
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">Category</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Bedroom items</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
