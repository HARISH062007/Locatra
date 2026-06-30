"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Bell, Settings, 
  Camera, Package, Building, User, Box, ScanFace,
  Clock, ArrowRight, Search, ArrowLeft, LayoutGrid, Building2
} from "lucide-react";

import { 
  RoomBackground, GlassCard, GlassSearch, 
  FloatingDock, DockItem, GlassButton, SectionHeader, Sidebar, AnimatedCounter,
  UnifiedScannerOverlay, QuickFind, QuickFindCategory
} from "@/components/ui";
import { useSpatial } from "@/contexts/SpatialContext";
import { cn } from "@/lib/utils";

import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { ActivityScreen } from "@/components/screens/ActivityScreen";
import { InventoryScreen } from "@/components/screens/InventoryScreen";
import { MyHousesScreen } from "@/components/screens/MyHousesScreen";

export default function DashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'dashboard' | 'current_home' | 'shift_home' | 'settings' | 'alerts' | 'history' | 'inventory' | 'my_houses'>('dashboard');
  const [activeScanner, setActiveScanner] = useState<'object' | 'room' | 'package' | null>(null);
  const [footerTab, setFooterTab] = useState<'menu' | 'home' | 'new' | 'alerts' | 'settings' | 'history' | 'inventory' | 'my_houses'>('menu');
  const { setBackgroundMode } = useSpatial();

  // Sync background mode with active views and scanners
  useEffect(() => {
    if (activeScanner) {
      setBackgroundMode("scanner");
    } else if (activeView === 'shift_home') {
      setBackgroundMode("new_house");
    } else {
      setBackgroundMode("default");
    }
  }, [activeView, activeScanner, setBackgroundMode]);

  const handleQuickFind = (category: QuickFindCategory) => {
    router.push(`/search?q=${encodeURIComponent(category.label)}`);
  };

  const dockItems: DockItem[] = [
    { id: 'home',       icon: <Home       className="w-5 h-5" />, label: 'Home',       isActive: footerTab === 'home' || footerTab === 'menu', onClick: () => { setFooterTab('home');       setActiveView('dashboard'); } },
    { id: 'my_houses',  icon: <Building2  className="w-5 h-5" />, label: 'My Houses',  isActive: footerTab === 'my_houses',                   onClick: () => { setFooterTab('my_houses');  setActiveView('my_houses'); } },
    { id: 'inventory',  icon: <LayoutGrid className="w-5 h-5" />, label: 'Inventory',  isActive: footerTab === 'inventory',                   onClick: () => { setFooterTab('inventory');  setActiveView('inventory'); } },
    { id: 'history',    icon: <Clock      className="w-5 h-5" />, label: 'History',    isActive: footerTab === 'history',                     onClick: () => { setFooterTab('history');    setActiveView('history'); } },
    { id: 'settings',   icon: <Settings   className="w-5 h-5" />, label: 'Settings',   isActive: footerTab === 'settings',                    onClick: () => { setFooterTab('settings');   setActiveView('settings'); } },
  ];

  return (
    <RoomBackground className="flex md:p-8 overflow-hidden h-screen">
      {/* Desktop Sidebar */}
      <Sidebar items={dockItems} />

      {/* Unified Workspace Container */}
      <motion.main 
        animate={activeScanner ? { scale: 0.95, opacity: 0, pointerEvents: "none" } : { scale: 1, opacity: 1, pointerEvents: "auto" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={cn(
          "flex-1 w-full h-full flex flex-col relative z-10 transition-colors duration-500 overflow-hidden",
          // Mobile: intense blur and frosted look for Apple Liquid Glass
          "backdrop-blur-3xl bg-white/20 dark:bg-black/50 border-x border-t border-white/20 dark:border-white/5 rounded-t-[32px] md:border-0 md:rounded-none",
          // Desktop: Spatial UI
          "md:ml-8 md:backdrop-blur-[40px] md:backdrop-saturate-[180%] md:bg-gradient-to-r md:from-[rgba(170,175,180,0.85)] md:to-[rgba(170,175,180,0.1)] md:dark:bg-none md:dark:bg-[#121418]/50 md:rounded-[3rem] md:dark:border md:dark:border-white/[0.08] md:shadow-[0_20px_60px_rgba(0,0,0,0.1)] md:dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_12px_35px_rgba(0,0,0,0.25)]"
        )}
      >
        <header className="md:hidden sticky top-0 z-30 w-full px-6 pt-10 pb-4 flex items-center justify-between backdrop-blur-xl bg-white/30 dark:bg-black/30 border-b border-white/20 dark:border-white/10 shadow-sm transition-all">
          <div className="flex items-center gap-3">
            {activeView !== 'dashboard' && (
              <button onClick={() => { setActiveView('dashboard'); setFooterTab('menu'); }} className="w-10 h-10 -ml-2 rounded-full bg-white/30 dark:bg-white/10 flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-sm hover:scale-105 active:scale-95 transition-all shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {activeView === 'dashboard' ? (
              <img src="/Logo/locatra%20text.png" alt="Locatra" className="h-8 sm:h-10 object-contain" />
            ) : (
              <span className="font-bold tracking-tight text-slate-900 dark:text-white text-lg line-clamp-1">
                {activeView === 'current_home' ? 'Current Home' : activeView === 'inventory' ? 'Inventory' : activeView === 'my_houses' ? 'My Houses' : activeView === 'settings' ? 'Settings' : activeView === 'alerts' ? 'Activity Center' : activeView === 'history' ? 'History' : 'Shift Home'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="w-10 h-10 rounded-full bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-sm hover:scale-105 active:scale-95 transition-all" onClick={() => { setActiveView('alerts'); setFooterTab('alerts'); }}>
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full border border-white/40 dark:border-white/20 bg-white/40 dark:bg-white/10 flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all" onClick={() => { setActiveView('settings'); setFooterTab('settings'); }}>
              <User className="w-5 h-5 text-slate-800 dark:text-slate-200" />
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex w-full items-center justify-between p-8 pb-4 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold text-slate-800 dark:text-white tracking-tight flex items-center gap-2 transition-colors duration-500">
              {activeView === 'dashboard' ? (
                <>
                  <img src="/Logo/locatra%20text.png" alt="Locatra" className="h-10 sm:h-12 object-contain" />
                </>
              ) : activeView === 'current_home' ? 'Current Home' : activeView === 'inventory' ? 'Inventory' : activeView === 'my_houses' ? 'My Houses' : activeView === 'settings' ? 'Settings' : activeView === 'alerts' ? 'Activity Center' : activeView === 'history' ? 'History' : 'Shift Home'}
            </h1>
            {activeView !== 'dashboard' && (
              <button onClick={() => { setActiveView('dashboard'); setFooterTab('menu'); }} className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 text-left hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                ← Back to Overview
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-full border border-white/60 bg-white/50 flex items-center justify-center cursor-pointer hover:bg-white/80 transition-colors shadow-sm" onClick={() => { setActiveView('alerts'); setFooterTab('alerts'); }}>
              <Bell className="w-6 h-6 text-slate-700" />
            </div>
            <div className="w-12 h-12 rounded-full border border-white/60 bg-white/50 flex items-center justify-center cursor-pointer hover:bg-white/80 transition-colors shadow-sm" onClick={() => { setActiveView('settings'); setFooterTab('settings'); }}>
              <User className="w-6 h-6 text-slate-700" />
            </div>
          </div>
        </header>

        {/* Search Capsule (Removed as requested) */}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-6 pb-32 scrollbar-hide">
          <AnimatePresence mode="wait">
            
            {activeView === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.12 }
                  }
                }}
                className="w-full max-w-7xl flex flex-col md:grid md:grid-cols-12 gap-12"
              >
                {/* MY SPACES (Full Width Top Row) */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-12 flex flex-row justify-start gap-4 sm:gap-8 z-10 relative">
                  
                  {/* Current Home Card Wrapper with Ambient Glow */}
                  <div className="relative w-full max-w-[400px] group">
                    {/* Soft Ambient Glow */}
                    <div className="absolute inset-0 bg-blue-500/20 dark:hidden rounded-[24px] blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-blue-500/35" />
                    
                    <GlassCard 
                      hoverable 
                      onClick={() => setActiveView('current_home')} 
                      className="relative w-full aspect-[3/4] sm:aspect-square flex flex-col p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out animate-none isolate"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0 z-0 rounded-[24px] sm:rounded-[32px] overflow-hidden pointer-events-none">
                         <img 
                           src="/images/current_home_banner.png?v=3" 
                           alt="Current Home" 
                           className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] dark:brightness-[0.6] dark:sepia-[0.2] dark:saturate-[0.8]" 
                         />
                      </div>
                      
                      {/* Image brightness boost layer */}
                      <div className="absolute inset-0 bg-white/10 z-0 pointer-events-none rounded-[24px] sm:rounded-[32px]" />
                      
                      {/* Subtle Glass Overlay for VisionOS feel */}
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-white/20 z-0 pointer-events-none rounded-[24px] sm:rounded-[32px]" />

                      {/* Content Container (z-10) with text shadow for readability */}
                      <div className="relative z-10 flex flex-col h-full justify-between drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                        {/* Top */}
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center justify-center shadow-lg shrink-0">
                            <Home className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                          </div>
                        </div>

                        {/* Bottom */}
                        <div className="mt-auto">
                          <h3 className="text-xl sm:text-3xl font-semibold text-white mb-0.5 sm:mb-1 tracking-tight drop-shadow-lg leading-tight">Current Home</h3>
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] sm:text-sm text-white/90 font-medium drop-shadow-md leading-snug line-clamp-2">Continue organizing your existing home.</p>
                            <span className="hidden sm:flex text-sm font-medium text-white items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 drop-shadow-md">
                              Continue <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  {/* Shift Home Card Wrapper */}
                  <div className="relative w-full max-w-[400px] group">
                    <GlassCard 
                      hoverable 
                      onClick={() => setActiveView('shift_home')} 
                      className="relative w-full aspect-[3/4] sm:aspect-square flex flex-col p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out opacity-95 hover:opacity-100 animate-none isolate"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0 z-0 rounded-[24px] sm:rounded-[32px] overflow-hidden pointer-events-none">
                         <img 
                           src="/images/shift_home_banner.png?v=3" 
                           alt="Shift Home" 
                           className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] dark:brightness-[0.6] dark:sepia-[0.2] dark:saturate-[0.8]" 
                         />
                      </div>
                      
                      {/* Image brightness boost layer */}
                      <div className="absolute inset-0 bg-white/10 z-0 pointer-events-none rounded-[24px] sm:rounded-[32px]" />
                      
                      {/* Subtle Glass Overlay for VisionOS feel */}
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-white/20 z-0 pointer-events-none rounded-[24px] sm:rounded-[32px]" />

                      {/* Content Container (z-10) with text shadow for readability */}
                      <div className="relative z-10 flex flex-col h-full justify-between drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center justify-center shadow-lg shrink-0">
                            <Building className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                          </div>
                        </div>

                        <div className="mt-auto">
                          <h3 className="text-xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1 tracking-tight drop-shadow-lg leading-tight">Shift Home</h3>
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] sm:text-sm text-white/90 font-medium drop-shadow-md leading-snug line-clamp-2">Plan and organize your upcoming move.</p>
                            <span className="hidden sm:flex text-sm font-bold text-white items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 drop-shadow-md">
                              Start Planning <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </motion.div>



                {/* LEFT COLUMN (40%) */}
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-5 flex flex-col gap-8 z-10 relative">
                  
                </motion.div>





              </motion.div>
            )}

            {activeView === 'current_home' && (
              <motion.div 
                key="current_house"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col w-full max-w-3xl gap-6"
              >
                {/* Scan Actions */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <GlassCard 
                    hoverable
                    onClick={() => setActiveScanner('room')}
                    className="flex flex-col items-center justify-center py-8 sm:py-10 px-2 sm:px-4 bg-white/20 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/30 dark:border-white/10 cursor-pointer group text-center rounded-[24px] shadow-[0_2px_16px_rgba(0,0,0,0.07)]"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white">Scan Room</span>
                  </GlassCard>

                  <GlassCard 
                    hoverable
                    onClick={() => setActiveScanner('object')}
                    className="flex flex-col items-center justify-center py-8 sm:py-10 px-2 sm:px-4 bg-white/20 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/30 dark:border-white/10 cursor-pointer group text-center rounded-[24px] shadow-[0_2px_16px_rgba(0,0,0,0.07)]"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Box className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white">Scan Object</span>
                  </GlassCard>
                </div>

                {/* Quick Find vertical list */}
                <QuickFind onSelect={handleQuickFind} />
              </motion.div>
            )}

            {activeView === 'shift_home' && (
              <motion.div 
                key="new_house"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col w-full max-w-3xl gap-8"
              >

                <div className="flex flex-col gap-6 w-full">
                  {/* Search Bar matching the image */}
                  <div 
                    onClick={() => router.push('/search')}
                    className="w-full h-11 sm:h-12 bg-white/60 dark:bg-white/10 backdrop-blur-md rounded-full border border-white/50 dark:border-white/20 flex items-center px-4 gap-3 shadow-sm cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Search your rooms, boxes, objects..</span>
                  </div>
                  
                  {/* Scan Actions */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <GlassCard 
                      hoverable
                      onClick={() => setActiveScanner('package')}
                      className="flex flex-col items-center justify-center py-4 sm:py-8 px-1 sm:px-4 bg-white/30 dark:bg-white/[0.08] border-white/40 dark:border-white/15 cursor-pointer group text-center"
                    >
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                        <Package className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] sm:text-sm font-semibold text-slate-800 dark:text-white leading-tight">Package Scan</span>
                    </GlassCard>

                    <GlassCard 
                      hoverable
                      onClick={() => setActiveScanner('room')}
                      className="flex flex-col items-center justify-center py-4 sm:py-8 px-1 sm:px-4 bg-white/30 dark:bg-white/[0.08] border-white/40 dark:border-white/15 cursor-pointer group text-center"
                    >
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                        <Home className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] sm:text-sm font-semibold text-slate-800 dark:text-white leading-tight">Scan Room</span>
                    </GlassCard>

                    <GlassCard 
                      hoverable
                      onClick={() => setActiveScanner('object')}
                      className="flex flex-col items-center justify-center py-4 sm:py-8 px-1 sm:px-4 bg-white/30 dark:bg-white/[0.08] border-white/40 dark:border-white/15 cursor-pointer group text-center"
                    >
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                        <Box className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] sm:text-sm font-semibold text-slate-800 dark:text-white leading-tight">Scan Object</span>
                    </GlassCard>
                  </div>

                  <SectionHeader title="History" />
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="flex flex-col items-center justify-center py-4 sm:py-6 px-1 sm:px-4 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/20 shadow-sm rounded-[24px]">
                      <span className="text-[9px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-normal sm:tracking-widest mb-1 sm:mb-2 text-center leading-tight">Packages</span>
                      <span className="text-xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-1">8</span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-4 sm:py-6 px-1 sm:px-4 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/20 shadow-sm rounded-[24px]">
                      <span className="text-[9px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-normal sm:tracking-widest mb-1 sm:mb-2 text-center leading-tight">Rooms</span>
                      <span className="text-xl sm:text-3xl font-bold text-slate-800 dark:text-white mt-1">3</span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-4 sm:py-6 px-1 sm:px-4 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/20 shadow-sm rounded-[24px]">
                      <span className="text-[9px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-normal sm:tracking-widest mb-1 sm:mb-2 text-center leading-tight">Recommendations</span>
                      <span className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">5</span>
                    </div>
                  </div>

                  <QuickFind onSelect={handleQuickFind} />
                </div>
              </motion.div>
            )}

            {activeView === 'history' && (
              <motion.div 
                key="history"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, scale: 0.98 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="w-full max-w-3xl flex flex-col gap-8 pb-20 pt-4"
              >
                {/* Recent Activity */}
                <div className="flex flex-col gap-4 mb-8 w-full">
                  <SectionHeader title="Recent Activity" />
                  <GlassCard className="flex flex-col p-5 gap-5 w-full dark:bg-white/[0.06] dark:border-white/10">
                    {[
                      { title: "Living Room scanned", time: "2h ago", room: "Living Room", icon: ScanFace },
                      { title: "TV relocated", time: "4h ago", room: "Living Room", icon: Box },
                      { title: "Kitchen updated", time: "Yesterday", room: "Kitchen", icon: Home },
                      { title: "Box #18 packed", time: "Yesterday", room: "Bedroom", icon: Package }
                    ].map((act, i) => (
                      <div key={i} className="flex gap-4 relative">
                        {i !== 3 && <div className="absolute top-8 bottom-[-20px] left-3.5 w-[2px] bg-white/20 dark:bg-white/5" />}
                        <div className="w-8 h-8 rounded-full bg-white/60 dark:bg-white/[0.1] border border-white/60 dark:border-white/10 flex flex-shrink-0 items-center justify-center z-10">
                          <act.icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{act.title}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{act.time} • {act.room}</span>
                        </div>
                      </div>
                    ))}
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {activeView === 'settings' && (
              <motion.div 
                key="settings"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, scale: 0.98 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
                }}
                className="w-full h-full pb-20"
              >
                <SettingsScreen />
              </motion.div>
            )}

            {activeView === 'alerts' && (
              <motion.div 
                key="alerts"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, scale: 0.98 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
                }}
                className="w-full h-full pt-4"
              >
                <ActivityScreen />
              </motion.div>
            )}

            {activeView === 'inventory' && (
              <motion.div
                key="inventory"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, scale: 0.98 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
                }}
                className="w-full h-full pb-20"
              >
                <InventoryScreen />
              </motion.div>
            )}

            {activeView === 'my_houses' && (
              <motion.div
                key="my_houses"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full h-full pb-20"
              >
                <MyHousesScreen
                  onNavigate={(view) => {
                    setActiveView(view);
                    setFooterTab(view === 'current_home' ? 'home' : 'new');
                  }}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.main>

      {/* Mobile Dock */}
      <FloatingDock items={dockItems} className="md:hidden" />

      {/* Scanner Overlays (Level 2) */}
      <AnimatePresence>
        {activeScanner && <UnifiedScannerOverlay key="scanner" mode={activeScanner} context={activeView} onClose={() => setActiveScanner(null)} />}
      </AnimatePresence>

    </RoomBackground>
  );
}
