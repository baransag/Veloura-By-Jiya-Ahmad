"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, Phone, AlertCircle, ArrowRight } from "lucide-react";
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

      router.push("/account");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-[#750A0A] font-semibold">
          Customer Sanctuary
        </span>
        <h1 className="font-serif text-3xl text-[#141211] tracking-wider">
          {isRegister ? "Join VELOURA" : "Sign In to Account"}
        </h1>
        <p className="text-xs text-zinc-500">
          {isRegister
            ? "Create an account for concierge order tracking and privileges"
            : "Access your purchase records and saved delivery addresses"}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#EAE2D5] space-y-4 shadow-sm text-xs">
        {isRegister && (
          <div className="space-y-1">
            <label className="font-medium text-zinc-700">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maryam Khan"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#EAE2D5] bg-white text-[#141211] focus:outline-none focus:border-[#750A0A]"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="font-medium text-zinc-700">Email Address *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@veloura.com"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#EAE2D5] bg-white text-[#141211] focus:outline-none focus:border-[#750A0A]"
          />
        </div>

        {isRegister && (
          <div className="space-y-1">
            <label className="font-medium text-zinc-700">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0300 1234567"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#EAE2D5] bg-white text-[#141211] focus:outline-none focus:border-[#750A0A]"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="font-medium text-zinc-700">Password *</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#EAE2D5] bg-white text-[#141211] focus:outline-none focus:border-[#750A0A]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-[#750A0A] hover:bg-[#8E1137] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
        >
          {loading ? "Authenticating..." : isRegister ? "Create Customer Account" : "Sign In"}
        </button>

        <div className="text-center pt-4 border-t border-[#EAE2D5]">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-xs text-[#750A0A] hover:underline font-medium"
          >
            {isRegister
              ? "Already have an account? Sign In"
              : "New to VELOURA? Create an account"}
          </button>
        </div>
      </form>
    </div>
  );
}
