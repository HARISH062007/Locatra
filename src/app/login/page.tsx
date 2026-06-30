"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { RoomBackground, GlassCard, GlassInput, GlassButton } from "@/components/ui";
import { Apple, Loader2, ArrowRight } from "lucide-react";

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
    <RoomBackground className="flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 25 }}
        className="w-full max-w-md z-10"
      >
        <GlassCard className="p-8 sm:p-10 flex flex-col gap-6 bg-white/40 border-white/50 shadow-2xl backdrop-blur-3xl">
          
          <div className="flex flex-col items-center mb-2">
            <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] mb-6 shadow-xl shadow-blue-500/20">
              <div className="w-full h-full rounded-[calc(1.2rem-1px)] bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
                  <path d="M30 70 L50 30 L70 70" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="50" cy="52" r="8" fill="white" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to Locatra</h1>
            <p className="text-slate-600 font-medium text-sm mt-2 text-center">
              Welcome back to your spatial workspace.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <GlassButton variant="secondary" className="w-full py-3.5 bg-white/60 hover:bg-white border-white/80 text-slate-900 shadow-sm flex items-center justify-center gap-3">
              <Apple className="w-5 h-5" fill="currentColor" />
              Continue with Apple
            </GlassButton>
            <GlassButton variant="secondary" className="w-full py-3.5 bg-white/60 hover:bg-white border-white/80 text-slate-900 shadow-sm flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </GlassButton>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-300/50"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-500 uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-slate-300/50"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm font-medium text-center">
                {error}
              </motion.div>
            )}
            
            <div className="space-y-4">
              <GlassInput
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50 border-white/60 focus:bg-white text-slate-900 placeholder:text-slate-500 py-3.5"
              />
              <GlassInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/50 border-white/60 focus:bg-white text-slate-900 placeholder:text-slate-500 py-3.5"
              />
            </div>

            <GlassButton 
              type="submit" 
              disabled={loading}
              className="w-full mt-2 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-[0_4px_20px_rgba(37,99,235,0.3)] disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>}
            </GlassButton>
          </form>

          <p className="text-center text-sm text-slate-600 mt-2 font-medium">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>

        </GlassCard>
      </motion.div>
    </RoomBackground>
  );
}
