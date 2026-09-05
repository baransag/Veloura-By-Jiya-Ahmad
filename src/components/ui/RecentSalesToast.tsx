"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, X } from "lucide-react";

interface SaleNotification {
  customer: string;
  city: string;
  product: string;
  time: string;
  image: string;
}

const mockPurchases: SaleNotification[] = [
  {
    customer: "Fatima A.",
    city: "Lahore, PK",
    product: "Velvet Matte Liquid Silk Lip Rouge",
    time: "2 minutes ago",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=300&auto=format&fit=crop",
  },
  {
    customer: "Ayesha K.",
    city: "Karachi, PK",
    product: "18K Baroque Pearl Choker Necklace",
    time: "4 minutes ago",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300&auto=format&fit=crop",
  },
  {
    customer: "Zainab M.",
    city: "Islamabad, PK",
    product: "Complete Hair & Skin Care Silk Bundle",
    time: "6 minutes ago",
    image: "https://images.unsplash.com/photo-1608248597289-5405629c4266?q=80&w=300&auto=format&fit=crop",
  },
  {
    customer: "Hira T.",
    city: "Faisalabad, PK",
    product: "Bio-Fermented Silk Peptide Dew Serum",
    time: "8 minutes ago",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop",
  },
];

export function RecentSalesToast() {
  const [current, setCurrent] = useState<SaleNotification | null>(null);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Initial delay of 4 seconds before first toast
    const initialTimeout = setTimeout(() => {
      showNextToast();
    }, 4000);

    const interval = setInterval(() => {
      showNextToast();
    }, 18000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [index]);

  const showNextToast = () => {
    setCurrent(mockPurchases[index % mockPurchases.length]);
    setVisible(true);
    setIndex((prev) => prev + 1);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setVisible(false);
    }, 5500);
  };

  if (!visible || !current) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 left-4 z-40 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-[#F8D5DE] shadow-hover-pink flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#FFF0F3] border border-[#F8D5DE] flex-shrink-0 relative">
        <Image src={current.image} alt={current.product} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#C2185B]" />
          <span className="text-[11px] font-bold text-[#25050D] truncate">
            {current.customer} in {current.city}
          </span>
        </div>
        <p className="text-[11px] text-[#8E1B3B] font-medium truncate mt-0.5">
          Purchased {current.product}
        </p>
        <span className="text-[9px] text-[#8E1B3B]/60">{current.time} • Verified Buyer</span>
      </div>

      <button
        type="button"
        onClick={() => setVisible(false)}
        className="p-1 text-[#8E1B3B]/40 hover:text-[#8E1B3B] transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
