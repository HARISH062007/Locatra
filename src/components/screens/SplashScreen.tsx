"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: (isAuthenticated: boolean) => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // 1. Minimum 2 second visibility
    const minDuration = new Promise(resolve => setTimeout(resolve, 2000));
    
    // 2. Check authentication state simultaneously
    const authCheck = fetch('/api/auth/session')
      .then(res => res.json())
      .then(session => !!(session && Object.keys(session).length > 0))
      .catch(() => false);

    // 3. When both are done, trigger exit animation
    Promise.all([minDuration, authCheck]).then(([_, isAuthenticated]) => {
      setIsFadingOut(true);
      setTimeout(() => {
        onComplete(isAuthenticated); 
      }, 800); // 800ms for a slower, more premium fade out transition
    });
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/60 backdrop-blur-[40px] overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/20 to-indigo-500/20 rounded-full blur-[80px] pointer-events-none"
          />

          {/* Main Content Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ 
              opacity: { duration: 0.8, ease: "easeOut" },
              scale: { duration: 0.8, ease: "easeOut", type: "spring", damping: 25 },
            }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Logo Container with floating animation */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative flex items-center justify-center w-40 h-40 mb-6"
            >
              {/* Premium Vector Icon (House + Scanning Frame) */}
              <svg width="100%" height="100%" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                  <filter id="iconGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Scanning Frame Corners */}
                <path d="M45 25 H25 V45 M115 25 H135 V45 M25 115 V135 H45 M135 115 V135 H115" 
                      stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                {/* Isometric / 3D-ish House Representation */}
                <path d="M50 85 L80 60 L110 85 V120 C110 122.209 108.209 124 106 124 H54 C51.7909 124 50 122.209 50 120 V85 Z" 
                      stroke="url(#logoGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="url(#logoGradient)" fillOpacity="0.05" />
                <path d="M68 124 V96 H92 V124" 
                      stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="80" cy="80" r="4" fill="url(#logoGradient)" />
              </svg>
            </motion.div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 drop-shadow-sm mb-3">
              Locatra
            </h1>
            
            {/* Tagline */}
            <p className="text-sm md:text-base font-semibold text-slate-500 tracking-[0.2em] uppercase mt-2 mb-16">
              Locate Anything, Anywhere.
            </p>

            {/* Pulsing Scanning Ring Loading Indicator */}
            <div className="relative flex items-center justify-center w-12 h-12">
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-blue-500/20"
              />
              <motion.div 
                initial={{ rotate: 0 }}
                className="absolute inset-0 rounded-full border-t-2 border-blue-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                initial={{ scale: 1, opacity: 0.3 }}
                className="absolute inset-2 rounded-full border border-indigo-500/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
