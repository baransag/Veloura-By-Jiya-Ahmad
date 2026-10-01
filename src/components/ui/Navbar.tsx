"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  MessageCircle,
  Sparkles,
  PackageCheck,
  Flame,
  Gem,
  Flower2,
  Store,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { LiveSearchDropdown } from "./LiveSearchDropdown";

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsAppUrl = getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER);

  return (
    <>
      {/* ── 1. Top Soft Pastel Silk Announcement Bar ──────────────────────── */}
      <div className="bg-gradient-to-r from-[#8E1B3B] via-[#C2185B] to-[#8E1B3B] text-white text-[11px] tracking-[0.2em] py-2 px-4 text-center uppercase font-medium flex items-center justify-between border-b border-[#F8D5DE]/30">
        <div className="hidden md:flex items-center gap-2 w-56 text-left text-[10px] text-[#FCE7EC]">
          <Sparkles className="w-3.5 h-3.5 text-[#FCE7EC] animate-pulse" />
          <span>VELOURA Atelier Luxe</span>
        </div>

        <div className="flex-1 text-center truncate px-2 font-semibold">
          Complimentary Keepsake Velvet Casket & Free Delivery Across Pakistan on Orders Over Rs. 3,000
        </div>

        <div className="w-56 text-right hidden md:flex items-center justify-end gap-3 text-[10px]">
          <Link
            href="/seller"
            className="flex items-center gap-1 text-[#FCE7EC] hover:text-white transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Seller Portal</span>
          </Link>
          <span className="text-[#F8D5DE]/40">|</span>
          <Link
            href="/order-tracking"
            className="flex items-center gap-1 text-[#FCE7EC] hover:text-white transition-colors"
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Track Parcel</span>
          </Link>
          <span className="text-[#F8D5DE]/40">|</span>
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#FCE7EC] hover:text-white transition-colors font-bold"
          >
            <MessageCircle className="w-3.5 h-3.5 text-white" />
            <span>VIP Concierge</span>
          </a>
        </div>
      </div>

      {/* ── 2. Main Luxury Header with Instant Search Bar ─────────────────── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-soft-pink py-3 border-b border-[#F8D5DE]"
            : "bg-white py-4 border-b border-[#FCE7EC]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#8E1B3B] hover:text-[#C2185B] rounded-xl hover:bg-[#FFF0F3] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Wordmark */}
            <Link href="/" className="flex-shrink-0 group text-left">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-medium text-[#8E1B3B] group-hover:text-[#C2185B] transition-colors">
                VELOURA
              </span>
              <span className="block text-[8px] tracking-[0.45em] text-[#C2185B] uppercase -mt-1 font-sans font-bold">
                By Jiya Ahmad
              </span>
            </Link>

            {/* Live Search Bar (Desktop) */}
            <div className="hidden lg:block flex-1 max-w-lg mx-6">
              <LiveSearchDropdown />
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* WhatsApp VIP Concierge Button */}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat with Personal Stylist on WhatsApp"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#E8F8EE] hover:bg-[#D4F3DE] text-[#1EBE5D] border border-[#BDE8CD] text-xs font-bold transition-all shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-[#1EBE5D]" />
                <span>WhatsApp VIP</span>
              </a>

              {/* Account Dropdown */}
              {user ? (
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-2xl text-xs font-bold text-[#8E1B3B] hover:text-[#C2185B] hover:bg-[#FFF0F3] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline truncate max-w-[100px]">{user.name}</span>
                </Link>
              ) : (
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-2xl text-xs font-bold text-[#8E1B3B] hover:text-[#C2185B] hover:bg-[#FFF0F3] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Cart Drawer Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-2xl bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#8E1B3B] hover:text-[#C2185B] border border-[#F8D5DE] transition-all flex items-center gap-2 group shadow-2xs"
                aria-label="Open Cart Drawer"
              >
                <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
                  Bag
                </span>
                {totalItems > 0 && (
                  <span className="bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Row */}
          <div className="mt-3 lg:hidden">
            <LiveSearchDropdown />
          </div>

          {/* Secondary Desktop Categories Navigation Strip */}
          <nav className="hidden lg:flex items-center justify-center space-x-7 pt-3 mt-2 border-t border-[#FCE7EC] text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8E1B3B]/80">
            <Link href="/" className="hover:text-[#C2185B] transition-colors">
              Home
            </Link>
            
            {/* The 2 Primary Universes */}
            <Link
              href="/shop?universe=JEWELRY"
              className="text-[#8E1B3B] hover:text-[#C2185B] transition-colors flex items-center gap-1 font-bold"
            >
              <Gem className="w-3.5 h-3.5 text-[#C2185B]" />
              <span>Fine Jewellery Wing</span>
            </Link>

            <Link
              href="/shop?universe=BEAUTY_SKIN_HAIR"
              className="text-[#8E1B3B] hover:text-[#C2185B] transition-colors flex items-center gap-1 font-bold"
            >
              <Flower2 className="w-3.5 h-3.5 text-[#E14D75]" />
              <span>Skincare, Facewash & Hair</span>
            </Link>

            <Link href="/shop" className="hover:text-[#C2185B] transition-colors">
              All 199 Creations
            </Link>

            <Link
              href="/shop?deals=true"
              className="text-[#C2185B] font-bold hover:text-[#8E1B3B] transition-colors flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
              <span>Flash Drops</span>
            </Link>

            <Link
              href="/seller"
              className="text-[#8E1B3B]/80 hover:text-[#C2185B] transition-colors flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Vendor Portal</span>
            </Link>

            <Link
              href="/order-tracking"
              className="text-[#8E1B3B]/80 hover:text-[#C2185B] transition-colors flex items-center gap-1"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Track Parcel</span>
            </Link>
          </nav>
        </div>

        {/* Mobile Slide-Out Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[110px] z-50 bg-[#25050D]/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white max-w-xs w-full h-full p-6 space-y-6 shadow-2xl border-r border-[#F8D5DE] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-[#F8D5DE]">
                <span className="font-serif text-lg font-bold text-[#8E1B3B]">Atelier Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-[#8E1B3B] hover:bg-[#FFF0F3]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-semibold uppercase tracking-wider text-[#8E1B3B]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#C2185B] border-b border-[#FCE7EC]"
                >
                  Home
                </Link>
                <Link
                  href="/shop?universe=JEWELRY"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-[#C2185B] font-bold border-b border-[#FCE7EC]"
                >
                  <Gem className="w-4 h-4 text-[#C2185B]" />
                  <span>💎 Fine Jewellery Wing</span>
                </Link>
                <Link
                  href="/shop?universe=BEAUTY_SKIN_HAIR"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-[#C2185B] font-bold border-b border-[#FCE7EC]"
                >
                  <Flower2 className="w-4 h-4 text-[#E14D75]" />
                  <span>🌸 Skincare, Facewash & Hair</span>
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#C2185B] border-b border-[#FCE7EC]"
                >
                  All 199 Creations
                </Link>
                <Link
                  href="/seller"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 hover:text-[#C2185B] border-b border-[#FCE7EC]"
                >
                  <Store className="w-4 h-4 text-[#8E1B3B]" />
                  <span>Vendor / Seller Dashboard</span>
                </Link>
                <Link
                  href="/order-tracking"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-[#8E1B3B] border-b border-[#FCE7EC]"
                >
                  Track My Order
                </Link>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-3 px-4 rounded-xl bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-center font-bold shadow-md"
                >
                  WhatsApp VIP Concierge
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
