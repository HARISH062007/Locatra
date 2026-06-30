import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
  // Account
  name: string;
  email: string;
  phone: string;
  profilePic: string | null;
  connectedAccounts: string[];

  // Home
  defaultHouse: string;
  defaultRoom: string;
  units: 'metric' | 'imperial';
  homeAddress: string;

  // Scanner
  cameraQuality: 'high' | 'medium' | 'low';
  preferredCamera: 'front' | 'rear';
  autoSaveScans: boolean;
  scanGrid: boolean;
  scannerSounds: boolean;
  haptic: boolean;

  // AI
  aiSuggestions: boolean;
  furnitureRecs: boolean;
  spaceOpt: boolean;
  autoObject: boolean;
  smartNotif: boolean;

  // Notifications
  notifPush: boolean;
  notifEmail: boolean;
  notifComplete: boolean;
  notifRecs: boolean;
  notifWeekly: boolean;
  notifLogin: boolean;
  notifMoving: boolean;

  // Appearance
  theme: 'light' | 'dark' | 'system';
  glassTransparency: number;
  backgroundBlur: number;
  accent: 'blue' | 'emerald' | 'orange';
  reduceMotion: boolean;

  // Privacy
  dataStorageLocation: string;

  // Actions
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  updateProfile: (profile: Partial<SettingsState>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  name: "John Doe",
  email: "john@locatra.ai",
  phone: "+1 (555) 123-4567",
  profilePic: null,
  connectedAccounts: ["Google", "Apple"],
  
  defaultHouse: "Main Residence",
  defaultRoom: "Living Room",
  units: "metric" as const,
  homeAddress: "",

  cameraQuality: "high" as const,
  preferredCamera: "rear" as const,
  autoSaveScans: true,
  scanGrid: true,
  scannerSounds: false,
  haptic: true,

  aiSuggestions: true,
  furnitureRecs: true,
  spaceOpt: false,
  autoObject: true,
  smartNotif: true,

  notifPush: true,
  notifEmail: true,
  notifComplete: true,
  notifRecs: true,
  notifWeekly: false,
  notifLogin: true,
  notifMoving: false,

  theme: "system" as const,
  glassTransparency: 40,
  backgroundBlur: 24,
  accent: "blue" as const,
  reduceMotion: false,

  dataStorageLocation: "US East",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      updateSetting: (key, value) => set({ [key]: value }),
      updateProfile: (profile) => set((state) => ({ ...state, ...profile })),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'locatra-settings',
    }
  )
);
