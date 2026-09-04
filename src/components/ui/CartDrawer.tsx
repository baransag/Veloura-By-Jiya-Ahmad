"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, ArrowRight } from "lucide-react";
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] shadow-2xl flex flex-col border-l border-[#EAE2D5]">
          {/* Header */}
          <div className="p-6 border-b border-[#EAE2D5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#750A0A]" />
              <h2 className="font-serif text-lg tracking-wider uppercase text-[#141211]">
                Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-zinc-400 hover:text-[#141211] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-[#F7EAEC] px-6 py-2.5 border-b border-[#E8C5C8]/40">
            {freeShippingRemaining > 0 ? (
              <p className="text-xs text-[#470B24] font-medium text-center">
                Add <span className="font-bold">Rs. {freeShippingRemaining.toLocaleString()}</span> more for complimentary luxury delivery!
              </p>
            ) : (
              <p className="text-xs text-[#0D3A2F] font-semibold text-center flex items-center justify-center gap-1">
                ✓ You have unlocked Complimentary Delivery!
              </p>
            )}
            <div className="w-full bg-white/70 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-[#750A0A] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / 3000) * 100)}%` }}
              />
            </div>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-[#D45B7B] mx-auto mb-3 opacity-40" />
                <p className="font-serif text-lg text-[#1A1014]">Your bag is empty</p>
                <p className="text-xs text-zinc-500 mt-1">Discover our new silk and beauty arrivals</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 inline-block text-xs uppercase tracking-[0.2em] font-semibold text-[#8E1E3B] border-b border-[#8E1E3B] pb-1 hover:text-[#D45B7B]"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => {
                const activePrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
                return (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-[#F0D5DE] last:border-0">
                    <div className="relative w-20 h-24 bg-[#FAF2F4] rounded-lg overflow-hidden flex-shrink-0 border border-[#F0D5DE]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">
                          VELOURA
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-[#1A1014] line-clamp-1">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-[#8E1E3B]">
                            Rs. {activePrice.toLocaleString()}
                          </span>
                          {item.salePrice && item.salePrice > 0 && (
                            <span className="text-[11px] text-zinc-400 line-through">
                              Rs. {item.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#F0D5DE] rounded bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-zinc-600 hover:text-[#8E1E3B]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-zinc-600 hover:text-[#8E1E3B]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-400 hover:text-[#8E1E3B] p-1"
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
            <div className="p-6 border-t border-[#F0D5DE] bg-[#FCF8F9] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? "Complimentary" : `Rs. ${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#1A1014] pt-2 border-t border-[#F0D5DE]">
                  <span>Total</span>
                  <span className="text-[#8E1E3B]">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Order Via WhatsApp Button */}
              <button
                onClick={() => openCartWhatsApp()}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#25D366] text-white hover:bg-[#1EBE5D] rounded-xl text-xs tracking-wider uppercase font-semibold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Order via WhatsApp
              </button>

              {/* Standard Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-[#8E1E3B] to-[#D45B7B] text-white hover:brightness-110 rounded-xl text-xs tracking-wider uppercase font-bold transition-all shadow-lg"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
