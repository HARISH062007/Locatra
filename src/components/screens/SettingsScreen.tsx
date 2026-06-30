"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Home, Camera, Sparkles, Bell, 
  Palette, Shield, Cloud, Info, ChevronRight, LogOut, Check
} from "lucide-react";
import { GlassCard, GlassSwitch, GlassSlider, GlassButton } from "@/components/ui";
import { useSettingsStore } from "@/store/settingsStore";
import { SettingsModals, ModalType } from "./SettingsModals";

const CATEGORIES = [
  { id: "account", label: "Account", icon: User },
  { id: "home", label: "Home Management", icon: Home },
  { id: "scanner", label: "Scanner", icon: Camera },
  { id: "ai", label: "AI Preferences", icon: Sparkles },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "storage", label: "Storage", icon: Cloud },
  { id: "about", label: "About", icon: Info },
];

export function SettingsScreen() {
  const [activeCategory, setActiveCategory] = useState("account");
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  
  const settings = useSettingsStore();

  // Load theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        settings.updateSetting("theme", savedTheme);
      }
    }
  }, []);

  const applyTheme = (themeValue: string) => {
    if (typeof window === "undefined") return;
    
    let isDark = false;
    if (themeValue === "dark") {
      isDark = true;
    } else if (themeValue === "light") {
      isDark = false;
    } else {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    if (themeValue === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", themeValue);
    }
    
    window.dispatchEvent(new Event("themechange"));
  };

  // Sync with system preferences if theme is 'system'
  useEffect(() => {
    if (settings.theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      window.dispatchEvent(new Event("themechange"));
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [settings.theme]);

  const updateSetting = (key: keyof typeof settings, value: any) => {
    settings.updateSetting(key as any, value);
    if (key === "theme") {
      applyTheme(value);
    }
    if (key === "glassTransparency" || key === "backgroundBlur") {
      document.documentElement.style.setProperty('--glass-opacity', String(key === "glassTransparency" ? value / 100 : settings.glassTransparency / 100));
      document.documentElement.style.setProperty('--glass-blur', String(key === "backgroundBlur" ? value : settings.backgroundBlur) + 'px');
    }
  };

  const renderContent = (categoryId: string) => {
    switch (categoryId) {
      case "account":
        return (
          <SettingsSection title="Account Settings" description="Manage your personal information and connected services.">
            <SettingsRow title="Profile Picture" value="Tap to edit" isAction onClick={() => {}} />
            <SettingsRow title="Name" value={settings.name} isAction onClick={() => setActiveModal('edit_name')} />
            <SettingsRow title="Email Address" value={settings.email} isAction onClick={() => setActiveModal('edit_email')} />
            <SettingsRow title="Phone Number" value={settings.phone} isAction onClick={() => setActiveModal('edit_phone')} />
            <SettingsRow title="Change Password" isAction onClick={() => setActiveModal('change_password')} />
            <SettingsRow title="Connected Accounts" value={settings.connectedAccounts.join(', ')} isAction onClick={() => setActiveModal('connected_accounts')} />
          </SettingsSection>
        );
      case "home":
        return (
          <SettingsSection title="Home Management" description="Configure your default spaces and measurement units.">
            <SettingsRow title="Default House" value={settings.defaultHouse} isAction onClick={() => setActiveModal('manage_houses')} />
            <SettingsRow title="Manage Houses" value="3 Houses" isAction onClick={() => setActiveModal('manage_houses')} />
            <SettingsRow title="Default Room" value={settings.defaultRoom} isAction onClick={() => {}} />
            <div className="py-4 border-b border-white/10 dark:border-white/5 last:border-0 flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-200 font-medium">Measurement Units</span>
              <div className="flex bg-slate-200/50 dark:bg-black/20 rounded-lg p-1 backdrop-blur-sm border border-white/40 dark:border-white/10">
                <button onClick={() => updateSetting("units", "metric")} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${settings.units === 'metric' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'}`}>Metric</button>
                <button onClick={() => updateSetting("units", "imperial")} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${settings.units === 'imperial' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'}`}>Imperial</button>
              </div>
            </div>
            <SettingsRow title="Home Address" value={settings.homeAddress || "Optional"} isAction onClick={() => setActiveModal('home_address')} />
          </SettingsSection>
        );
      case "scanner":
        return (
          <SettingsSection title="Scanner Preferences" description="Adjust hardware and visual settings for the spatial scanner.">
            <div className="py-4 border-b border-white/10 dark:border-white/5 last:border-0 flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-200 font-medium">Camera Quality</span>
              <div className="flex gap-2">
                {['high', 'medium', 'low'].map(q => (
                  <button key={q} onClick={() => updateSetting("cameraQuality", q)} className={`px-3 py-1 text-xs uppercase font-bold rounded-full border ${settings.cameraQuality === q ? 'bg-blue-100 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400' : 'bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 text-slate-500 hover:bg-white/60'}`}>{q}</button>
                ))}
              </div>
            </div>
            <div className="py-4 border-b border-white/10 dark:border-white/5 last:border-0 flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-200 font-medium">Preferred Camera</span>
              <div className="flex bg-slate-200/50 dark:bg-black/20 rounded-lg p-1 backdrop-blur-sm border border-white/40 dark:border-white/10">
                <button onClick={() => updateSetting("preferredCamera", "rear")} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${settings.preferredCamera === 'rear' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'}`}>Rear</button>
                <button onClick={() => updateSetting("preferredCamera", "front")} className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${settings.preferredCamera === 'front' ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'}`}>Front</button>
              </div>
            </div>
            <SettingsToggle title="Auto Save Scans" checked={settings.autoSaveScans} onChange={(v) => updateSetting("autoSaveScans", v)} />
            <SettingsToggle title="Scan Grid Visibility" checked={settings.scanGrid} onChange={(v) => updateSetting("scanGrid", v)} />
            <SettingsToggle title="Scanner Sounds" checked={settings.scannerSounds} onChange={(v) => updateSetting("scannerSounds", v)} />
            <SettingsToggle title="Haptic Feedback" checked={settings.haptic} onChange={(v) => updateSetting("haptic", v)} />
          </SettingsSection>
        );
      case "ai":
        return (
          <SettingsSection title="AI Intelligence" description="Control how Locatra's spatial engine understands your space.">
            <SettingsToggle title="AI Suggestions" description="Enable core spatial intelligence features." checked={settings.aiSuggestions} onChange={(v) => updateSetting("aiSuggestions", v)} />
            <SettingsToggle title="Furniture Recommendations" checked={settings.furnitureRecs} onChange={(v) => updateSetting("furnitureRecs", v)} />
            <SettingsToggle title="Space Optimization" checked={settings.spaceOpt} onChange={(v) => updateSetting("spaceOpt", v)} />
            <SettingsToggle title="Automatic Object Detection" checked={settings.autoObject} onChange={(v) => updateSetting("autoObject", v)} />
            <SettingsToggle title="Smart Notifications" checked={settings.smartNotif} onChange={(v) => updateSetting("smartNotif", v)} />
          </SettingsSection>
        );
      case "notifications":
        return (
          <SettingsSection title="Notifications" description="Manage when and how Locatra contacts you.">
            <SettingsToggle title="Push Notifications" checked={settings.notifPush} onChange={(v) => updateSetting("notifPush", v)} />
            <SettingsToggle title="Email Notifications" checked={settings.notifEmail} onChange={(v) => updateSetting("notifEmail", v)} />
            <SettingsToggle title="Scan Complete" checked={settings.notifComplete} onChange={(v) => updateSetting("notifComplete", v)} />
            <SettingsToggle title="AI Recommendations" checked={settings.notifRecs} onChange={(v) => updateSetting("notifRecs", v)} />
            <SettingsToggle title="Weekly Summary" checked={settings.notifWeekly} onChange={(v) => updateSetting("notifWeekly", v)} />
            <SettingsToggle title="Moving Reminders" checked={settings.notifMoving} onChange={(v) => updateSetting("notifMoving", v)} />
            <SettingsToggle title="New Device Login" checked={settings.notifLogin} onChange={(v) => updateSetting("notifLogin", v)} />
          </SettingsSection>
        );
      case "appearance":
        return (
          <SettingsSection title="Appearance" description="Customize the visual experience of the workspace.">
            <div className="py-4 border-b border-white/10 dark:border-white/5 last:border-0 flex flex-col gap-3">
              <span className="text-slate-700 dark:text-slate-200 font-medium">Theme</span>
              <div className="flex bg-slate-200/50 dark:bg-black/20 rounded-lg p-1 backdrop-blur-sm border border-white/40 dark:border-white/10">
                {['light', 'dark', 'system'].map(t => (
                  <button key={t} onClick={() => updateSetting("theme", t)} className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md capitalize transition-colors ${settings.theme === t ? 'bg-white dark:bg-white/10 shadow-sm text-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'}`}>{t}</button>
                ))}
              </div>
            </div>
            
            <div className="py-4 border-b border-white/10 dark:border-white/5 last:border-0 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 dark:text-slate-200 font-medium">Glass Transparency</span>
                <span className="text-xs font-bold text-slate-500">{settings.glassTransparency}%</span>
              </div>
              <GlassSlider value={settings.glassTransparency} onChange={(v) => updateSetting("glassTransparency", v)} />
            </div>

            <div className="py-4 border-b border-white/10 dark:border-white/5 last:border-0 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 dark:text-slate-200 font-medium">Background Blur</span>
                <span className="text-xs font-bold text-slate-500">{settings.backgroundBlur}px</span>
              </div>
              <GlassSlider value={settings.backgroundBlur} max={50} onChange={(v) => updateSetting("backgroundBlur", v)} />
            </div>

            <div className="py-4 border-b border-white/10 dark:border-white/5 last:border-0 flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-200 font-medium">Accent Color</span>
              <div className="flex gap-2">
                {[
                  { id: 'blue', color: 'bg-blue-500' },
                  { id: 'emerald', color: 'bg-emerald-500' },
                  { id: 'orange', color: 'bg-orange-500' },
                ].map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => updateSetting("accent", c.id)}
                    className={`w-8 h-8 rounded-full ${c.color} shadow-inner flex items-center justify-center transition-transform hover:scale-110`}
                  >
                    {settings.accent === c.id && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <SettingsToggle title="Reduce Motion" checked={settings.reduceMotion} onChange={(v) => updateSetting("reduceMotion", v)} />
          </SettingsSection>
        );
      case "privacy":
        return (
          <SettingsSection title="Privacy & Security" description="Manage your data and security preferences.">
            <SettingsRow title="Camera Permissions" value="Granted" isAction onClick={() => {}} />
            <SettingsRow title="Data Storage Location" value={settings.dataStorageLocation} isAction onClick={() => {}} />
            <SettingsRow title="Export My Data" isAction onClick={() => setActiveModal('export_data')} />
            <SettingsRow title="Privacy Policy" isAction onClick={() => setActiveModal('privacy')} />
            <div className="py-4 pt-8 border-b border-white/10 dark:border-white/5 last:border-0">
              <button onClick={() => setActiveModal('delete_account')} className="text-red-500 font-bold text-sm hover:text-red-600 transition-colors">Delete Account</button>
            </div>
          </SettingsSection>
        );
      case "storage":
        return (
          <SettingsSection title="Storage" description="View and manage your cloud storage capacity.">
            <div className="py-6 flex flex-col gap-2">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">3.2 GB Used</span>
                <span className="text-xs font-semibold text-slate-500">15 GB Total</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 overflow-hidden shadow-inner flex">
                <div className="h-full bg-blue-500" style={{ width: '15%' }} title="Scans" />
                <div className="h-full bg-emerald-500" style={{ width: '4%' }} title="Floor Plans" />
                <div className="h-full bg-purple-500" style={{ width: '2.3%' }} title="Models" />
              </div>
              <div className="flex gap-4 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"/> Scans</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Floor Plans</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"/> 3D Models</div>
              </div>
            </div>
            <SettingsRow title="Projects" value="12" />
            <SettingsRow title="Scans" value="147" />
            <SettingsRow title="Floor Plans" value="3" />
            <div className="pt-6">
              <GlassButton variant="primary" className="w-full justify-center" onClick={() => setActiveModal('manage_storage')}>Manage Storage</GlassButton>
            </div>
          </SettingsSection>
        );
      case "about":
        return (
          <SettingsSection title="About Locatra" description="Information and legal documents.">
            <SettingsRow title="App Version" value="1.0.4 (Build 420)" />
            <SettingsRow title="Terms of Service" isAction onClick={() => setActiveModal('terms')} />
            <SettingsRow title="Privacy Policy" isAction onClick={() => setActiveModal('privacy')} />
            <SettingsRow title="Licenses" isAction onClick={() => setActiveModal('licenses')} />
            <SettingsRow title="Contact Support" isAction onClick={() => setActiveModal('support')} />
            <SettingsRow title="Send Feedback" isAction onClick={() => setActiveModal('feedback')} />
            <div className="pt-6">
              <GlassButton variant="secondary" className="w-full justify-center text-blue-600 dark:text-blue-400 font-bold border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/10 hover:bg-blue-100/50 dark:hover:bg-blue-500/20">
                Rate Locatra ★★★★★
              </GlassButton>
            </div>
          </SettingsSection>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 lg:gap-8 h-full">
        {/* LEFT COLUMN: Categories */}
        <div className="w-full md:w-64 lg:w-80 shrink-0 flex flex-col gap-6">
          
          {/* Profile Header */}
          <GlassCard className="p-5 flex items-center gap-4 bg-white/40 dark:bg-white/[0.06] border-white/50 dark:border-white/10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[2px] shadow-md">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 border border-white/50 dark:border-white/10 overflow-hidden flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600/50 dark:text-white/70" />
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">{settings.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{settings.email}</span>
                <span className="shrink-0 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Pro</span>
              </div>
            </div>
          </GlassCard>

          {/* Categories List (Desktop stick, Mobile scroll) */}
          <GlassCard className="p-2 flex flex-col gap-1 bg-white/30 dark:bg-white/[0.03] border-white/40 dark:border-white/5 overflow-y-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  activeCategory === cat.id 
                    ? "bg-white dark:bg-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-slate-200/60 dark:border-white/10" 
                    : "hover:bg-white/40 dark:hover:bg-white/5 border border-transparent"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${activeCategory === cat.id ? 'bg-blue-100 dark:bg-white/10 text-blue-600 dark:text-white' : 'bg-slate-200/50 dark:bg-black/20 text-slate-500 dark:text-slate-400'}`}>
                  <cat.icon className="w-4 h-4" />
                </div>
                <span className={`font-semibold text-sm ${activeCategory === cat.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{cat.label}</span>
                {activeCategory === cat.id && <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-auto" />}
              </button>
            ))}
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Settings Content */}
        <div className="flex-1 relative pb-24 md:pb-8 h-full">
          <GlassCard className="w-full min-h-full p-6 md:p-8 bg-white/40 dark:bg-white/[0.06] border-white/50 dark:border-white/10 backdrop-blur-2xl shadow-xl overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="w-full"
              >
                {renderContent(activeCategory)}
              </motion.div>
            </AnimatePresence>

            <div className="mt-12 pt-8 border-t border-slate-300/30 dark:border-white/5">
              <GlassButton onClick={() => setActiveModal('sign_out')} variant="secondary" className="w-full md:w-auto px-6 py-3 bg-red-50/50 dark:bg-red-500/10 hover:bg-red-100/50 dark:hover:bg-red-500/20 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-bold shadow-none">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </div>
      
      <SettingsModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </>
  );
}

// --- Helper Components for Settings ---

function SettingsSection({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
  return (
    <div className="w-full flex flex-col">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 mb-6">{description}</p>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ title, value, isAction, onClick }: { title: string, value?: string, isAction?: boolean, onClick?: () => void }) {
  return (
    <div onClick={isAction ? onClick : undefined} className={`py-4 border-b border-white/10 dark:border-white/5 last:border-0 flex items-center justify-between ${isAction ? 'cursor-pointer hover:opacity-70 transition-opacity' : ''}`}>
      <span className="text-slate-700 dark:text-slate-200 font-medium">{title}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{value}</span>}
        {isAction && <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
      </div>
    </div>
  );
}

function SettingsToggle({ title, description, checked, onChange }: { title: string, description?: string, checked: boolean, onChange: (c: boolean) => void }) {
  return (
    <div className="py-4 border-b border-white/10 dark:border-white/5 last:border-0 flex items-center justify-between">
      <div className="flex flex-col pr-4">
        <span className="text-slate-700 dark:text-slate-200 font-medium">{title}</span>
        {description && <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{description}</span>}
      </div>
      <GlassSwitch checked={checked} onChange={onChange} />
    </div>
  );
}
