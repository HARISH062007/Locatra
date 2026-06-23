"use client";

import Link from "next/link";
import { Button, Badge, Card, SectionHeading, StatCard, StepIndicator } from "@/components/ui";
import { Navbar } from "@/components/Navbar";
import { BackgroundShader } from "@/components/BackgroundShader";

/* ── Feature data ─────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
    title: "Instant 3D Scanning",
    desc: "Scan any object with your phone camera. Locatra builds an accurate 3D model with real dimensions — no tape measure required.",
    accent: "cyan" as const,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: "Digital Room Twin",
    desc: "Walk through your room once and Locatra builds a persistent 3D spatial map — detecting doors, windows, walkways, and free spaces.",
    accent: "purple" as const,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "AI Placement Engine",
    desc: "Our spatial reasoning engine scores candidate locations against object fit, walkway clearance, accessibility, and your own preferences.",
    accent: "cyan" as const,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "WebXR AR Preview",
    desc: "See the recommended placement overlaid on your real room through your phone. Move, rotate, and scale before you commit — no app needed.",
    accent: "purple" as const,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Explainable AI",
    desc: "Every recommendation includes a confidence score and plain-language reasoning — never a black-box answer.",
    accent: "cyan" as const,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
    title: "Smart Home Memory",
    desc: "Locatra remembers your rooms, objects, preferences, and past decisions — getting smarter with every placement you confirm.",
    accent: "purple" as const,
  },
];

const STEPS = [
  { label: "Scan Object",     desc: "Walk around the item or upload photos. Locatra builds a measured 3D model in under 30 seconds." },
  { label: "Scan Room",       desc: "Pan your phone across your room to create a persistent digital twin with detected free spaces." },
  { label: "Get Recommended", desc: "AI analyses fit, walkways, and your preferences to propose the single best placement with reasons." },
  { label: "Preview in AR",   desc: "See the object placed in your room through your camera. Adjust, rotate, and confirm." },
  { label: "Save & Learn",    desc: "Your choice is saved. Locatra updates your spatial memory for smarter future recommendations." },
];

/* ── Hero visualisation (AR HUD) ─────────────────────────────────────── */
function HeroVisual() {
  return (
    <div className="relative mx-auto h-80 w-72 floating sm:h-[420px] sm:w-80">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--color-accent-purple)]/20 to-[var(--color-accent-cyan)]/20 blur-2xl" />
      {/* Phone frame */}
      <div className="glass-lens relative h-full overflow-hidden shadow-2xl">
        {/* Scan overlay grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(6,182,212,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.07) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Corner brackets */}
        {[["top-6 left-6 border-t border-l","rounded-tl-lg"],
          ["top-6 right-6 border-t border-r","rounded-tr-lg"],
          ["bottom-6 left-6 border-b border-l","rounded-bl-lg"],
          ["bottom-6 right-6 border-b border-r","rounded-br-lg"]].map(([pos,rnd],i) => (
          <div key={i} className={`absolute h-8 w-8 border-[var(--color-accent-cyan)] ${pos} ${rnd}`} />
        ))}
        {/* Center object wireframe */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-36 w-36">
            <div className="absolute inset-0 rotate-45 rounded-xl border border-[var(--color-accent-purple)]/60" />
            <div className="absolute inset-4 rounded-xl border border-[var(--color-accent-cyan)]/60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-[var(--color-accent-cyan)] pulse-glow" />
            </div>
          </div>
        </div>
        {/* HUD labels */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1">
          <div className="glass rounded-full px-4 py-1 text-xs font-semibold text-[var(--color-accent-cyan)]">
            Corner A — 91% Match
          </div>
          <div className="text-xs text-[var(--color-on-surface-variant)]">Fits · Walkway clear · Wall-adjacent</div>
        </div>
        {/* Live badge */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-[var(--color-accent-cyan)]/40 bg-[var(--color-accent-cyan)]/10 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent-cyan)] pulse-glow" />
          <span className="text-xs font-semibold text-[var(--color-accent-cyan)]">LIVE</span>
        </div>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <BackgroundShader />
      <Navbar />

      <main className="relative z-10">

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <section className="flex min-h-screen flex-col items-center justify-center gap-12 px-6 pt-32 pb-24 text-center lg:flex-row lg:text-left lg:gap-20 lg:px-24">
          <div className="flex max-w-2xl flex-col gap-6">
            <Badge label="Spatial Intelligence" variant="purple" />
            <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight text-[var(--color-on-surface)] sm:text-6xl lg:text-7xl">
              Your space,{" "}
              <span className="gradient-text">understood</span>
              {" "}by AI.
            </h1>
            <p className="text-lg text-[var(--color-on-surface-variant)] lg:text-xl">
              Scan an object, scan your room, and let Locatra's spatial reasoning engine
              find the perfect placement — then preview it in AR before lifting a finger.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link href="/signup">
                <Button variant="primary" size="lg">Start Scanning Free</Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="ghost" size="lg">See How It Works</Button>
              </Link>
            </div>
            {/* Social proof stats */}
            <div className="mt-4 grid grid-cols-3 gap-4">
              <StatCard value="&lt;30s" label="Object scan time" accent="cyan" />
              <StatCard value="91%"    label="Placement accuracy" accent="purple" />
              <StatCard value="0 Apps" label="Install required" accent="cyan" />
            </div>
          </div>

          <HeroVisual />
        </section>

        {/* ── FEATURES ────────────────────────────────────────────────── */}
        <section id="features" className="px-6 py-24 lg:px-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              badge="Core Capabilities"
              title={<>Everything you need to <span className="gradient-text">place it right</span></>}
              subtitle="A complete spatial intelligence platform — from object capture to AR confirmation."
              center
            />
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <Card key={i} hover glow={f.accent} className="flex flex-col gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                      f.accent === "cyan"
                        ? "bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]"
                        : "bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)]"
                    }`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-[var(--color-on-surface)]">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    {f.desc}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
        <section id="how-it-works" className="px-6 py-24 lg:px-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="flex flex-col gap-8">
                <SectionHeading
                  badge="The Flow"
                  title={<>From scan to <span className="gradient-text">confirmed</span> in minutes</>}
                  subtitle="Five steps. No installation. No tape measure."
                />
                <div className="flex flex-col gap-3">
                  {STEPS.map((s, i) => (
                    <StepIndicator
                      key={i}
                      step={i + 1}
                      label={s.label}
                      description={s.desc}
                      active={i === 2}
                    />
                  ))}
                </div>
              </div>

              {/* Pipeline visual */}
              <div className="relative flex flex-col items-center gap-3">
                {STEPS.map((s, i) => (
                  <div key={i} className="flex w-full items-center gap-4">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        i < 3
                          ? "bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-cyan)] text-white"
                          : "border border-[var(--color-border-glass)] text-[var(--color-on-surface-variant)]"
                      }`}
                    >
                      {i < 3 ? "✓" : i + 1}
                    </div>
                    <div
                      className={`h-12 flex-1 rounded-xl px-4 flex items-center text-sm ${
                        i === 2 ? "glass border-[var(--color-accent-cyan)]/40 text-[var(--color-accent-cyan)]" : "text-[var(--color-on-surface-variant)]"
                      }`}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ─────────────────────────────────────────────────── */}
        <section id="pricing" className="px-6 py-24 lg:px-24">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              badge="Pricing"
              title={<>Start free, <span className="gradient-text">scale with your space</span></>}
              subtitle="No credit card required to get started."
              center
            />
            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {[
                {
                  name: "Starter",
                  price: "Free",
                  sub: "forever",
                  perks: ["3 object scans / month","1 room digital twin","Basic recommendations","3D model viewer"],
                  cta: "Get Started",
                  accent: false,
                },
                {
                  name: "Pro",
                  price: "$12",
                  sub: "/ month",
                  perks: ["Unlimited scans","Multi-room twin","Preference learning","Priority GPU processing","WebXR AR preview"],
                  cta: "Start Pro Trial",
                  accent: true,
                },
                {
                  name: "Designer",
                  price: "$39",
                  sub: "/ month",
                  perks: ["Everything in Pro","Multi-client projects","Exportable placement plans","White-label reports","Priority support"],
                  cta: "Talk to Sales",
                  accent: false,
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`relative flex flex-col gap-6 rounded-2xl border p-8 transition-all duration-300 ${
                    plan.accent
                      ? "border-[var(--color-accent-purple)]/50 bg-[var(--color-accent-purple)]/5 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                      : "glass"
                  }`}
                >
                  {plan.accent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge label="Most Popular" variant="purple" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-[var(--color-on-surface)]">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-heading text-4xl font-bold text-[var(--color-on-surface)]">{plan.price}</span>
                      <span className="text-sm text-[var(--color-on-surface-variant)]">{plan.sub}</span>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {plan.perks.map((p, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]">
                        <span className="mt-0.5 text-[var(--color-accent-cyan)]">✓</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="mt-auto">
                    <Button variant={plan.accent ? "primary" : "ghost"} className="w-full">
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA STRIP ───────────────────────────────────────────────── */}
        <section className="px-6 py-20 lg:px-24">
          <div className="mx-auto max-w-3xl glass-lens px-8 py-16 text-center">
            <Badge label="Ready?" variant="cyan" />
            <h2 className="mt-6 font-heading text-4xl font-bold text-[var(--color-on-surface)]">
              Place it <span className="gradient-text">right</span>, the first time.
            </h2>
            <p className="mt-4 text-[var(--color-on-surface-variant)]">
              Join thousands of homeowners and designers who scan first and move never.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/signup">
                <Button variant="primary" size="lg">Start for Free</Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--color-border-glass)] px-6 py-12 lg:px-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="font-heading text-lg font-bold text-[var(--color-on-surface)]">Locatra</div>
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            © {new Date().getFullYear()} Locatra. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[var(--color-on-surface-variant)]">
            <Link href="/privacy" className="hover:text-[var(--color-accent-cyan)] transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-[var(--color-accent-cyan)] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
