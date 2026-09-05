"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Phone,
  Banknote,
  Tag,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const PAKISTAN_CITIES = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Gujranwala",
  "Sialkot",
  "Quetta",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Abbottabad",
  "Sukkur",
  "Jhelum",
  "Gujrat",
  "Mardan",
  "Sahiwal",
  "Rahim Yar Khan",
  "Sheikhupura",
  "Wah Cantt",
  "Kasur",
  "Okara",
  "Mingora (Swat)",
  "Muzaffarabad",
  "Mirpur (AJK)",
  "Other Pakistan City",
];

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
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Coupon / Promo Code Engine
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate final numbers
  const effectiveShipping = appliedCoupon === "FREESHIP" || subtotal >= 3000 ? 0 : shippingFee;
  const finalTotal = Math.max(0, subtotal - discountAmount + effectiveShipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();

    if (code === "VELOURA10") {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setAppliedCoupon("VELOURA10 (10% OFF)");
    } else if (code === "JIYA15") {
      const disc = Math.round(subtotal * 0.15);
      setDiscountAmount(disc);
      setAppliedCoupon("JIYA15 (15% VIP OFF)");
    } else if (code === "FREESHIP") {
      setAppliedCoupon("FREESHIP (Free Delivery)");
      setDiscountAmount(0);
    } else {
      setCouponError("Invalid promo code. Try VELOURA10 or FREESHIP");
    }
  };

  const copyNumber = () => {
    navigator.clipboard.writeText("03219954325");
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your shopping bag is empty.");
      return;
    }

    if (!customerName || !customerPhone || !shippingAddress || !city) {
      setError("Please fill in all mandatory delivery fields (Name, Phone, Address, City).");
      return;
    }

    if ((paymentMethod === "EASYPAISA" || paymentMethod === "JAZZCASH") && !transactionReference.trim()) {
      setError(`Please enter your ${paymentMethod} transaction reference ID / TID.`);
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
          customerEmail: customerEmail || `${customerPhone}@veloura.pk`,
          shippingAddress,
          city,
          province,
          postalCode,
          notes: notes
            ? `${notes} | Promo: ${appliedCoupon || "None"}`
            : appliedCoupon
            ? `Promo applied: ${appliedCoupon}`
            : undefined,
          paymentMethod,
          transactionReference: transactionReference.trim(),
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to place order.");
      }

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
        <h2 className="font-serif text-3xl text-[#25050D]">Your Bag is Empty</h2>
        <p className="text-xs text-[#8E1B3B]/70">Please add creations to your bag before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-xl shadow-md"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center space-y-2 mb-10">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C2185B] font-bold block">
          Secure Atelier Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#25050D] font-light">
          Complete Your Order
        </h1>
        <p className="text-xs text-[#8E1B3B]/70">
          Fast Cash on Delivery & Express Courier Dispatch Across Pakistan
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-[#C2185B] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Form: Shipping Details & Payment Selection */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Customer & Shipping Details */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F8D5DE] shadow-soft-pink space-y-6">
            <h2 className="font-serif text-xl text-[#25050D] pb-3 border-b border-[#F8D5DE] font-semibold flex items-center justify-between">
              <span>1. Delivery Destination</span>
              <span className="text-[11px] text-[#C2185B] font-sans uppercase font-bold tracking-wider">
                Pakistan Domestic
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#8E1B3B]">Full Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ayesha Malik"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] outline-none focus:border-[#E14D75] focus:ring-2 focus:ring-[#E14D75]/15"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#8E1B3B]">WhatsApp / Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 0321 1234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] outline-none focus:border-[#E14D75] focus:ring-2 focus:ring-[#E14D75]/15"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#8E1B3B]">Email Address (For Courier Receipt)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. ayesha@example.com (optional)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] outline-none focus:border-[#E14D75] focus:ring-2 focus:ring-[#E14D75]/15"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#8E1B3B]">Complete Street Address / House No / Area *</label>
              <textarea
                required
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="e.g. House #14, Street 3, Sector G-9/2, or DHA Phase 5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] outline-none focus:border-[#E14D75] focus:ring-2 focus:ring-[#E14D75]/15"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#8E1B3B]">City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] bg-white outline-none focus:border-[#E14D75]"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#8E1B3B]">Province *</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] bg-white outline-none focus:border-[#E14D75]"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital Territory">Islamabad</option>
                  <option value="Azad Kashmir">Azad Kashmir</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#8E1B3B]">Special Delivery Rider Instructions (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please call before arrival or deliver after 3 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] outline-none focus:border-[#E14D75]"
              />
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F8D5DE] shadow-soft-pink space-y-6">
            <h2 className="font-serif text-xl text-[#25050D] pb-3 border-b border-[#F8D5DE] font-semibold">
              2. Payment Method
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery (Pre-selected) */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "border-[#C2185B] bg-[#FFF0F3] shadow-xs"
                    : "border-[#F8D5DE] hover:border-[#E14D75]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-[#C2185B] w-4 h-4"
                  />
                  <div className="flex items-center gap-2.5">
                    <Banknote className="w-5 h-5 text-[#C2185B]" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#25050D]">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-[11px] text-[#8E1B3B]/70">
                        Pay cash directly to courier rider upon doorstep arrival
                      </p>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-white bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] px-2.5 py-0.5 rounded-full uppercase">
                  Most Popular
                </span>
              </label>

              {/* Option 2: Easypaisa */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "EASYPAISA"
                    ? "border-[#C2185B] bg-[#FFF0F3] shadow-xs"
                    : "border-[#F8D5DE] hover:border-[#E14D75]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="EASYPAISA"
                    checked={paymentMethod === "EASYPAISA"}
                    onChange={() => setPaymentMethod("EASYPAISA")}
                    className="accent-[#C2185B] w-4 h-4"
                  />
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#8E1B3B] text-white flex items-center justify-center text-[10px] font-bold">
                      EP
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#25050D]">
                        Easypaisa Mobile Account
                      </p>
                      <p className="text-[11px] text-[#8E1B3B]/70">Direct transfer to 0321 9954325</p>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#8E1B3B] bg-[#FCE7EC] px-2.5 py-0.5 rounded-full uppercase">
                  Instant
                </span>
              </label>

              {/* Option 3: JazzCash */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "JAZZCASH"
                    ? "border-[#C2185B] bg-[#FFF0F3] shadow-xs"
                    : "border-[#F8D5DE] hover:border-[#E14D75]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="JAZZCASH"
                    checked={paymentMethod === "JAZZCASH"}
                    onChange={() => setPaymentMethod("JAZZCASH")}
                    className="accent-[#C2185B] w-4 h-4"
                  />
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#C2185B] text-white flex items-center justify-center text-[10px] font-bold">
                      JC
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#25050D]">
                        JazzCash Account
                      </p>
                      <p className="text-[11px] text-[#8E1B3B]/70">Direct transfer to 0321 9954325</p>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#8E1B3B] bg-[#FCE7EC] px-2.5 py-0.5 rounded-full uppercase">
                  Instant
                </span>
              </label>
            </div>

            {/* Instruction Boxes */}
            {paymentMethod === "COD" ? (
              <div className="p-4 rounded-2xl bg-[#FFF8FA] border border-[#F8D5DE] text-xs text-[#8E1B3B] space-y-1">
                <p className="font-bold text-[#25050D]">Cash on Delivery Selected</p>
                <p>
                  Please keep exact cash ready upon delivery. Our courier partner will collect{" "}
                  <strong className="text-[#8E1B3B]">Rs. {finalTotal.toLocaleString()}</strong> at your doorstep.
                </p>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#FFF0F3] border border-[#F8D5DE] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#8E1B3B] uppercase tracking-wider">
                    {paymentMethod} Official Account
                  </span>
                  <button
                    type="button"
                    onClick={copyNumber}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#F8D5DE] text-[10px] font-bold text-[#C2185B] flex items-center gap-1 shadow-2xs hover:bg-[#FCE7EC]"
                  >
                    {copiedAccount ? <Check className="w-3 h-3 text-[#C2185B]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAccount ? "Copied!" : "Copy Number"}</span>
                  </button>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#F8D5DE] space-y-1">
                  <p className="text-[11px] text-[#8E1B3B]/70">Account Title: <strong>Jiya Ahmad / Veloura</strong></p>
                  <p className="text-sm font-bold text-[#8E1B3B] tracking-wider">0321 9954325</p>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#8E1B3B]">Transaction ID / Reference Number (TID) *</label>
                  <input
                    type="text"
                    required
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    placeholder="e.g. 19284738291"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] bg-white text-xs text-[#25050D] outline-none focus:border-[#E14D75]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Form: Order Summary & Coupon Code */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F8D5DE] shadow-soft-pink space-y-6 sticky top-24">
            <h2 className="font-serif text-xl text-[#25050D] pb-3 border-b border-[#F8D5DE] font-semibold">
              Order Summary ({items.length} items)
            </h2>

            {/* Free Shipping Meter */}
            <div className="p-3.5 rounded-2xl bg-[#FFF8FA] border border-[#F8D5DE] space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#8E1B3B]">
                <span>{subtotal >= 3000 ? "🎉 FREE Shipping Unlocked!" : "Free Delivery Threshold"}</span>
                <span>Rs. {subtotal.toLocaleString()} / 3,000</span>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#F8D5DE]">
                <div
                  className="h-full bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / 3000) * 100)}%` }}
                />
              </div>
              {subtotal < 3000 && (
                <p className="text-[10px] text-[#8E1B3B]/70">
                  Add Rs. {(3000 - subtotal).toLocaleString()} more to unlock complimentary delivery!
                </p>
              )}
            </div>

            {/* Items List */}
            <div className="divide-y divide-[#FCE7EC] max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FFF0F3] border border-[#F8D5DE] flex-shrink-0 relative">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#25050D] truncate">{item.name}</p>
                    <p className="text-[11px] text-[#8E1B3B]/70">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-[#8E1B3B]">
                    Rs. {((item.salePrice || item.price) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Input */}
            <div className="space-y-2 pt-2 border-t border-[#F8D5DE]">
              <label className="text-xs font-bold text-[#8E1B3B] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#C2185B]" />
                <span>Promo Code / Voucher</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. VELOURA10"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#F8D5DE] text-xs uppercase text-[#25050D] outline-none focus:border-[#E14D75]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-xl bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#8E1B3B] border border-[#F8D5DE] text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-[11px] text-[#C2185B] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Coupon Applied: {appliedCoupon}
                </p>
              )}
              {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 pt-2 border-t border-[#F8D5DE] text-xs text-[#8E1B3B]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#25050D]">Rs. {subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#C2185B] font-bold">
                  <span>Discount Applied</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-bold text-[#25050D]">
                  {effectiveShipping === 0 ? "FREE" : `Rs. ${effectiveShipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#8E1B3B] pt-2 border-t border-[#F8D5DE]">
                <span>Total Amount</span>
                <span>Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#8E1B3B] via-[#C2185B] to-[#8E1B3B] hover:brightness-110 text-white text-xs uppercase tracking-[0.2em] font-bold rounded-2xl shadow-hover-pink transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Securing Order...</span>
              ) : (
                <>
                  <span>Place Order (Rs. {finalTotal.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#8E1B3B]/60 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C2185B]" />
              <span>SSL Encrypted Checkout • Verified Atelier Dispatch</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
