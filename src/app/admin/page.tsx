"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DollarSign, ShoppingBag, Package, AlertTriangle, Clock, ArrowRight, Plus } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2185B] font-bold">
            Operational Overview
          </span>
          <h1 className="font-serif text-3xl text-[#FDFBF7] mt-1">Atelier Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white text-xs uppercase tracking-wider font-bold rounded-xl flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Real Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Total Revenue */}
        <div className="p-6 rounded-2xl bg-[#1A1615] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-[#E14D75]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#FDFBF7]">
            {loading ? "..." : `Rs. ${(stats?.revenue || 0).toLocaleString()}`}
          </p>
          <p className="text-[11px] text-zinc-500">From real PostgreSQL orders</p>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="p-6 rounded-xl bg-[#1A1615] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider">Total Orders</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#FDFBF7]">
            {loading ? "..." : stats?.totalOrders ?? 0}
          </p>
          <p className="text-[11px] text-zinc-500">Live store transactions</p>
        </div>

        {/* Metric 3: Pending Payments (Easypaisa/JazzCash) - MANDATORY SPEC */}
        <div className="p-6 rounded-xl bg-[#1A1615] border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Pending Payments</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-amber-300">
            {loading ? "..." : stats?.pendingPayments ?? 0}
          </p>
          <p className="text-[11px] text-zinc-400">Easypaisa / JazzCash manual verification</p>
        </div>

        {/* Metric 4: Low Stock Alert */}
        <div className="p-6 rounded-xl bg-[#1A1615] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase tracking-wider">Low Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#FDFBF7]">
            {loading ? "..." : stats?.lowStockCount ?? 0}
          </p>
          <p className="text-[11px] text-zinc-500">Stock ≤ 3 units</p>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 rounded-xl bg-[#1A1615] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg text-[#FDFBF7]">Recent Atelier Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-wider text-[#C2185B] hover:text-[#E14D75] flex items-center gap-1 font-bold"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-zinc-500 py-6 text-center">Loading live database records...</p>
        ) : !stats?.recentOrders || stats.recentOrders.length === 0 ? (
          <div className="text-center py-10 text-xs text-zinc-500">
            No customer orders placed yet. Place a test order via storefront to verify!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono text-[#E14D75] font-bold">{order.orderNumber}</td>
                    <td className="py-3 text-white">{order.customerName}</td>
                    <td className="py-3 uppercase text-zinc-300">{order.paymentMethod}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                          order.paymentStatus === "VERIFIED"
                            ? "bg-emerald-900/40 text-emerald-300 border border-emerald-500/30"
                            : order.paymentStatus === "PENDING_VERIFICATION"
                            ? "bg-amber-900/40 text-amber-300 border border-amber-500/30"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 uppercase text-zinc-300">{order.orderStatus}</td>
                    <td className="py-3 text-right font-semibold text-white">
                      Rs. {order.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
