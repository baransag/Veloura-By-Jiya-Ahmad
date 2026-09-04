"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X, MessageCircle } from "lucide-react";
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

    // Fetch user status
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsAppUrl = getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER);

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#470B24] text-[#F6F1E8] text-[11px] tracking-[0.2em] py-2 px-4 text-center uppercase font-medium flex items-center justify-between border-b border-[#DA9413]/20">
        <div className="hidden md:block w-32 text-left text-[10px] text-[#DA9413]">
          Official Store
        </div>
        <div className="flex-1 text-center truncate">
          Complimentary Silk Packaging & Free Delivery Over Rs. 3,000
        </div>
        <div className="w-32 text-right hidden md:flex items-center justify-end gap-2 text-[10px]">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#F6F1E8] hover:text-[#DA9413] transition-colors"
          >
            <MessageCircle className="w-3 h-3 text-[#DA9413]" />
            +92 321 9954325
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm py-3 border-b border-[#EAE2D5]"
            : "bg-[#FDFBF7] py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#141211] hover:text-[#750A0A]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-[0.18em] uppercase font-medium text-[#141211]">
            <Link href="/" className="hover:text-[#750A0A] transition-colors">
              Home
            </Link>
            <Link href="/shop" className="hover:text-[#750A0A] transition-colors">
              Collection
            </Link>
            <Link href="/shop?category=beauty-personal-care" className="hover:text-[#750A0A] transition-colors">
              Beauty & Care
            </Link>
            <Link href="/shop?sort=newest" className="hover:text-[#750A0A] transition-colors text-[#750A0A]">
              New Arrivals
            </Link>
            <Link href="/order-tracking" className="hover:text-[#750A0A] transition-colors text-zinc-500">
              Track Order
            </Link>
          </nav>

          {/* Luxury Brand Logo */}
          <div className="text-center">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-light text-[#141211] group-hover:text-[#750A0A] transition-colors">
                VELOURA
              </span>
              <span className="block text-[8px] tracking-[0.4em] text-[#5D2806] uppercase -mt-1 font-sans">
                Haute Luxury
              </span>
            </Link>
          </div>

          {/* Utility Icons */}
          <div className="flex items-center space-x-5 text-[#141211]">
            <Link
              href="/shop"
              className="p-1 hover:text-[#750A0A] transition-colors hidden sm:block"
              title="Search collection"
            >
              <Search className="w-5 h-5" />
            </Link>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:text-[#0D3A2F] transition-colors"
              title="WhatsApp Concierge"
            >
              <MessageCircle className="w-5 h-5 text-[#0D3A2F]" />
            </a>

            {user?.role === "ADMIN" ? (
              <Link
                href="/admin"
                className="text-[11px] tracking-wider uppercase font-semibold text-[#470B24] border border-[#470B24] px-2 py-1 rounded hover:bg-[#470B24] hover:text-white transition-colors"
              >
                Admin
              </Link>
            ) : user ? (
              <Link
                href="/account"
                className="p-1 hover:text-[#750A0A] transition-colors flex items-center gap-1"
                title="My Account"
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] hidden sm:inline uppercase">{user.name?.split(" ")[0] || "Account"}</span>
              </Link>
            ) : (
              <Link
                href="/account/login"
                className="p-1 hover:text-[#750A0A] transition-colors"
                title="Customer Sign In"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 hover:text-[#750A0A] transition-colors group flex items-center"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#141211] group-hover:text-[#750A0A]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#750A0A] text-[#FDFBF7] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE2D5] bg-[#FDFBF7] px-6 py-6 space-y-4 text-xs tracking-[0.2em] uppercase font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#141211] hover:text-[#750A0A]"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#141211] hover:text-[#750A0A]"
            >
              All Collections
            </Link>
            <Link
              href="/shop?category=beauty-personal-care"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#141211] hover:text-[#750A0A]"
            >
              Beauty & Personal Care
            </Link>
            <Link
              href="/shop?sort=newest"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#750A0A]"
            >
              New Arrivals
            </Link>
            <Link
              href="/order-tracking"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-zinc-500"
            >
              Track My Order
            </Link>
            <div className="pt-4 border-t border-[#EAE2D5] flex justify-between items-center text-xs">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#0D3A2F] font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp: +92 321 9954325
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
