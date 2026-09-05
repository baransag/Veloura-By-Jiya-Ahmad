"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  CheckCircle2,
  XCircle,
  Search,
  Clock,
  Phone,
  Printer,
  MessageCircle,
  AlertCircle,
  Truck,
  MapPin,
  Sparkles,
} from "lucide-react";
import { getBaseWhatsAppUrl } from "@/lib/whatsapp";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<any | null>(null);

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

  // Verify or reject manual payment
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Printable Thermal Slip Modal */}
      {selectedOrderForPrint && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-black p-8 rounded-2xl max-w-lg w-full space-y-6 shadow-2xl print:m-0 print:p-0 print:shadow-none print:w-full">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-wider">VELOURA</h3>
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">
                  Luxury Beauty & Fine Jewels Atelier
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold">{selectedOrderForPrint.orderNumber}</span>
                <p className="text-[10px] text-zinc-500">
                  {new Date(selectedOrderForPrint.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-2 border-b pb-4 text-xs">
              <p className="font-bold text-sm">Customer Shipping Label</p>
              <p className="font-semibold">{selectedOrderForPrint.customerName}</p>
              <p className="text-zinc-700">{selectedOrderForPrint.shippingAddress}</p>
              <p className="font-bold">{selectedOrderForPrint.city}, {selectedOrderForPrint.province}</p>
              <p className="font-mono">Contact: {selectedOrderForPrint.customerPhone}</p>
            </div>

            <div className="space-y-2 border-b pb-4 text-xs">
              <p className="font-bold">Parcel Checklist</p>
              <div className="divide-y">
                {selectedOrderForPrint.items?.map((item: any) => (
                  <div key={item.id} className="py-1.5 flex justify-between">
                    <span>[ ] {item.quantity}x {item.productName}</span>
                    <span className="font-mono font-semibold">Rs. {item.total}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-bold border-b pb-4">
              <span>COD Collection Amount:</span>
              <span className="text-base">Rs. {selectedOrderForPrint.total.toLocaleString()}</span>
            </div>

            <div className="flex gap-3 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-black text-white text-xs uppercase font-bold tracking-wider rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Parcel Slip
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrderForPrint(null)}
                className="px-4 py-2.5 border rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2185B] font-bold">
            Order Fulfillment & Verification
          </span>
          <h1 className="font-serif text-3xl text-white mt-1">Orders & Dispatch CMS</h1>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, phone, TID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-[#F8D5DE]/20 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-[#C2185B]"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-400">Loading orders from PostgreSQL...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-white/5 rounded-3xl border border-[#F8D5DE]/20 space-y-2">
          <Package className="w-8 h-8 text-[#C2185B] mx-auto opacity-70 animate-pulse" />
          <p className="font-serif text-lg text-white">No Orders Found</p>
          <p className="text-xs text-zinc-400">New customer orders will immediately show up here live.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const customerPhoneClean = order.customerPhone.replace(/[^0-9]/g, "");
            const whatsAppDirect = `https://wa.me/92${customerPhoneClean.startsWith("0") ? customerPhoneClean.slice(1) : customerPhoneClean}?text=Hello%20${encodeURIComponent(order.customerName)},%20this%20is%20Veloura%20Atelier%20regarding%20your%20Order%20%23${order.orderNumber}.`;

            return (
              <div
                key={order.id}
                className="bg-white/5 p-6 rounded-3xl border border-[#F8D5DE]/20 space-y-4 hover:border-[#C2185B]/50 transition-all text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#E14D75]">
                        {order.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase">
                        {order.paymentMethod}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#8E1B3B] text-white text-[10px] font-bold uppercase">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      Placed: {new Date(order.createdAt).toLocaleString("en-PK")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForPrint(order)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors font-bold text-[11px]"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip</span>
                    </button>

                    <a
                      href={whatsAppDirect}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white flex items-center gap-1.5 transition-all font-bold text-[11px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                    </a>
                  </div>
                </div>

                {/* Customer & Address Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-zinc-300">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                      Customer
                    </span>
                    <p className="font-bold text-white text-sm mt-0.5">{order.customerName}</p>
                    <p className="text-zinc-400">{order.customerPhone}</p>
                    <p className="text-zinc-400 truncate">{order.customerEmail}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                      Shipping Address
                    </span>
                    <p className="mt-0.5 font-medium">{order.shippingAddress}</p>
                    <p className="text-zinc-400 font-bold text-[#E14D75]">{order.city}, {order.province}</p>
                    {order.notes && <p className="text-amber-300 italic text-[11px] mt-1">Note: {order.notes}</p>}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                      Change Fulfillment Status
                    </span>
                    <select
                      value={order.orderStatus}
                      disabled={actionLoading === order.id}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl bg-[#25050D] border border-[#F8D5DE]/30 text-white text-xs outline-none focus:border-[#C2185B]"
                    >
                      <option value="PENDING">PENDING (New)</option>
                      <option value="CONFIRMED">CONFIRMED (Verified)</option>
                      <option value="PROCESSING">PROCESSING (Crafting)</option>
                      <option value="PACKED">PACKED (Velvet Box Ready)</option>
                      <option value="SHIPPED">SHIPPED (In Courier Transit)</option>
                      <option value="DELIVERED">DELIVERED (Cash Cleared)</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                {/* Items and Total */}
                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-zinc-400">
                    <span className="font-bold text-white">Items: </span>
                    {order.items?.map((it: any) => `${it.quantity}x ${it.productName}`).join(", ")}
                  </div>
                  <div className="text-right font-bold text-white text-sm">
                    Total: <span className="text-[#E14D75]">Rs. {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
