"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export function LiveSearchDropdown() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/store/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const trendingTags = ["Lip Silk", "18K Pearls", "Hair Nectar", "Rose Toner", "Bundle"];

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search luxury beauty, fine jewelry, bundles..."
          className="w-full pl-10 pr-10 py-2 sm:py-2.5 rounded-full text-xs bg-[#FFF0F3]/80 hover:bg-[#FFF0F3] focus:bg-white text-[#25050D] placeholder-[#8E1B3B]/50 border border-[#F8D5DE] focus:border-[#E14D75] focus:ring-2 focus:ring-[#E14D75]/20 outline-none transition-all shadow-xs"
        />
        <Search className="w-4 h-4 text-[#C2185B] absolute left-3.5 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-3 p-1 rounded-full text-[#8E1B3B]/60 hover:text-[#8E1B3B] hover:bg-[#FCE7EC] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Dropdown Results Overlay */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white/95 backdrop-blur-md rounded-2xl border border-[#FCE7EC] shadow-hover-pink overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {loading ? (
            <div className="p-6 text-center text-xs text-[#8E1B3B] flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E14D75] animate-ping" />
              Searching Atelier catalog...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-[10px] uppercase tracking-wider font-semibold text-[#8E1B3B] border-b border-[#FCE7EC] flex items-center justify-between">
                <span>Matching Creations ({results.length})</span>
                <span className="text-[#C2185B] font-normal">Press Enter for full shop</span>
              </div>
              <div className="divide-y divide-[#FCE7EC]/50 max-h-80 overflow-y-auto">
                {results.map((product) => {
                  const image = product.images?.[0]?.url || "/placeholder-product.jpg";
                  const hasDiscount = product.salePrice && product.salePrice < product.price;

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 hover:bg-[#FFF0F3] transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FFF0F3] border border-[#FCE7EC] flex-shrink-0 relative">
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-[#C2185B] font-medium truncate">
                            {product.category?.name || "Atelier"}
                          </span>
                          {product.stock <= 3 && product.stock > 0 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFF0F3] text-[#C2185B] font-semibold border border-[#F8D5DE]">
                              Low Stock
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-[#25050D] truncate group-hover:text-[#8E1B3B] transition-colors">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-[#8E1B3B]">
                            Rs. {(product.salePrice || product.price).toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] text-[#8E1B3B]/50 line-through">
                              Rs. {product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F4B8C6] group-hover:text-[#E14D75] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
              </div>
              <Link
                href={`/shop?q=${encodeURIComponent(query)}`}
                onClick={() => setIsOpen(false)}
                className="block p-3 text-center text-xs font-semibold text-white bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 transition-all"
              >
                View all results for &quot;{query}&quot; →
              </Link>
            </div>
          ) : query.length >= 2 ? (
            <div className="p-6 text-center space-y-2">
              <p className="text-xs text-[#8E1B3B]">No creations found for &quot;{query}&quot;</p>
              <p className="text-[11px] text-[#8E1B3B]/60">Try searching for lipstick, pearls, toner or bundle</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-[#8E1B3B]">
                <TrendingUp className="w-3.5 h-3.5 text-[#E14D75]" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setQuery(tag);
                      setIsOpen(true);
                    }}
                    className="text-[11px] px-3 py-1 rounded-full bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#8E1B3B] border border-[#F8D5DE] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
