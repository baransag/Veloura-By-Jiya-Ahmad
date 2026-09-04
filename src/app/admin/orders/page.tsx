"use client";

import React, { useEffect, useState } from "react";
import { Package, CheckCircle2, XCircle, Search, Clock, Phone, AlertCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/admin/orders${search ? `?search=${encodeURIComponent(search)}` : ""}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search]);

  // Update order fulfillment status
  const handleUpdateStatus = async (orderId: string, orderStatus: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Verify or reject manual payment (Easypaisa / JazzCash)
  const handlePaymentAction = async (orderId: string, paymentStatus: "VERIFIED" | "REJECTED") => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#DA9413] font-semibold">
            Order Fulfillment & Verification
          </span>
          <h1 className="font-serif text-3xl text-[#FDFBF7] mt-1">Orders & Payments</h1>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, phone, TID..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#1A1615] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#DA9413]"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500">Loading orders from PostgreSQL...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-[#1A1615] rounded-xl border border-white/10 space-y-2">
          <Package className="w-8 h-8 text-[#DA9413] mx-auto opacity-60" />
          <p className="font-serif text-lg text-white">No Orders Found</p>
          <p className="text-xs text-zinc-500">Orders placed by customers will immediately appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isManualPay = order.paymentMethod === "EASYPAISA" || order.paymentMethod === "JAZZCASH";
            const isPendingVerification = order.paymentStatus === "PENDING_VERIFICATION";

            return (
              <div
                key={order.id}
                className="p-6 rounded-xl bg-[#1A1615] border border-white/10 space-y-4 hover:border-white/20 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[#DA9413] bg-white/5 px-2.5 py-1 rounded">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase text-zinc-400 font-medium">Fulfillment:</span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      disabled={actionLoading === order.id}
                      className="bg-black/60 border border-white/20 text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:border-[#DA9413]"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="PACKED">PACKED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Customer */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-zinc-500 tracking-wider">Customer & Delivery</span>
                    <p className="font-semibold text-white">{order.customerName}</p>
                    <p className="text-zinc-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#DA9413]" /> {order.customerPhone}
                    </p>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      {order.shippingAddress}, {order.city}
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase text-zinc-500 tracking-wider">Payment Info</span>
                    <p className="font-semibold text-white uppercase">
                      Method: <span className="text-[#DA9413]">{order.paymentMethod}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-[11px]">Payment Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          order.paymentStatus === "VERIFIED"
                            ? "bg-emerald-900/40 text-emerald-300 border border-emerald-500/30"
                            : order.paymentStatus === "REJECTED"
                            ? "bg-rose-900/40 text-rose-300 border border-rose-500/30"
                            : order.paymentStatus === "PENDING_VERIFICATION"
                            ? "bg-amber-900/40 text-amber-300 border border-amber-500/30"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                    {order.transactionReference && (
                      <p className="text-xs text-amber-300 font-mono bg-black/40 px-2 py-1 rounded inline-block">
                        TID: {order.transactionReference}
                      </p>
                    )}
                  </div>

                  {/* Total & Verification Actions */}
                  <div className="space-y-2 sm:text-right">
                    <span className="text-[10px] uppercase text-zinc-500 tracking-wider block">Total Amount</span>
                    <p className="font-serif text-xl font-bold text-[#FDFBF7]">
                      Rs. {order.total.toLocaleString()}
                    </p>

                    {/* MANUAL VERIFICATION BUTTONS FOR EASYPAISA / JAZZCASH - MANDATORY SPEC */}
                    {isManualPay && (
                      <div className="pt-2 flex sm:justify-end gap-2">
                        {order.paymentStatus !== "VERIFIED" && (
                          <button
                            onClick={() => handlePaymentAction(order.id, "VERIFIED")}
                            disabled={actionLoading === order.id}
                            className="px-3 py-1.5 bg-[#0D3A2F] hover:bg-[#084A3B] text-emerald-200 rounded text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 border border-emerald-500/30"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verify Payment
                          </button>
                        )}
                        {order.paymentStatus !== "REJECTED" && (
                          <button
                            onClick={() => handlePaymentAction(order.id, "REJECTED")}
                            disabled={actionLoading === order.id}
                            className="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-200 rounded text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 border border-rose-500/30"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject Payment
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items preview */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-3">
                  {order.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="px-2.5 py-1 rounded bg-black/40 text-[11px] text-zinc-300 border border-white/5 flex items-center gap-2"
                    >
                      <span>{item.productName}</span>
                      <span className="text-zinc-500">×{item.quantity}</span>
                      <span className="font-semibold text-white">Rs. {item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
