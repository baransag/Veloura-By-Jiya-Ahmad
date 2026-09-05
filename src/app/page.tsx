import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ui/ProductCard";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { FlashSaleSection } from "@/components/ui/FlashSaleSection";
import { RecentSalesToast } from "@/components/ui/RecentSalesToast";
import { MobileBottomBar } from "@/components/ui/MobileBottomBar";
import {
  ArrowRight,
  Sparkles,
  Gem,
  ShieldCheck,
  Award,
  MessageCircle,
  Star,
  CheckCircle2,
  Heart,
  Truck,
} from "lucide-react";
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

  const realCustomerReviews = [
    {
      name: "Ayesha Malik",
      city: "Lahore, DHA Phase 5",
      rating: 5,
      date: "Yesterday",
      comment:
        "The Velvet Matte Lip Rouge is so lightweight and hydrating! Lasts through chai without fading. The packaging in the silk pink box felt like receiving high-end Parisian couture.",
      item: "Velvet Matte Liquid Silk Lip Rouge",
    },
    {
      name: "Zoya Tariq",
      city: "Karachi, Clifton",
      rating: 5,
      date: "3 days ago",
      comment:
        "Ordered the 18K Freshwater Pearl Choker. It's truly tarnish-free and feels so luxurious. COD delivery reached Karachi within 48 hours. 10/10 recommended!",
      item: "18K Baroque Pearl Choker Necklace",
    },
    {
      name: "Mahnoor Khan",
      city: "Islamabad, F-7",
      rating: 5,
      date: "1 week ago",
      comment:
        "The Bio-Silk peptide serum gave my skin such an angelic glass glow. No greasy feel. Customer service on WhatsApp confirmed my order immediately with parcel tracking.",
      item: "Bio-Fermented Silk Peptide Dew Serum",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 bg-[#FFF8FA] text-[#25050D]">
      {/* ── 1. 3D Animated Hero Banner with Picture Slides ─────────────────── */}
      <HeroBanner />

      {/* ── 2. Soft Pastel Luxury Marquee Strip ────────────────────────────── */}
      <div className="border-y border-[#F8D5DE] bg-white py-4 overflow-hidden shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-around text-[11px] uppercase tracking-[0.25em] text-[#8E1B3B] font-semibold whitespace-nowrap overflow-x-auto gap-8">
          <div className="flex items-center gap-2">
            <Gem className="w-4 h-4 text-[#C2185B]" />
            <span>18K Real Gold Plated</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C2185B]" />
            <span>Bio-Fermented Silk Peptides</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C2185B]" />
            <span>Signature Keepsake Velvet Box</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C2185B]" />
            <span>Cash on Delivery Across Pakistan</span>
          </div>
        </div>
      </div>

      {/* ── 3. Flash Velvet Deals (Temu/Daraz Engine) ──────────────────────── */}
      <FlashSaleSection products={products} />

      {/* ── 4. Curated Atelier Universes (Visual Category Portals) ─────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C2185B] font-bold block">
            Signature Curation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#25050D] font-light tracking-wide">
            The Atelier Universes
          </h2>
          <p className="text-xs sm:text-sm text-[#8E1B3B]/70 max-w-md mx-auto">
            Infused with precious Moroccan botanicals or cast in 18-karat tarnish-free gold.
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
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-white shadow-soft-pink hover:shadow-hover-pink transition-all duration-500 border border-[#F8D5DE] hover:border-[#E14D75]"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#25050D]/90 via-[#25050D]/30 to-transparent" />

              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[9px] uppercase tracking-widest text-[#8E1B3B] font-bold border border-[#F8D5DE]">
                  {cat.tag}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 z-10 space-y-1.5 text-white">
                <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-[#FCE7EC] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#F8D5DE]/80 font-light line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#FCE7EC] font-bold">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-[#E14D75]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 5. New Atelier Masterpieces (Product Grid) ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-[#F8D5DE] gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C2185B] font-bold block">
              Curated Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#25050D] font-light tracking-wide mt-1">
              New Atelier Masterpieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-[#8E1B3B] hover:text-[#C2185B] font-bold flex items-center gap-2 group transition-colors"
          >
            <span>View All Creations ({products.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#F8D5DE] p-8 space-y-3 shadow-soft-pink">
            <Sparkles className="w-8 h-8 text-[#C2185B] mx-auto animate-pulse" />
            <h3 className="font-serif text-xl text-[#25050D]">Catalog Initializing</h3>
            <p className="text-xs text-[#8E1B3B]/70">Creations are loading from the database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── 6. Daraz/Temu Style Verified Customer Reviews Wall ─────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F8D5DE] shadow-soft-pink space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F8D5DE] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.3em] text-[#C2185B] font-bold">
                  Loved Across Pakistan
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FFF0F3] text-[#C2185B] border border-[#F8D5DE] text-[10px] font-bold">
                  4.9 / 5.0 Rating
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#25050D] font-light mt-1">
                Real Customer Testimonials
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[#E14D75]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="ml-2 text-xs font-bold text-[#8E1B3B]">98.4% Verified Satisfaction</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {realCustomerReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#FFF8FA] rounded-2xl p-6 border border-[#F8D5DE] space-y-4 flex flex-col justify-between hover:border-[#E14D75] transition-all hover:shadow-hover-pink"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#E14D75]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#8E1B3B]/60">{rev.date}</span>
                  </div>
                  <p className="text-xs text-[#25050D] leading-relaxed italic">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F8D5DE]/60 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C2185B]" />
                    <span className="text-xs font-bold text-[#25050D]">{rev.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#8E1B3B]/80">
                    <span>{rev.city}</span>
                    <span className="font-semibold text-[#C2185B] truncate max-w-[140px]">
                      {rev.item}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Velvet Craftsmanship & Guarantees Showcase ──────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#25050D] via-[#500A1C] to-[#25050D] text-white p-8 sm:p-14 border border-[#F8D5DE]/30 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-[#E14D75]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-[#F8D5DE]/30 text-[#FCE7EC] text-[10px] uppercase tracking-widest font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#F4B8C6]" />
                <span>The Veloura Standard</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-light leading-[1.2] text-white">
                Hypoallergenic 18K Real Gold, <br />
                <span className="italic font-extralight text-[#FCE7EC]">
                  Bio-Silk Peptides & Keepsake Velvet Box
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-[#F8D5DE]/90 font-light leading-relaxed max-w-xl">
                Every lip elixir is poured with organic botanical oils, and every jewelry piece is triple-plated in genuine 18-karat gold with high-lustre freshwater pearls. Delivered in our signature velvet gift box with Cash on Delivery across Pakistan.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/shop?category=fine-jewelry"
                  className="px-7 py-3.5 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white text-xs uppercase tracking-widest font-bold rounded-2xl transition-all shadow-lg"
                >
                  Explore Fine Jewels
                </Link>
                <Link
                  href="/shop?category=luxe-makeup"
                  className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest font-bold rounded-2xl border border-white/20 transition-colors"
                >
                  Explore Lip Elixirs
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 aspect-[3/4] rounded-3xl overflow-hidden border border-[#F8D5DE]/40 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
                  alt="Veloura Craftsmanship"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#25050D]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#F8D5DE] text-center">
                  <span className="text-[10px] uppercase tracking-widest text-[#C2185B] block font-bold">
                    100% Guaranteed Satisfaction
                  </span>
                  <span className="text-xs text-[#25050D] font-serif font-medium">
                    7-Day Easy Concierge Exchange
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Live Real Sales Toasts & Mobile App Bar ─────────────────────── */}
      <RecentSalesToast />
      <MobileBottomBar />
    </div>
  );
}
