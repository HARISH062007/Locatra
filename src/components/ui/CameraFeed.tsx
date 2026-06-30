"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCamera } from "@/hooks/useCamera";
import { Camera, AlertCircle, RefreshCw } from "lucide-react";
import { GlassCard, GlassButton } from "@/components/ui";

interface CameraFeedProps {
  onPermissionDenied?: () => void;
}

export function CameraFeed({ onPermissionDenied }: CameraFeedProps) {
  const { stream, error, permissionStatus, startCamera } = useCamera();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(true);
  const [isBypassed, setIsBypassed] = useState(false);

  // Auto-start camera on mount
  useEffect(() => {
    startCamera();
  }, [startCamera]);

  // Connect stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black z-0 flex items-center justify-center overflow-hidden">
      
      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlays for Permissions / Errors */}
      <AnimatePresence>
        {permissionStatus === 'prompt' && isPromptVisible && !stream && !isBypassed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
          >
            <GlassCard className="max-w-md w-full p-8 flex flex-col items-center bg-black/60 border-white/20 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/20 flex items-center justify-center border border-blue-500/40 mb-6">
                <Camera className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Camera Access</h2>
              <p className="text-slate-300 text-sm mb-8">
                Locatra needs access to your camera to build a live spatial digital twin of this environment.
              </p>
              
              <div className="flex gap-3 w-full">
                <GlassButton 
                  variant="ghost" 
                  onClick={() => setIsPromptVisible(false)} 
                  className="flex-1 py-3 text-sm border border-white/20 bg-white/5 hover:bg-white/10 text-white"
                >
                  Cancel
                </GlassButton>
                <GlassButton 
                  onClick={startCamera} 
                  className="flex-1 py-3 text-sm bg-white text-black hover:bg-slate-200 border-none shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  Allow Camera
                </GlassButton>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {(permissionStatus === 'denied' || permissionStatus === 'unavailable') && !isBypassed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg p-6"
          >
            <GlassCard className="max-w-md w-full p-8 flex flex-col items-center bg-red-950/40 border-red-500/20 shadow-2xl text-center">
              <div className="w-16 h-16 rounded-3xl bg-red-500/20 flex items-center justify-center border border-red-500/40 mb-6">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {permissionStatus === 'denied' ? 'Camera Blocked' : 'Camera Unavailable'}
              </h2>
              <p className="text-slate-300 text-sm mb-8 px-4">
                {permissionStatus === 'denied' 
                  ? 'Please allow camera access in your browser settings or address bar to use the scanner.'
                  : 'No camera detected. The browser will not ask for permission if no webcam is connected, or if you are accessing the app over an insecure network (non-HTTPS).'}
              </p>
              
              <div className="flex gap-3 w-full">
                <GlassButton 
                  variant="ghost" 
                  onClick={() => {
                    setIsBypassed(true);
                    if (onPermissionDenied) onPermissionDenied();
                  }} 
                  className="flex-1 py-3 text-sm border border-white/20 bg-white/5 hover:bg-white/10 text-white"
                >
                  Continue Anyway
                </GlassButton>
                <GlassButton 
                  onClick={startCamera} 
                  className="flex-1 py-3 text-sm bg-white text-black hover:bg-slate-200 border-none shadow-lg flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </GlassButton>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
