import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-[#FFF5F8] via-[#FFF8FA] to-[#FFF0F4] text-[#25050D]">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 border border-[#F8D5DE] shadow-soft-pink text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF0F3] border border-[#F8D5DE] flex items-center justify-center text-[#C2185B] shadow-inner">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2185B] font-bold block">
            404 — Page Not Found
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#25050D]">
            Creation Not Found
          </h2>
          <p className="text-xs sm:text-sm text-[#8E1B3B]/80 leading-relaxed">
            The piece or page you are looking for is currently unavailable or has been archived.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FFF0F3] hover:bg-[#FCE7EC] text-[#8E1B3B] text-xs font-bold uppercase tracking-wider border border-[#F8D5DE] transition-all flex items-center justify-center gap-2"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
