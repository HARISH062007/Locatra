"use client";

import { motion } from "framer-motion";
import { useSpatial } from "@/contexts/SpatialContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Define a realistic interconnected floorplan
const rooms = [
  {
    id: "living room",
    label: "Living Room",
    path: "M 100 100 L 400 100 L 400 350 L 100 350 Z",
    cx: 250,
    cy: 225,
    furniture: [
      { id: "sofa", path: "M 150 150 L 350 150 L 350 180 L 150 180 Z" }, // Sofa
      { id: "coffee table", path: "M 200 220 L 300 220 L 300 260 L 200 260 Z" }, // Coffee table
      { id: "tv", path: "M 120 320 L 380 320 L 380 330 L 120 330 Z" } // TV
    ]
  },
  {
    id: "kitchen",
    label: "Kitchen",
    path: "M 400 100 L 700 100 L 700 250 L 400 250 Z",
    cx: 550,
    cy: 175,
    furniture: [
      { id: "kitchen island", path: "M 480 140 L 620 140 L 620 180 L 480 180 Z" }
    ]
  },
  {
    id: "dining area",
    label: "Dining Area",
    path: "M 400 250 L 700 250 L 700 400 L 400 400 Z",
    cx: 550,
    cy: 325,
    furniture: [
      { id: "dining table", path: "M 480 300 L 620 300 L 620 350 L 480 350 Z" }
    ]
  },
  {
    id: "hallway",
    label: "Hallway",
    path: "M 300 350 L 400 350 L 400 500 L 300 500 Z",
    cx: 350,
    cy: 425,
    furniture: []
  },
  {
    id: "bedroom",
    label: "Bedroom",
    path: "M 100 350 L 300 350 L 300 650 L 100 650 Z",
    cx: 200,
    cy: 500,
    furniture: [
      { id: "bed", path: "M 120 400 L 220 400 L 220 520 L 120 520 Z" }
    ]
  },
  {
    id: "bathroom",
    label: "Bathroom",
    path: "M 400 400 L 600 400 L 600 650 L 400 650 Z",
    cx: 500,
    cy: 525,
    furniture: []
  },
];

export function InteractiveBlueprint({ className, style }: { className?: string, style?: React.CSSProperties }) {
  const { activeRoom, setHoveredRoom } = useSpatial();
  const [localHover, setLocalHover] = useState<string | null>(null);

  const query = activeRoom?.toLowerCase() || "";

  return (
    <div 
      className={cn("w-full h-full flex items-center justify-center", className)}
      style={{
        ...style,
        perspective: "1200px" // Perspective container
      }}
    >
      <motion.div
        className="relative w-full h-full max-w-[1200px] max-h-[1200px]"
        initial={{ rotateX: 60, rotateZ: -35, scale: 1.2, y: 100 }}
        animate={{ rotateX: 60, rotateZ: -35, scale: 1.2, y: 100 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg 
          viewBox="0 0 800 800" 
          className="w-full h-full drop-shadow-2xl" 
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: "visible" }}
        >
          <defs>
            <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
            
            {/* Soft AR glow filter */}
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComponentTransfer in="blur" result="glow">
                <feFuncA type="linear" slope="1.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Scanning sweep gradient */}
            <linearGradient id="scan-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(59,130,246,0)" />
              <stop offset="50%" stopColor="rgba(59,130,246,0.15)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </linearGradient>
            
            <mask id="blueprint-mask">
              {rooms.map(r => <path key={r.id} d={r.path} fill="white" />)}
            </mask>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#arch-grid)" className="pointer-events-none" />

          {/* Rooms Layer */}
          {rooms.map((room) => {
            // Match room or furniture
            const isRoomMatch = query && room.id.includes(query);
            const matchingFurniture = room.furniture.filter(f => query && f.id.includes(query));
            const hasMatch = isRoomMatch || matchingFurniture.length > 0;
            const isHovered = localHover === room.id;
            
            // Interaction States
            const baseOpacity = 0.15;
            const matchOpacity = 0.5;
            const hoverOpacity = 0.3;
            
            const currentOpacity = hasMatch ? matchOpacity : isHovered ? hoverOpacity : baseOpacity;

            return (
              <motion.g 
                key={room.id}
                onMouseEnter={() => {
                  setHoveredRoom(room.id);
                  setLocalHover(room.id);
                }}
                onMouseLeave={() => {
                  setHoveredRoom(null);
                  setLocalHover(null);
                }}
                className="cursor-pointer"
                animate={{ opacity: currentOpacity }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Hit Area */}
                <path d={room.path} fill="transparent" className="pointer-events-auto" />

                {/* Glowing Room Fill (Active) */}
                <motion.path
                  d={room.path}
                  initial={{ fillOpacity: 0 }}
                  animate={{ fillOpacity: isRoomMatch ? 0.08 : 0 }}
                  className="fill-blue-400"
                  style={{ filter: "url(#soft-glow)" }}
                  transition={{ duration: 0.6 }}
                  pointerEvents="none"
                />

                {/* Technical Room Outline */}
                <motion.path
                  d={room.path}
                  fill="none"
                  animate={{ strokeWidth: hasMatch ? 1.5 : 0.75 }}
                  className={hasMatch ? "stroke-blue-200" : "stroke-white/40"}
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  transition={{ duration: 0.4 }}
                  pointerEvents="none"
                />

                {/* Furniture Render */}
                {room.furniture.map(furn => {
                  const isFurnMatch = query && furn.id.includes(query);
                  return (
                    <motion.path
                      key={furn.id}
                      d={furn.path}
                      fill="none"
                      animate={{ 
                        strokeWidth: isFurnMatch ? 1.5 : 0.5,
                        stroke: isFurnMatch ? "rgba(96, 165, 250, 0.8)" : "rgba(255, 255, 255, 0.2)"
                      }}
                      className={isFurnMatch ? "stroke-blue-400" : "stroke-white/20"}
                      style={isFurnMatch ? { filter: "url(#soft-glow)" } : {}}
                      transition={{ duration: 0.4 }}
                      pointerEvents="none"
                    />
                  );
                })}

                {/* Technical Node (Corner) */}
                <motion.circle
                  cx={room.cx}
                  cy={room.cy}
                  r="2"
                  animate={{ opacity: hasMatch ? 1 : 0.3 }}
                  className="fill-white/60"
                  pointerEvents="none"
                />
              </motion.g>
            );
          })}

          {/* Ambient Scanning Line */}
          <motion.rect
            width="100%"
            height="50%"
            fill="url(#scan-grad)"
            mask="url(#blueprint-mask)"
            className="pointer-events-none"
            initial={{ y: "-50%" }}
            animate={{ y: "200%" }}
            transition={{
              duration: 8,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 12
            }}
          />
        </svg>

        {/* HTML Tooltip Layer for Hover Labels */}
        {rooms.map((room) => {
          const isHovered = localHover === room.id;
          if (!isHovered) return null;
          
          return (
            <div
              key={`tooltip-${room.id}`}
              className="absolute pointer-events-none flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(room.cx / 800) * 100}%`,
                top: `${(room.cy / 800) * 100}%`,
                // Reverse the perspective rotation so the text faces the camera
                transform: `translate(-50%, -50%) rotateX(-60deg) rotateZ(35deg)`
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1.5 rounded uppercase tracking-widest border border-white/20 whitespace-nowrap shadow-xl"
              >
                {room.label}
                <div className="text-blue-300/80 text-[8px] mt-0.5 tracking-normal normal-case">
                  {room.furniture.length} Objects • Scanned Today
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
