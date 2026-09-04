"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { ShieldCheck, Truck, ArrowRight, AlertCircle, CheckCircle2, Phone, CreditCard, Banknote } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("Lahore");
  const [province, setProvince] = useState("Punjab");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  // Payment Selection: COD | EASYPAISA | JAZZCASH
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "EASYPAISA" | "JAZZCASH">("COD");
  const [transactionReference, setTransactionReference] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your shopping bag is empty.");
      return;
    }

    if (!customerName || !customerPhone || !shippingAddress || !city) {
      setError("Please fill in all mandatory delivery fields.");
      return;
    }

    if ((paymentMethod === "EASYPAISA" || paymentMethod === "JAZZCASH") && !transactionReference.trim()) {
      setError(`Please enter your ${paymentMethod} transaction/reference ID after sending payment.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress,
          city,
          province,
          postalCode,
          notes,
          paymentMethod,
          transactionReference: transactionReference.trim(),
          paymentScreenshot,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order.");
      }

      // Order created successfully!
      clearCart();
      router.push(`/order-confirmation/${data.order.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl text-[#141211]">Your Bag is Empty</h2>
        <p className="text-xs text-zinc-500">Please add items to your bag before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-[#750A0A] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-2xl mx-auto text-center space-y-2 mb-10">
        <span className="text-xs uppercase tracking-[0.3em] text-[#750A0A] font-semibold">
          Seamless & Secure
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#141211] tracking-wider">
          Complete Your Order
        </h1>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-8 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Customer Details */}
          <div className="bg-[#FDFBF7] p-6 rounded-xl border border-[#EAE2D5] space-y-4">
            <h2 className="font-serif text-lg text-[#141211] pb-2 border-b border-[#EAE2D5] tracking-wide">
              1. Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Fatima Ali"
                  className="w-full px-3 py-2.5 rounded border border-[#EAE2D5] bg-white text-[#141211] focus:outline-none focus:border-[#750A0A]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 0300 1234567"
                  className="w-full px-3 py-2.5 rounded border border-[#EAE2D5] bg-white text-[#141211] focus:outline-none focus:border-[#750A0A]"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-zinc-700">Email Address (Optional)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="for order tracking updates"
                className="w-full px-3 py-2.5 rounded border border-[#EAE2D5] bg-white text-[#141211] focus:outline-none focus:border-[#750A0A]"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-zinc-700">Complete Shipping Address *</label>
              <textarea
                required
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="House/Apartment #, Street, Block, Area"
                className="w-full px-3 py-2.5 rounded border border-[#EAE2D5] bg-white text-[#141211] focus:outline-none focus:border-[#750A0A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-700">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  className="w-full px-3 py-2.5 rounded border border-[#EAE2D5] bg-white text-[#141211] focus:outline-none focus:border-[#750A0A]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-zinc-700">Province</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2.5 rounded border border-[#EAE2D5] bg-white text-[#141211] focus:outline-none focus:border-[#750A0A]"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital Territory">Islamabad</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-medium text-zinc-700">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2.5 rounded border border-[#EAE2D5] bg-white text-[#141211] focus:outline-none focus:border-[#750A0A]"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-zinc-700">Special Delivery Instructions (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please call before arrival"
                className="w-full px-3 py-2.5 rounded border border-[#EAE2D5] bg-white text-[#141211] focus:outline-none focus:border-[#750A0A]"
              />
            </div>
          </div>

          {/* Section 2: Payment Method Selector */}
          <div className="bg-[#FDFBF7] p-6 rounded-xl border border-[#EAE2D5] space-y-6">
            <h2 className="font-serif text-lg text-[#141211] pb-2 border-b border-[#EAE2D5] tracking-wide">
              2. Payment Method
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "border-[#750A0A] bg-[#750A0A]/5 shadow-sm"
                    : "border-[#EAE2D5] hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-[#750A0A] w-4 h-4"
                  />
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-[#750A0A]" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#141211]">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-[11px] text-zinc-500">Pay cash directly to the courier upon parcel arrival</p>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#750A0A] uppercase tracking-widest">Popular</span>
              </label>

              {/* Option 2: Easypaisa */}
              <label
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === "EASYPAISA"
                    ? "border-[#0D3A2F] bg-[#0D3A2F]/5 shadow-sm"
                    : "border-[#EAE2D5] hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="EASYPAISA"
                    checked={paymentMethod === "EASYPAISA"}
                    onChange={() => setPaymentMethod("EASYPAISA")}
                    className="accent-[#0D3A2F] w-4 h-4"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#0D3A2F] text-white flex items-center justify-center text-[10px] font-bold">
                      EP
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#141211]">
                        Easypaisa Mobile Account
                      </p>
                      <p className="text-[11px] text-zinc-500">Send payment to +92 321 9954325</p>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#0D3A2F] uppercase tracking-widest">Instant</span>
              </label>

              {/* Option 3: JazzCash */}
              <label
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === "JAZZCASH"
                    ? "border-[#750A0A] bg-[#750A0A]/5 shadow-sm"
                    : "border-[#EAE2D5] hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="JAZZCASH"
                    checked={paymentMethod === "JAZZCASH"}
                    onChange={() => setPaymentMethod("JAZZCASH")}
                    className="accent-[#750A0A] w-4 h-4"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#750A0A] text-white flex items-center justify-center text-[10px] font-bold">
                      JC
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#141211]">
                        JazzCash Account
                      </p>
                      <p className="text-[11px] text-zinc-500">Send payment to +92 321 9954325</p>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#750A0A] uppercase tracking-widest">Instant</span>
              </label>
            </div>

            {/* Dynamic Payment Instruction Boxes */}
            {paymentMethod === "COD" && (
              <div className="p-4 rounded-lg bg-[#F6F1E8] border border-[#EAE2D5] text-xs text-zinc-700 space-y-1">
                <p className="font-semibold text-[#141211]">Cash on Delivery Selected</p>
                <p className="text-zinc-600">
                  Please keep exact cash ready upon parcel delivery. Our courier partner will collect Rs. {total.toLocaleString()} at your doorstep.
                </p>
              </div>
            )}

            {paymentMethod === "EASYPAISA" && (
              <div className="p-5 rounded-lg bg-[#0D3A2F]/10 border border-[#0D3A2F]/30 space-y-4 text-xs">
                <div className="border-b border-[#0D3A2F]/20 pb-2">
                  <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#0D3A2F]">
                    EASYPAISA PAYMENT INSTRUCTIONS
                  </h3>
                  <p className="text-zinc-700 mt-1">
                    Send exact total <span className="font-bold text-[#0D3A2F]">Rs. {total.toLocaleString()}</span> to the official account:
                  </p>
                  <p className="text-base font-bold text-[#0D3A2F] mt-1 flex items-center gap-1.5">
                    <Phone className="w-4 h-4" /> +92 321 9954325
                  </p>
                  <p className="text-[11px] text-zinc-500">Account Title: VELOURA Official</p>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#141211]">
                    Transaction / Reference ID (TID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    placeholder="Enter the 11-digit or alphanumeric Easypaisa TID"
                    className="w-full px-3 py-2.5 rounded border border-[#0D3A2F]/40 bg-white text-[#141211] focus:outline-none focus:ring-1 focus:ring-[#0D3A2F]"
                  />
                  <p className="text-[10px] text-zinc-500">
                    Our dispatch team will manually verify this transaction ID before packing your order.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === "JAZZCASH" && (
              <div className="p-5 rounded-lg bg-[#750A0A]/10 border border-[#750A0A]/30 space-y-4 text-xs">
                <div className="border-b border-[#750A0A]/20 pb-2">
                  <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[#750A0A]">
                    JAZZCASH PAYMENT INSTRUCTIONS
                  </h3>
                  <p className="text-zinc-700 mt-1">
                    Send exact total <span className="font-bold text-[#750A0A]">Rs. {total.toLocaleString()}</span> to the official account:
                  </p>
                  <p className="text-base font-bold text-[#750A0A] mt-1 flex items-center gap-1.5">
                    <Phone className="w-4 h-4" /> +92 321 9954325
                  </p>
                  <p className="text-[11px] text-zinc-500">Account Title: VELOURA Official</p>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#141211]">
                    Transaction / Reference ID (TID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    placeholder="Enter the 11-digit or alphanumeric JazzCash TID"
                    className="w-full px-3 py-2.5 rounded border border-[#750A0A]/40 bg-white text-[#141211] focus:outline-none focus:ring-1 focus:ring-[#750A0A]"
                  />
                  <p className="text-[10px] text-zinc-500">
                    Our dispatch team will manually verify this transaction ID before packing your order.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary: Bag review & Place Order CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FDFBF7] p-6 rounded-xl border border-[#EAE2D5] space-y-4 sticky top-24">
            <h2 className="font-serif text-lg text-[#141211] pb-2 border-b border-[#EAE2D5] tracking-wide">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
            </h2>

            {/* List of items */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => {
                const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
                return (
                  <div key={item.id} className="flex gap-3 text-xs items-center justify-between pb-2 border-b border-[#EAE2D5]/60 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-12 rounded overflow-hidden bg-[#F6F1E8] border border-[#EAE2D5] flex-shrink-0">
                        {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium text-[#141211] line-clamp-1">{item.name}</p>
                        <p className="text-zinc-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#141211]">
                      Rs. {(activePrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totals breakdown */}
            <div className="space-y-2 text-xs pt-4 border-t border-[#EAE2D5]">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery Charges</span>
                <span>{shippingFee === 0 ? "Complimentary (Free)" : `Rs. ${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#141211] pt-2 border-t border-[#EAE2D5]">
                <span>Total Amount</span>
                <span className="text-[#750A0A]">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-[#750A0A] hover:bg-[#8E1137] text-white text-xs uppercase tracking-[0.25em] font-semibold rounded shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Processing Atelier Order..."
              ) : (
                <>
                  Place Order Now
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-zinc-400 space-y-1">
              <p>🔒 256-bit encrypted secure checkout</p>
              <p>Complimentary silk packaging included with every order</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
