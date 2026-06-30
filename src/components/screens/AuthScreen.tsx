"use client";

import { motion } from "framer-motion";
import { Button, Card, SectionHeading } from "@/components/ui";

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-20 px-4">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[var(--color-accent-purple)]/10 to-[var(--color-accent-cyan)]/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <Card className="backdrop-blur-xl bg-slate-900/40 border border-slate-800 p-8 shadow-2xl flex flex-col gap-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-[var(--color-on-surface)]">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
              Enter your credentials to access your spaces.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLoginSuccess();
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-on-surface-variant)] ml-1">
                Email address
              </label>
              <input
                type="email"
                required
                defaultValue="demo@locatra.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-[var(--color-on-surface)] outline-none focus:border-[var(--color-accent-cyan)] focus:ring-1 focus:ring-[var(--color-accent-cyan)] transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-[var(--color-on-surface-variant)]">
                  Password
                </label>
                <a href="#" className="text-xs text-[var(--color-accent-cyan)] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                defaultValue="password123"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-[var(--color-on-surface)] outline-none focus:border-[var(--color-accent-cyan)] focus:ring-1 focus:ring-[var(--color-accent-cyan)] transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-slate-500 uppercase tracking-widest">
              Or continue with
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onLoginSuccess}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/30 px-4 py-2.5 text-sm font-medium text-[var(--color-on-surface)] hover:bg-slate-800/80 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.43.987 3.96.948 1.567-.027 2.559-1.497 3.556-2.901 1.149-1.615 1.626-3.181 1.65-3.266-.035-.015-3.072-1.183-3.111-4.743-.035-2.98 2.451-4.455 2.56-4.522-1.396-2.046-3.535-2.324-4.296-2.361-2.016-.25-4.043 1.163-5.04 1.163zM10.82 5.568c.842-1.026 1.411-2.448 1.256-3.876-1.218.049-2.709.813-3.585 1.831-.778.887-1.442 2.345-1.256 3.738 1.36.106 2.735-.658 3.585-1.693z" />
              </svg>
              Apple
            </button>
            <button
              type="button"
              onClick={onLoginSuccess}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/30 px-4 py-2.5 text-sm font-medium text-[var(--color-on-surface)] hover:bg-slate-800/80 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M12.0003 11.9998H21.5703C21.6882 12.7818 21.7503 13.5898 21.7503 14.4148C21.7503 20.0828 17.8653 23.9998 12.0003 23.9998C5.37227 23.9998 0.000274658 18.6278 0.000274658 11.9998C0.000274658 5.3718 5.37227 -0.000244141 12.0003 -0.000244141C15.1953 -0.000244141 17.8203 1.14476 19.8273 3.01176L16.2903 6.42876C15.3573 5.54676 13.8873 4.67976 12.0003 4.67976C8.04927 4.67976 4.80027 7.97376 4.80027 11.9998C4.80027 16.0258 8.04927 19.3198 12.0003 19.3198C16.5903 19.3198 18.4203 16.0348 18.7293 14.1988H12.0003V11.9998Z" fill="#4285F4"/>
              </svg>
              Google
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            By continuing, you agree to Locatra's <a href="#" className="underline hover:text-slate-300">Terms of Service</a> and <a href="#" className="underline hover:text-slate-300">Privacy Policy</a>.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
