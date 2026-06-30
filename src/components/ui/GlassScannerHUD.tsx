import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { GlassButton } from './GlassButton';

interface GlassScannerHUDProps {
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function GlassScannerHUD({ onClose, children, title, subtitle }: GlassScannerHUDProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-200/40 backdrop-blur-md flex flex-col"
    >
      {/* Top Header */}
      <div className="w-full flex justify-between items-center p-6 md:p-8 shrink-0 relative z-50">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm font-bold text-slate-600 mt-1">{subtitle}</p>}
        </div>
        <GlassButton variant="icon" onClick={onClose}>
          <X className="w-6 h-6" />
        </GlassButton>
      </div>

      {/* Camera Viewfinder Area */}
      <div className="flex-1 relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Frame reticle */}
        <div className="absolute inset-4 md:inset-12 border-[3px] border-white/60 rounded-[40px] shadow-sm pointer-events-none" />
        
        {/* Dynamic Content injected here */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-8">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
