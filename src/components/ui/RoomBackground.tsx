"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSpatial } from "@/contexts/SpatialContext";
import { useSettingsStore } from "@/store/settingsStore";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { InteractiveBlueprint } from "./InteractiveBlueprint";

interface RoomBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function RoomBackground({ children, className }: RoomBackgroundProps) {
  const { backgroundMode } = useSpatial();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      if (typeof window === "undefined") return false;
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") return true;
      if (savedTheme === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    // Initial check
    setIsDark(checkTheme());

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => setIsDark(checkTheme());
    mediaQuery.addEventListener("change", handleMediaChange);

    // Listen for custom theme change events triggered by settings
    const handleThemeChange = () => setIsDark(checkTheme());
    window.addEventListener("themechange", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("themechange", handleThemeChange);
    };
  }, []);

  // Initialize CSS variables from settings store
  useEffect(() => {
    if (typeof window === "undefined") return;
    const unsubscribe = useSettingsStore.subscribe((state) => {
      document.documentElement.style.setProperty('--glass-opacity', String(state.glassTransparency / 100));
      document.documentElement.style.setProperty('--glass-blur', String(state.backgroundBlur) + 'px');
    });
    
    // Initial application
    const state = useSettingsStore.getState();
    document.documentElement.style.setProperty('--glass-opacity', String(state.glassTransparency / 100));
    document.documentElement.style.setProperty('--glass-blur', String(state.backgroundBlur) + 'px');
    
    return unsubscribe;
  }, []);

  // URL-encode the space in the filename so the browser doesn't fail to load the asset
  // Append a query param to bust browser cache (works safely now because of unoptimized)
  const logoSrc = isDark ? "/logo%20night.png?v=3" : "/logo.png?v=3";

  // Determine base blueprint styles based on mode
  let blueprintOpacity = 0.05;
  let bgGradient = "from-slate-100 via-white to-slate-200";
  
  if (backgroundMode === "history") {
    blueprintOpacity = 0.02;
  } else if (backgroundMode === "scanner") {
    blueprintOpacity = 0.12;
  } else if (backgroundMode === "new_house") {
    blueprintOpacity = 0.08;
  }

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 50, stiffness: 400 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse position (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      // Move background opposite to mouse, max 8px
      mouseX.set(x * -8);
      mouseY.set(y * -8);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className={`relative min-h-screen w-full overflow-hidden bg-slate-100 dark:bg-[#111315] text-slate-900 font-sans selection:bg-slate-300 transition-colors duration-1000`}>
      
      {/* Photorealistic Background Image */}
      <motion.div 
        className="absolute inset-[-16px] z-0"
        style={{ x: parallaxX, y: parallaxY }}
        animate={{ scale: backgroundMode === 'scanner' ? 1.05 : 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image 
          src={logoSrc}
          alt="Room Background" 
          fill
          priority
          unoptimized={true}
          className="object-cover object-center dark:brightness-[0.45] dark:saturate-90 dark:blur-[2px]"
        />
      </motion.div>
      {/* Blueprint & Ambient Motion */}
      <motion.div 
        className="absolute inset-0 w-full h-full pointer-events-auto z-0"
        animate={{
          scale: [1, 1.03, 1],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <InteractiveBlueprint 
          className="absolute inset-0 w-full h-full mix-blend-multiply transition-opacity duration-1000"
          style={{ opacity: blueprintOpacity }}
        />
      </motion.div>

      {/* Ambient Daylight & Structural Lighting */}
      {/* Warm daylight from top edge */}
      <div className="absolute top-0 inset-x-0 h-[50vh] bg-gradient-to-b from-orange-50/40 to-transparent pointer-events-none z-0 opacity-70 dark:hidden" />
      
      {/* Warm ambient corner reflection */}
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-amber-100/20 rounded-full blur-[140px] pointer-events-none z-0 dark:hidden" />
      
      {/* Cool structural light inside the room */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-sky-100/30 rounded-full blur-[130px] pointer-events-none z-0 dark:opacity-40" />

      {/* Main Content */}
      <div className={cn("relative z-10 w-full h-full", className)}>
        {children}
      </div>
    </div>
  );
}
