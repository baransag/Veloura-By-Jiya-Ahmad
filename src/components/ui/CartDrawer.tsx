"use client";

import React from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, ArrowRight, Sparkles, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    shippingFee,
    total,
    freeShippingRemaining,
    openCartWhatsApp,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-[#25050D]/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#F8D5DE]">
          {/* Header */}
          <div className="p-6 border-b border-[#F8D5DE] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C2185B]" />
              <h2 className="font-serif text-lg tracking-wider uppercase text-[#25050D] font-bold">
                Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-[#8E1B3B]/60 hover:text-[#8E1B3B] rounded-lg hover:bg-[#FFF0F3] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-[#FFF0F3] px-6 py-3 border-b border-[#F8D5DE]">
            {freeShippingRemaining > 0 ? (
              <p className="text-xs text-[#8E1B3B] font-medium text-center">
                Add <span className="font-bold text-[#C2185B]">Rs. {freeShippingRemaining.toLocaleString()}</span> more for free delivery!
              </p>
            ) : (
              <p className="text-xs text-[#C2185B] font-bold text-center flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> You have unlocked Complimentary Delivery!
              </p>
            )}
            <div className="w-full bg-white rounded-full h-1.5 mt-2 overflow-hidden border border-[#F8D5DE]">
              <div
                className="bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / 3000) * 100)}%` }}
              />
            </div>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#E14D75] mx-auto opacity-40" />
                <p className="font-serif text-lg text-[#25050D]">Your bag is empty</p>
                <p className="text-xs text-[#8E1B3B]/70">Discover our new silk and beauty creations</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 inline-block text-xs uppercase tracking-[0.2em] font-bold text-[#8E1B3B] border-b-2 border-[#8E1B3B] pb-1 hover:text-[#C2185B]"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => {
                const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
                return (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-[#FCE7EC] last:border-0">
                    <div className="relative w-20 h-24 bg-[#FFF0F3] rounded-2xl overflow-hidden flex-shrink-0 border border-[#F8D5DE]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8E1B3B]/50">
                          VELOURA
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-[#25050D] line-clamp-1">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-[#8E1B3B]">
                            Rs. {activePrice.toLocaleString()}
                          </span>
                          {item.salePrice && item.salePrice > 0 && (
                            <span className="text-[11px] text-[#8E1B3B]/40 line-through">
                              Rs. {item.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#F8D5DE] rounded-xl bg-white overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-[#8E1B3B] hover:bg-[#FFF0F3]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-[#25050D]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-[#8E1B3B] hover:bg-[#FFF0F3]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#8E1B3B]/50 hover:text-[#C2185B] p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#F8D5DE] bg-[#FFF8FA] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#8E1B3B]/80">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#25050D]">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#8E1B3B]/80">
                  <span>Shipping</span>
                  <span className="font-bold text-[#25050D]">
                    {shippingFee === 0 ? "Complimentary" : `Rs. ${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#25050D] pt-2 border-t border-[#F8D5DE]">
                  <span>Total</span>
                  <span className="text-[#8E1B3B]">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Order Via WhatsApp Button */}
              <button
                onClick={() => openCartWhatsApp()}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#FFF0F3] text-[#8E1B3B] hover:bg-[#FCE7EC] border border-[#F8D5DE] rounded-2xl text-xs tracking-wider uppercase font-bold transition-all shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-[#C2185B]" />
                Order via WhatsApp
              </button>

              {/* Standard Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-[#8E1B3B] via-[#C2185B] to-[#8E1B3B] text-white hover:brightness-110 rounded-2xl text-xs tracking-wider uppercase font-bold transition-all shadow-hover-pink"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
