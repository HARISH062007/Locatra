"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-4 py-16">
      <div className="glass-lens w-full max-w-md p-8">
        <div className="mb-8 flex flex-col items-center gap-2">
          <svg width="44" height="44" viewBox="0 0 100 100" fill="none" aria-hidden>
            <rect width="100" height="100" rx="16" fill="url(#liLogoGrad)" />
            <path d="M30 70 L50 30 L70 70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="52" r="7" fill="#06B6D4" />
            <defs>
              <linearGradient id="liLogoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" /><stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          <h1 className="font-heading text-2xl font-bold text-[var(--color-on-surface)]">Welcome back</h1>
          <p className="text-sm text-[var(--color-on-surface-variant)]">Sign in to your spatial workspace.</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-[var(--color-border-glass)] bg-[var(--color-surface-glass)] px-4 text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:border-[var(--color-accent-cyan)] focus:outline-none focus:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                Password
              </label>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-[var(--color-border-glass)] bg-[var(--color-surface-glass)] px-4 text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:border-[var(--color-accent-cyan)] focus:outline-none focus:shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" className="mt-2 w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--color-border-glass)]" />
          <span className="text-xs text-[var(--color-on-surface-variant)]">or</span>
          <div className="h-px flex-1 bg-[var(--color-border-glass)]" />
        </div>

        <Button
          variant="ghost"
          className="w-full gap-3"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 11.745V8.28h11.5c.133.657.2 1.322.2 2.003 0 6.063-4.07 10.374-11.7 10.374-6.71 0-12-5.39-12-12S5.29 .657 12 .657c3.236 0 5.948 1.19 8.037 3.14L17.7 6.072C16.167 4.636 14.2 3.797 12 3.797c-4.63 0-8.39 3.808-8.39 8.531s3.76 8.531 8.39 8.531c4.23 0 7.154-2.4 7.706-5.713H12V11.745z" />
          </svg>
          Continue with Google
        </Button>

        <p className="mt-8 text-center text-sm text-[var(--color-on-surface-variant)]">
          No account?{" "}
          <Link href="/signup" className="text-[var(--color-accent-cyan)] hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
