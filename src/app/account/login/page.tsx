"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, Phone, AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister
      ? { name, email, phone, password, role: "CUSTOMER" }
      : { email, password, role: "CUSTOMER" };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (data.user?.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/account";
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-[#FFF8FA] pb-32">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C2185B] font-bold block">
            Customer Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#25050D] font-light">
            {isRegister ? "Join Veloura Atelier" : "Welcome Back"}
          </h1>
          <p className="text-xs text-[#8E1B3B]/70 max-w-xs mx-auto">
            {isRegister
              ? "Create your private atelier account to track orders & enjoy VIP privileges."
              : "Access your saved addresses, order tracking, and bespoke beauty history."}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-[#C2185B] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-7 sm:p-9 rounded-3xl border border-[#F8D5DE] space-y-4 shadow-soft-pink text-xs"
        >
          {isRegister && (
            <div className="space-y-1.5">
              <label className="font-bold text-[#8E1B3B]">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ayesha Malik"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] outline-none focus:border-[#E14D75] focus:ring-2 focus:ring-[#E14D75]/15"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-bold text-[#8E1B3B]">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ayesha@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] outline-none focus:border-[#E14D75] focus:ring-2 focus:ring-[#E14D75]/15"
            />
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <label className="font-bold text-[#8E1B3B]">WhatsApp / Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0321 1234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] outline-none focus:border-[#E14D75] focus:ring-2 focus:ring-[#E14D75]/15"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-bold text-[#8E1B3B]">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] outline-none focus:border-[#E14D75] focus:ring-2 focus:ring-[#E14D75]/15"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#8E1B3B] via-[#C2185B] to-[#8E1B3B] hover:brightness-110 text-white text-xs uppercase tracking-[0.2em] font-bold rounded-2xl shadow-hover-pink transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? "Authenticating..." : isRegister ? "Create Customer Account" : "Sign In to Bag"}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-4 border-t border-[#F8D5DE]">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-xs text-[#C2185B] hover:text-[#8E1B3B] font-bold transition-colors"
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "New to VELOURA? Create Private Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
