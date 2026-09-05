import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { WhatsAppFloating } from "@/components/ui/WhatsAppFloating";
import { MobileBottomBar } from "@/components/ui/MobileBottomBar";

export const metadata: Metadata = {
  title: "VELOURA By Jiya Ahmad — Luxury Beauty & Fine Jewelry Atelier",
  description: "Discover organic silk lip elixirs, peptide skincare serums, and 18K hypoallergenic baroque pearl jewelry.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FFF8FA] text-[#25050D] min-h-screen flex flex-col antialiased selection:bg-[#C2185B] selection:text-white pb-14 md:pb-0">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <WhatsAppFloating />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileBottomBar />
        </CartProvider>
      </body>
    </html>
  );
}
