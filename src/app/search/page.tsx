"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { RoomBackground, GlassSearch, Sidebar, FloatingDock, DockItem, GlassCard } from "@/components/ui";
import { Home, PlusSquare, Clock, Bell, Settings, ArrowLeft } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams?.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  const dockItems: DockItem[] = [
    { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home', isActive: false, onClick: () => router.push('/dashboard') },
    { id: 'new', icon: <PlusSquare className="w-5 h-5" />, label: 'New', isActive: false, onClick: () => {} },
    { id: 'history', icon: <Clock className="w-5 h-5" />, label: 'History', isActive: false, onClick: () => {} },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings', isActive: false, onClick: () => {} },
  ];

  return (
    <RoomBackground className="flex md:p-8 overflow-hidden h-screen">
      <Sidebar items={dockItems} />

      <main className="flex-1 w-full h-full flex flex-col relative z-10 md:ml-8 md:backdrop-blur-[40px] md:backdrop-saturate-[180%] md:bg-gradient-to-r md:from-[rgba(170,175,180,0.85)] md:to-[rgba(170,175,180,0.1)] md:dark:bg-[#121418]/50 md:rounded-[3rem] md:dark:border md:dark:border-white/[0.08] backdrop-blur-3xl bg-white/20 dark:bg-black/50 overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 w-full px-6 pt-10 pb-4 flex items-center justify-between backdrop-blur-xl bg-white/30 dark:bg-black/30 border-b border-white/20 dark:border-white/10 shadow-sm">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white/30 dark:bg-white/10 flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-sm hover:scale-105 active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold tracking-tight text-slate-900 dark:text-white">Search</span>
          <button onClick={() => router.push('/dashboard?view=alerts')} className="w-10 h-10 rounded-full bg-white/30 dark:bg-white/10 flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-sm hover:scale-105 active:scale-95 transition-all">
            <Bell className="w-5 h-5" />
          </button>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex w-full items-center justify-between p-8 pb-4 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-full border border-white/60 bg-white/50 flex items-center justify-center cursor-pointer hover:bg-white/80 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-3xl font-semibold text-slate-800 dark:text-white tracking-tight">Search</h1>
          </div>
          <button onClick={() => router.push('/dashboard?view=alerts')} className="w-12 h-12 rounded-full border border-white/60 bg-white/50 flex items-center justify-center cursor-pointer hover:bg-white/80 transition-colors shadow-sm shrink-0">
            <Bell className="w-6 h-6 text-slate-700" />
          </button>
        </header>

        <div className="px-6 md:px-8 w-full mt-4 md:mt-0 mb-6 shrink-0 justify-start z-20">
          <div className="w-full max-w-[832px]">
            <GlassSearch 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your rooms, boxes, objects..." 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-32">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-48 sm:h-64 mt-12 w-full max-w-[832px] mx-auto">
            <GlassCard className="w-full h-full flex flex-col items-center justify-center gap-4 text-center p-8 bg-white/40 dark:bg-white/5 border-white/40 dark:border-white/10 shadow-sm">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200/50 dark:bg-white/10 flex items-center justify-center text-2xl sm:text-3xl mb-2">
                🔍
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">No items found</h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-sm">
                No items found. Start scanning to add items.
              </p>
            </GlassCard>
          </motion.div>
        </div>

      </main>

      <FloatingDock items={dockItems} className="md:hidden" />
    </RoomBackground>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-[#1c1c1e]" />}>
      <SearchContent />
    </Suspense>
  );
}
