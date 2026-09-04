"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, MessageCircle } from "lucide-react";
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
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const primaryImage = product.images?.[0]?.url || "/logo.png";
  const activePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const hasDiscount = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

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
    });
  };

  return (
    <div className="group relative flex flex-col">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F6F1EA] border border-[#EAE2D5] group-hover:border-[#C9A464]/50 transition-all duration-300 shadow-sm group-hover:shadow-md">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center font-serif text-zinc-400">
              VELOURA
            </div>
          )}

          {/* Luxury Silk Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {hasDiscount && (
              <span className="bg-[#632839] text-[#FAF8F5] text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            {product.stock <= 0 && (
              <span className="bg-[#1E191B] text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                Sold Out
              </span>
            )}
          </div>

          {/* Quick Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2 z-10">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 py-2.5 px-3 bg-[#FAF8F5] text-[#1E191B] hover:bg-[#632839] hover:text-white rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {product.stock > 0 ? "Add to Bag" : "Sold Out"}
            </button>
            <button
              onClick={handleWhatsApp}
              title="Inquire on WhatsApp"
              className="p-2.5 bg-[#25D366] text-white hover:bg-[#1EBE5D] rounded-lg transition-colors shadow"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>

      <div className="mt-3 flex flex-col">
        {product.category?.name && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A464] font-semibold">
            {product.category.name}
          </span>
        )}
        <Link href={`/product/${product.slug}`} className="hover:text-[#632839] transition-colors">
          <h3 className="text-sm font-medium text-[#1E191B] line-clamp-1 mt-0.5">{product.name}</h3>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-[#632839]">
            Rs. {activePrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-zinc-400 line-through">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
