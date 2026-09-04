import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import { ArrowRight, Sparkles, MessageCircle, ShieldCheck, Gem, Heart, Star, Award } from "lucide-react";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

// Force dynamic to pull fresh products directly
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
    <div className="space-y-16 sm:space-y-24 bg-[#FAF8F5]">
      {/* ── Liquid Silk Animated Hero Banner ────────────────────────────────── */}
      <section className="relative overflow-hidden liquid-silk-gradient text-[#FAF8F5] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-b border-[#C9A464]/20 silk-sheen">
        {/* Soft Ambient Fluid Glows */}
        <div className="absolute -top-24 -left-20 w-96 h-96 bg-[#8C3A4D]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-[#C9A464]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-1/3 w-80 h-80 bg-[#562737]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-7">
          {/* Subtle Atelier Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C9A464]/40 text-[#C9A464] text-xs uppercase tracking-[0.28em] font-medium shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atelier of Silk Cosmetics & 18K Fine Jewels</span>
          </div>

          {/* Majestic Luxury Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-[0.08em] text-[#FAF8F5] leading-[1.15]">
            Adorn Yourself In <br />
            <span className="italic font-extralight text-[#E8D6CF] bg-clip-text">
              Silk Radiance & Fine Gold
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300 font-light leading-relaxed tracking-wide">
            Designed exclusively for the modern muse. Discover weightless velvet lip mousse, 
            botanical silk glow concentrates, and handcrafted 18-karat tarnish-free jewelry.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#632839] hover:bg-[#7D3449] text-[#FAF8F5] text-xs uppercase tracking-[0.25em] font-semibold rounded shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border border-[#C9A464]/40"
            >
              Shop Atelier Collection
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-md text-[#FAF8F5] text-xs uppercase tracking-[0.25em] font-medium rounded transition-colors flex items-center justify-center gap-2 border border-white/20"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              WhatsApp VIP Concierge
            </a>
          </div>

          {/* Value Badges */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/10 text-[11px] text-zinc-300 font-light tracking-wider">
            <div className="flex items-center justify-center gap-2">
              <Gem className="w-4 h-4 text-[#C9A464]" />
              <span>18K Tarnish Free</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A464]" />
              <span>Silk Peptide Infused</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-[#C9A464]" />
              <span>Velvet Gift Boxed</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C9A464]" />
              <span>Cash on Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Curated Universes: Makeup & Fine Jewelry ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-[#8C3A4D] font-semibold">
            Signature Curation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1E191B] tracking-wide">
            The Atelier Universes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Luxe Makeup & Lips",
              slug: "luxe-makeup",
              desc: "Velvet matte liquid silks & 24K lip oils",
              tag: "Bestseller",
              bgGradient: "from-[#3D1A25] to-[#251017]",
            },
            {
              title: "Fine Jewelry & Pearls",
              slug: "fine-jewelry",
              desc: "18K baroque pearls & zircon tennis bracelets",
              tag: "High Lustre",
              bgGradient: "from-[#2A1D20] to-[#1A1214]",
            },
            {
              title: "Silk Skincare & Glow",
              slug: "silk-skincare",
              desc: "Pure botanical peptides & 24K radiance serums",
              tag: "Ethereal Dew",
              bgGradient: "from-[#351E28] to-[#1E1116]",
            },
            {
              title: "Hair Elixir & Mist",
              slug: "hair-fragrance",
              desc: "Moroccan argan silk nectar & amber hair mist",
              tag: "Pure Silk Shine",
              bgGradient: "from-[#2C1920] to-[#150B0E]",
            },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className={`group relative rounded-2xl overflow-hidden p-7 bg-gradient-to-b ${cat.bgGradient} text-[#FAF8F5] border border-[#C9A464]/20 hover:border-[#C9A464]/60 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between min-h-[220px]`}
            >
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[9px] uppercase tracking-widest text-[#C9A464] border border-[#C9A464]/30">
                  {cat.tag}
                </span>
                <h3 className="font-serif text-xl text-white group-hover:text-[#E8D6CF] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-[#C9A464] font-medium group-hover:translate-x-1 transition-transform">
                <span>Explore Atelier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Live Atelier Products ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#EAE2D5] gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#8C3A4D] font-semibold block">
              Curated Masterpieces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1E191B] tracking-wide mt-1">
              New Atelier Arrivals
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-[#8C3A4D] hover:text-[#632839] font-semibold flex items-center gap-2 group"
          >
            <span>View Complete Collection ({products.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#EAE2D5] p-8 space-y-3">
            <Sparkles className="w-8 h-8 text-[#C9A464] mx-auto" />
            <h3 className="font-serif text-xl text-[#1E191B]">Atelier Collection Refreshing</h3>
            <p className="text-xs text-zinc-500">Products are currently loading from the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Silk & Gold Craftsmanship Banner ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl liquid-silk-gradient text-white p-8 sm:p-14 border border-[#C9A464]/30 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#C9A464]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl space-y-5 relative">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C9A464] font-medium block">
              The Veloura Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl leading-snug">
              Hypoallergenic 18K Fine Gold, Organic Silk Peptides & Velveteen Luxury
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              Every lip elixir is poured with organic plant oils, and every jewelry piece is crafted with genuine 18-karat triple gold plating so you can wear it daily without tarnishing. Delivered in our signature keepsake velvet gift box.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/shop?category=fine-jewelry"
                className="px-6 py-3 bg-[#FAF8F5] text-[#1E191B] hover:bg-[#E8D6CF] text-xs uppercase tracking-widest font-semibold rounded transition-colors"
              >
                Explore Fine Jewels
              </Link>
              <Link
                href="/shop?category=luxe-makeup"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest font-medium rounded border border-white/20 transition-colors"
              >
                Explore Velvet Lips
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
