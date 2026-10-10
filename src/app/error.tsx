"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Sparkles, RefreshCw, Home, MessageCircle } from "lucide-react";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Veloura Application Error:", error);
  }, [error]);

  const whatsAppUrl = getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-[#FFF5F8] via-[#FFF8FA] to-[#FFF0F4] text-[#25050D]">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-[#F8D5DE] shadow-soft-pink text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF0F3] border border-[#F8D5DE] flex items-center justify-center text-[#C2185B] shadow-inner">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2185B] font-bold block">
            Veloura Haute Atelier
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#25050D]">
            Momentary Refinement
          </h2>
          <p className="text-xs sm:text-sm text-[#8E1B3B]/80 leading-relaxed">
            Our atelier is updating collection details. Please refresh or return to explore our fine jewelry and botanical silk beauty.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#8E1B3B] text-xs font-bold uppercase tracking-wider border border-[#F8D5DE] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-[#F8D5DE]/60">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-[#1EBE5D] hover:underline flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Concierge: +92 321 9954325</span>
          </a>
        </div>
      </div>
    </div>
  );
}
