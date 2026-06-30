"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type BackgroundMode = "default" | "history" | "scanner" | "new_house";

interface SpatialContextProps {
  activeRoom: string | null;
  setActiveRoom: (room: string | null) => void;
  hoveredRoom: string | null;
  setHoveredRoom: (room: string | null) => void;
  backgroundMode: BackgroundMode;
  setBackgroundMode: (mode: BackgroundMode) => void;
}

const SpatialContext = createContext<SpatialContextProps | undefined>(undefined);

export function SpatialProvider({ children }: { children: ReactNode }) {
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>("default");

  return (
    <SpatialContext.Provider value={{ activeRoom, setActiveRoom, hoveredRoom, setHoveredRoom, backgroundMode, setBackgroundMode }}>
      {children}
    </SpatialContext.Provider>
  );
}

export function useSpatial() {
  const context = useContext(SpatialContext);
  if (!context) {
    throw new Error("useSpatial must be used within a SpatialProvider");
  }
  return context;
}
