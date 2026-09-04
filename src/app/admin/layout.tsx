"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, LogOut, ExternalLink, ShieldCheck } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on admin login page, don't show admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "ADMIN" }),
    });
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Orders & Payments", href: "/admin/orders", icon: Package },
    { name: "Products & Atelier", href: "/admin/products", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#141211] text-[#FDFBF7] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#1A1615] flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div>
            <span className="font-serif text-2xl tracking-[0.25em] text-[#FDFBF7] block">
              VELOURA
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#DA9413] font-semibold">
              Admin CMS Portal
            </span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-[#750A0A] text-white font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-white/10 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-zinc-400 hover:text-[#DA9413] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-rose-400 hover:text-rose-300 w-full transition-colors pt-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Admin Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#141211] p-8 lg:p-12">
        {children}
      </main>
    </div>
  );
}
