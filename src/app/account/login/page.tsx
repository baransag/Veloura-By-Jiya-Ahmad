"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, Phone, AlertCircle, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("sarah@veloura.com");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("password123");

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

      router.push("/account");
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  const fillCustomerDemo = () => {
    setIsRegister(false);
    setEmail("sarah@veloura.com");
    setPassword("password123");
    setError("");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#FAF8F5]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C3A4D] font-semibold block">
            Customer Sanctuary
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1E191B] tracking-wide">
            {isRegister ? "Join Veloura" : "Sign In to Veloura"}
          </h1>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            {isRegister
              ? "Register to enjoy concierge privileges, order tracking & private atelier sales."
              : "Access your beauty & fine jewelry purchase history and saved addresses."}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl border border-[#EAE2D5] space-y-4 shadow-sm text-xs"
        >
          {isRegister && (
            <div className="space-y-1.5">
              <label className="font-medium text-zinc-700">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Khan"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#EAE2D5] bg-[#FAF8F5] text-[#1E191B] focus:outline-none focus:border-[#632839]"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-medium text-zinc-700">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@veloura.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#EAE2D5] bg-[#FAF8F5] text-[#1E191B] focus:outline-none focus:border-[#632839]"
            />
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <label className="font-medium text-zinc-700">WhatsApp / Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300 1234567"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#EAE2D5] bg-[#FAF8F5] text-[#1E191B] focus:outline-none focus:border-[#632839]"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-medium text-zinc-700">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#EAE2D5] bg-[#FAF8F5] text-[#1E191B] focus:outline-none focus:border-[#632839]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#632839] hover:bg-[#7D3449] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2 shadow"
          >
            {loading ? "Authenticating..." : isRegister ? "Create Customer Account" : "Sign In"}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Pre-fill */}
          <div className="pt-2">
            <button
              type="button"
              onClick={fillCustomerDemo}
              className="w-full py-2 px-3 bg-[#FAF8F5] hover:bg-[#F3ECE2] border border-[#EAE2D5] text-[#1E191B] rounded-lg text-[11px] font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A464]" />
              <span>Fill Demo Customer (sarah@veloura.com)</span>
            </button>
          </div>

          <div className="text-center pt-4 border-t border-[#EAE2D5] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-xs text-[#8C3A4D] hover:underline font-medium"
            >
              {isRegister
                ? "Already have an account? Sign In"
                : "New to VELOURA? Create account"}
            </button>

            <Link
              href="/admin/login"
              className="text-[11px] text-zinc-400 hover:text-zinc-600 uppercase tracking-wider flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              Admin Portal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
