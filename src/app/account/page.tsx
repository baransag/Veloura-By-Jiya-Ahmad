"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Package, LogOut, Clock, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export default function CustomerAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/account/login");
        } else {
          setUser(data.user);
          setLoading(false);
        }
      })
      .catch(() => {
        router.push("/account/login");
      });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "CUSTOMER" }),
    });
    router.push("/");
  };

  if (loading) {
    return <div className="p-20 text-center text-xs text-zinc-500">Loading your sanctuary...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE2D5]">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#750A0A] font-semibold">
            Personal Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#141211] mt-1">
            Welcome, {user.name || "Valued Client"}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">{user.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#EAE2D5] text-xs uppercase tracking-wider font-semibold text-zinc-600 hover:text-[#750A0A] transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-[#FDFBF7] border border-[#EAE2D5] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider">Account Level</span>
            <ShieldCheck className="w-4 h-4 text-[#DA9413]" />
          </div>
          <p className="font-serif text-xl font-bold text-[#141211]">VELOURA Privilege</p>
          <p className="text-[11px] text-zinc-500">Complimentary silk packaging enabled</p>
        </div>

        <div className="p-6 rounded-xl bg-[#FDFBF7] border border-[#EAE2D5] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider">Track Shipments</span>
            <Package className="w-4 h-4 text-[#0D3A2F]" />
          </div>
          <Link
            href="/order-tracking"
            className="font-serif text-xl font-bold text-[#0D3A2F] hover:underline block"
          >
            Live Tracking →
          </Link>
          <p className="text-[11px] text-zinc-500">Real-time status updates</p>
        </div>

        <div className="p-6 rounded-xl bg-[#FDFBF7] border border-[#EAE2D5] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider">Explore Boutique</span>
            <Heart className="w-4 h-4 text-[#750A0A]" />
          </div>
          <Link
            href="/shop"
            className="font-serif text-xl font-bold text-[#750A0A] hover:underline block"
          >
            Shop Silk Pret →
          </Link>
          <p className="text-[11px] text-zinc-500">Fresh arrivals daily</p>
        </div>
      </div>
    </div>
  );
}
