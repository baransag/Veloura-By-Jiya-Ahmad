"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, CheckCircle, Clock, Truck, ShieldAlert, ArrowRight } from "lucide-react";

const TIMELINE_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "DELIVERED"];

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const trackOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/store/track/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order not found");
      }
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || "Failed to find order");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      trackOrder(orderNumber);
    }
  }, []);

  const getStepIndex = (status: string) => {
    return TIMELINE_STEPS.indexOf(status);
  };

  return (
    <div className="space-y-10">
      {/* Search Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          trackOrder(orderNumber);
        }}
        className="flex gap-2 max-w-md mx-auto"
      >
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Enter Order # (e.g. VEL-100123)"
          className="flex-1 px-4 py-3 rounded-lg border border-[#EAE2D5] bg-white text-xs font-mono tracking-wider text-[#141211] focus:outline-none focus:border-[#750A0A]"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#750A0A] hover:bg-[#8E1137] text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" />
          {loading ? "Searching..." : "Track"}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center">
          {error}. Please check the order reference number and try again.
        </div>
      )}

      {order && (
        <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-2xl border border-[#EAE2D5] space-y-8 shadow-sm">
          {/* Top info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE2D5]">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">Order Reference</span>
              <p className="font-mono text-lg font-bold text-[#750A0A]">{order.orderNumber}</p>
              <p className="text-xs text-zinc-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400">Current Status</span>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0D3A2F] bg-emerald-50 px-3 py-1 rounded border border-emerald-200 inline-block mt-0.5">
                ● {order.orderStatus}
              </div>
            </div>
          </div>

          {/* Timeline visualization */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#141211]">
              Fulfillment Journey
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px] uppercase tracking-wider">
              {TIMELINE_STEPS.map((step, idx) => {
                const currentIdx = getStepIndex(order.orderStatus);
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={step} className="flex flex-col items-center space-y-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold transition-all ${
                        isCurrent
                          ? "bg-[#750A0A] text-white ring-4 ring-[#750A0A]/20"
                          : isPassed
                          ? "bg-[#0D3A2F] text-white"
                          : "bg-zinc-200 text-zinc-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className={isCurrent ? "font-bold text-[#750A0A]" : isPassed ? "text-zinc-800" : "text-zinc-400"}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EAE2D5] text-xs">
            <div>
              <span className="text-zinc-400 uppercase tracking-wider text-[10px]">Recipient</span>
              <p className="font-semibold text-[#141211] mt-0.5">{order.customerName}</p>
              <p className="text-zinc-600">{order.shippingAddress}, {order.city}</p>
            </div>
            <div>
              <span className="text-zinc-400 uppercase tracking-wider text-[10px]">Payment Overview</span>
              <p className="font-semibold text-[#141211] mt-0.5">
                {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod} (Rs. {order.total.toLocaleString()})
              </p>
              <p className="text-zinc-600">Status: {order.paymentStatus}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-[#750A0A] font-semibold">
          Real-Time Concierge Tracking
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#141211] tracking-wider">
          Track Your Atelier Order
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500">
          Enter your VELOURA order number (e.g. VEL-123456) to view current status and dispatch progress.
        </p>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading concierge tracking...</div>}>
        <OrderTrackingContent />
      </Suspense>
    </div>
  );
}
