"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, MessageCircle, Star, Sparkles, Gem, Check, Store } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { generateProductWhatsAppMessage, getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { LUXURY_FALLBACK_IMAGE } from "@/lib/catalog-data";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    universe?: string;
    subCategory?: string;
    sellerShopName?: string;
    isDeal?: boolean;
    dealBadge?: string;
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
  const [addedAnimation, setAddedAnimation] = useState(false);

  const primaryImage = product.images?.[0]?.url || LUXURY_FALLBACK_IMAGE;
  const secondaryImage = product.images?.[1]?.url || primaryImage;
  const activePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const hasDiscount = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const isJewelry = product.universe === "JEWELRY" || product.category?.name?.toLowerCase().includes("jewelry");


  // 3D Tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;

    setTilt({
      x: yPct * -6,
      y: xPct * 6,
    });

    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
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
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-between bg-gradient-to-b from-white via-[#FFF9FA] to-[#FFF0F4] rounded-[24px] sm:rounded-[28px] p-2.5 sm:p-3.5 border border-[#F8D5DE] hover:border-[#E14D75] transition-all duration-500 hover:shadow-[0_16px_40px_rgba(225,77,117,0.18)] hover:-translate-y-1 select-none"
      style={{ perspective: "1000px" }}
    >
      <Link href={`/product/${product.slug}`} className="block relative">
        {/* Image Frame */}
        <div
          className="relative aspect-[3/4] w-full overflow-hidden rounded-[18px] sm:rounded-[22px] bg-[#FFF0F3] shadow-xs"
          style={{
            transform: isHovered
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
              : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            transformStyle: "preserve-3d",
            transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
          }}
        >
          {/* Primary Photo */}
          <img
            src={primaryImage}
            alt={product.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = LUXURY_FALLBACK_IMAGE;
            }}
            className={`h-full w-full object-cover object-center transition-all duration-700 ${
              isHovered && secondaryImage !== primaryImage ? "opacity-0 scale-105" : "opacity-100 scale-100 group-hover:scale-105"
            }`}
          />

          {/* Secondary Photo (Angle Reveal on Hover) */}
          {secondaryImage !== primaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = LUXURY_FALLBACK_IMAGE;
              }}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          )}

          {/* Soft Glare Effect */}
          <div
            className="pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-300"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.95) 0%, rgba(254,231,236,0) 60%)`,
            }}
          />

          {/* Badges on Top */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between z-10 pointer-events-none">
            <div className="flex flex-col gap-1 items-start">
              {product.isDeal && (
                <span className="bg-gradient-to-r from-[#D32F2F] to-[#E91E63] text-white text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-[0_4px_12px_rgba(211,47,47,0.4)] flex items-center gap-1 animate-pulse">
                  <span>🔥</span>
                  <span>{product.dealBadge || "SPECIAL DEAL"}</span>
                </span>
              )}

              {hasDiscount && !product.isDeal && (
                <span className="bg-gradient-to-r from-[#C2185B] via-[#E14D75] to-[#FF4D8D] text-white text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-[0_4px_12px_rgba(225,77,117,0.35)]">
                  -{discountPercent}% OFF
                </span>
              )}

              {/* Category indicator pill */}
              <span className="backdrop-blur-md bg-white/90 text-[#8E1B3B] border border-[#F8D5DE] text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-xs flex items-center gap-1">
                {isJewelry ? (
                  <>
                    <Gem className="w-2.5 h-2.5 text-[#C2185B]" />
                    <span>Fine Jewels</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-2.5 h-2.5 text-[#E14D75]" />
                    <span>Silk Beauty</span>
                  </>
                )}
              </span>
            </div>

            {product.stock <= 3 && product.stock > 0 && (
              <span className="backdrop-blur-md bg-[#FFF0F3]/95 text-[#C2185B] border border-[#F8D5DE] text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                Low Stock
              </span>
            )}
          </div>

          {/* Quick Hover Overlay: WhatsApp & Add to Cart */}
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-gradient-to-t from-[#25050D]/90 via-[#25050D]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between gap-1.5 z-20 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl text-[10px] sm:text-[11px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-md ${
                addedAnimation
                  ? "bg-[#25D366] text-white"
                  : "bg-white hover:bg-gradient-to-r hover:from-[#C2185B] hover:to-[#E14D75] text-[#8E1B3B] hover:text-white"
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{product.stock > 0 ? "Add to Bag" : "Sold Out"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsApp}
              title="Order Directly on WhatsApp"
              className="p-2 sm:p-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl transition-all shadow-md flex items-center justify-center hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            </button>
          </div>
        </div>
      </Link>

      {/* Card Info Details */}
      <div className="mt-3 flex flex-col space-y-1.5 px-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#C2185B] font-bold tracking-wider uppercase truncate max-w-[140px]">
            {product.subCategory || product.category?.name || "Veloura Exclusive"}
          </span>
          <div className="flex items-center gap-1 font-bold text-[#8E1B3B]">
            <Star className="w-3 h-3 fill-[#FFB300] text-[#FFB300]" />
            <span>4.9</span>
          </div>
        </div>

        {/* Product Title */}
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-xs sm:text-[13px] font-semibold text-[#25050D] line-clamp-1 hover:text-[#C2185B] transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Seller Shop Attribution if available */}
        {product.sellerShopName && (
          <div className="flex items-center gap-1 text-[9px] text-[#8E1B3B]/70 truncate">
            <Store className="w-2.5 h-2.5 text-[#E14D75]" />
            <span className="truncate">By {product.sellerShopName}</span>
          </div>
        )}

        {/* Price Row */}
        <div className="flex items-baseline justify-between pt-1 border-t border-[#F8D5DE]/60">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs sm:text-sm font-black text-[#8E1B3B]">
              Rs. {activePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-[#8E1B3B]/40 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleWhatsApp}
            className="text-[9px] font-bold text-[#25D366] hover:text-[#128C7E] flex items-center gap-1 transition-colors"
          >
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
