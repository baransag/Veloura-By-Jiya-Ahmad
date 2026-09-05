"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

const TIMELINE_STEPS = [
  { key: "PENDING", label: "Order Placed", desc: "Order recorded at Veloura Atelier" },
  { key: "CONFIRMED", label: "Confirmed", desc: "Verified & queued for crafting" },
  { key: "PACKED", label: "Packed & Sealed", desc: "Protected in signature velvet silk box" },
  { key: "SHIPPED", label: "In Transit", desc: "Dispatched with express courier" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", desc: "Rider dispatched to your address" },
  { key: "DELIVERED", label: "Delivered", desc: "Received & COD payment collected" },
];

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
    switch (status) {
      case "PENDING":
        return 0;
      case "CONFIRMED":
        return 1;
      case "PROCESSING":
      case "PACKED":
        return 2;
      case "SHIPPED":
        return 3;
      case "DELIVERED":
        return 5;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : 0;

  const whatsAppInquiryUrl = order
    ? getBaseWhatsAppUrl(
        OFFICIAL_WHATSAPP_NUMBER,
        `Hi Veloura! I would like to check the delivery update for Order #${order.orderNumber}.`
      )
    : getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER);

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
          className="flex-1 px-4 py-3 rounded-2xl border border-[#F8D5DE] bg-white text-xs font-mono tracking-wider text-[#25050D] outline-none focus:border-[#E14D75] focus:ring-2 focus:ring-[#E14D75]/15 shadow-soft-pink"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white text-xs uppercase tracking-wider font-bold rounded-2xl transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? "Searching..." : "Track"}</span>
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-[#C2185B] text-xs text-center max-w-md mx-auto">
          {error}. Please verify the reference number or contact our WhatsApp concierge.
        </div>
      )}

      {order && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#F8D5DE] space-y-8 shadow-soft-pink">
          {/* Top Order Information Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F8D5DE]">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C2185B] font-bold">
                Order Reference
              </span>
              <p className="font-mono text-xl font-bold text-[#8E1B3B]">{order.orderNumber}</p>
              <p className="text-xs text-[#8E1B3B]/70 mt-0.5">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-PK", {
                  dateStyle: "medium",
                })}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase tracking-widest text-[#C2185B] font-bold block">
                Fulfillment Status
              </span>
              <span className="inline-block mt-1 text-xs font-bold uppercase tracking-wider text-[#8E1B3B] bg-[#FFF0F3] px-3.5 py-1 rounded-full border border-[#F8D5DE]">
                ● {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Daraz/Temu 6-Step Visual Courier Stepper */}
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.25em] font-bold text-[#25050D] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C2185B]" />
              <span>Courier Delivery Stepper</span>
            </h3>

            <div className="relative">
              {/* Progress Line */}
              <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-[#FFF0F3] -z-0">
                <div
                  className="h-full bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] transition-all duration-700"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>

              {/* Step Circles */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.key} className="flex flex-col items-center space-y-2 relative z-10">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                          isDone
                            ? "bg-gradient-to-br from-[#8E1B3B] to-[#C2185B] text-white shadow-md scale-105"
                            : "bg-[#FFF0F3] text-[#F4B8C6] border border-[#F8D5DE]"
                        } ${isCurrent ? "ring-4 ring-[#E14D75]/20 animate-pulse" : ""}`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <span className="text-xs font-bold font-mono">{idx + 1}</span>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <p
                          className={`text-xs font-bold ${
                            isDone ? "text-[#8E1B3B]" : "text-[#8E1B3B]/40"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[10px] text-[#8E1B3B]/60 line-clamp-2 leading-tight">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Delivery Details & Courier Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#F8D5DE]">
            <div className="p-5 rounded-2xl bg-[#FFF8FA] border border-[#F8D5DE] space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#C2185B]">
                <MapPin className="w-4 h-4" />
                <span>Delivery Address</span>
              </div>
              <p className="font-bold text-[#25050D]">{order.customerName}</p>
              <p className="text-[#8E1B3B]/80 font-light">
                {order.shippingAddress}, {order.city} ({order.province})
              </p>
              <p className="text-[#8E1B3B] font-semibold">{order.customerPhone}</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF8FA] border border-[#F8D5DE] space-y-3 text-xs flex flex-col justify-between">
              <div>
                <span className="font-bold text-[#C2185B] block">Need Instant Assistance?</span>
                <p className="text-[#8E1B3B]/80 mt-1 font-light">
                  Our WhatsApp Atelier concierge can check exact rider location or change delivery schedule.
                </p>
              </div>

              <a
                href={whatsAppInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:brightness-110 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask Courier on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C2185B] font-bold block">
          Domestic Express Delivery
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#25050D] font-light">
          Track Your Veloura Order
        </h1>
        <p className="text-xs text-[#8E1B3B]/70 max-w-md mx-auto">
          Enter your order reference code below for real-time tracking across Pakistan.
        </p>
      </div>

      <Suspense fallback={<div className="text-center text-xs text-[#8E1B3B]">Loading tracking engine...</div>}>
        <OrderTrackingContent />
      </Suspense>
    </div>
  );
}
