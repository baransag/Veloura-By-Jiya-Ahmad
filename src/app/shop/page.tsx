import React from "react";
import Link from "next/link";
import { getStoreProducts, getStoreCategories } from "@/lib/store-data";
import { UNIVERSES } from "@/lib/catalog-data";
import { ProductCard } from "@/components/ui/ProductCard";
import { MobileBottomBar } from "@/components/ui/MobileBottomBar";
import { Sparkles, Flame, Search, Gem, Flower2, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: {
    universe?: string;
    subCategory?: string;
    category?: string;
    search?: string;
    q?: string;
    sort?: string;
    deals?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { universe = "ALL", subCategory, category, search, q, sort = "newest", deals } = searchParams;
  const searchQuery = (q || search || "").trim();
  const isDealsUniverse = universe === "DEALS" || deals === "true";
  const activeUniverse = isDealsUniverse ? "DEALS" : (universe || "ALL");

  // Fetch dynamic categories configured by Admin
  const dynamicCategories = await getStoreCategories(
    activeUniverse === "ALL" || activeUniverse === "DEALS" ? undefined : activeUniverse
  );

  // Fetch products
  const products = await getStoreProducts({
    universe: (activeUniverse === "ALL" || activeUniverse === "DEALS") ? undefined : activeUniverse,
    subCategory: subCategory && !subCategory.startsWith("All") ? subCategory : undefined,
    categorySlug: category,
    search: searchQuery,
    sort,
    deals: isDealsUniverse,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F8] via-[#FFF8FA] to-[#FFF0F4] py-8 sm:py-14 text-[#25050D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ── 1. Page Header & Pinkish Brand Aura ───────────────────────────── */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#F8D5DE] text-[11px] uppercase tracking-[0.25em] text-[#C2185B] font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E14D75]" />
            <span>Veloura Haute Atelier</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#25050D] font-light tracking-wide">
            {activeUniverse === "JEWELRY"
              ? "Fine Jewellery & Pearls"
              : activeUniverse === "BEAUTY_SKIN_HAIR"
              ? "Silk Skincare, Facewash & Hair"
              : activeUniverse === "DEALS"
              ? "Exclusive Deals & Bundles"
              : "Veloura Beauty & Fine Jewels"}
          </h1>

          <p className="text-xs sm:text-sm text-[#8E1B3B]/80 max-w-xl mx-auto leading-relaxed">
            {activeUniverse === "JEWELRY"
              ? "18K & 22K gold-plated bridal chokers, zircon solitaires, and organic freshwater pearls."
              : activeUniverse === "BEAUTY_SKIN_HAIR"
              ? "Gentle rose facewashes, bio-silk peptide glow serums, and Moroccan cashmere argan hair elixirs."
              : activeUniverse === "DEALS"
              ? "Limited time discounted beauty hampers, bridal bundles, and exclusive flash offers."
              : "Explore our dual ateliers: Handcrafted heirloom jewelry on one wing, and organic botanical skincare on the other."}
          </p>

          {searchQuery && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#F8D5DE] rounded-full text-xs text-[#8E1B3B] shadow-xs">
              <Search className="w-3.5 h-3.5 text-[#C2185B]" />
              <span>
                Search results for: <strong>&quot;{searchQuery}&quot;</strong>
              </span>
              <Link href="/shop" className="text-xs text-[#C2185B] font-bold hover:underline ml-2">
                Clear
              </Link>
            </div>
          )}
        </div>

        {/* ── 2. Master Dual-Universe Switcher (Jewellery vs Skincare/Hair vs Deals) ── */}
        <div className="flex flex-col items-center gap-3">
          <div className="inline-flex p-1.5 rounded-3xl bg-white/90 backdrop-blur-md border border-[#F8D5DE] shadow-soft-pink max-w-full overflow-x-auto gap-1">
            {UNIVERSES.map((u) => {
              const isActive = activeUniverse === u.id;
              const linkHref = `/shop?universe=${u.id}${sort ? `&sort=${sort}` : ""}`;
              return (
                <Link
                  key={u.id}
                  href={linkHref}
                  className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-[#8E1B3B] via-[#C2185B] to-[#E14D75] text-white shadow-md scale-102"
                      : "text-[#8E1B3B] hover:bg-[#FFF0F4] hover:text-[#C2185B]"
                  }`}
                >
                  <span className="text-base">{u.icon}</span>
                  <span>{u.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Dynamic Category Filter Pills */}
          {dynamicCategories.length > 0 && activeUniverse !== "DEALS" && (
            <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2">
              <Link
                href={`/shop?universe=${activeUniverse}${sort ? `&sort=${sort}` : ""}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  !category && !subCategory
                    ? "bg-[#FFF0F4] border-[#E14D75] text-[#C2185B] shadow-2xs font-bold"
                    : "bg-white/70 border-[#F8D5DE] text-[#8E1B3B]/80 hover:bg-white hover:text-[#C2185B]"
                }`}
              >
                All {activeUniverse === "JEWELRY" ? "Jewels" : activeUniverse === "BEAUTY_SKIN_HAIR" ? "Beauty" : "Creations"}
              </Link>

              {dynamicCategories.map((cat) => {
                const isCatActive = category === cat.slug || subCategory === cat.name;
                const catHref = `/shop?universe=${activeUniverse}&category=${cat.slug}${sort ? `&sort=${sort}` : ""}`;
                return (
                  <Link
                    key={cat.id}
                    href={catHref}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      isCatActive
                        ? "bg-[#FFF0F4] border-[#E14D75] text-[#C2185B] shadow-2xs font-bold"
                        : "bg-white/70 border-[#F8D5DE] text-[#8E1B3B]/80 hover:bg-white hover:text-[#C2185B]"
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>


        {/* ── 3. Filter Bar & Quick Stats ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#F8D5DE]/80 text-xs text-[#8E1B3B]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#25050D] text-sm">
              {products.length} {products.length === 1 ? "Creation" : "Creations"}
            </span>
            <span className="text-[#8E1B3B]/40">•</span>
            <span className="text-[#8E1B3B]/70">
              {activeUniverse === "JEWELRY"
                ? "Fine Jewels Atelier"
                : activeUniverse === "BEAUTY_SKIN_HAIR"
                ? "Silk Skincare & Hair Laboratory"
                : "Full Atelier Catalog"}
            </span>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8E1B3B]/60">
              Sort:
            </span>
            <div className="inline-flex rounded-xl bg-white border border-[#F8D5DE] p-0.5 shadow-2xs">
              <Link
                href={`/shop?universe=${activeUniverse}${subCategory ? `&subCategory=${encodeURIComponent(subCategory)}` : ""}sort=newest`}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  sort === "newest" ? "bg-[#FFF0F4] text-[#C2185B] font-bold" : "text-[#8E1B3B]/70 hover:text-[#8E1B3B]"
                }`}
              >
                Newest
              </Link>
              <Link
                href={`/shop?universe=${activeUniverse}${subCategory ? `&subCategory=${encodeURIComponent(subCategory)}` : ""}sort=price-asc`}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  sort === "price-asc" ? "bg-[#FFF0F4] text-[#C2185B] font-bold" : "text-[#8E1B3B]/70 hover:text-[#8E1B3B]"
                }`}
              >
                Price: Low to High
              </Link>
              <Link
                href={`/shop?universe=${activeUniverse}${subCategory ? `&subCategory=${encodeURIComponent(subCategory)}` : ""}sort=price-desc`}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  sort === "price-desc" ? "bg-[#FFF0F4] text-[#C2185B] font-bold" : "text-[#8E1B3B]/70 hover:text-[#8E1B3B]"
                }`}
              >
                Price: High to Low
              </Link>
            </div>
          </div>
        </div>

        {/* ── 4. Full Products Grid ───────────────────────────────────────── */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-md rounded-3xl border border-[#F8D5DE] p-8 space-y-4 shadow-soft-pink">
            <Sparkles className="w-10 h-10 text-[#C2185B] mx-auto opacity-70 animate-pulse" />
            <h3 className="font-serif text-2xl text-[#25050D]">No creations found in this selection</h3>
            <p className="text-xs text-[#8E1B3B]/70 max-w-md mx-auto">
              Please adjust your filters or switch universe to explore all fine jewels and silk beauty creations.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
            >
              Reset to All Creations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
      <MobileBottomBar />
    </div>
  );
}
