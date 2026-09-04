"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function WhatsAppFloating() {
  const url = getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER, "Hello VELOURA, I have an inquiry about your collection.");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#0D3A2F] text-[#FDFBF7] hover:bg-[#084A3B] px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-[#DA9413]/30 group"
    >
      <div className="relative">
        <MessageCircle className="w-5 h-5 text-[#DA9413] group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DA9413] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#DA9413]"></span>
        </span>
      </div>
      <span className="text-xs tracking-wider uppercase font-medium hidden sm:inline">
        WhatsApp Concierge
      </span>
    </a>
  );
}
