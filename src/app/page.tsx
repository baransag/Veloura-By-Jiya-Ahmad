import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import { ArrowRight, Sparkles, MessageCircle, Shield, Diamond, Heart } from "lucide-react";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

// Force dynamic so new products appear immediately upon publishing!
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Real database fetch for New Arrivals: sorted by createdAt DESC
  let newArrivals: any[] = [];
  try {
    newArrivals = await prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  const whatsAppUrl = getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Cinematic Silk Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#470B24] via-[#3D071E] to-[#141211] text-[#FDFBF7] py-20 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-[#DA9413]/30">
        {/* Ambient Silk Fluid Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#750A0A]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-[#0D3A2F]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-[#DA9413]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#DA9413]/40 text-[#DA9413] text-xs uppercase tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5" />
            Autumn / Winter Silk Haute Couture
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-[0.12em] text-[#FDFBF7] leading-tight">
            The Sensation of <br />
            <span className="italic font-light text-[#E8C5C8]">Pure Silk & Velvet</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300 font-light leading-relaxed tracking-wide">
            Immerse yourself in fluid textures, rich mulberry silks, and rare botanical care. Designed to celebrate femininity in its most luxurious form.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#750A0A] hover:bg-[#8E1137] text-white text-xs uppercase tracking-[0.25em] font-semibold rounded shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-[#DA9413]/30"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0D3A2F]/80 hover:bg-[#084A3B] text-[#FDFBF7] text-xs uppercase tracking-[0.25em] font-medium rounded transition-colors flex items-center justify-center gap-2 border border-[#DA9413]/40"
            >
              <MessageCircle className="w-4 h-4 text-[#DA9413]" />
              WhatsApp Concierge
            </a>
          </div>
        </div>
      </section>

      {/* Curated Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-[#750A0A] font-semibold">
            Curated Universes
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#141211] tracking-wider">
            Signature Worlds
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Beauty & Personal Care",
              slug: "beauty-personal-care",
              desc: "Pure botanical oils & silk elixirs",
              color: "bg-[#470B24]",
              accent: "border-[#E8C5C8]/40",
            },
            {
              title: "Silk Pret",
              slug: "silk-pret",
              desc: "Flowing mulberry silk silhouettes",
              color: "bg-[#0D3A2F]",
              accent: "border-[#115F78]/40",
            },
            {
              title: "Luxury Velvet",
              slug: "luxury-velvet",
              desc: "Deep wine & rich jewel velvets",
              color: "bg-[#750A0A]",
              accent: "border-[#DA9413]/40",
            },
            {
              title: "Haute Fragrances",
              slug: "fragrances",
              desc: "Sensual amber, oud & rare florals",
              color: "bg-[#5D2806]",
              accent: "border-[#808000]/40",
            },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className={`group relative p-8 rounded-lg overflow-hidden ${cat.color} text-[#FDFBF7] flex flex-col justify-between min-h-[220px] transition-transform duration-300 hover:-translate-y-1 shadow-md border ${cat.accent}`}
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#DA9413]">Category</span>
                <h3 className="font-serif text-xl font-normal group-hover:text-[#E8C5C8] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-zinc-300 font-light">{cat.desc}</p>
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#DA9413] group-hover:translate-x-1 transition-transform">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals — REAL DATABASE DATA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-4 border-b border-[#EAE2D5]">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#750A0A] font-semibold">
              Fresh From The Atelier
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#141211] tracking-wider mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-xs uppercase tracking-[0.2em] font-medium text-[#5D2806] hover:text-[#750A0A] flex items-center gap-1 mt-2 sm:mt-0"
          >
            View All Arrivals <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {newArrivals.length === 0 ? (
          /* Elegant Empty State (No Mock Products!) */
          <div className="text-center py-20 px-4 bg-[#F6F1E8]/60 rounded-xl border border-[#EAE2D5] space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#E8C5C8]/40 flex items-center justify-center text-[#750A0A]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#141211]">Something beautiful is coming.</h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
              Discover the latest VELOURA collection as it arrives. New silk pret and personal care items are updated in real time.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/products/new"
                className="inline-block text-xs uppercase tracking-[0.2em] font-medium text-[#750A0A] border border-[#750A0A] px-4 py-2 rounded hover:bg-[#750A0A] hover:text-white transition-colors"
              >
                Add Your First Product in Admin
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Dramatic Season of Beauty Sale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#470B24] via-[#750A0A] to-[#3D071E] text-[#FDFBF7] p-8 sm:p-14 border border-[#DA9413]/30 shadow-xl">
          <div className="max-w-xl space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-[#DA9413] font-semibold">
              The Season of Beauty
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl leading-tight">
              Indulge in <br />
              <span className="italic text-[#E8C5C8]">Something Beautiful</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-200 font-light leading-relaxed">
              Curated skincare bundles, hand-woven silks, and delicate accessories. Free nationwide shipping on orders over Rs. 3,000.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/shop"
                className="px-6 py-3 bg-[#FDFBF7] text-[#750A0A] hover:bg-[#E8C5C8] text-xs uppercase tracking-[0.2em] font-semibold rounded transition-colors shadow"
              >
                Shop The Sale
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
