"use client";

import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data: rooms = [] } = useSWR<any[]>("/api/rooms", fetcher);
  const { data: objects = [] } = useSWR<any[]>("/api/objects", fetcher);
  const { data: scans = [] } = useSWR<any[]>("/api/scans", fetcher);

  const activeRoomsCount = rooms.length;
  const capturedObjectsCount = objects.length;
  const scansRemaining = Math.max(3 - scans.length, 0);

  // Real completion rate from scan history
  const completedScans = scans.filter((s: any) => s.status === "COMPLETED").length;
  const engineAccuracy = scans.length > 0
    ? `${Math.round((completedScans / scans.length) * 100)}%`
    : "N/A";

  const formattedScans = scans.slice(0, 5).map((s: any) => ({
    id: s.id,
    name: s.targetType === "ROOM" ? `Room Scan · ${s.id.slice(-5).toUpperCase()}` : `Object Scan · ${s.id.slice(-5).toUpperCase()}`,
    type: s.targetType,
    date: new Date(s.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: s.status,
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight">Spatial Workspace</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Welcome back. You have {activeRoomsCount} active room{activeRoomsCount === 1 ? "" : "s"} mapped.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/scan">
            <Button variant="primary" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Scan
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Rooms", value: `${activeRoomsCount} Mapped`, sub: "Digital twins in memory", accent: "cyan" },
          { label: "Captured Objects", value: `${capturedObjectsCount} Items`, sub: "Furniture & inventory", accent: "purple" },
          { label: "Scans Remaining", value: `${scansRemaining} / 3`, sub: "Free tier allowance", accent: "cyan" },
          { label: "Engine Accuracy", value: engineAccuracy, sub: "Scan completion rate", accent: "purple" },
        ].map((item, i) => (
          <Card key={i} className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                {item.label}
              </span>
              <div className="mt-2 font-heading text-2xl font-bold text-[var(--color-on-surface)]">
                {item.value}
              </div>
            </div>
            <div className="mt-4 text-xs text-[var(--color-on-surface-variant)] border-t border-[var(--color-border-glass)] pt-2">
              {item.sub}
            </div>
          </Card>
        ))}
      </div>

      {/* Grid of Main Sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Spatial Memory Twin Visual */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-heading text-lg font-bold">Interactive Spatial Twin</h3>
          <Card className="relative flex aspect-video items-center justify-center overflow-hidden p-0">
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(var(--color-accent-cyan) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <svg viewBox="0 0 400 240" className="relative z-10 w-full max-w-md p-4 text-[var(--color-on-surface-variant)]" fill="none" stroke="currentColor">
              <rect x="20" y="20" width="360" height="200" rx="12" strokeWidth="2" strokeDasharray="4 4" className="text-[var(--color-border-glass)]" />
              <path d="M120 20 L120 220" strokeWidth="1" strokeDasharray="2 2" className="text-[var(--color-border-glass)]" />
              <path d="M20 120 L380 120" strokeWidth="1" strokeDasharray="2 2" className="text-[var(--color-border-glass)]" />
              <rect x="30" y="30" width="80" height="60" rx="4" fill="var(--color-surface-container)" className="text-[var(--color-border-glass)]" />
              <text x="70" y="65" textAnchor="middle" className="fill-[var(--color-on-surface-variant)] text-[10px] font-semibold">SOFA</text>
              <rect x="280" y="140" width="80" height="60" rx="4" fill="var(--color-surface-container)" className="text-[var(--color-border-glass)]" />
              <text x="320" y="175" textAnchor="middle" className="fill-[var(--color-on-surface-variant)] text-[10px] font-semibold">T.V. UNIT</text>
              <circle cx="200" cy="80" r="10" className="fill-[var(--color-accent-cyan)]/20 stroke-[var(--color-accent-cyan)] stroke-2 pulse-glow" />
              <text x="200" y="84" textAnchor="middle" className="fill-[var(--color-accent-cyan)] text-[8px] font-bold">A</text>
            </svg>
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-[var(--color-accent-cyan)] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-cyan)] pulse-glow" />
              Active Spatial Layout Plans
            </div>
          </Card>
        </div>

        {/* Recent Scans / Job list */}
        <div className="flex flex-col gap-4">
          <h3 className="font-heading text-lg font-bold">Recent Scans</h3>
          <Card className="flex flex-col gap-4">
            {formattedScans.length > 0 ? (
              formattedScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between border-b border-[var(--color-border-glass)] pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="font-heading text-sm font-semibold">{scan.name}</div>
                    <div className="mt-1 text-xs text-[var(--color-on-surface-variant)] flex items-center gap-2">
                      <span>{scan.type}</span>
                      <span>•</span>
                      <span>{scan.date}</span>
                    </div>
                  </div>
                  <Badge label={scan.status} variant={scan.status === "COMPLETED" ? "cyan" : "purple"} />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-[var(--color-on-surface-variant)]">
                No scans recorded yet. Click "New Scan" to start!
              </div>
            )}
            <Link href="/dashboard/objects" className="mt-2 text-center text-xs text-[var(--color-accent-cyan)] hover:underline font-semibold">
              View All Captured Objects
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
