"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Box, Layers, ArrowRight } from "lucide-react";
import { SimulationMode } from "@/components/screens/DashboardScreen";
import { Button, Card, Badge } from "@/components/ui";

interface SimulationOverlayProps {
  mode: SimulationMode;
  onClose: () => void;
}

export function SimulationOverlay({ mode, onClose }: SimulationOverlayProps) {
  const [phase, setPhase] = useState<'scanning' | 'loading1' | 'loading2' | 'loading3' | 'result'>('scanning');

  useEffect(() => {
    if (mode === 'none') return;
    
    // Reset phase when mode changes
    if (mode === 'scan_package') {
      setPhase('loading1');
    } else {
      setPhase('scanning');
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'none') return;

    if (mode === 'scan_package') {
      const timers = [
        setTimeout(() => setPhase('loading2'), 1500),
        setTimeout(() => setPhase('loading3'), 3000),
        setTimeout(() => setPhase('result'), 4500),
      ];
      return () => timers.forEach(clearTimeout);
    } else if (phase === 'scanning') {
      // Simulate scanning duration before showing results
      const timer = setTimeout(() => {
        setPhase('result');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [mode, phase]);

  if (mode === 'none') return null;

  const isRoomOrObject = mode === 'scan_object' || mode === 'scan_room';
  const isPackage = mode === 'scan_package';

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-slate-900/50 border border-slate-700 text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {isRoomOrObject && phase === 'scanning' && (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative w-full h-full max-w-lg max-h-[80vh] m-4 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] border border-slate-700/50"
          >
            {/* Simulated camera feed background */}
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
               <div className="w-full h-full opacity-30" style={{
                 backgroundImage: "radial-gradient(circle at center, #1e293b 0%, #020617 100%)"
               }}/>
            </div>
            
            {/* Scanning HUD */}
            <div className="absolute inset-0 border-[4px] border-[var(--color-accent-cyan)]/30 rounded-3xl m-4">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[var(--color-accent-cyan)] -m-1 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--color-accent-cyan)] -m-1 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--color-accent-cyan)] -m-1 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[var(--color-accent-cyan)] -m-1 rounded-br-xl" />
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-50">
              <div className="w-full h-full" style={{
                backgroundImage: "linear-gradient(rgba(139,92,246,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.3) 1px,transparent 1px)",
                backgroundSize: "40px 40px",
                transform: "perspective(500px) rotateX(60deg) translateY(-50px) scale(2)",
                transformOrigin: "center center"
              }}/>
            </div>

            {/* Floating tooltips */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="glass px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2 border border-[var(--color-accent-cyan)]/50 shadow-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent-cyan)]" />
                {mode === 'scan_room' ? "Point device at floor planes and scan area slowly" : "Move around the object to capture all angles"}
              </div>
            </div>

            {/* Animated scanning line */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent-cyan)] to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)]"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}

        {isRoomOrObject && phase === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full max-w-5xl max-h-[85vh] m-4 bg-[#0f172a] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_60px_rgba(139,92,246,0.2)] border border-slate-700/50"
          >
            {/* Left: 2D Vector Blueprint */}
            <div className="flex-1 border-r border-slate-800 relative bg-[#020617] overflow-hidden flex items-center justify-center p-8">
               {/* Grid */}
               <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
                  backgroundSize: "20px 20px",
                }}/>
                
                {/* Blueprint Shapes */}
                <div className="relative w-full aspect-square max-w-md border-2 border-[var(--color-accent-cyan)]/40 rounded-sm">
                  {/* Walls */}
                  <div className="absolute top-10 left-10 right-10 bottom-10 border-4 border-slate-600/60" />
                  {/* Doorway */}
                  <div className="absolute bottom-6 left-20 w-16 h-8 border-b-4 border-slate-800 bg-[#020617]" />
                  <div className="absolute bottom-10 left-[80px] w-16 h-16 border-t border-l border-slate-600/40 rounded-tl-full" />
                  
                  {/* Detected Object Bounding Box */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute top-20 right-20 w-24 h-32 bg-[var(--color-accent-purple)]/20 border-2 border-[var(--color-accent-purple)] rounded-sm flex items-center justify-center"
                  >
                    <span className="text-[var(--color-accent-purple)] text-xs font-bold font-mono">OBJECT</span>
                    {/* Corner coordinates */}
                    <div className="absolute -top-6 -left-6 text-[10px] text-slate-500 font-mono">x:2.4, y:1.2</div>
                  </motion.div>
                </div>
            </div>

            {/* Right: Analytical Text Block */}
            <div className="w-full md:w-[400px] bg-[#0f172a] p-8 flex flex-col gap-6 overflow-y-auto">
              <div>
                <Badge label="Analysis Complete" variant="purple" className="mb-3" />
                <h2 className="text-2xl font-heading font-bold text-white">Spatial Optimization</h2>
                <p className="text-slate-400 text-sm mt-1">AI placement reasoning and coordinates.</p>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/80">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Plain-English Reasoning
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Fits with 15cm clearance on all sides. Maintains the primary walking path from the doorway to the window. Avoids blocking the detected electrical wall plates on the north wall.
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/80">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Box className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                    Coordinates & Metrics
                  </h4>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Location</div>
                      <div className="text-sm text-white font-mono mt-0.5">X: 2.45m, Y: 1.20m</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Orientation</div>
                      <div className="text-sm text-white font-mono mt-0.5">90.0° N</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Clearance</div>
                      <div className="text-sm text-emerald-400 font-mono mt-0.5">15cm (Pass)</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Confidence</div>
                      <div className="text-sm text-[var(--color-accent-purple)] font-mono mt-0.5">98.2%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>Dismiss</Button>
                <Button variant="primary" className="flex-1 bg-gradient-to-r from-[var(--color-accent-purple)] to-[var(--color-accent-cyan)] border-none text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]">Save & Confirm</Button>
              </div>
            </div>
          </motion.div>
        )}

        {isPackage && (
          <motion.div
            key="package"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full max-w-2xl max-h-[70vh] m-4 bg-[#0f172a] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.2)] border border-slate-700/50 flex flex-col items-center justify-center p-10 text-center relative"
          >
             {phase !== 'result' && (
                <div className="flex flex-col items-center gap-8 w-full max-w-sm">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <motion.div 
                      className="absolute inset-0 rounded-full border-4 border-slate-800"
                    />
                    <motion.div 
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-accent-cyan)] border-r-[var(--color-accent-purple)]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                      <span className={phase === 'loading1' ? 'text-white' : 'text-slate-500'}>Initialize</span>
                      <span className={phase === 'loading2' ? 'text-[var(--color-accent-cyan)]' : 'text-slate-500'}>Capture</span>
                      <span className={phase === 'loading3' ? 'text-[var(--color-accent-purple)]' : 'text-slate-500'}>Merge</span>
                    </div>
                    
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[var(--color-accent-cyan)] to-[var(--color-accent-purple)]"
                        initial={{ width: "0%" }}
                        animate={{ 
                          width: phase === 'loading1' ? "33%" : phase === 'loading2' ? "66%" : "100%" 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 h-6 font-mono">
                    {phase === 'loading1' && "> Initializing Native Apple RoomPlan API Pipeline..."}
                    {phase === 'loading2' && "> Capturing Hardware LiDAR Metric Depth Points..."}
                    {phase === 'loading3' && "> Merging High-Res RGB Textures to 3D Geometry..."}
                  </p>
                </div>
             )}

             {phase === 'result' && (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 className="w-full h-full flex flex-col"
               >
                 <div className="flex-1 relative bg-[#020617] rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
                   {/* 3D Canvas Viewport Simulation */}
                   <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: "linear-gradient(rgba(139,92,246,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.3) 1px,transparent 1px)",
                      backgroundSize: "40px 40px",
                      transform: "perspective(500px) rotateX(60deg) translateY(-50px) scale(2)",
                      transformOrigin: "center center"
                    }}/>
                    
                    <motion.div 
                      initial={{ rotateY: 0, rotateX: 20 }}
                      animate={{ rotateY: 360, rotateX: 20 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="relative w-48 h-48 preserve-3d"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Simulated 3D wireframe box */}
                      <div className="absolute inset-0 border-2 border-[var(--color-accent-cyan)]/60 bg-[var(--color-accent-cyan)]/5" style={{ transform: 'translateZ(96px)' }} />
                      <div className="absolute inset-0 border-2 border-[var(--color-accent-cyan)]/60 bg-[var(--color-accent-cyan)]/5" style={{ transform: 'translateZ(-96px)' }} />
                      <div className="absolute inset-0 border-2 border-[var(--color-accent-cyan)]/60 bg-[var(--color-accent-cyan)]/5" style={{ transform: 'rotateY(90deg) translateZ(96px)' }} />
                      <div className="absolute inset-0 border-2 border-[var(--color-accent-cyan)]/60 bg-[var(--color-accent-cyan)]/5" style={{ transform: 'rotateY(90deg) translateZ(-96px)' }} />
                      <div className="absolute inset-0 border-2 border-[var(--color-accent-cyan)]/60 bg-[var(--color-accent-cyan)]/5" style={{ transform: 'rotateX(90deg) translateZ(96px)' }} />
                      <div className="absolute inset-0 border-2 border-[var(--color-accent-cyan)]/60 bg-[var(--color-accent-cyan)]/5" style={{ transform: 'rotateX(90deg) translateZ(-96px)' }} />
                    </motion.div>

                    <div className="absolute bottom-4 left-4 right-4 glass p-3 rounded-xl flex items-center justify-between">
                      <span className="text-xs text-white font-mono">DIMS: 60x40x40 cm</span>
                      <span className="text-xs text-[var(--color-accent-cyan)] font-mono flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> VERIFIED</span>
                    </div>
                 </div>
                 
                 <div className="mt-6 flex gap-3">
                   <Button variant="outline" className="flex-1" onClick={onClose}>Discard</Button>
                   <Button variant="primary" className="flex-1 bg-[var(--color-accent-cyan)] border-none text-black hover:bg-[var(--color-accent-cyan)]/90" onClick={onClose}>Import to Room</Button>
                 </div>
               </motion.div>
             )}
          </motion.div>
        )}

      </motion.div>
    </AnimatePresence>
  );
}
