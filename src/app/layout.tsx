import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { WhatsAppFloating } from "@/components/ui/WhatsAppFloating";

export const metadata: Metadata = {
  title: "VELOURA — Haute Luxury Fashion & Beauty",
  description: "Bespoke silk pret, rich velvet ensembles, and haute botanical beauty elixirs.",
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
      <body className="bg-[#FDFBF7] text-[#141211] min-h-screen flex flex-col antialiased selection:bg-[#750A0A] selection:text-white">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <WhatsAppFloating />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
