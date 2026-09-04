import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import { Sparkles, SlidersHorizontal } from "lucide-react";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, search, sort = "newest" } = searchParams;

  const where: any = { isPublished: true };
  if (category) {
    where.category = { slug: category };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.3em] text-[#750A0A] font-semibold">
          The Complete Boutique
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#141211] tracking-wider">
          VELOURA Collection
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500">
          Showing {products.length} {products.length === 1 ? "design" : "designs"} meticulously crafted in pure silk and botanical formulations.
        </p>
      </div>

      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-[#EAE2D5]">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Link
            href="/shop"
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-colors ${
              !category ? "bg-[#750A0A] text-white" : "bg-[#F6F1E8] text-[#141211] hover:bg-[#EAE2D5]"
            }`}
          >
            All Items
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}${sort ? `&sort=${sort}` : ""}`}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-colors ${
                category === cat.slug
                  ? "bg-[#750A0A] text-white"
                  : "bg-[#F6F1E8] text-[#141211] hover:bg-[#EAE2D5]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs">
          <span className="text-zinc-400 uppercase tracking-wider">Sort By:</span>
          <div className="flex items-center gap-2">
            <Link
              href={`/shop?sort=newest${category ? `&category=${category}` : ""}`}
              className={`px-2.5 py-1 rounded ${
                sort === "newest" ? "font-bold text-[#750A0A] underline" : "text-zinc-600"
              }`}
            >
              Newest
            </Link>
            <Link
              href={`/shop?sort=price-asc${category ? `&category=${category}` : ""}`}
              className={`px-2.5 py-1 rounded ${
                sort === "price-asc" ? "font-bold text-[#750A0A] underline" : "text-zinc-600"
              }`}
            >
              Price: Low to High
            </Link>
            <Link
              href={`/shop?sort=price-desc${category ? `&category=${category}` : ""}`}
              className={`px-2.5 py-1 rounded ${
                sort === "price-desc" ? "font-bold text-[#750A0A] underline" : "text-zinc-600"
              }`}
            >
              Price: High to Low
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of Products */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-[#F6F1E8]/50 rounded-xl border border-[#EAE2D5] space-y-3">
          <Sparkles className="w-8 h-8 text-[#DA9413] mx-auto opacity-70" />
          <h3 className="font-serif text-xl text-[#141211]">No designs found</h3>
          <p className="text-xs text-zinc-500">Try selecting another collection or clearing filters.</p>
          <Link
            href="/shop"
            className="inline-block text-xs uppercase tracking-widest font-semibold text-[#750A0A] underline pt-2"
          >
            Clear Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
}
