"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X, MessageCircle, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

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
      {/* Top Silk Luxury Announcement Bar */}
      <div className="bg-[#121012] text-[#FAF9F6] text-[11px] tracking-[0.22em] py-2 px-4 text-center uppercase font-medium flex items-center justify-between border-b border-[#C5A880]/25">
        <div className="hidden md:flex items-center gap-2 w-48 text-left text-[10px] text-[#C5A880]">
          <Sparkles className="w-3 h-3" />
          <span>Atelier Concierge</span>
        </div>
        <div className="flex-1 text-center truncate">
          Complimentary Velvet Packaging & Free Express Shipping Over Rs. 3,000
        </div>
        <div className="w-48 text-right hidden md:flex items-center justify-end gap-2 text-[10px]">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#FAF9F6] hover:text-[#C5A880] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>+92 321 9954325</span>
          </a>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF9F6]/95 backdrop-blur-md shadow-sm py-3.5 border-b border-[#E8E1D5]"
            : "bg-[#FAF9F6] py-5 border-b border-[#E8E1D5]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#121012] hover:text-[#C5A880]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs tracking-[0.16em] uppercase font-medium text-[#121012]">
            <Link href="/" className="hover:text-[#C5A880] transition-colors">
              Home
            </Link>
            <Link href="/shop?category=luxe-makeup" className="hover:text-[#C5A880] transition-colors">
              Makeup & Lips
            </Link>
            <Link href="/shop?category=fine-jewelry" className="hover:text-[#C5A880] transition-colors">
              Fine Jewelry
            </Link>
            <Link href="/shop?category=silk-skincare" className="hover:text-[#C5A880] transition-colors">
              Silk Skincare
            </Link>
            <Link href="/shop?category=hair-fragrance" className="hover:text-[#C5A880] transition-colors">
              Hair & Mist
            </Link>
            <Link href="/order-tracking" className="hover:text-[#C5A880] transition-colors text-zinc-500">
              Track Order
            </Link>
          </nav>

          {/* Brand Wordmark */}
          <div className="text-center">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.28em] font-light text-[#121012] group-hover:text-[#C5A880] transition-colors">
                VELOURA
              </span>
              <span className="block text-[8px] tracking-[0.45em] text-[#C5A880] uppercase -mt-1 font-sans">
                Beauty & Fine Jewels
              </span>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-5 text-[#1E191B]">
            <Link
              href="/shop"
              className="p-1 hover:text-[#632839] transition-colors hidden sm:block"
              title="Search Atelier"
            >
              <Search className="w-5 h-5" />
            </Link>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:text-[#25D366] transition-colors"
              title="WhatsApp VIP Concierge"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </a>

            {user?.role === "ADMIN" ? (
              <Link
                href="/admin"
                className="text-[11px] tracking-wider uppercase font-semibold text-[#632839] border border-[#632839]/50 px-2.5 py-1 rounded hover:bg-[#632839] hover:text-white transition-colors"
              >
                Admin
              </Link>
            ) : user ? (
              <Link
                href="/account"
                className="p-1 hover:text-[#632839] transition-colors flex items-center gap-1.5"
                title="My Account"
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] hidden sm:inline uppercase font-medium">{user.name?.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link
                href="/account/login"
                className="p-1 hover:text-[#632839] transition-colors flex items-center gap-1"
                title="Customer Sign In"
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] hidden sm:inline uppercase tracking-wider text-zinc-600">Sign In</span>
              </Link>
            )}

            {/* Shopping Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 hover:text-[#632839] transition-colors group flex items-center"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#1E191B] group-hover:text-[#632839]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#632839] text-[#FAF8F5] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE2D5] bg-[#FAF8F5] px-6 py-6 space-y-4 text-xs uppercase tracking-widest font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#1E191B] border-b border-zinc-100"
            >
              Home
            </Link>
            <Link
              href="/shop?category=luxe-makeup"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#1E191B] border-b border-zinc-100"
            >
              Makeup & Lips
            </Link>
            <Link
              href="/shop?category=fine-jewelry"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#1E191B] border-b border-zinc-100"
            >
              Fine Jewelry & Pearls
            </Link>
            <Link
              href="/shop?category=silk-skincare"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#1E191B] border-b border-zinc-100"
            >
              Silk Skincare & Glow
            </Link>
            <Link
              href="/shop?category=hair-fragrance"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#1E191B] border-b border-zinc-100"
            >
              Hair Elixirs & Fragrance
            </Link>
            <Link
              href="/order-tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-zinc-500"
            >
              Track Your Order
            </Link>
            <div className="pt-2">
              <Link
                href="/account/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 bg-[#632839] text-white text-center rounded block text-xs tracking-widest font-semibold"
              >
                Sign In / Join Veloura
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
