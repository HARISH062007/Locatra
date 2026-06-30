"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Camera, Package, Cloud, AlertCircle, 
  MapPin, Clock, MoreVertical, Trash2, Archive, ExternalLink,
  CheckCircle2, Box, Info
} from "lucide-react";
import { GlassCard, GlassButton } from "@/components/ui";

// Mock Data
type ActivityType = 'ai' | 'scan' | 'moving' | 'system';
type Priority = 'normal' | 'high' | 'critical';

interface Activity {
  id: string;
  type: ActivityType;
  priority: Priority;
  title: string;
  description: string;
  room: string;
  time: string;
  isRead: boolean;
  icon: any;
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    type: "ai",
    priority: "normal",
    title: "AI Suggestion",
    description: "Coffee table blocks the main walking path.",
    room: "Living Room",
    time: "5 minutes ago",
    isRead: false,
    icon: Sparkles
  },
  {
    id: "act-2",
    type: "scan",
    priority: "high",
    title: "Room Scan Complete",
    description: "Living Room digital twin generated successfully.",
    room: "Living Room",
    time: "1 hour ago",
    isRead: false,
    icon: Camera
  },
  {
    id: "act-3",
    type: "system",
    priority: "critical",
    title: "System Alert",
    description: "Low cloud storage space remaining. Upgrade to Pro.",
    room: "Account",
    time: "2 hours ago",
    isRead: false,
    icon: AlertCircle
  },
  {
    id: "act-4",
    type: "moving",
    priority: "normal",
    title: "Moving Progress",
    description: "3 out of 15 boxes packed for the Kitchen.",
    room: "Kitchen",
    time: "4 hours ago",
    isRead: true,
    icon: Package
  },
  {
    id: "act-5",
    type: "scan",
    priority: "normal",
    title: "Object Detection",
    description: "Found 12 new objects in Bedroom 2.",
    room: "Bedroom 2",
    time: "Yesterday",
    isRead: true,
    icon: Box
  },
  {
    id: "act-6",
    type: "system",
    priority: "normal",
    title: "Cloud Sync",
    description: "All assets successfully synced to the cloud.",
    room: "System",
    time: "Yesterday",
    isRead: true,
    icon: Cloud
  }
];

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI' },
  { id: 'scan', label: 'Scans' },
  { id: 'moving', label: 'Moving' },
  { id: 'system', label: 'System' },
];

const springConfig = { type: "spring", stiffness: 400, damping: 25 };

