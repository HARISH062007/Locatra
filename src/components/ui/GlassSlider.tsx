"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  className?: string;
  step?: number;
}

export function GlassSlider({ value, min = 0, max = 100, onChange, className, step = 1 }: GlassSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = () => setIsDragging(false);

  const updateValue = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newPercent = x / rect.width;
    let newValue = min + newPercent * (max - min);
    
    // Snap to step
    newValue = Math.round(newValue / step) * step;
    newValue = Math.max(min, Math.min(max, newValue));
    onChange(newValue);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault(); // Prevent text selection
    containerRef.current?.setPointerCapture(e.pointerId);
    handleDragStart();
    updateValue(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateValue(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    containerRef.current?.releasePointerCapture(e.pointerId);
    handleDragEnd();
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-8 flex items-center touch-none cursor-pointer", className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Track */}
      <div className="absolute w-full h-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Fill */}
        <motion.div 
          className="absolute h-full top-0 left-0 bg-blue-500/80 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Thumb */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2),inset_0_-1px_1px_rgba(0,0,0,0.1)] border border-slate-200 flex items-center justify-center -ml-3"
        style={{ left: `${percentage}%` }}
        animate={{ scale: isDragging ? 1.15 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      >
        <div className="w-2 h-2 rounded-full bg-blue-500/20" />
      </motion.div>
    </div>
  );
}
