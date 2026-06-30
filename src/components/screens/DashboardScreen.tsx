"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Home, Building2, Bell, Settings, Search, ScanFace, Box, Package, X } from "lucide-react";

export function DashboardScreen() {
  const [activeTab, setActiveTab] = useState<'current_home' | 'shift_home' | 'notifications' | 'settings'>('current_home');
  const [activeScanner, setActiveScanner] = useState<'room' | 'object' | 'package' | null>(null);

  // Reusable spring physics
  const springConfig = { type: "spring", stiffness: 400, damping: 25 };

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-[#1c1c1e] via-[#121212] to-[#09090b] text-white font-sans">
      
      {/* HEADER */}
      <div className="pt-2 sm:pt-4 px-3 sm:px-8 z-40 max-w-6xl w-full mx-auto">
        <header className="apple-glass-heavy rounded-[32px] sm:rounded-[36px] h-14 px-6 flex items-center justify-between shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]">
          <div className="w-6" /> {/* Placeholder for balance */}
          <span className="text-xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
            Locatra
          </span>
          <motion.button 
            whileTap={{ scale: 0.9, opacity: 0.7 }}
            transition={springConfig}
            className="text-slate-200 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </header>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto pb-32 px-4 md:px-8 pt-6 flex flex-col gap-8 w-full max-w-6xl mx-auto scrollbar-hide">
        
        {/* Search Bar */}
        <div className="relative w-full max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search rooms, objects, history..." 
            className="w-full h-12 pl-12 pr-4 apple-glass-panel rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all text-sm"
          />
        </div>

        {/* Dynamic Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'current_home' && (
            <motion.div 
              key="current"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-8 w-full"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <motion.button 
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95, opacity: 0.9, boxShadow: "inset 0 3px 6px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.8 }}
                  onClick={() => setActiveScanner('room')}
                  className="aspect-square flex flex-col items-center justify-center gap-3 apple-glass-panel hover:bg-white/5 group"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 group-hover:bg-purple-500/20 flex items-center justify-center text-white group-hover:text-purple-300 transition-colors duration-300 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),0_10px_20px_-5px_rgba(0,0,0,0.2)]">
                    <ScanFace className="w-7 h-7 md:w-8 md:h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                  </div>
                  <span className="font-semibold text-sm md:text-base tracking-wide drop-shadow-sm text-slate-100 group-hover:text-white">Scan Room</span>
                </motion.button>
                <motion.button 
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95, opacity: 0.9, boxShadow: "inset 0 3px 6px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.8 }}
                  onClick={() => setActiveScanner('object')}
                  className="aspect-square flex flex-col items-center justify-center gap-3 apple-glass-panel hover:bg-white/5 group"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 group-hover:bg-cyan-500/20 flex items-center justify-center text-white group-hover:text-cyan-300 transition-colors duration-300 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),0_10px_20px_-5px_rgba(0,0,0,0.2)]">
                    <Box className="w-7 h-7 md:w-8 md:h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                  </div>
                  <span className="font-semibold text-sm md:text-base tracking-wide drop-shadow-sm text-slate-100 group-hover:text-white">Scan Object</span>
                </motion.button>
              </div>

              {/* History Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold px-2 tracking-wide">History</h3>
                <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 md:gap-6 snap-x pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                  <motion.div whileHover={{ y: -2 }} transition={springConfig} className="shrink-0 w-64 md:w-auto snap-center apple-glass-panel p-5 flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                      <Box className="w-5 h-5" />
                    </div>
                    <h4 className="font-medium text-base tracking-wide">Recent Objects</h4>
                    <p className="text-sm text-slate-400">4 items scanned today</p>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} transition={springConfig} className="shrink-0 w-64 md:w-auto snap-center apple-glass-panel p-5 flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                      <ScanFace className="w-5 h-5" />
                    </div>
                    <h4 className="font-medium text-base tracking-wide">Recent Rooms</h4>
                    <p className="text-sm text-slate-400">Living Room updated</p>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} transition={springConfig} className="shrink-0 w-64 md:w-auto snap-center apple-glass-panel p-5 flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 mb-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                      <Box className="w-5 h-5" />
                    </div>
                    <h4 className="font-medium text-base tracking-wide">AI Suggestions</h4>
                    <p className="text-sm text-slate-400">Placement ideas ready</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'shift_home' && (
            <motion.div 
              key="new"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            >
              <motion.button 
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={springConfig}
                onClick={() => setActiveScanner('package')}
                className="w-full flex md:flex-col items-center md:justify-center md:text-center gap-4 p-5 md:p-8 apple-glass-panel"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  <Package className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="flex flex-col items-start md:items-center">
                  <span className="font-medium md:text-lg tracking-wide">Package Scan</span>
                  <span className="text-xs md:text-sm text-slate-400">Scan moving boxes &amp; labels</span>
                </div>
              </motion.button>
              <motion.button 
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={springConfig}
                onClick={() => setActiveScanner('room')}
                className="w-full flex md:flex-col items-center md:justify-center md:text-center gap-4 p-5 md:p-8 apple-glass-panel"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  <ScanFace className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="flex flex-col items-start md:items-center">
                  <span className="font-medium md:text-lg tracking-wide">Room Scan</span>
                  <span className="text-xs md:text-sm text-slate-400">Map a new empty room</span>
                </div>
              </motion.button>
              <motion.button 
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={springConfig}
                onClick={() => setActiveScanner('object')}
                className="w-full flex md:flex-col items-center md:justify-center md:text-center gap-4 p-5 md:p-8 apple-glass-panel"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  <Box className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="flex flex-col items-start md:items-center">
                  <span className="font-medium md:text-lg tracking-wide">Object Scan</span>
                  <span className="text-xs md:text-sm text-slate-400">Capture individual furniture</span>
                </div>
              </motion.button>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div 
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center h-48 text-slate-400 apple-glass-panel"
            >
              No new notifications.
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            >
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={springConfig} className="apple-glass-panel p-6 text-sm text-white cursor-pointer tracking-wide">
                Account Settings
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={springConfig} className="apple-glass-panel p-6 text-sm text-white cursor-pointer tracking-wide">
                Spatial Preferences
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER NAV - Floating Liquid Glass Pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] sm:w-[90%] max-w-sm">
        <nav className="apple-glass-nav flex justify-between items-center px-1.5 py-1.5 relative">
          {[
            { id: 'current_home', icon: Home, label: 'Home' },
            { id: 'shift_home', icon: Building2, label: 'Shift' },
            { id: 'notifications', icon: Bell, label: 'Alerts' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                whileTap={{ scale: 0.9, y: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, mass: 0.8 }}
                className="relative flex-1 flex flex-col items-center justify-center h-14 z-10"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBubble"
                    className="absolute inset-1.5 bg-white/15 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_0_20px_rgba(255,255,255,0.2)] pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:rounded-full before:pointer-events-none"
                    transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.8 }}
                  />
                )}
                <tab.icon className={`w-6 h-6 transition-all duration-300 relative z-10 ${isActive ? 'text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] scale-110' : 'text-slate-400'}`} />
              </motion.button>
            )
          })}
        </nav>
      </div>

      {/* AR SCANNER OVERLAY */}
      <AnimatePresence>
        {activeScanner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/40 backdrop-blur-3xl flex flex-col items-center"
          >
            <div className="w-full max-w-6xl flex justify-between items-center p-6 pt-10">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveScanner(null)} 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full apple-glass-panel flex items-center justify-center text-white"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>
              <div className="px-4 py-1.5 md:px-6 md:py-2 md:text-sm apple-glass-panel rounded-full text-xs font-semibold tracking-wider uppercase">
                {activeScanner} Mode
              </div>
              <div className="w-10 md:w-12" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full relative">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springConfig}
                className="w-64 h-64 md:w-96 md:h-96 border border-cyan-400/50 rounded-[32px] relative flex items-center justify-center apple-glass-panel bg-cyan-500/10"
              >
                {/* Center dot */}
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
              </motion.div>
              <p className="mt-8 text-sm md:text-base text-cyan-100 font-medium tracking-wide animate-pulse">
                Point camera at {activeScanner}...
              </p>
            </div>

            <div className="pb-16 pt-6 md:pb-24">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                transition={springConfig}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full apple-glass-panel border-4 border-white/80 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-inner" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
