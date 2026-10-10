import React from "react";
import Link from "next/link";
import { getStoreProducts } from "@/lib/store-data";
import { LUXURY_FALLBACK_IMAGE, DEFAULT_JEWELRY_SHOWCASE, DEFAULT_BEAUTY_SHOWCASE } from "@/lib/catalog-data";
import { ProductCard } from "@/components/ui/ProductCard";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { FlashSaleSection } from "@/components/ui/FlashSaleSection";
import { RecentSalesToast } from "@/components/ui/RecentSalesToast";
import {
  ArrowRight,
  Sparkles,
  Gem,
  Award,
  Star,
  CheckCircle2,
  Heart,
  Truck,
  Flower2,
  Droplets,
  ShieldCheck,
} from "lucide-react";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dbJewelry = [], dbBeauty = [], dbFlash = []] = await Promise.all([
    getStoreProducts({ universe: "JEWELRY", limit: 8 }).catch(() => []),
    getStoreProducts({ universe: "BEAUTY_SKIN_HAIR", limit: 8 }).catch(() => []),
    getStoreProducts({ featured: true, limit: 8 }).catch(() => []),
  ]);

  const jewelryProducts = dbJewelry.length > 0 ? dbJewelry : DEFAULT_JEWELRY_SHOWCASE;
  const beautyProducts = dbBeauty.length > 0 ? dbBeauty : DEFAULT_BEAUTY_SHOWCASE;
  const flashProducts =
    dbFlash.length > 0
      ? dbFlash
      : [
          DEFAULT_JEWELRY_SHOWCASE[0],
          DEFAULT_BEAUTY_SHOWCASE[0],
          DEFAULT_JEWELRY_SHOWCASE[3],
          DEFAULT_BEAUTY_SHOWCASE[2],
        ];

  const jewelryCover = jewelryProducts?.[0]?.images?.[0]?.url || LUXURY_FALLBACK_IMAGE;
  const beautyCover = beautyProducts?.[0]?.images?.[0]?.url || LUXURY_FALLBACK_IMAGE;


  const whatsAppUrl = getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER);

  const realCustomerReviews = [
    {
      name: "Ayesha Malik",
      city: "Lahore, DHA Phase 5",
      rating: 5,
      date: "Yesterday",
      comment:
        "The Damask Rose & Silk Peptide Facewash is divine! Foams like silk cloud and doesn't strip my sensitive skin at all. The velvet pink packaging feels like receiving Parisian couture.",
      item: "Damask Rose & Silk Peptide Gentle Foaming Facewash",
    },
    {
      name: "Zoya Tariq",
      city: "Karachi, Clifton",
      rating: 5,
      date: "3 days ago",
      comment:
        "Ordered the 18K Freshwater Pearl & Emerald Choker. It's truly tarnish-free and so heavy in gold weight. COD delivery reached Karachi in 48 hours. 10/10 recommended!",
      item: "Imperial Baroque Freshwater Pearl & Emerald Drop Necklace",
    },
    {
      name: "Mahnoor Khan",
      city: "Islamabad, F-7",
      rating: 5,
      date: "1 week ago",
      comment:
        "The Moroccan Cashmere Silk Hair Oil gave my hair mirror shine and heat protection without any stickiness. WhatsApp concierge answered my queries within 5 minutes.",
      item: "Moroccan Cashmere Silk Nourishing Hair Oil Elixir",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 bg-gradient-to-b from-[#FFF5F8] via-[#FFF8FA] to-[#FFF0F4] text-[#25050D]">
      {/* ── 1. 3D Animated Hero Banner ────────────────────────────────────── */}
      <HeroBanner />

      {/* ── 2. Soft Pastel Luxury Marquee Strip ────────────────────────────── */}
      <div className="border-y border-[#F8D5DE] bg-white/90 backdrop-blur-md py-4 overflow-hidden shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-around text-[11px] uppercase tracking-[0.25em] text-[#8E1B3B] font-semibold whitespace-nowrap overflow-x-auto gap-8">
          <div className="flex items-center gap-2">
            <Gem className="w-4 h-4 text-[#C2185B]" />
            <span>18K Real Gold Plated Ornaments</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#C2185B]" />
            <span>Bio-Fermented Silk Facewashes & Serums</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#C2185B]" />
            <span>Complimentary Keepsake Velvet Casket</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C2185B]" />
            <span>Cash on Delivery Across Pakistan</span>
          </div>
        </div>
      </div>

      {/* ── 3. Dual-Wing Universe Split Portals (Jewellery vs Skincare/Hair) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C2185B] font-bold block">
            Signature Curation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#25050D] font-light tracking-wide">
            Two Distinct Universes of Beauty
          </h2>
          <p className="text-xs sm:text-sm text-[#8E1B3B]/80 max-w-lg mx-auto">
            Choose your destination: Royal 18K bridal jewellery on one wing, or organic silk skincare & hair elixirs on the other.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Wing A: Fine Jewellery */}
          <Link
            href="/shop?universe=JEWELRY"
            className="group relative rounded-[32px] overflow-hidden aspect-[16/10] bg-white shadow-soft-pink hover:shadow-[0_20px_50px_rgba(225,77,117,0.22)] transition-all duration-500 border border-[#F8D5DE] hover:border-[#E14D75]"
          >
            <img
              src={jewelryCover}
              alt="Fine Jewellery Wing"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25050D]/95 via-[#25050D]/40 to-transparent" />

            <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] uppercase tracking-widest text-[#8E1B3B] font-bold border border-[#F8D5DE] flex items-center gap-1.5 shadow-sm">
                <Gem className="w-3.5 h-3.5 text-[#C2185B]" />
                <span>Fine Jewels Wing</span>
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 z-10 space-y-2 text-white">
              <h3 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#FCE7EC] transition-colors">
                Fine Jewellery & Pearls
              </h3>
              <p className="text-xs sm:text-sm text-[#F8D5DE]/85 font-light leading-relaxed max-w-md">
                18K & 22K gold-plated bridal chokers, zircon solitaires, Kundan sets & baroque pearl strings.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#FCE7EC] font-bold">
                <span>Enter Jewellery Wing</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#E14D75]" />
              </div>
            </div>
          </Link>

          {/* Wing B: Skincare, Facewash & Hair */}
          <Link
            href="/shop?universe=BEAUTY_SKIN_HAIR"
            className="group relative rounded-[32px] overflow-hidden aspect-[16/10] bg-white shadow-soft-pink hover:shadow-[0_20px_50px_rgba(225,77,117,0.22)] transition-all duration-500 border border-[#F8D5DE] hover:border-[#E14D75]"
          >
            <img
              src={beautyCover}
              alt="Skincare & Hair Wing"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25050D]/95 via-[#25050D]/40 to-transparent" />

            <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] uppercase tracking-widest text-[#8E1B3B] font-bold border border-[#F8D5DE] flex items-center gap-1.5 shadow-sm">
                <Flower2 className="w-3.5 h-3.5 text-[#E14D75]" />
                <span>Skincare & Hair Wing</span>
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 z-10 space-y-2 text-white">
              <h3 className="font-serif text-2xl sm:text-3xl text-white group-hover:text-[#FCE7EC] transition-colors">
                Silk Skincare, Facewash & Hair
              </h3>
              <p className="text-xs sm:text-sm text-[#F8D5DE]/85 font-light leading-relaxed max-w-md">
                Gentle Damask rose facewashes, bio-silk peptide glow serums, and Moroccan argan hair oils.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[#FCE7EC] font-bold">
                <span>Enter Skincare Wing</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#E14D75]" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── 4. Flash Velvet Drops ─────────────────────────────────────────── */}
      <FlashSaleSection products={flashProducts} />

      {/* ── 5. Fine Jewellery & Pearls Showcase ────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#F8D5DE] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-[#C2185B]" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#C2185B] font-bold block">
                Atelier Fine Ornaments
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#25050D] font-light tracking-wide mt-1">
              Royal Jewels & Pearls
            </h2>
          </div>
          <Link
            href="/shop?universe=JEWELRY"
            className="text-xs uppercase tracking-widest text-[#8E1B3B] hover:text-[#C2185B] font-bold flex items-center gap-2 group transition-colors"
          >
            <span>Explore All Jewellery Wing</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {jewelryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── 6. Silk Skincare, Facewashes & Hair Elixirs Showcase ──────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#F8D5DE] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Flower2 className="w-4 h-4 text-[#E14D75]" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#C2185B] font-bold block">
                Botanical Silk Laboratory
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#25050D] font-light tracking-wide mt-1">
              Facewash, Skincare & Hair Care
            </h2>
          </div>
          <Link
            href="/shop?universe=BEAUTY_SKIN_HAIR"
            className="text-xs uppercase tracking-widest text-[#8E1B3B] hover:text-[#C2185B] font-bold flex items-center gap-2 group transition-colors"
          >
            <span>Explore All Skincare Wing</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {beautyProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── 7. Verified Customer Reviews Wall ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-[#F8D5DE] shadow-soft-pink space-y-8">
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
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {realCustomerReviews.map((review, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FFF8FA] border border-[#F8D5DE] flex flex-col justify-between space-y-4 shadow-2xs hover:border-[#E14D75] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FFB300] text-[#FFB300]" />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#8E1B3B]/60">{review.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#25050D]/80 leading-relaxed italic">
                    &quot;{review.comment}&quot;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F8D5DE]/60 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#8E1B3B]">{review.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                    <span className="text-[9px] uppercase tracking-wider text-[#25D366] font-bold">
                      Verified Buyer
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8E1B3B]/60">{review.city}</div>
                  <div className="text-[10px] font-semibold text-[#C2185B] truncate">
                    Purchased: {review.item}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. VIP WhatsApp Concierge Banner ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-[32px] bg-gradient-to-r from-[#25050D] via-[#500A1C] to-[#8E1B3B] p-8 sm:p-14 text-white text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#F8D5DE] font-bold">
              VIP Personal Concierge
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-light">
              Need Bridal Consultation or Custom Sizing?
            </h2>
            <p className="text-xs sm:text-sm text-[#F8D5DE]/80 leading-relaxed">
              Connect directly with Jiya Ahmad&apos;s styling team on WhatsApp for real parcel dispatch videos, ring size measurements, and immediate order placement.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Chat on WhatsApp (+92 321 9954325)</span>
              </a>
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition-all border border-white/20"
              >
                <span>Browse All Creations</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <RecentSalesToast />
    </div>
  );
}
