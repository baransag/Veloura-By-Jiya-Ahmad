"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@veloura.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "ADMIN" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid administrative credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#141211] via-[#2A0917] to-[#141211] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1A1615] p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6 text-[#FDFBF7]">
        <div className="text-center space-y-2">
          <span className="font-serif text-3xl tracking-[0.25em] text-[#FDFBF7] block">
            VELOURA
          </span>
          <p className="text-xs uppercase tracking-[0.3em] text-[#DA9413] font-semibold">
            Atelier Administrative Gate
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-900/30 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#DA9413]"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute right-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 uppercase tracking-wider text-[10px]">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#DA9413]"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute right-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#750A0A] hover:bg-[#8E1137] text-white font-semibold uppercase tracking-[0.2em] rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4 border border-[#DA9413]/30"
          >
            {loading ? "Verifying Credentials..." : "Authenticate Admin"}
          </button>
        </form>

        <div className="pt-2 text-center text-[10px] text-zinc-500">
          Default seed credentials pre-filled for administrative testing.
        </div>
      </div>
    </div>
  );
}
