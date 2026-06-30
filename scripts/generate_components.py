import os

output_dir = r"d:\Harish\Locatra\src\components\ui"
os.makedirs(output_dir, exist_ok=True)

components = {
    "RoomBackground.tsx": """\"use client\";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RoomBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function RoomBackground({ children, className }: RoomBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900 font-sans selection:bg-slate-300", className)}>
      {/* Blueprint / Depth */}
      <div className="absolute inset-0 w-full h-full opacity-5 mix-blend-multiply pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/blueprint_background.png')] bg-cover bg-center grayscale" />
      </div>

      {/* Floating subtle light orbs for spatial depth */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-blue-100 rounded-full blur-[120px] pointer-events-none z-0 opacity-60" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-50 rounded-full blur-[120px] pointer-events-none z-0 opacity-60" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col w-full h-full">
        {children}
      </div>
    </div>
  );
}
""",
    "GlassCard.tsx": """\"use client\";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hoverable?: boolean;
}

export function GlassCard({ className, hoverable = false, children, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "backdrop-blur-xl bg-white/40 border border-white/60 rounded-[2rem] shadow-lg",
        hoverable && "hover:bg-white/60 hover:shadow-xl transition-all duration-300 cursor-pointer",
        className
      )}
      whileTap={hoverable ? { scale: 0.97 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
""",
    "GlassPanel.tsx": """\"use client\";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassPanel({ className, children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={cn(
        "backdrop-blur-3xl bg-white/70 border border-white/80 rounded-[3rem] shadow-2xl p-8",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
""",
    "GlassButton.tsx": """\"use client\";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export function GlassButton({ className, variant = 'primary', children, ...props }: GlassButtonProps) {
  const baseStyles = "relative overflow-hidden font-bold tracking-wide rounded-xl px-6 py-4 transition-all shadow-md flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-600 text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:bg-blue-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] border border-blue-500",
    secondary: "backdrop-blur-xl bg-white/70 text-slate-900 border border-white/80 hover:bg-white/90 hover:shadow-lg",
    danger: "backdrop-blur-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:shadow-lg",
    ghost: "bg-transparent text-slate-600 shadow-none hover:bg-black/5 hover:text-slate-900",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
""",
    "GlassInput.tsx": """\"use client\";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-5 py-4 rounded-2xl backdrop-blur-md bg-white/40 border border-white/60",
            "text-slate-900 placeholder:text-slate-400 font-medium",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/60 transition-all shadow-sm",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
GlassInput.displayName = "GlassInput";
""",
    "GlassSearch.tsx": """\"use client\";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

export function GlassSearch({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-11 pr-4 py-4 backdrop-blur-2xl bg-white/50 border border-white/70 rounded-2xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/70 transition-all shadow-lg"
        placeholder="Search rooms, objects..."
        {...props}
      />
    </div>
  );
}
""",
    "GlassModal.tsx": """\"use client\";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function GlassModal({ isOpen, onClose, children, className }: GlassModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-200/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "relative w-full max-w-lg backdrop-blur-3xl bg-white/80 border border-white/80 rounded-[3rem] shadow-2xl overflow-hidden p-8",
              className
            )}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
""",
    "FloatingDock.tsx": """\"use client\";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DockItem {
  id: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  return (
    <div className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-md", className)}>
      <div className="backdrop-blur-3xl bg-white/70 border border-white/80 rounded-[2.5rem] shadow-2xl p-3 flex items-center justify-between px-6">
        {items.map((item) => (
          <motion.button
            key={item.id}
            onClick={item.onClick}
            whileTap={{ scale: 0.9 }}
            className="relative flex flex-col items-center justify-center p-2 group"
          >
            <div className={cn(
              "transition-all duration-300 relative z-10",
              item.isActive ? "text-blue-600 scale-110" : "text-slate-400 group-hover:text-slate-600"
            )}>
              {item.icon}
            </div>
            {item.isActive && (
              <motion.div
                layoutId="dock-indicator"
                className="absolute inset-0 bg-blue-100 rounded-2xl -z-0"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
""",
    "TopNavigation.tsx": """\"use client\";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface TopNavigationProps {
  title: string;
  onBack?: () => void;
  actions?: ReactNode;
  className?: string;
}

export function TopNavigation({ title, onBack, actions, className }: TopNavigationProps) {
  return (
    <div className={cn("sticky top-0 z-40 w-full backdrop-blur-2xl bg-white/60 border-b border-white/60", className)}>
      <div className="flex h-16 items-center justify-between px-4 max-w-2xl mx-auto w-full">
        <div className="w-12 flex justify-start">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-black/5 text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
        </div>
        
        <h1 className="text-lg font-bold tracking-tight text-slate-900 truncate px-2">
          {title}
        </h1>
        
        <div className="w-12 flex justify-end">
          {actions}
        </div>
      </div>
    </div>
  );
}
""",
    "BottomNavigation.tsx": """\"use client\";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  children: ReactNode;
  className?: string;
}

export function BottomNavigation({ children, className }: BottomNavigationProps) {
  return (
    <div className={cn("fixed bottom-0 left-0 w-full z-40 pb-safe", className)}>
      <div className="backdrop-blur-3xl bg-white/80 border-t border-white/80 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] w-full">
        <div className="flex items-center justify-around h-16 px-4 max-w-2xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
""",
    "FloatingActionButton.tsx": """\"use client\";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FABProps {
  icon: ReactNode;
  onClick: () => void;
  className?: string;
}

export function FloatingActionButton({ icon, onClick, className }: FABProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center",
        "bg-blue-600 text-white shadow-[0_8px_32px_rgba(37,99,235,0.4)]",
        "hover:bg-blue-700 transition-colors border border-blue-500",
        className
      )}
    >
      {icon}
    </motion.button>
  );
}
""",
    "GlassBadge.tsx": """\"use client\";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassBadgeProps {
  children: ReactNode;
  variant?: 'slate' | 'blue' | 'emerald' | 'purple';
  className?: string;
}

export function GlassBadge({ children, variant = 'slate', className }: GlassBadgeProps) {
  const variants = {
    slate: "bg-slate-100/50 text-slate-700 border-slate-200/50",
    blue: "bg-blue-100/50 text-blue-700 border-blue-200/50",
    emerald: "bg-emerald-100/50 text-emerald-700 border-emerald-200/50",
    purple: "bg-purple-100/50 text-purple-700 border-purple-200/50",
  };

  return (
    <span className={cn(
      "inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase backdrop-blur-md border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
""",
    "StatusChip.tsx": """\"use client\";

import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface StatusChipProps {
  status: 'success' | 'warning' | 'pending' | 'offline';
  label: string;
  className?: string;
}

export function StatusChip({ status, label, className }: StatusChipProps) {
  const styles = {
    success: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: <CheckCircle2 className="w-3 h-3 text-emerald-500" /> },
    warning: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: <AlertCircle className="w-3 h-3 text-amber-500" /> },
    pending: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: <Clock className="w-3 h-3 text-blue-500" /> },
    offline: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", icon: <div className="w-2 h-2 rounded-full bg-slate-400" /> },
  };

  const current = styles[status];

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border backdrop-blur-sm",
      current.bg, current.text, current.border,
      className
    )}>
      {current.icon}
      {label}
    </div>
  );
}
""",
    "SectionHeader.tsx": """\"use client\";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("w-full flex items-end justify-between mb-4 px-2", className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm font-medium text-slate-500">{subtitle}</p>}
      </div>
      {action && (
        <div className="shrink-0">{action}</div>
      )}
    </div>
  );
}
""",
    "EmptyState.tsx": """\"use client\";

import { ReactNode } from "react";
import { GlassCard } from "./GlassCard";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <GlassCard className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6 text-slate-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm font-medium text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action}
    </GlassCard>
  );
}
""",
    "ScannerHUD.tsx": """\"use client\";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScannerHUDProps {
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ScannerHUD({ onClose, title, subtitle, children, className }: ScannerHUDProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-50 bg-slate-200/40 backdrop-blur-xl flex flex-col font-sans text-slate-900",
        className
      )}
    >
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center p-6 relative z-50 pointer-events-auto">
        <div className="flex flex-col">
          {title && <h2 className="text-xl font-bold text-slate-900">{title}</h2>}
          {subtitle && <p className="text-sm font-bold text-slate-500">{subtitle}</p>}
        </div>
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/70 border border-white/80 hover:bg-white text-slate-900 transition-all shadow-md"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Viewport Overlay Content */}
      <div className="flex-1 w-full flex flex-col items-center justify-center p-6 relative z-10 pointer-events-none">
        {children}
      </div>
    </motion.div>
  );
}
""",
    "FloatingPanel.tsx": """\"use client\";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function FloatingPanel({ isOpen, onClose, children, className }: FloatingPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed bottom-0 left-0 w-full z-50 rounded-t-[3rem] backdrop-blur-3xl bg-white/80 border-t border-white/80 shadow-[0_-20px_60px_rgba(0,0,0,0.1)] p-6 pb-safe",
              className
            )}
          >
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-8" />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
""",
    "ContextMenu.tsx": """\"use client\";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  items: ContextMenuItem[];
}

export function ContextMenu({ isOpen, x, y, onClose, items }: ContextMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ top: y, left: x }}
            className="fixed z-50 w-56 backdrop-blur-3xl bg-white/80 border border-white/80 rounded-2xl shadow-2xl overflow-hidden py-1"
          >
            {items.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-black/5 text-left",
                  item.danger ? "text-red-600" : "text-slate-900",
                  idx !== items.length - 1 && "border-b border-black/5"
                )}
              >
                {item.icon && <span className="w-5 h-5">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
""",
    "Toast.tsx": """\"use client\";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  onClose: () => void;
}

export function Toast({ type = 'info', title, message, onClose }: ToastProps) {
  const styles = {
    success: { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
    error: { icon: <AlertCircle className="w-5 h-5 text-red-500" /> },
    info: { icon: <Info className="w-5 h-5 text-blue-500" /> },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="pointer-events-auto w-full max-w-sm backdrop-blur-3xl bg-white/90 border border-white/80 shadow-2xl rounded-2xl p-4 flex gap-4 items-start mx-auto mb-2"
    >
      <div className="shrink-0 mt-0.5">{styles[type].icon}</div>
      <div className="flex-1 flex flex-col">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        {message && <p className="text-xs font-medium text-slate-500 mt-1">{message}</p>}
      </div>
      <button onClick={onClose} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
""",
    "NotificationBubble.tsx": """\"use client\";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NotificationBubbleProps {
  count: number;
  className?: string;
}

export function NotificationBubble({ count, className }: NotificationBubbleProps) {
  if (count <= 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        "absolute -top-2 -right-2 min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center",
        "bg-red-500 text-white text-[10px] font-bold shadow-md border-2 border-white z-10",
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </motion.div>
  );
}
""",
    "index.ts": """export * from './RoomBackground';
export * from './GlassCard';
export * from './GlassPanel';
export * from './GlassButton';
export * from './GlassInput';
export * from './GlassSearch';
export * from './GlassModal';
export * from './FloatingDock';
export * from './TopNavigation';
export * from './BottomNavigation';
export * from './FloatingActionButton';
export * from './GlassBadge';
export * from './StatusChip';
export * from './SectionHeader';
export * from './EmptyState';
export * from './ScannerHUD';
export * from './FloatingPanel';
export * from './ContextMenu';
export * from './Toast';
export * from './NotificationBubble';
"""
}

for name, content in components.items():
    with open(os.path.join(output_dir, name), "w", encoding="utf-8") as f:
        f.write(content)

print(f"Generated {len(components)} components in {output_dir}")
