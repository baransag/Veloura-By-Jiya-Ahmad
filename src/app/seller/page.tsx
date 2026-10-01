"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  PlusCircle,
  Package,
  DollarSign,
  Instagram,
  Facebook,
  Share2,
  Sparkles,
  Gem,
  Flower2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  TrendingUp,
  ShieldCheck,
  Percent,
} from "lucide-react";

export default function SellerPortalPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "add-product" | "products" | "payouts">("profile");
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  // Profile form state
  const [shopName, setShopName] = useState("");
  const [bio, setBio] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [facebook, setFacebook] = useState("");
  const [city, setCity] = useState("Lahore");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Product form state
  const [prodName, setProdName] = useState("");
  const [universe, setUniverse] = useState<"JEWELRY" | "BEAUTY_SKIN_HAIR">("JEWELRY");
  const [subCategory, setSubCategory] = useState("Chokers & Necklaces");
  const [basePrice, setBasePrice] = useState("");
  const [stock, setStock] = useState("15");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("/uploads/products/item-05.jpeg");
  const [prodSubmitting, setProdSubmitting] = useState(false);
  const [prodMsg, setProdMsg] = useState("");
  const [prodError, setProdError] = useState("");

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/seller/me");
      const data = await res.json();
      if (res.ok && data.seller) {
        setSeller(data.seller);
        setShopName(data.seller.sellerShopName || "");
        setBio(data.seller.sellerBio || "");
        setWhatsapp(data.seller.sellerWhatsApp || "");
        setInstagram(data.seller.sellerInstagram || "");
        setTiktok(data.seller.sellerTikTok || "");
        setFacebook(data.seller.sellerFacebook || "");
        setCity(data.seller.sellerCity || "Lahore");
        setProducts(data.products || []);
      } else {
        // Redirect to login if unauthorized
        window.location.href = "/seller/login";
      }
    } catch (err) {
      console.error("Seller fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const res = await fetch("/api/seller/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerShopName: shopName,
          sellerBio: bio,
          sellerWhatsApp: whatsapp,
          sellerInstagram: instagram,
          sellerTikTok: tiktok,
          sellerFacebook: facebook,
          sellerCity: city,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileMsg("✓ Shop profile & social media links updated successfully!");
        setSeller((prev: any) => ({ ...prev, ...data.seller }));
      } else {
        setProfileMsg("Error updating profile: " + data.error);
      }
    } catch (err: any) {
      setProfileMsg("Network error: " + err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdSubmitting(true);
    setProdMsg("");
    setProdError("");

    try {
      const res = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prodName,
          universe,
          subCategory,
          sellerBasePrice: Number(basePrice),
          stock: Number(stock),
          description,
          imageUrl: imageUrl || "/uploads/products/item-01.jpeg",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add product");
      }

      setProdMsg(
        `✓ Creation listed! Base: Rs. ${data.breakdown.sellerBasePrice.toLocaleString()} + Admin Profit (${data.breakdown.adminProfitMargin}): Rs. ${data.breakdown.adminProfitAdded.toLocaleString()} = Store Price: Rs. ${data.breakdown.customerListingPrice.toLocaleString()}`
      );
      // Reset form
      setProdName("");
      setBasePrice("");
      setDescription("");
      fetchSellerData();
    } catch (err: any) {
      setProdError(err.message);
    } finally {
      setProdSubmitting(false);
    }
  };

  const adminMargin = seller?.adminProfitMargin || 15;
  const numBase = Number(basePrice) || 0;
  const calculatedAdminProfit = Math.round(numBase * (adminMargin / 100));
  const calculatedCustomerPrice = numBase + calculatedAdminProfit;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F8] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Sparkles className="w-10 h-10 text-[#C2185B] animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#8E1B3B] font-bold">
            Loading Vendor Atelier Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F8] via-[#FFF8FA] to-[#FFF0F4] py-8 sm:py-12 text-[#25050D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-[#F8D5DE] shadow-soft-pink flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8E1B3B] to-[#E14D75] flex items-center justify-center text-white shadow-md">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2185B] font-bold bg-[#FFF0F4] px-2.5 py-0.5 rounded-full border border-[#F8D5DE]">
                  Certified Veloura Partner
                </span>
                <span className="text-xs text-[#8E1B3B]/60">• {seller?.sellerCity || "Pakistan"}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#25050D] font-light mt-0.5">
                {seller?.sellerShopName || seller?.name}
              </h1>
              <p className="text-xs text-[#8E1B3B]/80">
                Registered Email: <strong>{seller?.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-[#FFF0F4] border border-[#F8D5DE] text-left">
              <div className="text-[10px] uppercase tracking-wider text-[#8E1B3B]/70 font-semibold">
                Admin Profit Margin
              </div>
              <div className="text-base font-black text-[#C2185B]">
                +{seller?.adminProfitMargin || 15}% Auto-Added
              </div>
            </div>

            <Link
              href="/shop"
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FFF0F4] border border-[#F8D5DE] text-xs font-bold text-[#8E1B3B] flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </Link>
          </div>
        </div>

        {/* ── Navigation Tabs ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-[#F8D5DE] pb-3 overflow-x-auto">
          {[
            { id: "profile", label: "Shop Profile & Socials", icon: Store },
            { id: "add-product", label: "Add New Creation", icon: PlusCircle },
            { id: "products", label: `My Products (${products.length})`, icon: Package },
            { id: "payouts", label: "Earnings & Profit", icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white shadow-md"
                    : "bg-white/80 text-[#8E1B3B] hover:bg-white hover:text-[#C2185B] border border-[#F8D5DE]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: Shop Profile & Social Links ───────────────────────────── */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-[32px] p-6 sm:p-10 border border-[#F8D5DE] shadow-soft-pink space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2185B] font-bold">
                  Boutique Identity
                </span>
                <h2 className="font-serif text-2xl text-[#25050D] font-light mt-0.5">
                  Your Shop Details & Social Presence
                </h2>
                <p className="text-xs text-[#8E1B3B]/80">
                  Customers will see your boutique branding and can reach you through your official links.
                </p>
              </div>

              {profileMsg && (
                <div
                  className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                    profileMsg.startsWith("✓")
                      ? "bg-[#E8F8EE] text-[#1EBE5D] border border-[#BDE8CD]"
                      : "bg-[#FFF0F3] text-[#C2185B] border border-[#F8D5DE]"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{profileMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8E1B3B] uppercase tracking-wider">
                      Shop / Boutique Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g. Lahore Heritage Jewels & Pearls"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#8E1B3B] uppercase tracking-wider">
                      City of Origin
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Lahore, Karachi, Islamabad..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8E1B3B] uppercase tracking-wider">
                    Shop Bio & Story
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your craft, materials (18K gold vermeil, organic Damask rose, pearls), and dispatch speed..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-medium resize-none"
                  />
                </div>

                {/* Social Media Links */}
                <div className="pt-2 border-t border-[#F8D5DE]/80 space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-[#C2185B] font-bold">
                    Official Social Media & WhatsApp Links
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8E1B3B] flex items-center gap-1.5">
                        <span className="text-[#25D366]">WhatsApp Business #</span>
                      </label>
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8E1B3B] flex items-center gap-1.5">
                        <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                        <span>Instagram Profile Link</span>
                      </label>
                      <input
                        type="url"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="https://instagram.com/your_boutique"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8E1B3B] flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-[#000]" />
                        <span>TikTok Profile URL</span>
                      </label>
                      <input
                        type="url"
                        value={tiktok}
                        onChange={(e) => setTiktok(e.target.value)}
                        placeholder="https://tiktok.com/@your_boutique"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#8E1B3B] flex items-center gap-1.5">
                        <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                        <span>Facebook Page Link</span>
                      </label>
                      <input
                        type="url"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder="https://facebook.com/your_boutique"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-xs font-bold uppercase tracking-widest shadow-md hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {profileSaving ? "Saving..." : "Save Shop Profile & Links"}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Boutique Card Preview */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2185B] font-bold block">
                Live Storefront Card Preview
              </span>
              <div className="bg-white rounded-[32px] p-6 border border-[#F8D5DE] shadow-soft-pink space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#8E1B3B] to-[#E14D75] text-white flex items-center justify-center font-serif text-lg font-bold">
                    {shopName ? shopName[0] : "V"}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#25050D] font-bold">
                      {shopName || "Your Shop Name"}
                    </h3>
                    <p className="text-[10px] text-[#8E1B3B]/70">{city || "Lahore"}, Pakistan</p>
                  </div>
                </div>

                <p className="text-xs text-[#25050D]/80 leading-relaxed italic bg-[#FFF8FA] p-3 rounded-xl border border-[#F8D5DE]/60">
                  &quot;{bio || "Handcrafted luxury jewelry and organic silk botanicals designed for royal celebrations."}&quot;
                </p>

                <div className="pt-2 border-t border-[#F8D5DE] space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8E1B3B]/60">
                    Connected Social Channels
                  </div>
                  <div className="flex items-center gap-2">
                    {whatsapp && (
                      <span className="px-2.5 py-1 rounded-full bg-[#E8F8EE] text-[#1EBE5D] text-[10px] font-bold flex items-center gap-1">
                        WhatsApp Active
                      </span>
                    )}
                    {instagram && (
                      <span className="px-2.5 py-1 rounded-full bg-[#FFF0F4] text-[#E1306C] text-[10px] font-bold flex items-center gap-1">
                        Instagram Linked
                      </span>
                    )}
                    {tiktok && (
                      <span className="px-2.5 py-1 rounded-full bg-black text-white text-[10px] font-bold flex items-center gap-1">
                        TikTok
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: Add New Creation & Profit Margin Calculator ─────────── */}
        {activeTab === "add-product" && (
          <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-[32px] p-6 sm:p-10 border border-[#F8D5DE] shadow-soft-pink space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2185B] font-bold">
                Atelier Catalog Entry
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#25050D] font-light mt-0.5">
                List a New Creation
              </h2>
              <p className="text-xs text-[#8E1B3B]/80">
                Enter your base cost price. The system automatically adds the Admin Profit Margin (+{adminMargin}%) to calculate the customer price!
              </p>
            </div>

            {prodMsg && (
              <div className="p-4 rounded-2xl bg-[#E8F8EE] text-[#1EBE5D] border border-[#BDE8CD] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{prodMsg}</span>
              </div>
            )}

            {prodError && (
              <div className="p-4 rounded-2xl bg-[#FFF0F3] text-[#C2185B] border border-[#F8D5DE] text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{prodError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-6">
              {/* Universe Selector (Jewelry vs Beauty/Skin/Hair) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8E1B3B] uppercase tracking-wider block">
                  Select Wing / Universe *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setUniverse("JEWELRY");
                      setSubCategory("Chokers & Necklaces");
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      universe === "JEWELRY"
                        ? "bg-[#FFF0F4] border-[#E14D75] shadow-xs"
                        : "bg-white border-[#F8D5DE] hover:bg-[#FFF8FA]"
                    }`}
                  >
                    <Gem className="w-6 h-6 text-[#C2185B]" />
                    <div>
                      <div className="text-xs font-bold text-[#25050D]">Fine Jewellery Wing</div>
                      <div className="text-[10px] text-[#8E1B3B]/70">Chokers, Rings, Jhumkas</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUniverse("BEAUTY_SKIN_HAIR");
                      setSubCategory("Facewash & Cleansers");
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      universe === "BEAUTY_SKIN_HAIR"
                        ? "bg-[#FFF0F4] border-[#E14D75] shadow-xs"
                        : "bg-white border-[#F8D5DE] hover:bg-[#FFF8FA]"
                    }`}
                  >
                    <Flower2 className="w-6 h-6 text-[#E14D75]" />
                    <div>
                      <div className="text-xs font-bold text-[#25050D]">Skincare & Hair Wing</div>
                      <div className="text-[10px] text-[#8E1B3B]/70">Facewashes, Serums, Hair Oils</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Sub Category Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8E1B3B] uppercase tracking-wider">
                  Sub-Category *
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-semibold"
                >
                  {universe === "JEWELRY" ? (
                    <>
                      <option value="Chokers & Necklaces">Chokers & Necklaces</option>
                      <option value="Earrings & Jhumkas">Earrings & Jhumkas</option>
                      <option value="Rings & Solitaires">Rings & Solitaires</option>
                      <option value="Bridal Sets & Bangles">Bridal Sets & Bangles</option>
                    </>
                  ) : (
                    <>
                      <option value="Facewash & Cleansers">Facewash & Cleansers</option>
                      <option value="Silk Serums & Glow">Silk Serums & Glow</option>
                      <option value="Hair Oils & Elixirs">Hair Oils & Elixirs</option>
                      <option value="Luxe Lip Care">Luxe Lip Care</option>
                    </>
                  )}
                </select>
              </div>

              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#8E1B3B] uppercase tracking-wider">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Pure Damask Rose Foam Cleanser or 24K Kundan Choker"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-medium"
                />
              </div>

              {/* ── LIVE PROFIT MARGIN ENGINE ──────────────────────────────── */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFF0F4] via-white to-[#FCE7EC] border border-[#E14D75]/40 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#C2185B]" />
                    <span className="text-xs font-bold text-[#8E1B3B] uppercase tracking-wider">
                      Live Pricing & Admin Profit Calculator
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#8E1B3B] text-white text-[10px] font-bold">
                    Admin Margin: {adminMargin}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#25050D]">
                      Your Base Cost Price (PKR) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      step={50}
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      placeholder="e.g. 2000"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-white text-[#25050D] text-sm font-bold focus:outline-none focus:border-[#C2185B]"
                    />
                    <span className="text-[10px] text-[#8E1B3B]/70 block">
                      This is what you will receive when the product sells.
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#25050D]">Initial Inventory / Stock</label>
                    <input
                      type="number"
                      min={1}
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-white text-[#25050D] text-sm font-bold focus:outline-none focus:border-[#C2185B]"
                    />
                  </div>
                </div>

                {numBase > 0 && (
                  <div className="pt-3 border-t border-[#F8D5DE] grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-white border border-[#F8D5DE]">
                      <div className="text-[10px] text-[#8E1B3B]/70 font-semibold uppercase">
                        Your Payout
                      </div>
                      <div className="text-sm font-black text-[#25050D]">
                        Rs. {numBase.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-[#F8D5DE]">
                      <div className="text-[10px] text-[#C2185B] font-semibold uppercase">
                        Admin Profit (+{adminMargin}%)
                      </div>
                      <div className="text-sm font-black text-[#C2185B]">
                        +Rs. {calculatedAdminProfit.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#8E1B3B] text-white">
                      <div className="text-[10px] text-[#F8D5DE] font-semibold uppercase">
                        Customer Store Price
                      </div>
                      <div className="text-sm font-black">
                        Rs. {calculatedCustomerPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Image URL & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8E1B3B] uppercase tracking-wider">
                    Product Image (Path or URL)
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/uploads/products/item-05.jpeg"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#8E1B3B] uppercase tracking-wider">
                    Product Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Handcrafted 18K gold vermeil or organic silk peptides..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F8D5DE] bg-[#FFF8FA] focus:outline-none focus:border-[#E14D75] text-xs font-medium"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={prodSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8E1B3B] via-[#C2185B] to-[#E14D75] text-white text-xs font-bold uppercase tracking-widest shadow-md hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {prodSubmitting ? "Listing Creation..." : "Publish Creation to Veloura Store"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TAB 3: My Products List ─────────────────────────────────────── */}
        {activeTab === "products" && (
          <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 sm:p-10 border border-[#F8D5DE] shadow-soft-pink space-y-6">
            <div className="flex items-center justify-between border-b border-[#F8D5DE] pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2185B] font-bold">
                  Boutique Inventory
                </span>
                <h2 className="font-serif text-2xl text-[#25050D] font-light mt-0.5">
                  Creations Listed by {seller?.sellerShopName || seller?.name}
                </h2>
              </div>
              <button
                onClick={() => setActiveTab("add-product")}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Creation</span>
              </button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <Package className="w-10 h-10 text-[#C2185B] opacity-40 mx-auto" />
                <h3 className="font-serif text-lg text-[#25050D]">No creations listed yet</h3>
                <p className="text-xs text-[#8E1B3B]/70">
                  Click &quot;Add Creation&quot; above to list your first jewelry or skincare product.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#F8D5DE] text-[10px] uppercase tracking-wider text-[#8E1B3B]/70">
                      <th className="pb-3 font-bold">Creation</th>
                      <th className="pb-3 font-bold">Wing</th>
                      <th className="pb-3 font-bold">Base Payout</th>
                      <th className="pb-3 font-bold">Admin Profit</th>
                      <th className="pb-3 font-bold">Store Price</th>
                      <th className="pb-3 font-bold">Stock</th>
                      <th className="pb-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F8D5DE]/60">
                    {products.map((p) => {
                      const base = p.sellerBasePrice || Math.round(p.price / 1.15);
                      const profit = p.price - base;
                      return (
                        <tr key={p.id} className="hover:bg-[#FFF8FA] transition-colors">
                          <td className="py-3 pr-4 flex items-center gap-3">
                            <img
                              src={p.images?.[0]?.url || "/uploads/products/item-01.jpeg"}
                              alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover border border-[#F8D5DE]"
                            />
                            <div>
                              <div className="font-bold text-[#25050D] line-clamp-1">{p.name}</div>
                              <div className="text-[10px] text-[#8E1B3B]/60">{p.sku}</div>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full bg-[#FFF0F4] text-[#C2185B] text-[10px] font-bold border border-[#F8D5DE]">
                              {p.universe === "JEWELRY" ? "💎 Jewels" : "🌸 Skincare"}
                            </span>
                          </td>
                          <td className="py-3 font-bold text-[#25050D]">
                            Rs. {base.toLocaleString()}
                          </td>
                          <td className="py-3 font-bold text-[#C2185B]">
                            +Rs. {profit.toLocaleString()}
                          </td>
                          <td className="py-3 font-black text-[#8E1B3B]">
                            Rs. {p.price.toLocaleString()}
                          </td>
                          <td className="py-3">
                            <span className="font-semibold">{p.stock} units</span>
                          </td>
                          <td className="py-3 text-right">
                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              className="text-[10px] font-bold text-[#C2185B] hover:underline inline-flex items-center gap-1"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: Earnings & Profit Breakdown ──────────────────────────── */}
        {activeTab === "payouts" && (
          <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-6 sm:p-10 border border-[#F8D5DE] shadow-soft-pink space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2185B] font-bold">
                Financial Transparency
              </span>
              <h2 className="font-serif text-2xl text-[#25050D] font-light mt-0.5">
                Earnings & Admin Profit Summary
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#FFF8FA] border border-[#F8D5DE] space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#8E1B3B]/70 font-bold">
                  Active Listed Creations
                </span>
                <div className="text-3xl font-serif font-bold text-[#25050D]">
                  {products.length}
                </div>
                <p className="text-[10px] text-[#8E1B3B]/60">Live on Veloura marketplace</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFF8FA] border border-[#F8D5DE] space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#8E1B3B]/70 font-bold">
                  Your Payout Potential
                </span>
                <div className="text-3xl font-serif font-bold text-[#8E1B3B]">
                  Rs.{" "}
                  {products
                    .reduce((acc, p) => acc + (p.sellerBasePrice || Math.round(p.price / 1.15)), 0)
                    .toLocaleString()}
                </div>
                <p className="text-[10px] text-[#8E1B3B]/60">Total base value of single inventory</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFF0F4] border border-[#E14D75]/40 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#C2185B] font-bold">
                  Admin Profit Margin Set
                </span>
                <div className="text-3xl font-serif font-bold text-[#C2185B]">
                  +{seller?.adminProfitMargin || 15}%
                </div>
                <p className="text-[10px] text-[#C2185B]/70">Admin profit automatically added to prices</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
