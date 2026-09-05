"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, MessageCircle, Star, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { generateProductWhatsAppMessage, getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    category?: { name: string } | null;
    images?: Array<{ url: string; alt?: string | null }> | null;
  };
  onQuickView?: (product: any) => void;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop";
  const activePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const hasDiscount = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;

    setTilt({
      x: yPct * -8,
      y: xPct * 8,
    });

    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.3,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productUrl = typeof window !== "undefined" ? `${window.location.origin}/product/${product.slug}` : "";
    const msg = generateProductWhatsAppMessage({
      name: product.name,
      price: activePrice,
      url: productUrl,
    });
    window.open(getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER, msg), "_blank");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: primaryImage,
      stock: product.stock,
      slug: product.slug,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col group select-none bg-white rounded-3xl p-3 border border-[#F8D5DE] hover:border-[#E14D75] transition-all duration-300 hover:shadow-hover-pink"
      style={{ perspective: "1000px" }}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div
          className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[#FFF0F3] transition-all duration-300 shadow-2xs"
          style={{
            transform: isHovered
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
              : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            transformStyle: "preserve-3d",
            transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
          }}
        >
          {/* Main Photography */}
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* 3D Soft Light Glare Overlay */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.9) 0%, rgba(254,231,236,0) 65%)`,
            }}
          />

          {/* Luxury Tags & Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {hasDiscount && (
              <span className="bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
                -{discountPercent}% OFF
              </span>
            )}
            {product.stock <= 3 && product.stock > 0 && (
              <span className="bg-[#FFF0F3] text-[#C2185B] border border-[#F8D5DE] text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
                Only {product.stock} Left
              </span>
            )}
            {product.stock <= 0 && (
              <span className="bg-[#500A1C] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
                Sold Out
              </span>
            )}
          </div>

          {/* Quick Action Overlay on Hover */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#25050D]/80 via-[#25050D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2 z-20">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 py-2.5 px-3 bg-white hover:bg-gradient-to-r hover:from-[#8E1B3B] hover:to-[#C2185B] text-[#8E1B3B] hover:text-white rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{product.stock > 0 ? "Add to Bag" : "Sold Out"}</span>
            </button>

            <button
              onClick={handleWhatsApp}
              title="Order on WhatsApp"
              className="p-2.5 bg-gradient-to-r from-[#8E1B3B] to-[#E14D75] text-white hover:brightness-110 rounded-xl transition-all shadow-md flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>

      {/* Product Details */}
      <div className="mt-3 flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#C2185B] font-bold">
            {product.category?.name || "Atelier Luxe"}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#8E1B3B]">
            <Star className="w-3 h-3 fill-[#E14D75] text-[#E14D75]" />
            <span>4.9</span>
          </div>
        </div>

        <Link href={`/product/${product.slug}`} className="hover:text-[#C2185B] transition-colors">
          <h3 className="text-xs sm:text-sm font-medium text-[#25050D] line-clamp-1 group-hover:text-[#8E1B3B] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm sm:text-base font-bold text-[#8E1B3B]">
            Rs. {activePrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[#8E1B3B]/40 line-through">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
