"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck, Truck, RefreshCw, Gem, Sparkles, Heart } from "lucide-react";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function Footer() {
  const whatsAppUrl = getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER);

  return (
    <footer className="bg-[#2A0711] text-[#FDE8EF] pt-16 pb-12 border-t border-[#D45B7B]/30">
      {/* Service Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#D45B7B]/20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <div className="p-3 rounded-full bg-white/5 border border-[#D45B7B]/40 text-[#E8A5B7]">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#FFF0F4]">
              Complimentary Delivery
            </h4>
            <p className="text-xs text-[#F4B2C2] mt-0.5">Across Pakistan on orders above Rs. 3,000</p>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <div className="p-3 rounded-full bg-white/5 border border-[#D45B7B]/40 text-[#E8A5B7]">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#FFF0F4]">
              18K Tarnish Free & Hypoallergenic
            </h4>
            <p className="text-xs text-[#F4B2C2] mt-0.5">Crafted with high-lustre freshwater pearls</p>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <div className="p-3 rounded-full bg-white/5 border border-[#D45B7B]/40 text-[#E8A5B7]">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#FFF0F4]">
              Concierge Exchange Policy
            </h4>
            <p className="text-xs text-[#F4B2C2] mt-0.5">Seamless 7-day atelier exchange support</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <span className="font-serif text-2xl tracking-[0.25em] text-[#FFF0F4] block">
            VELOURA
          </span>
          <p className="text-xs text-[#F4B2C2] leading-relaxed font-light">
            Atelier of silk beauty, velvet cosmetic elixirs, and 18-karat fine jewelry for girls.
          </p>
          <div className="pt-2">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#E8A5B7] hover:underline"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              WhatsApp VIP: +92 321 9954325
            </a>
          </div>
        </div>

        {/* Col 2: Curated Universes */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D45B7B]">Atelier Universes</h4>
          <ul className="space-y-2 text-xs text-[#F8D2DC] font-light">
            <li><Link href="/shop?category=luxe-makeup" className="hover:text-white transition-colors">Luxe Makeup & Lips</Link></li>
            <li><Link href="/shop?category=fine-jewelry" className="hover:text-white transition-colors">Fine Jewelry & Pearls</Link></li>
            <li><Link href="/shop?category=silk-skincare" className="hover:text-white transition-colors">Silk Skincare & Glow</Link></li>
            <li><Link href="/shop?category=hair-fragrance" className="hover:text-white transition-colors">Hair Elixirs & Fragrance</Link></li>
          </ul>
        </div>

        {/* Col 3: Client Care */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D45B7B]">Client Care</h4>
          <ul className="space-y-2 text-xs text-[#F8D2DC] font-light">
            <li><Link href="/order-tracking" className="hover:text-white transition-colors">Track Your Parcel</Link></li>
            <li><Link href="/account" className="hover:text-white transition-colors">Customer Account</Link></li>
            <li><Link href="/checkout" className="hover:text-white transition-colors">Express Checkout</Link></li>
            <li><Link href="/shop" className="hover:text-white transition-colors">Exclusive Bundles</Link></li>
          </ul>
        </div>

        {/* Col 4: Packaging & Payment */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D45B7B]">Payment & Shipping</h4>
          <p className="text-xs text-[#F4B2C2] font-light leading-relaxed">
            We accept Cash on Delivery (COD) across Pakistan, plus instant Easypaisa & JazzCash transfers.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-[#FDE8EF]">
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-[#D45B7B]/30">Cash on Delivery</span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-[#D45B7B]/30">Easypaisa</span>
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-[#D45B7B]/30">JazzCash</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#D45B7B]/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F4B2C2] gap-4">
        <div>
          &copy; {new Date().getFullYear()} VELOURA Haute Luxury Atelier. All rights reserved.
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#F4B2C2]">
          <span>Crafted in Pure Rose Silk & Fine Jewels for Girls</span>
        </div>
      </div>
    </footer>
  );
}
