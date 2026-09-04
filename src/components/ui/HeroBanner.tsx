"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, MessageCircle, Gem, Award, ShieldCheck, ChevronRight, ChevronLeft } from "lucide-react";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

const SLIDES = [
  {
    id: 1,
    tag: "Haute Joaillerie & Beauty Atelier",
    headingMain: "Adorn Yourself In",
    headingAccent: "Silk Radiance & 18K Gold",
    description:
      "Handcrafted 18-karat tarnish-free fine jewelry paired with pure bio-fermented silk botanical skincare. Curated for the modern muse.",
    primaryCta: { text: "Shop Fine Jewelry", href: "/shop?category=fine-jewelry" },
    secondaryCta: { text: "Explore Silk Elixirs", href: "/shop?category=silk-skincare" },
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop",
    floatingBadge: {
      title: "18K Baroque Pearl Choker",
      price: "Rs. 3,850",
      tag: "Handcrafted Luxury",
    },
  },
  {
    id: 2,
    tag: "Luxe Velvet Cosmetics",
    headingMain: "Sensational",
    headingAccent: "Velvet Silk Lip Mousse",
    description:
      "Feather-soft matte liquid lip elixirs and 24K gold flecked plumping nectars. Enriched with organic rosehip and silk amino acids for 12-hour weightless wear.",
    primaryCta: { text: "Explore Lip Elixirs", href: "/shop?category=luxe-makeup" },
    secondaryCta: { text: "All Beauty Creations", href: "/shop" },
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1600&auto=format&fit=crop",
    floatingBadge: {
      title: "Velvet Liquid Lip Elixir",
      price: "Rs. 1,950",
      tag: "Organic Silk Infused",
    },
  },
  {
    id: 3,
    tag: "Celestial Diamond Fire",
    headingMain: "Mesmerizing",
    headingAccent: "Zirconia & Huggie Jewels",
    description:
      "Triple 18K gold-plated bracelets and pavé ear climbers that capture every beam of light. Hypoallergenic, waterproof, and presented in our signature velvet keepsake box.",
    primaryCta: { text: "Shop Tennis Bracelets", href: "/shop?category=fine-jewelry" },
    secondaryCta: { text: "WhatsApp Concierge", href: "#whatsapp" },
    image: "https://images.unsplash.com/photo-1611591475152-473549646b9a?q=80&w=1600&auto=format&fit=crop",
    floatingBadge: {
      title: "Celestial Tennis Bracelet",
      price: "Rs. 3,200",
      tag: "AAAAA Sparkle Zircon",
    },
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const whatsAppUrl = getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER);

  // Auto-play slide transition
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // 3D Parallax Tilt Handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const slide = SLIDES[current];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[640px] lg:min-h-[720px] overflow-hidden bg-[#0F0D0E] text-[#FAF9F6] flex items-center select-none"
    >
      {/* Background Slides with Ken Burns Smooth Transition */}
      {SLIDES.map((s, idx) => {
        const isActive = idx === current;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              isActive ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
            style={{
              transform: `scale(${isActive ? 1.02 : 1.06}) translate3d(${mousePos.x * -12}px, ${mousePos.y * -12}px, 0)`,
              transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease",
            }}
          >
            {/* Dark Cinematic Vignette & Luxury Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F0D0E] via-[#0F0D0E]/85 to-black/40 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0E] via-transparent to-black/40 z-10" />
            <img
              src={s.image}
              alt={s.headingMain}
              className="w-full h-full object-cover object-center filter brightness-90"
            />
          </div>
        );
      })}

      {/* Ambient Liquid Silk Glow Orbs */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#D45B7B]/20 rounded-full blur-[140px] pointer-events-none z-10 transition-transform duration-700"
        style={{
          transform: `translate3d(${mousePos.x * 40}px, ${mousePos.y * 40}px, 0)`,
        }}
      />
      <div
        className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#8E1E3B]/30 rounded-full blur-[130px] pointer-events-none z-10 transition-transform duration-700"
        style={{
          transform: `translate3d(${mousePos.x * -35}px, ${mousePos.y * -35}px, 0)`,
        }}
      />

      {/* Main Content Layer with 3D Depth */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Typography */}
          <div
            className="lg:col-span-7 space-y-6"
            style={{
              transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 0)`,
              transition: "transform 0.4s ease-out",
            }}
          >
            {/* Atelier Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#E8A5B7]/40 text-[#FDE8EF] text-[11px] uppercase tracking-[0.28em] font-medium shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A5B7]" />
              <span>{slide.tag}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-[0.04em] text-[#FAF9F6] leading-[1.12]">
              {slide.headingMain} <br />
              <span className="italic font-extralight text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0F4] via-[#F4B2C2] to-[#E8A5B7]">
                {slide.headingAccent}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-sm sm:text-base text-zinc-300 font-light leading-relaxed tracking-wide">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={slide.primaryCta.href}
                className="px-8 py-4 bg-gradient-to-r from-[#8E1E3B] via-[#A62B4A] to-[#D45B7B] hover:from-[#A62B4A] hover:to-[#E8A5B7] text-white text-xs uppercase tracking-[0.25em] font-bold rounded-lg shadow-2xl hover:shadow-[0_0_30px_rgba(212,91,123,0.45)] transition-all flex items-center justify-center gap-2"
              >
                <span>{slide.primaryCta.text}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {slide.secondaryCta.href === "#whatsapp" ? (
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-md text-[#FAF9F6] text-xs uppercase tracking-[0.25em] font-medium rounded-lg border border-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp VIP</span>
                </a>
              ) : (
                <Link
                  href={slide.secondaryCta.href}
                  className="px-8 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-md text-[#FAF9F6] text-xs uppercase tracking-[0.25em] font-medium rounded-lg border border-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <span>{slide.secondaryCta.text}</span>
                </Link>
              )}
            </div>

            {/* Value Highlights */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-[11px] text-zinc-400 font-light tracking-wider max-w-lg">
              <div className="flex items-center gap-2">
                <Gem className="w-3.5 h-3.5 text-[#E8A5B7] flex-shrink-0" />
                <span>18K Real Plated</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-[#E8A5B7] flex-shrink-0" />
                <span>Velvet Keepsake Box</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8A5B7] flex-shrink-0" />
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Floating Interactive Spotlight Card */}
          <div className="lg:col-span-5 hidden lg:flex justify-center">
            <div
              className="relative w-80 rounded-2xl p-4 bg-white/10 backdrop-blur-xl border border-[#E8A5B7]/30 shadow-2xl group hover:border-[#D45B7B]/70 transition-all duration-500"
              style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 20}deg) rotateX(${
                  mousePos.y * -20
                }deg) scale3d(1.02, 1.02, 1.02)`,
                transition: "transform 0.2s ease-out, border-color 0.3s ease",
              }}
            >
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black/40">
                <img
                  src={slide.image}
                  alt={slide.floatingBadge.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#1A0A10]/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] uppercase tracking-widest text-[#FDE8EF] border border-[#E8A5B7]/30">
                  {slide.floatingBadge.tag}
                </div>
              </div>

              <div className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-serif text-sm text-white">{slide.floatingBadge.title}</h4>
                  <span className="text-[#E8A5B7] font-semibold text-sm mt-0.5 block">
                    {slide.floatingBadge.price}
                  </span>
                </div>
                <Link
                  href="/shop"
                  className="p-2.5 rounded-full bg-gradient-to-r from-[#8E1E3B] to-[#D45B7B] text-white hover:brightness-110 transition-all shadow"
                  title="View Creation"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators & Controls */}
        <div className="pt-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  idx === current ? "w-10 bg-gradient-to-r from-[#8E1E3B] to-[#D45B7B]" : "w-3 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
