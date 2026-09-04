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
    <div className="group relative flex flex-col card-3d-wrap">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-[#F6F1E8] border border-[#EAE2D5] card-3d">
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

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {hasDiscount && (
              <span className="bg-[#750A0A] text-[#FDFBF7] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                {discountPercent}% OFF
              </span>
            )}
            {product.stock <= 0 && (
              <span className="bg-[#141211] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                Sold Out
              </span>
            )}
          </div>

          {/* Quick Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 py-2 px-3 bg-[#FDFBF7] text-[#141211] hover:bg-[#750A0A] hover:text-white rounded text-[11px] font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {product.stock > 0 ? "Add to Bag" : "Sold Out"}
            </button>
            <button
              onClick={handleWhatsApp}
              title="Inquire on WhatsApp"
              className="p-2 bg-[#0D3A2F] text-white hover:bg-[#084A3B] rounded transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#DA9413]" />
            </button>
          </div>
        </div>
      </Link>

      <div className="mt-3 flex flex-col">
        {product.category?.name && (
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#5D2806] font-medium">
            {product.category.name}
          </span>
        )}
        <Link href={`/product/${product.slug}`} className="hover:text-[#750A0A] transition-colors">
          <h3 className="text-sm font-medium text-[#141211] line-clamp-1 mt-0.5">{product.name}</h3>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-[#750A0A]">
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
