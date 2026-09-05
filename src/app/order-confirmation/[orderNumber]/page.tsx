import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, MessageCircle, Truck, Package, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { generateOrderConfirmationWhatsAppMessage, getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

interface OrderConfirmationProps {
  params: {
    orderNumber: string;
  };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationProps) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber.toUpperCase() },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  // Generate dynamic WhatsApp message
  const whatsappMsg = generateOrderConfirmationWhatsAppMessage({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    items: order.items.map((i) => ({ productName: i.productName, quantity: i.quantity })),
    total: order.total,
    paymentMethod: order.paymentMethod,
  });

  const whatsappUrl = getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER, whatsappMsg);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-10">
      {/* Confirmation Banner */}
      <div className="text-center space-y-4 bg-white p-8 sm:p-12 rounded-3xl border border-[#F8D5DE] shadow-soft-pink">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#8E1B3B] to-[#C2185B] text-white mx-auto flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs uppercase tracking-[0.3em] text-[#C2185B] font-bold block">
          Order Successfully Received
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#25050D] font-light">
          Thank You, {order.customerName.split(" ")[0]}!
        </h1>

        <p className="text-xs sm:text-sm text-[#8E1B3B]/80 max-w-lg mx-auto font-light">
          Your order has been recorded in the VELOURA atelier. We are preparing your complimentary velvet packaging and dispatching via express courier.
        </p>

        <div className="inline-block bg-[#FFF0F3] px-5 py-2.5 rounded-full border border-[#F8D5DE] text-xs font-mono tracking-wider font-bold text-[#8E1B3B]">
          Order Number: <span className="text-[#C2185B]">{order.orderNumber}</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white text-xs uppercase tracking-[0.2em] font-bold rounded-2xl shadow-hover-pink transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm Order on WhatsApp</span>
          </a>

          <Link
            href={`/order-tracking?orderNumber=${order.orderNumber}`}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#8E1B3B] text-xs uppercase tracking-[0.2em] font-bold rounded-2xl border border-[#F8D5DE] transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Track Live Shipment</span>
          </Link>
        </div>
      </div>

      {/* Payment & Delivery Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-[#F8D5DE] shadow-soft-pink space-y-2 text-xs">
          <h3 className="text-[11px] uppercase tracking-wider text-[#C2185B] font-bold">
            Payment Method
          </h3>
          <p className="font-bold text-[#25050D] text-sm">
            {order.paymentMethod === "COD" ? "Cash on Delivery (COD)" : order.paymentMethod}
          </p>
          <div className="pt-1">
            {order.paymentMethod === "COD" ? (
              <span className="inline-block text-[11px] font-semibold text-[#8E1B3B] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#F8D5DE]">
                Cash Due Upon Doorstep Delivery: Rs. {order.total.toLocaleString()}
              </span>
            ) : (
              <div className="space-y-1">
                <span className="inline-block text-[11px] font-semibold text-[#C2185B] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#F8D5DE]">
                  Payment Verification Underway
                </span>
                {order.transactionReference && (
                  <p className="text-[11px] text-[#8E1B3B]/70 font-mono">TID: {order.transactionReference}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#F8D5DE] shadow-soft-pink space-y-2 text-xs">
          <h3 className="text-[11px] uppercase tracking-wider text-[#C2185B] font-bold">
            Shipping Destination
          </h3>
          <p className="font-bold text-[#25050D] text-sm">{order.customerName}</p>
          <p className="text-[#8E1B3B]/80 leading-relaxed font-light">
            {order.shippingAddress}, {order.city}, {order.province}
          </p>
          <p className="text-[#8E1B3B] font-semibold">{order.customerPhone}</p>
        </div>
      </div>

      {/* Order Summary Items */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F8D5DE] shadow-soft-pink space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#25050D] pb-3 border-b border-[#F8D5DE]">
          Purchased Creations ({order.items.length})
        </h3>
        <div className="divide-y divide-[#FCE7EC]">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-[#25050D]">{item.productName}</p>
                <p className="text-[11px] text-[#8E1B3B]/70">Quantity: {item.quantity}</p>
              </div>
              <span className="font-bold text-[#8E1B3B]">
                Rs. {item.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[#F8D5DE] flex justify-between text-sm font-bold text-[#8E1B3B]">
          <span>Total Payable</span>
          <span>Rs. {order.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8E1B3B] hover:text-[#C2185B] transition-colors"
        >
          <span>Continue Exploring Creations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
