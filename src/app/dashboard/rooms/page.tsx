"use client";

import { useState, useEffect } from "react";
import { Button, Card, Badge } from "@/components/ui";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RoomsPage() {
  const { data: dbRooms = [] } = useSWR<any[]>("/api/rooms", fetcher);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const formattedRooms = dbRooms.map((r) => ({
    id: r.id,
    name: r.name,
    dims: `${(Number(r.lengthCm) / 100).toFixed(1)}m × ${(Number(r.widthCm) / 100).toFixed(1)}m × ${(Number(r.heightCm) / 100).toFixed(1)}m`,
    spaces: r.spaces?.map((s: any) => s.label) || [],
    created: new Date(r.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    meshUrl: r.meshUrl,
    rawSpaces: r.spaces || [],
  }));

  useEffect(() => {
    if (formattedRooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(formattedRooms[0].id);
    }
  }, [dbRooms, selectedRoomId]);

  const activeRoom = formattedRooms.find((r) => r.id === selectedRoomId) || formattedRooms[0];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight">Digital Twins</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Explore and edit your mapped rooms and detected free spaces.
          </p>
        </div>
        <Link href="/dashboard/scan">
          <Button variant="primary">Map New Room</Button>
        </Link>
      </div>

      {formattedRooms.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Rooms list */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {formattedRooms.map((room) => {
              const active = activeRoom.id === room.id;
              return (
                <Card
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`flex flex-col gap-3 cursor-pointer border transition-all ${
                    active
                      ? "border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/5 glow-cyan"
                      : "border-[var(--color-border-glass)] hover:border-[var(--color-border-glass)]/60"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-heading font-bold">{room.name}</h3>
                    <Badge label={room.dims} variant="glass" />
                  </div>
                  <div className="text-xs text-[var(--color-on-surface-variant)]">
                    Spaces: {room.spaces.length > 0 ? room.spaces.join(", ") : "None detected"}
                  </div>
                  <div className="text-[10px] text-[var(--color-on-surface-variant)]/60 pt-2 border-t border-[var(--color-border-glass)]">
                    Mapped: {room.created}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Selected Room Detail & Blueprint */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Card className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-[var(--color-border-glass)] pb-4">
                <div>
                  <h3 className="font-heading text-xl font-bold">{activeRoom.name}</h3>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">Dimensions: {activeRoom.dims}</p>
                </div>
                <Badge label="Active Twin" variant="cyan" />
              </div>

              {/* Blueprint visualization */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border-glass)] bg-[var(--color-surface-container-lowest)]">
                <div className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: "radial-gradient(var(--color-accent-cyan) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  {/* Schematic Room SVG */}
                  <svg viewBox="0 0 400 240" className="w-full h-full text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor">
                    <rect x="30" y="30" width="340" height="180" rx="8" strokeWidth="2.5" className="text-[var(--color-border-glass)]" />
                    
                    <path d="M30 110 L30 140" strokeWidth="4" stroke="var(--color-accent-cyan)" />
                    <path d="M30 140 A30 30 0 0 1 60 170" strokeWidth="1" strokeDasharray="3 3" />
                    
                    <line x1="180" y1="30" x2="250" y2="30" strokeWidth="4" stroke="var(--color-accent-purple)" />

                    {activeRoom.rawSpaces.map((space: any, idx: number) => {
                      const coords = [
                        { x: 50, y: 50, w: 70, h: 50, label: "A" },
                        { x: 180, y: 140, w: 90, h: 50, label: "B" },
                        { x: 290, y: 50, w: 60, h: 70, label: "C" },
                      ][idx] || { x: 50, y: 50, w: 60, h: 60, label: "X" };

                      return (
                        <g key={space.id || idx} className="cursor-pointer group">
                          <rect
                            x={coords.x}
                            y={coords.y}
                            width={coords.w}
                            height={coords.h}
                            rx="4"
                            className="fill-[var(--color-accent-cyan)]/5 stroke-[var(--color-accent-cyan)]/30 stroke-1 hover:fill-[var(--color-accent-cyan)]/10 hover:stroke-[var(--color-accent-cyan)]/80 transition-all duration-300"
                          />
                          <circle cx={coords.x + coords.w/2} cy={coords.y + coords.h/2} r="12" className="fill-[var(--color-accent-cyan)]/20 stroke-[var(--color-accent-cyan)]" />
                          <text x={coords.x + coords.w/2} y={coords.y + coords.h/2 + 4} textAnchor="middle" className="fill-[var(--color-on-surface)] text-[10px] font-bold">
                            {coords.label}
                          </text>
                          <text x={coords.x + coords.w/2} y={coords.y + coords.h/2 + 25} textAnchor="middle" className="fill-[var(--color-on-surface-variant)] text-[8px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            {space.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* List of Detected Spaces */}
              <div>
                <h4 className="font-heading text-sm font-bold mb-3">Detected Spatial Anchors</h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {activeRoom.rawSpaces.length > 0 ? (
                    activeRoom.rawSpaces.map((space: any, idx: number) => (
                      <div key={space.id || idx} className="glass rounded-xl p-3 flex flex-col justify-between border border-[var(--color-border-glass)]">
                        <div className="font-heading text-sm font-semibold">{space.label}</div>
                        <div className="mt-2 text-xs text-[var(--color-on-surface-variant)]">
                          Anchor: {`${space.widthCm}cm × ${space.depthCm}cm`}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center text-xs text-[var(--color-on-surface-variant)] py-4">
                      No anchors segmented in this room.
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="py-16 text-center">
          <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
            No digital twin meshes mapped yet. Begin a space scan to map your room bounds.
          </p>
          <Link href="/dashboard/scan">
            <Button variant="primary">Map Room Twin</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
