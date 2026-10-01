"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Store, Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function SellerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/seller/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      window.location.href = "/seller";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F8] via-[#FFF8FA] to-[#FCE7EC] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[32px] p-8 sm:p-10 border border-[#F8D5DE] shadow-soft-pink space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8E1B3B] to-[#E14D75] flex items-center justify-center text-white mx-auto shadow-md">
            <Store className="w-7 h-7" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2185B] font-bold block pt-1">
            Vendor & Partner Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#25050D] font-light">
            Sign In to Your Boutique
          </h1>
          <p className="text-xs text-[#8E1B3B]/80 max-w-xs mx-auto">
            Manage your fine jewels, facewashes, skincare, social links, and real-time earnings.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-[#FFF0F3] text-[#C2185B] border border-[#F8D5DE] text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8E1B3B] uppercase tracking-wider block">
              Registered Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#C2185B] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vendor.jewels@veloura.pk"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#8E1B3B] uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#C2185B] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#8E1B3B] via-[#C2185B] to-[#E14D75] text-white text-xs font-bold uppercase tracking-widest shadow-md hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 pt-2"
          >
            <span>{loading ? "Authenticating..." : "Access Boutique Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#F8D5DE]/80 text-center space-y-2">
          <p className="text-[11px] text-[#8E1B3B]/70">
            Don&apos;t have a vendor account yet?
          </p>
          <p className="text-[11px] text-[#25050D] font-medium">
            Contact <strong>Veloura Atelier Admin</strong> (+92 321 9954325) to onboard your shop and start selling today.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="text-xs font-bold text-[#C2185B] hover:underline"
            >
              ← Back to Veloura Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
