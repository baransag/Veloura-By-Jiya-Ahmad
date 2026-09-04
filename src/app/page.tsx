import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { ArrowRight, Sparkles, Gem, ShieldCheck, Award, MessageCircle, Heart, Star } from "lucide-react";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
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
    <div className="space-y-16 sm:space-y-24 bg-[#FAF9F6] text-[#121012]">
      {/* ── 1. 3D Animated Hero Banner with Picture Slides ─────────────────── */}
      <HeroBanner />

      {/* ── 2. Luxury Atelier Marquee Strip ────────────────────────────────── */}
      <div className="border-y border-[#E8E1D5] bg-white py-4 overflow-hidden shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-around text-[11px] uppercase tracking-[0.25em] text-[#6B5E55] font-medium whitespace-nowrap overflow-x-auto gap-8">
          <div className="flex items-center gap-2">
            <Gem className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>18K Real Gold Plated</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Bio-Fermented Silk Peptides</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Signature Velvet Gift Box</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Cash on Delivery Across Pakistan</span>
          </div>
        </div>
      </div>

      {/* ── 3. Curated Atelier Universes (Visual Category Portals) ─────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C5A880] font-bold block">
            Signature Curation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#121012] font-light tracking-wide">
            The Atelier Universes
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto font-light">
            Each creation is formulated with precious botanicals or cast in 18-karat tarnish-free gold.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Luxe Makeup & Lips",
              slug: "luxe-makeup",
              desc: "Velvet matte liquid silks & 24K gold lip plumping nectars",
              tag: "Best Seller",
              image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop",
            },
            {
              title: "Fine Jewelry & Pearls",
              slug: "fine-jewelry",
              desc: "18K baroque freshwater pearls & zircon tennis bracelets",
              tag: "18K Real Gold",
              image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
            },
            {
              title: "Silk Skincare & Glow",
              slug: "silk-skincare",
              desc: "Bio-fermented silk peptides & rose damascena toners",
              tag: "Ethereal Dew",
              image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
            },
            {
              title: "Hair Nectar & Mist",
              slug: "hair-fragrance",
              desc: "Cold-pressed Moroccan argan silk & vanilla amber mists",
              tag: "Mirror Gloss",
              image: "https://images.unsplash.com/photo-1608248597289-5405629c4266?q=80&w=800&auto=format&fit=crop",
            },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-black shadow-md hover:shadow-2xl transition-all duration-500 border border-[#E8E1D5] hover:border-[#C5A880]"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-95"
              />
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[9px] uppercase tracking-widest text-[#FAF9F6] border border-white/20">
                  {cat.tag}
                </span>
              </div>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 z-10 space-y-1.5 text-[#FAF9F6]">
                <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-[#E8D4B5] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-zinc-300 font-light line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#C5A880] font-bold">
                  <span>Explore Universe</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. Live Atelier Products with Interactive 3D Card Hover ───────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#E8E1D5] gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C5A880] font-bold block">
              Curated Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#121012] font-light tracking-wide mt-1">
              New Atelier Masterpieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-[#121012] hover:text-[#C5A880] font-bold flex items-center gap-2 group transition-colors"
          >
            <span>View Complete Collection ({products.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E1D5] p-8 space-y-3 shadow-xs">
            <Sparkles className="w-8 h-8 text-[#C5A880] mx-auto" />
            <h3 className="font-serif text-xl text-[#121012]">Catalog Initializing</h3>
            <p className="text-xs text-zinc-500">Products are loading from the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── 5. French Haute Craftsmanship Showcase ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#141214] via-[#1E191C] to-[#141214] text-white p-8 sm:p-14 border border-[#C5A880]/30 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-[#C5A880]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#C5A880]/30 text-[#E8D4B5] text-[10px] uppercase tracking-widest font-semibold">
                <Sparkles className="w-3 h-3 text-[#C5A880]" />
                <span>The Veloura Standard</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-light leading-[1.2] text-[#FAF9F6]">
                Hypoallergenic 18K Real Gold, <br />
                <span className="italic font-extralight text-[#E8D4B5]">
                  Bio-Silk Peptides & Keepsake Velvet
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed max-w-xl">
                Every lip elixir is poured with organic botanical oils, and every jewelry piece is triple-plated in genuine 18-karat gold with high-lustre freshwater pearls so you can wear it daily without tarnishing. Delivered in our signature velvet gift box.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/shop?category=fine-jewelry"
                  className="px-7 py-3.5 bg-[#C5A880] hover:bg-[#D4B991] text-[#121012] text-xs uppercase tracking-widest font-bold rounded-lg transition-colors shadow-lg"
                >
                  Explore Fine Jewels
                </Link>
                <Link
                  href="/shop?category=luxe-makeup"
                  className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest font-medium rounded-lg border border-white/20 transition-colors"
                >
                  Explore Lip Elixirs
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 aspect-[3/4] rounded-2xl overflow-hidden border border-[#C5A880]/40 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
                  alt="Veloura Craftsmanship"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A880] block font-semibold">
                    100% Guaranteed Satisfaction
                  </span>
                  <span className="text-xs text-white font-serif">7-Day Easy Concierge Exchange</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
