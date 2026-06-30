import React from 'react';
import { Search } from 'lucide-react';
import { GlassInput, GlassInputProps } from './GlassInput';
import { motion } from 'framer-motion';

export function FloatingSearch({ className = '', ...props }: GlassInputProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-xl mx-auto ${className}`}
    >
      <GlassInput icon={<Search className="w-5 h-5 text-slate-500" />} placeholder="Search spaces, objects..." {...props} />
    </motion.div>
  );
}
