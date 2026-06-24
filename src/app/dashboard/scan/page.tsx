"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { useRouter } from "next/navigation";

// Status steps shown during AI reconstruction
const PROCESSING_STEPS = [
  "Aligning points & estimating camera poses…",
  "Generating spatial bounding boxes…",
  "Reconstructing high-fidelity 3D mesh…",
  "Optimizing textures & generating digital twin…",
];

export default function ScanPage() {
  const router = useRouter();
  const [targetType, setTargetType] = useState<"OBJECT" | "ROOM">("OBJECT");
  const [step, setStep] = useState<"SELECT" | "CAPTURE" | "UPLOADING" | "PROCESSING" | "SUCCESS" | "ERROR">("SELECT");

  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Queued in AI Pipeline");
  const [scanId, setScanId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Start Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(mediaStream);
    } catch (err) {
      console.warn("Camera access denied or unavailable, using simulated viewport.", err);
    }
    setStep("CAPTURE");
  };

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Upload simulation → then real backend call
  const handleCapture = async () => {
    stopCamera();
    setStep("UPLOADING");
    setProgress(0);

    // Simulate a media upload (chunked progress animation)
    await new Promise<void>((resolve) => {
      let p = 0;
      const interval = setInterval(() => {
        p += 20;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 150);
    });

    await startBackendProcessing();
  };

  // Create scan in backend → animate progress while polling
  const startBackendProcessing = async () => {
    setStep("PROCESSING");
    setProgress(0);
    setStatusText("Initializing Reconstruction Job…");

    try {
      // POST to BFF → FastAPI creates Scan + AIJob + runs background reconstruction
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType,
          rawMediaUrl: `https://s3.locatra.app/raw/${Date.now()}.mp4`,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      const realScanId: string = data.id || data.scanId || "";
      setScanId(realScanId);

      // Animate progress steps (backend job runs concurrently)
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        setStatusText(PROCESSING_STEPS[i]);
        setProgress((i + 1) * 25);
        await new Promise((r) => setTimeout(r, 1200));
      }

      setStep("SUCCESS");
    } catch (e: any) {
      console.error("Scan creation failed:", e);
      setErrorMsg(e?.message || "An error occurred. Please try again.");
      setStep("ERROR");
    }
  };

  // Bind stream to video element when it mounts and stream is loaded
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, step]);

  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-8">
      {/* Header */}
      <div>
        <h2 className="font-heading text-3xl font-bold tracking-tight">Spatial AR Scan</h2>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          Create high-fidelity 3D assets and digital room twin meshes directly from your browser.
        </p>
      </div>

      {step === "SELECT" && (
        <Card className="flex flex-col gap-6">
          <h3 className="font-heading text-xl font-semibold">Select Scan Target</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Object Box */}
            <div
              onClick={() => setTargetType("OBJECT")}
              className={`flex flex-col gap-4 rounded-xl border p-6 cursor-pointer transition-all duration-300 ${
                targetType === "OBJECT"
                  ? "border-[var(--color-accent-purple)] bg-[var(--color-accent-purple)]/10 glow-purple"
                  : "border-[var(--color-border-glass)] bg-[var(--color-surface-glass)] hover:border-[var(--color-border-glass)]/60"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
              <div>
                <div className="font-heading font-bold">Object Reconstruction</div>
                <div className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
                  Scan furniture, decor, or packaging to generate exact 3D models with true-to-life measurements.
                </div>
              </div>
            </div>

            {/* Room Box */}
            <div
              onClick={() => setTargetType("ROOM")}
              className={`flex flex-col gap-4 rounded-xl border p-6 cursor-pointer transition-all duration-300 ${
                targetType === "ROOM"
                  ? "border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/10 glow-cyan"
                  : "border-[var(--color-border-glass)] bg-[var(--color-surface-glass)] hover:border-[var(--color-border-glass)]/60"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12" />
                </svg>
              </div>
              <div>
                <div className="font-heading font-bold">Room Digital Twin</div>
                <div className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
                  Scan your room boundary walls, doors, windows, and floor space to map clearances.
                </div>
              </div>
            </div>
          </div>

          <Button variant="primary" size="lg" className="w-full" onClick={startCamera}>
            Initialize Scanner
          </Button>
        </Card>
      )}

      {step === "CAPTURE" && (
        <Card className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-lg font-bold">Guided AR Viewport</h3>
            <Badge label={targetType} variant={targetType === "OBJECT" ? "purple" : "cyan"} />
          </div>

          {/* Viewport Screen */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-inner">
            {stream ? (
              <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
            ) : (
              /* Glassmorphism fallback visualizer */
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: "linear-gradient(var(--color-accent-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent-cyan) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative h-28 w-28 floating">
                  <div className="absolute inset-0 rotate-45 rounded-lg border border-[var(--color-accent-purple)]/60" />
                  <div className="absolute inset-2 rounded-lg border border-[var(--color-accent-cyan)]/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-[var(--color-accent-cyan)] pulse-glow">PREVIEW</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] text-center max-w-xs">
                  Camera blocked or unavailable. Showing active rendering emulation mesh.
                </p>
              </div>
            )}

            {/* Corner capture overlays */}
            {["top-4 left-4 border-t border-l","top-4 right-4 border-t border-r","bottom-4 left-4 border-b border-l","bottom-4 right-4 border-b border-r"].map((cls, idx) => (
              <div key={idx} className={`absolute h-6 w-6 border-2 border-[var(--color-accent-cyan)] ${cls}`} />
            ))}

            {/* Capture guide indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full glass px-4 py-1.5 text-xs text-white">
              {targetType === "OBJECT"
                ? "Pan 360° slowly around the object"
                : "Point at wall corners to construct room bounds"}
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="ghost" className="flex-1" onClick={() => { stopCamera(); setStep("SELECT"); }}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleCapture}>
              Capture Scan
            </Button>
          </div>
        </Card>
      )}

      {(step === "UPLOADING" || step === "PROCESSING") && (
        <Card className="flex flex-col items-center justify-center gap-8 py-16 text-center">
          <div className="relative flex h-24 w-24 items-center justify-center">
            {/* Pulsing glow boundary */}
            <div className="absolute inset-0 rounded-full border border-[var(--color-accent-cyan)]/30 pulse-glow" />
            {/* Spinning ring */}
            <div className="absolute inset-1 rounded-full border-t-2 border-b-2 border-[var(--color-accent-purple)] scan-ring" />
            <span className="font-heading text-lg font-bold text-white">{progress}%</span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-xl font-bold">
              {step === "UPLOADING" ? "Uploading Scan Media" : "AI Reconstruction in Progress"}
            </h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] max-w-md">
              {step === "UPLOADING"
                ? "Transmitting 4K video sequence to GPU processing cluster…"
                : statusText}
            </p>
          </div>
        </Card>
      )}

      {step === "SUCCESS" && (
        <Card className="flex flex-col items-center justify-center gap-8 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-cyan)]/20 text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)]/40">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-2xl font-bold">3D Reconstruction Complete</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] max-w-sm">
              Your {targetType.toLowerCase()} mesh has been processed and saved to your spatial memory.
            </p>
            {scanId && (
              <div className="mt-4 rounded-xl glass px-4 py-2 text-xs font-mono text-[var(--color-on-surface-variant)]">
                Scan ID: {scanId}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => { setScanId(""); setProgress(0); setStep("SELECT"); }}>
              Scan Another
            </Button>
            <Button variant="primary" onClick={() => router.push("/dashboard")}>
              View in Dashboard
            </Button>
          </div>
        </Card>
      )}

      {step === "ERROR" && (
        <Card className="flex flex-col items-center justify-center gap-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-heading text-2xl font-bold">Scan Failed</h3>
            <p className="text-sm text-[var(--color-on-surface-variant)] max-w-sm">{errorMsg}</p>
          </div>
          <Button variant="primary" onClick={() => { setErrorMsg(""); setStep("SELECT"); }}>
            Try Again
          </Button>
        </Card>
      )}
    </div>
  );
}