export function ActivityScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);

  const filteredActivities = activities.filter(act => 
    activeTab === 'all' ? true : act.type === activeTab
  );

  const markAsRead = (id: string) => {
    setActivities(acts => acts.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const removeActivity = (id: string) => {
    setActivities(acts => acts.filter(a => a.id !== id));
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-full font-sans">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide py-2 px-1">
        <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/20 shadow-sm rounded-full flex items-center p-1 w-max">
          {TABS.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileTap={{ scale: 0.95 }}
              transition={springConfig}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 z-10 ${
                activeTab === tab.id 
                  ? 'text-slate-900 dark:text-white' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeFilterBubble"
                  className="absolute inset-0 bg-white/60 dark:bg-white/20 rounded-full shadow-sm pointer-events-none"
                  transition={springConfig}
                  style={{ zIndex: -1 }}
                />
              )}
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pt-2 pb-32 pr-2 [mask-image:linear-gradient(to_bottom,transparent,black_12px,black_calc(100%-100px),transparent_calc(100%-30px))] -webkit-[mask-image:linear-gradient(to_bottom,transparent,black_12px,black_calc(100%-100px),transparent_calc(100%-30px))]">
        <AnimatePresence mode="popLayout">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                index={index} 
                onRead={() => markAsRead(activity.id)}
                onRemove={() => removeActivity(activity.id)}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={springConfig}
              className="w-full h-64 flex flex-col items-center justify-center text-center mt-12"
            >
              <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/20 shadow-sm rounded-[24px] sm:rounded-[32px] p-12 flex flex-col items-center max-w-md">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 mb-6 shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 tracking-wide">Your home is fully up to date.</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">No new activities or alerts to show right now.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ActivityCard({ activity, index, onRead, onRemove }: { activity: Activity, index: number, onRead: () => void, onRemove: () => void }) {
  const [showActions, setShowActions] = useState(false);

  // Determine colors based on type and priority
  let iconBg = "bg-blue-500/20";
  let iconColor = "text-blue-400";
  let borderColor = "border-blue-400/30";
  
  if (activity.priority === 'critical') {
    iconBg = "bg-red-500/20";
    iconColor = "text-red-400";
    borderColor = "border-red-400/30";
  } else if (activity.priority === 'high') {
    iconBg = "bg-amber-500/20";
    iconColor = "text-amber-400";
    borderColor = "border-amber-400/30";
  } else if (activity.type === 'ai') {
    iconBg = "bg-purple-500/20";
    iconColor = "text-purple-400";
    borderColor = "border-purple-400/30";
  } else if (activity.type === 'moving') {
    iconBg = "bg-emerald-500/20";
    iconColor = "text-emerald-400";
    borderColor = "border-emerald-400/30";
  }

  const getActionText = () => {
    switch (activity.type) {
      case 'ai': return 'View Suggestion';
      case 'scan': return 'Open Scanner';
      case 'moving': return 'View Progress';
      default: return 'Preview';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05, ...springConfig } }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="relative mb-4 group"
    >
      <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/20 shadow-sm rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center hover:bg-white/70 dark:hover:bg-white/20 transition-colors duration-300">

        {/* Icon */}
        <div className={`w-12 h-12 shrink-0 rounded-[20px] flex items-center justify-center border ${iconBg} ${borderColor} shadow-sm`}>
          <activity.icon className={`w-6 h-6 ${iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`text-base font-bold truncate tracking-wide ${!activity.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              {activity.title}
            </h4>
            {!activity.isRead && <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 shrink-0 shadow-sm" />}
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 truncate">
            {activity.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1 bg-white/40 dark:bg-white/10 border border-white/50 dark:border-white/10 px-2 py-1 rounded-md shadow-sm">
              <MapPin className="w-3 h-3" /> {activity.room}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {activity.time}
            </div>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2 shrink-0 ml-4">
          <GlassButton variant="secondary" className="py-2 px-4 text-xs font-semibold">
            <ExternalLink className="w-3 h-3 mr-1" /> {getActionText()}
          </GlassButton>
          
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowActions(!showActions)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>
            
            <AnimatePresence>
              {showActions && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={springConfig}
                  className="absolute right-0 top-full mt-2 w-48 bg-white/80 dark:bg-white/10 backdrop-blur-xl z-10 overflow-hidden flex flex-col py-1 border border-white/50 dark:border-white/20 shadow-lg rounded-xl"
                >
                  {!activity.isRead && (
                    <button onClick={() => { onRead(); setShowActions(false); }} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 text-left flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Mark as Read
                    </button>
                  )}
                  <button onClick={() => { onRemove(); setShowActions(false); }} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 text-left flex items-center gap-2">
                    <Archive className="w-4 h-4" /> Archive
                  </button>
                  <button onClick={() => { onRemove(); setShowActions(false); }} className="px-4 py-2 text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 text-left flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="sm:hidden flex items-center gap-2 mt-2 pt-4 border-t border-white/10">
          <GlassButton variant="secondary" className="flex-1 py-2 text-xs justify-center">
            {getActionText()}
          </GlassButton>
          {!activity.isRead && (
            <GlassButton variant="ghost" onClick={onRead} className="px-4 py-2 text-xs bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] text-slate-200">
              Read
            </GlassButton>
          )}
          <GlassButton variant="danger" onClick={onRemove} className="px-4 py-2 text-xs">
            Delete
          </GlassButton>
        </div>
        
      </div>
    </motion.div>
  );
}
