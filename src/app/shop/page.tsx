import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import { MobileBottomBar } from "@/components/ui/MobileBottomBar";
import { Sparkles, SlidersHorizontal, Flame, Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: {
    category?: string;
    search?: string;
    q?: string;
    sort?: string;
    deals?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, search, q, sort = "newest", deals } = searchParams;
  const searchQuery = (q || search || "").trim();

  const where: any = { isPublished: true };

  if (category) {
    where.category = { slug: category };
  }

  if (deals === "true") {
    where.salePrice = { not: null };
  }

  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
      { sku: { contains: searchQuery, mode: "insensitive" } },
      { brand: { contains: searchQuery, mode: "insensitive" } },
      { tags: { hasSome: [searchQuery] } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };

  let products: any[] = [];
  let categories: any[] = [];
  try {
    [products, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
        },
      }),
      prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    ]);
  } catch (err) {
    console.error("Shop fetch error:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 bg-[#FFF8FA] min-h-screen">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C2185B] font-bold">
          {deals === "true" ? "Limited Time Flash Drops" : "The Atelier Collection"}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#25050D] font-light tracking-wide">
          {deals === "true" ? "Flash Deals & Offers" : "Veloura Beauty & Fine Jewels"}
        </h1>
        <p className="text-xs sm:text-sm text-[#8E1B3B]/70">
          Showing {products.length} {products.length === 1 ? "creation" : "creations"} formulated in pure organic silk botanicals and cast in 18K hypoallergenic gold.
        </p>

        {searchQuery && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF0F3] border border-[#F8D5DE] rounded-full text-xs text-[#8E1B3B]">
            <Search className="w-3.5 h-3.5 text-[#C2185B]" />
            <span>Search results for: <strong>&quot;{searchQuery}&quot;</strong></span>
            <Link href="/shop" className="text-xs text-[#C2185B] font-bold hover:underline ml-2">
              Clear
            </Link>
          </div>
        )}
      </div>

      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#F8D5DE]">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Link
            href="/shop"
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all shadow-2xs ${
              !category && deals !== "true"
                ? "bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white"
                : "bg-white text-[#8E1B3B] hover:bg-[#FFF0F3] border border-[#F8D5DE]"
            }`}
          >
            All Creations
          </Link>

          <Link
            href="/shop?deals=true"
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all shadow-2xs flex items-center gap-1.5 ${
              deals === "true"
                ? "bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white"
                : "bg-white text-[#C2185B] hover:bg-[#FFF0F3] border border-[#F8D5DE]"
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Flash Deals</span>
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}${sort ? `&sort=${sort}` : ""}`}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all shadow-2xs ${
                category === cat.slug
                  ? "bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white"
                  : "bg-white text-[#8E1B3B] hover:bg-[#FFF0F3] border border-[#F8D5DE]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs">
          <span className="text-[#8E1B3B]/60 uppercase tracking-wider font-bold text-[11px]">
            Sort By:
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={`/shop?${category ? `category=${category}&` : ""}${deals ? `deals=true&` : ""}sort=newest`}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                sort === "newest"
                  ? "bg-[#FFF0F3] border-[#C2185B] text-[#C2185B]"
                  : "bg-white border-[#F8D5DE] text-[#8E1B3B] hover:bg-[#FFF0F3]"
              }`}
            >
              Newest
            </Link>
            <Link
              href={`/shop?${category ? `category=${category}&` : ""}${deals ? `deals=true&` : ""}sort=price-asc`}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                sort === "price-asc"
                  ? "bg-[#FFF0F3] border-[#C2185B] text-[#C2185B]"
                  : "bg-white border-[#F8D5DE] text-[#8E1B3B] hover:bg-[#FFF0F3]"
              }`}
            >
              Price: Low to High
            </Link>
            <Link
              href={`/shop?${category ? `category=${category}&` : ""}${deals ? `deals=true&` : ""}sort=price-desc`}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                sort === "price-desc"
                  ? "bg-[#FFF0F3] border-[#C2185B] text-[#C2185B]"
                  : "bg-white border-[#F8D5DE] text-[#8E1B3B] hover:bg-[#FFF0F3]"
              }`}
            >
              Price: High to Low
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#F8D5DE] p-8 space-y-4 shadow-soft-pink">
          <Sparkles className="w-10 h-10 text-[#C2185B] mx-auto opacity-70 animate-pulse" />
          <h3 className="font-serif text-2xl text-[#25050D]">No creations matched your criteria</h3>
          <p className="text-xs text-[#8E1B3B]/70 max-w-md mx-auto">
            Try adjusting your search terms or view our complete catalog of French luxury beauty and fine jewels.
          </p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md"
          >
            Clear Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <MobileBottomBar />
    </div>
  );
}
