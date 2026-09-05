"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Timer, ArrowRight, ShoppingBag, Flame } from "lucide-react";
import { useCart } from "@/lib/cart-context";

interface FlashSaleProps {
  products: any[];
}

export function FlashSaleSection({ products }: FlashSaleProps) {
  const { addItem } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter products with sale price or take first 4
  const saleProducts = products.filter((p) => p.salePrice && p.salePrice < p.price).slice(0, 4);
  const displayItems = saleProducts.length > 0 ? saleProducts : products.slice(0, 4);

  if (displayItems.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-[#FFF0F3] via-white to-[#FCE7EC] rounded-3xl p-6 sm:p-8 border border-[#F8D5DE] shadow-soft-pink relative overflow-hidden">
        {/* Shimmer background accent */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#F4B8C6]/20 blur-3xl pointer-events-none" />

        {/* Section Header with Flash Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F8D5DE]/70 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8E1B3B] to-[#C2185B] text-white flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 fill-current animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#C2185B] font-bold">
                  Limited Atelier Drop
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#E14D75] text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5 fill-current" /> Hot
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#25050D] font-light">
                Flash Velvet Deals
              </h3>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white/90 backdrop-blur-xs px-4 py-2 rounded-2xl border border-[#F8D5DE] shadow-xs">
            <Timer className="w-4 h-4 text-[#C2185B]" />
            <span className="text-xs font-semibold text-[#8E1B3B] uppercase tracking-wider mr-1">
              Ends In:
            </span>
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-white">
              <span className="px-2 py-1 rounded-lg bg-[#8E1B3B]">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[#8E1B3B]">:</span>
              <span className="px-2 py-1 rounded-lg bg-[#8E1B3B]">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[#8E1B3B]">:</span>
              <span className="px-2 py-1 rounded-lg bg-[#C2185B]">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6 relative z-10">
          {displayItems.map((prod, idx) => {
            const imgUrl = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop";
            const discountPct = prod.salePrice
              ? Math.round(((prod.price - prod.salePrice) / prod.price) * 100)
              : 25;
            const progress = [78, 92, 64, 85][idx % 4];

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-3 sm:p-4 border border-[#F8D5DE] hover:border-[#E14D75] transition-all hover:shadow-hover-pink flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#FFF0F3] mb-3">
                    <Image
                      src={imgUrl}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-[10px] font-bold shadow-xs">
                      -{discountPct}%
                    </span>
                  </div>

                  <Link href={`/product/${prod.slug}`}>
                    <h4 className="text-xs font-semibold text-[#25050D] group-hover:text-[#C2185B] transition-colors line-clamp-2 min-h-[32px]">
                      {prod.name}
                    </h4>
                  </Link>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-[#8E1B3B]">
                      Rs. {(prod.salePrice || prod.price).toLocaleString()}
                    </span>
                    {prod.salePrice && (
                      <span className="text-[11px] text-[#8E1B3B]/40 line-through">
                        Rs. {prod.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Stock Claim Progress Bar */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex justify-between text-[10px] text-[#8E1B3B] font-medium">
                      <span>Claimed: {progress}%</span>
                      <span className="text-[#C2185B] font-bold">Fast Selling</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#FFF0F3] rounded-full overflow-hidden border border-[#F8D5DE]">
                      <div
                        className="h-full bg-gradient-to-r from-[#8E1B3B] to-[#E14D75] rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      id: prod.id,
                      name: prod.name,
                      price: prod.price,
                      salePrice: prod.salePrice,
                      image: imgUrl,
                      stock: prod.stock || 10,
                      slug: prod.slug,
                    }, 1)
                  }
                  className="mt-3 w-full py-2 bg-[#FFF0F3] hover:bg-gradient-to-r hover:from-[#8E1B3B] hover:to-[#C2185B] text-[#8E1B3B] hover:text-white text-[11px] font-bold rounded-xl transition-all border border-[#F8D5DE] flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Quick Claim
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-6 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8E1B3B] hover:text-[#C2185B] transition-colors"
          >
            <span>Explore All Flash Atelier Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
