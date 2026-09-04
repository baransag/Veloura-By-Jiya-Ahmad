import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, MessageCircle, Truck, Package, ArrowRight, ShieldCheck } from "lucide-react";
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Confirmation Banner */}
      <div className="text-center space-y-4 bg-[#F6F1E8]/60 p-8 sm:p-12 rounded-2xl border border-[#EAE2D5]">
        <div className="w-16 h-16 rounded-full bg-[#0D3A2F] text-[#DA9413] mx-auto flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-[0.3em] text-[#750A0A] font-semibold block">
          Order Successfully Received
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#141211]">
          Thank You, {order.customerName.split(" ")[0]}
        </h1>

        <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto">
          Your order has been recorded in the VELOURA atelier. We will prepare your silk packaging and dispatch promptly.
        </p>

        <div className="inline-block bg-[#FDFBF7] px-5 py-2.5 rounded-full border border-[#EAE2D5] text-xs font-mono tracking-wider font-semibold text-[#141211]">
          Order Reference: <span className="text-[#750A0A] font-bold">{order.orderNumber}</span>
        </div>

        {/* WhatsApp Confirmation Button - MANDATORY SPEC */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#0D3A2F] hover:bg-[#084A3B] text-[#FDFBF7] text-xs uppercase tracking-[0.2em] font-semibold rounded shadow-md transition-all flex items-center justify-center gap-2 border border-[#DA9413]/30"
          >
            <MessageCircle className="w-4 h-4 text-[#DA9413]" />
            Chat on WhatsApp
          </a>

          <Link
            href={`/order-tracking?orderNumber=${order.orderNumber}`}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#FDFBF7] hover:bg-[#EAE2D5] text-[#141211] text-xs uppercase tracking-[0.2em] font-semibold rounded border border-[#EAE2D5] transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            Track Shipment
          </Link>
        </div>
      </div>

      {/* Payment & Delivery Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-[#FDFBF7] border border-[#EAE2D5] space-y-2">
          <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Payment Details</h3>
          <p className="font-semibold text-[#141211] text-sm">
            Method: {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}
          </p>
          <div className="pt-1">
            {order.paymentMethod === "COD" ? (
              <span className="inline-block text-[11px] font-semibold text-zinc-700 bg-zinc-100 px-2.5 py-0.5 rounded border">
                Cash Due Upon Delivery
              </span>
            ) : (
              <div className="space-y-1">
                <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  Payment Verification Pending
                </span>
                {order.transactionReference && (
                  <p className="text-[11px] text-zinc-500 font-mono">TID: {order.transactionReference}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#FDFBF7] border border-[#EAE2D5] space-y-2">
          <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Shipping Destination</h3>
          <p className="font-semibold text-[#141211] text-sm">{order.customerName}</p>
          <p className="text-xs text-zinc-600">{order.shippingAddress}, {order.city}</p>
          <p className="text-xs text-zinc-500">{order.customerPhone}</p>
        </div>
      </div>

      {/* Items Breakdown */}
      <div className="p-6 rounded-xl bg-[#FDFBF7] border border-[#EAE2D5] space-y-4">
        <h3 className="font-serif text-base text-[#141211] pb-2 border-b border-[#EAE2D5]">
          Purchased Atelier Creations
        </h3>
        <div className="divide-y divide-[#EAE2D5]">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center text-xs">
              <div>
                <p className="font-medium text-[#141211]">{item.productName}</p>
                <p className="text-zinc-500">Qty: {item.quantity}</p>
              </div>
              <span className="font-semibold text-[#750A0A]">
                Rs. {item.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#EAE2D5] space-y-1.5 text-xs">
          <div className="flex justify-between text-zinc-600">
            <span>Subtotal</span>
            <span>Rs. {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-zinc-600">
            <span>Shipping</span>
            <span>{order.shippingFee === 0 ? "Complimentary" : `Rs. ${order.shippingFee}`}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-[#141211] pt-2 border-t border-[#EAE2D5]">
            <span>Grand Total</span>
            <span className="text-[#750A0A]">Rs. {order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.2em] font-semibold text-[#750A0A] hover:text-[#470B24] inline-flex items-center gap-1"
        >
          Return to VELOURA Atelier <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
