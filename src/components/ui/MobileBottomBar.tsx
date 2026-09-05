"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Sparkles, PackageCheck, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function MobileBottomBar() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  // Hide inside admin area
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Atelier", href: "/shop", icon: ShoppingBag },
    { label: "Deals", href: "/shop?deals=true", icon: Sparkles },
    { label: "Track", href: "/order-tracking", icon: PackageCheck },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-[#FCE7EC] shadow-[0_-4px_20px_rgba(225,77,117,0.12)] px-2 py-1.5">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive ? "text-[#C2185B]" : "text-[#8E1B3B]/70 hover:text-[#8E1B3B]"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C2185B]" />
                )}
              </div>
              <span className={`text-[10px] tracking-wider mt-1 ${isActive ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Cart Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-[#8E1B3B]/70 hover:text-[#8E1B3B] transition-all relative group"
          aria-label="Open Bag"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-[#8E1B3B] to-[#E14D75] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs animate-pulse">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wider font-medium mt-1">Bag</span>
        </button>
      </div>
    </div>
  );
}
