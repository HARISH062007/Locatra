"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ChevronRight, Plus, Building2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface House {
  id: string;
  name: string;
  subtitle: string;
  iconColor: string;
  bgColor: string;
  type: "current" | "shift" | "custom";
}

const DEFAULT_HOUSES: House[] = [
  {
    id: "current",
    name: "Current Home",
    subtitle: "Downtown Apartment",
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/15 dark:bg-blue-500/20",
    type: "current",
  },
  {
    id: "shift",
    name: "Shift Home",
    subtitle: "Lakeside Villa",
    iconColor: "text-orange-500 dark:text-orange-400",
    bgColor: "bg-orange-500/15 dark:bg-orange-500/20",
    type: "shift",
  },
];

interface MyHousesScreenProps {
  onNavigate?: (view: "current_home" | "shift_home") => void;
}

export function MyHousesScreen({ onNavigate }: MyHousesScreenProps) {
  const [houses, setHouses] = useState<House[]>(DEFAULT_HOUSES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    const id = `house-${Date.now()}`;
    setHouses((prev) => [
      ...prev,
      {
        id,
        name: newName.trim(),
        subtitle: newSubtitle.trim() || "My House",
        iconColor: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-500/15 dark:bg-purple-500/20",
        type: "custom",
      },
    ]);
    setNewName("");
    setNewSubtitle("");
    setShowAddModal(false);
  };

  const handleRowClick = (house: House) => {
    if (house.type === "current" && onNavigate) onNavigate("current_home");
    if (house.type === "shift"   && onNavigate) onNavigate("shift_home");
  };

  return (
    <>
      <div className="flex flex-col w-full max-w-2xl gap-4">
        {/* House rows */}
        <motion.div
          className="flex flex-col gap-3"
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        >
          {houses.map((house) => (
            <motion.button
              key={house.id}
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRowClick(house)}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-[22px] bg-white/20 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:bg-white/30 dark:hover:bg-white/[0.10] transition-all duration-200 text-left group"
            >
              {/* Icon bubble */}
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", house.bgColor)}>
                <Home className={cn("w-6 h-6", house.iconColor)} strokeWidth={2} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-slate-800 dark:text-white">{house.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate">{house.subtitle}</p>
              </div>

              {/* Chevron */}
              <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0" />
            </motion.button>
          ))}

          {/* Add New House */}
          <motion.button
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-[22px] bg-white/20 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:bg-white/30 dark:hover:bg-white/[0.10] transition-all duration-200 text-left group"
          >
            {/* Green plus bubble */}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-green-500/15 dark:bg-green-500/20">
              <Plus className="w-6 h-6 text-green-600 dark:text-green-400" strokeWidth={2.5} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-slate-800 dark:text-white">Add New House</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Create a new digital twin</p>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0" />
          </motion.button>
        </motion.div>
      </div>

      {/* Add House Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="fixed inset-x-4 bottom-8 z-50 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-sm"
            >
              <div className="bg-white/80 dark:bg-[#1c1f26]/90 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[28px] shadow-2xl p-6 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-base font-bold text-slate-800 dark:text-white">New House</p>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center hover:bg-black/20 transition-colors">
                    <X className="w-4 h-4 text-slate-600 dark:text-white" />
                  </button>
                </div>

                {/* Inputs */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">House Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Beach House"
                      className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                      autoFocus
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Location / Subtitle</label>
                    <input
                      type="text"
                      value={newSubtitle}
                      onChange={(e) => setNewSubtitle(e.target.value)}
                      placeholder="e.g. Malibu, California"
                      className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                      onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 rounded-2xl bg-black/5 dark:bg-white/5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={!newName.trim()}
                    className="flex-1 py-3 rounded-2xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Add House
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
