"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { generateProductWhatsAppMessage, getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { ShoppingBag, MessageCircle, ShieldCheck, Truck, Sparkles, Check, ChevronRight } from "lucide-react";
import Link from "next/link";

export function ProductDetailClient({ product }: { product: any }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url || "/logo.png"
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const activePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const hasDiscount = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: selectedImage,
        stock: product.stock,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const msg = generateProductWhatsAppMessage({
      name: product.name,
      price: activePrice,
      url: currentUrl,
    });
    window.open(getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER, msg), "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 mb-8">
        <Link href="/" className="hover:text-[#750A0A]">Home</Link>
        <ChevronRight className="w-3 h-3 text-zinc-400" />
        <Link href="/shop" className="hover:text-[#750A0A]">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#750A0A]">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-zinc-400" />
        <span className="text-[#141211] font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#F6F1E8] border border-[#EAE2D5] shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-[#750A0A] text-[#FDFBF7] text-xs font-bold px-3 py-1 rounded tracking-wider uppercase">
                Sale
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: any) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img.url ? "border-[#750A0A] shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <span className="text-xs uppercase tracking-[0.25em] text-[#5D2806] font-semibold">
                {product.category.name}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl text-[#141211] mt-1 tracking-wide">
              {product.name}
            </h1>
            {product.sku && (
              <p className="text-[11px] uppercase tracking-wider text-zinc-400 mt-1">
                SKU: {product.sku}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-3xl font-semibold text-[#750A0A]">
              Rs. {activePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-lg text-zinc-400 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs font-bold text-[#0D3A2F] uppercase tracking-wider">
                Save Rs. {(product.price - activePrice).toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Status Indicator */}
          <div className="pt-1">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded border border-rose-200 uppercase tracking-wider">
                ● Currently Sold Out
              </span>
            ) : product.stock <= 3 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded border border-amber-200 uppercase tracking-wider">
                ● Only {product.stock} items remaining in stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D3A2F] bg-emerald-50 px-3 py-1 rounded border border-emerald-200 uppercase tracking-wider">
                ● In Stock & Ready to Dispatch
              </span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-4 border-t border-[#EAE2D5]">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Quantity:</span>
              <div className="flex items-center border border-[#EAE2D5] rounded bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="px-3 py-1.5 text-zinc-600 hover:text-[#750A0A] disabled:opacity-30"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="px-3 py-1.5 text-zinc-600 hover:text-[#750A0A] disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons: Add to Bag + WhatsApp Inquiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#8E1E3B] to-[#D45B7B] hover:brightness-110 text-white text-xs uppercase tracking-[0.2em] font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {isOutOfStock ? "Out of Stock" : "Add to Bag"}
                  </>
                )}
              </button>

              {/* WHATSAPP INQUIRY BUTTON - MANDATORY SPEC */}
              <button
                onClick={handleWhatsAppInquiry}
                type="button"
                className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Inquiry
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 pt-6 border-t border-[#EAE2D5]">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#141211]">
              Atelier Details & Description
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line font-light">
              {product.description}
            </p>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EAE2D5]">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F6F1E8]/60 border border-[#EAE2D5]">
              <Truck className="w-5 h-5 text-[#750A0A] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[#141211]">Complimentary Delivery</h4>
                <p className="text-[11px] text-zinc-500">Free courier for orders above Rs. 3,000</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F6F1E8]/60 border border-[#EAE2D5]">
              <ShieldCheck className="w-5 h-5 text-[#0D3A2F] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-[#141211]">Official VELOURA Guarantee</h4>
                <p className="text-[11px] text-zinc-500">100% Genuine silk & botanical care</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
