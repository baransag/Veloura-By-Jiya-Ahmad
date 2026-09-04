"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Phone, Mail, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function Footer() {
  const whatsAppUrl = getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER);

  return (
    <footer className="bg-[#141211] text-[#FDFBF7] pt-16 pb-12 border-t border-[#DA9413]/20">
      {/* Service Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <div className="p-3 rounded-full bg-[#470B24] text-[#DA9413]">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#FDFBF7]">
              Complimentary Delivery
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">On all orders above Rs. 3,000</p>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <div className="p-3 rounded-full bg-[#0D3A2F] text-[#DA9413]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#FDFBF7]">
              100% Authentic Luxury
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">Handcrafted fabrics & pure elixirs</p>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center sm:justify-start">
          <div className="p-3 rounded-full bg-[#750A0A] text-[#DA9413]">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#FDFBF7]">
              Easy Exchange Policy
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">Seamless 7-day concierge exchange</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1 */}
        <div className="space-y-4">
          <span className="font-serif text-2xl tracking-[0.25em] text-[#FDFBF7]">VELOURA</span>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The epitome of feminine silk, bespoke velvet textures, and haute botanical beauty. Crafted for the modern connoisseur.
          </p>
          <div className="pt-2">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#DA9413] hover:underline"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp: +92 321 9954325
            </a>
          </div>
        </div>

        {/* Col 2 */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#DA9413]">Collections</h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><Link href="/shop?category=silk-pret" className="hover:text-white">Silk Pret</Link></li>
            <li><Link href="/shop?category=luxury-velvet" className="hover:text-white">Luxury Velvet</Link></li>
            <li><Link href="/shop?category=beauty-personal-care" className="hover:text-white">Beauty & Personal Care</Link></li>
            <li><Link href="/shop?category=fragrances" className="hover:text-white">Fragrances</Link></li>
            <li><Link href="/shop?sort=newest" className="hover:text-white">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#DA9413]">Client Services</h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li><Link href="/order-tracking" className="hover:text-white">Track Your Order</Link></li>
            <li><Link href="/account" className="hover:text-white">Customer Account</Link></li>
            <li><Link href="/admin/login" className="hover:text-white">Admin Portal</Link></li>
            <li>
              <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Contact Concierge
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Payment Methods */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#DA9413]">Payment Methods</h4>
          <p className="text-xs text-zinc-400">We offer secure & flexible payment solutions across Pakistan:</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-white/10 text-white rounded border border-white/10">
              Cash on Delivery (COD)
            </span>
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#0D3A2F] text-[#FDFBF7] rounded border border-[#DA9413]/40">
              Easypaisa
            </span>
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#750A0A] text-[#FDFBF7] rounded border border-[#DA9413]/40">
              JazzCash
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 pt-1">
            Manual verification line: <span className="text-[#DA9413] font-medium">+92 321 9954325</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-400">
        <p>© {new Date().getFullYear()} VELOURA. All rights reserved.</p>
        <p className="tracking-widest uppercase text-[10px]">Haute Luxury Fashion & Beauty</p>
      </div>
    </footer>
  );
}
