"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, CheckCircle2, RefreshCw, Box, Map as MapIcon, Sparkles, Package } from "lucide-react";
import { CameraFeed, GlassButton, GlassCard } from "@/components/ui";

interface UnifiedScannerOverlayProps {
  mode: 'room' | 'object' | 'package';
  context?: string;
  onClose: () => void;
}

export function UnifiedScannerOverlay({ mode, context, onClose }: UnifiedScannerOverlayProps) {
  const [scanPhase, setScanPhase] = useState<'idle' | 'processing' | 'complete' | 'ar_preview'>('idle');
  const [processingText, setProcessingText] = useState("");
  const [packageName, setPackageName] = useState("Box 01");

  const handleCapture = () => {
    setScanPhase('processing');
  };

  useEffect(() => {
    if (scanPhase === 'processing') {
      let steps: string[] = [];
      if (mode === 'object') {
        steps = ["Detected: Chair", "Creating 3D model...", "Measuring dimensions..."];
      } else if (mode === 'package') {
        steps = ["Scanning: Laptop...", "Scanning: Books...", "Scanning: Lamp..."];
      } else if (mode === 'room') {
        if (context === 'shift_home') {
          steps = ["Scanning new room...", "Finding available space...", "Calculating optimal layout..."];
        } else {
          steps = ["Scanning walls...", "Scanning floor...", "Detecting furniture...", "Creating Living Room Map..."];
        }
      }

      let step = 0;
      if (steps.length > 0) {
        setProcessingText(steps[step]);
        const interval = setInterval(() => {
          step++;
          if (step < steps.length) {
            setProcessingText(steps[step]);
          } else {
            clearInterval(interval);
            setScanPhase('complete');
          }
        }, 1500);
        return () => clearInterval(interval);
      }
    }
  }, [scanPhase, mode, context]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 pointer-events-auto overflow-hidden text-white font-sans bg-black"
    >
      <CameraFeed />

      {/* Target Reticle (Subtle) */}
      {scanPhase !== 'ar_preview' && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center opacity-30">
          <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
        </div>
      )}

      {/* AR Preview Simulated Chair */}
      {scanPhase === 'ar_preview' && (
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="flex flex-col items-center"
          >
            <div className="w-32 h-32 border-2 border-dashed border-blue-400 bg-blue-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm relative">
              <span className="absolute -top-8 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                Virtual Item
              </span>
              <Box className="w-12 h-12 text-blue-300" />
            </div>
            <div className="w-32 h-8 bg-black/40 blur-md rounded-full mt-4" />
          </motion.div>
        </div>
      )}

      {/* Top Header */}
      <header className="absolute top-0 inset-x-0 z-20 p-6 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent pt-12">
        <GlassButton variant="secondary" onClick={onClose} className="w-12 h-12 rounded-full p-0 flex items-center justify-center bg-black/40 border-white/20 text-white hover:bg-black/60 shadow-none backdrop-blur-xl">
          <X className="w-5 h-5" />
        </GlassButton>
        
        <div className="bg-black/40 border border-white/20 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg">
          <span className="text-sm font-semibold tracking-wide uppercase">
            {mode === 'room' ? 'Scan Room' : mode === 'object' ? 'Scan Object' : 'Create Package'}
          </span>
        </div>
        
        <div className="w-12 h-12" /> {/* Spacer for centering */}
      </header>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 inset-x-0 z-20 pb-16 pt-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end pointer-events-auto">
        <AnimatePresence mode="wait">
          {scanPhase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-6"
            >
              {mode === 'object' && (
                <div className="text-center flex flex-col items-center gap-2">
                  <p className="text-lg font-semibold text-white drop-shadow-md">Move around the object</p>
                  <p className="text-sm text-white/80 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                    <RefreshCw className="w-4 h-4 animate-[spin_3s_linear_infinite]" /> Capture from all sides
                  </p>
                </div>
              )}
              {mode === 'room' && (
                <div className="text-center flex flex-col items-center gap-2">
                  <p className="text-lg font-semibold text-white drop-shadow-md">Walk around room</p>
                  <p className="text-sm text-white/80 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                    Keep your device upright
                  </p>
                </div>
              )}
              {mode === 'package' && (
                <div className="text-center flex flex-col items-center gap-4 w-64">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/80">Package Name</label>
                    <input 
                      type="text"
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                      className="bg-white/20 border border-white/30 backdrop-blur-md px-4 py-2.5 rounded-xl text-white text-center font-semibold focus:outline-none focus:border-white focus:bg-white/30 transition-all shadow-inner"
                    />
                  </div>
                  <p className="text-sm text-white/80 font-medium">Point at objects to scan</p>
                </div>
              )}

              <button 
                onClick={handleCapture}
                className="w-20 h-20 rounded-full border-4 border-white/80 p-1 hover:scale-95 transition-transform mt-2 group"
              >
                <div className="w-full h-full rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:scale-95 transition-transform" />
              </button>
            </motion.div>
          )}

          {scanPhase === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center bg-black/50 backdrop-blur-xl px-8 py-6 rounded-3xl border border-white/10"
            >
              <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-6" />
              <p className="text-lg font-semibold text-white animate-pulse text-center max-w-xs">{processingText}</p>
            </motion.div>
          )}

          {scanPhase === 'complete' && mode === 'object' && (
            <motion.div
              key="complete-object"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full px-6 flex justify-center"
            >
              <GlassCard className="w-full max-w-sm p-6 bg-black/60 border-white/20 backdrop-blur-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <Box className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-1 text-white">Chair</h3>
                <p className="text-blue-300 font-mono text-sm mb-4">60cm x 60cm x 90cm</p>
                
                <div className="bg-white/10 w-full rounded-xl p-3 mb-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3D model created
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saved to inventory
                  </div>
                </div>

                <div className="flex gap-3 w-full">
                  <GlassButton onClick={() => setScanPhase('idle')} variant="secondary" className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Scan Another
                  </GlassButton>
                  <GlassButton onClick={onClose} variant="primary" className="flex-1 bg-blue-600 hover:bg-blue-700 border-none shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                    Done
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {scanPhase === 'complete' && mode === 'package' && (
            <motion.div
              key="complete-package"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full px-6 flex justify-center"
            >
              <GlassCard className="w-full max-w-sm p-6 bg-black/60 border-white/20 backdrop-blur-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <Package className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold mb-1 text-white">{packageName}</h3>
                
                <div className="bg-white/10 w-full rounded-xl p-4 mb-6 flex flex-col gap-3 mt-4 text-left">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1">
                    <Box className="w-4 h-4" /> Contains:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/20 px-3 py-1 rounded-md text-sm font-medium">💻 Laptop</span>
                    <span className="bg-white/20 px-3 py-1 rounded-md text-sm font-medium">📚 Books</span>
                    <span className="bg-white/20 px-3 py-1 rounded-md text-sm font-medium">💡 Lamp</span>
                  </div>
                  <div className="mt-2 text-sm text-white/70">
                    Location: <span className="text-white/90 font-medium">Not placed</span>
                  </div>
                </div>

                <div className="flex gap-3 w-full">
                  <GlassButton onClick={() => setScanPhase('idle')} variant="secondary" className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Scan More
                  </GlassButton>
                  <GlassButton onClick={onClose} variant="primary" className="flex-1 bg-amber-600 hover:bg-amber-700 border-none shadow-[0_0_20px_rgba(245,158,11,0.4)] text-white">
                    Save Box
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {scanPhase === 'complete' && mode === 'room' && (
            <motion.div
              key="complete-room"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full px-6 flex justify-center"
            >
              <GlassCard className="w-full max-w-sm p-6 bg-black/60 border-white/20 backdrop-blur-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <MapIcon className="w-8 h-8 text-purple-400" />
                </div>
                
                {context === 'shift_home' ? (
                  <>
                    <h3 className="text-xl font-bold mb-4 text-white">Placement Suggestions</h3>
                    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 w-full rounded-xl p-4 mb-6 flex flex-col gap-3 text-left shadow-[inset_0_1px_10px_rgba(255,255,255,0.05)]">
                      <div className="flex items-center gap-2 text-purple-300 font-semibold mb-2">
                        <Sparkles className="w-4 h-4" /> Optimal Layout
                      </div>
                      <div className="flex justify-between items-center bg-black/30 px-3 py-2 rounded-lg">
                        <span className="text-white font-medium">Sofa</span>
                        <span className="text-emerald-400 font-bold text-sm">Wall A</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/30 px-3 py-2 rounded-lg">
                        <span className="text-white font-medium">Lamp</span>
                        <span className="text-emerald-400 font-bold text-sm">Corner</span>
                      </div>
                      <div className="flex justify-between items-center bg-black/30 px-3 py-2 rounded-lg">
                        <span className="text-white font-medium">Table</span>
                        <span className="text-emerald-400 font-bold text-sm">Center</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-1 text-white">Living Room Map Created</h3>
                    
                    <div className="flex gap-4 mb-4 text-sm font-medium text-white/80">
                      <span>Objects: Sofa, Table, Chair</span>
                      <span>Empty Spaces: 2</span>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 w-full rounded-xl p-4 mb-6 flex flex-col gap-3 text-left shadow-[inset_0_1px_10px_rgba(255,255,255,0.05)]">
                      <div className="flex items-center gap-2 text-purple-300 font-semibold mb-1">
                        <Sparkles className="w-4 h-4" /> AI Recommendation
                      </div>
                      <p className="text-white text-sm font-medium">Recommended placement:<br/><span className="text-blue-300">Chair → Corner near window</span></p>
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="text-xs text-white/80 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400"/> enough space</span>
                        <span className="text-xs text-white/80 flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-emerald-400"/> does not block walking</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 w-full">
                  <GlassButton onClick={onClose} variant="secondary" className="flex-1 bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Done
                  </GlassButton>
                  <GlassButton onClick={() => setScanPhase('ar_preview')} variant="primary" className="flex-1 bg-purple-600 hover:bg-purple-700 border-none shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    AR Preview
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {scanPhase === 'ar_preview' && (
            <motion.div
              key="ar-preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full px-6 flex justify-center mb-8"
            >
              <GlassCard className="w-full max-w-sm py-4 px-6 bg-black/40 border-white/20 backdrop-blur-md flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-white font-semibold">AR Preview Active</span>
                  <span className="text-white/70 text-xs">{context === 'shift_home' ? 'Layout visualization' : 'Chair placement'}</span>
                </div>
                <GlassButton onClick={onClose} variant="primary" className="bg-white text-black hover:bg-white/90 border-none px-6 rounded-full text-sm font-semibold">
                  Save
                </GlassButton>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
