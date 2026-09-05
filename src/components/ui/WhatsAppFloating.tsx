"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function WhatsAppFloating() {
  const whatsAppUrl = getBaseWhatsAppUrl(
    OFFICIAL_WHATSAPP_NUMBER,
    "Hello VELOURA Atelier Concierge, I would like to inquire about your luxury beauty & fine jewelry creations."
  );

  return (
    <aside aria-label="WhatsApp Concierge" className="contents">
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white hover:brightness-110 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-[#F8D5DE]/40 group"
        title="Chat with Atelier Concierge"
      >
        <MessageCircle className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
        <span className="text-xs uppercase tracking-widest font-semibold hidden sm:inline">
          WhatsApp Concierge
        </span>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
      </a>
    </aside>
  );
}
