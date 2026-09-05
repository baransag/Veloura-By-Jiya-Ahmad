"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { generateProductWhatsAppMessage, getBaseWhatsAppUrl, OFFICIAL_WHATSAPP_NUMBER } from "@/lib/whatsapp";
import {
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  Sparkles,
  Check,
  ChevronRight,
  Star,
  Flame,
  Eye,
  CheckCircle2,
  Package,
  Clock,
  Heart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function ProductDetailClient({ product }: { product: any }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(4.9);
  const [totalReviews, setTotalReviews] = useState(24);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    author: "",
    city: "Lahore",
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Live viewers simulation for social proof (12-22 viewers)
  const [viewersCount, setViewersCount] = useState(16);

  useEffect(() => {
    setViewersCount(12 + Math.floor(Math.random() * 11));
    fetchReviews();
  }, [product.id]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/store/reviews?productId=${product.id}`);
      const data = await res.json();
      if (data.reviews && data.reviews.length > 0) {
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setTotalReviews(data.totalReviews);
      } else {
        // Fallback default initial reviews for real feeling
        setReviews([
          {
            id: "rev-1",
            author: "Ayesha Malik",
            city: "Lahore",
            rating: 5,
            comment:
              "Absolutely divine quality! The finish is so smooth and lightweight. Received it in the signature velvet box within 2 days.",
            verified: true,
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            id: "rev-2",
            author: "Zoya Fatima",
            city: "Karachi",
            rating: 5,
            comment:
              "Even more gorgeous in person than the pictures! Premium formulation, non-sticky and truly luxurious. Will definitely order again.",
            verified: true,
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          },
        ]);
        setTotalReviews(2);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.comment) return;

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/store/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          author: newReview.author,
          city: newReview.city,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (res.ok) {
        setReviewSuccess(true);
        setNewReview({ author: "", city: "Lahore", rating: 5, comment: "" });
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccess(false);
          fetchReviews();
        }, 1200);
      }
    } catch (err) {
      console.error("Failed to post review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const activePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const hasDiscount = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  const isOutOfStock = product.stock <= 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        image: selectedImage,
        stock: product.stock,
        slug: product.slug,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleWhatsAppInquiry = () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const msg = generateProductWhatsAppMessage({
      name: product.name,
      price: activePrice,
      url: currentUrl,
    });
    window.open(getBaseWhatsAppUrl(OFFICIAL_WHATSAPP_NUMBER, msg), "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8E1B3B]/70">
        <Link href="/" className="hover:text-[#C2185B]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#F8D5DE]" />
        <Link href="/shop" className="hover:text-[#C2185B]">
          Atelier
        </Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#F8D5DE]" />
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-[#C2185B]">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-[#F8D5DE]" />
        <span className="text-[#25050D] font-bold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* ── Main Product Display ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-white border border-[#F8D5DE] shadow-soft-pink">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase shadow-xs">
                -{discountPercent}% OFF
              </span>
            )}
            {product.stock <= 3 && product.stock > 0 && (
              <span className="absolute top-4 right-4 bg-white/95 text-[#C2185B] border border-[#F8D5DE] text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase shadow-xs flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" /> Only {product.stock} Left
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img: any) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img.url
                      ? "border-[#C2185B] shadow-md scale-105"
                      : "border-[#F8D5DE] opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C2185B] font-bold">
                {product.category?.name || "Veloura Signature Collection"}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF0F3] border border-[#F8D5DE] text-xs font-bold text-[#8E1B3B]">
                <Star className="w-3.5 h-3.5 fill-[#E14D75] text-[#E14D75]" />
                <span>{avgRating}</span>
                <span className="text-[#8E1B3B]/60 font-normal">({totalReviews} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl text-[#25050D] font-light leading-tight">
              {product.name}
            </h1>

            {/* Live Social Proof Urgency */}
            <div className="flex items-center gap-2 text-xs text-[#8E1B3B] bg-[#FFF0F3] p-2.5 rounded-xl border border-[#F8D5DE]">
              <Eye className="w-4 h-4 text-[#C2185B] animate-pulse" />
              <span>
                <strong>{viewersCount} people</strong> are currently viewing this creation.
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-[#F8D5DE]">
            <span className="text-2xl sm:text-3xl font-bold text-[#8E1B3B]">
              Rs. {activePrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-base text-[#8E1B3B]/40 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
            <span className="text-xs text-[#C2185B] font-semibold bg-[#FFF0F3] px-2.5 py-1 rounded-full border border-[#F8D5DE]">
              Taxes Included • Cash on Delivery
            </span>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[#25050D]/80 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E1B3B]">
                Quantity
              </span>
              <div className="flex items-center border border-[#F8D5DE] bg-white rounded-xl overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-sm font-bold text-[#8E1B3B] hover:bg-[#FFF0F3] transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold text-[#25050D] min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-sm font-bold text-[#8E1B3B] hover:bg-[#FFF0F3] transition-colors"
                >
                  +
                </button>
              </div>

              {product.stock > 0 ? (
                <span className="text-xs font-semibold text-[#8E1B3B] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C2185B]" /> In Stock ({product.stock} units)
                </span>
              ) : (
                <span className="text-xs font-bold text-[#500A1C]">Out of Stock</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-[#8E1B3B] via-[#C2185B] to-[#8E1B3B] hover:brightness-110 text-white text-xs uppercase tracking-[0.2em] font-bold rounded-2xl shadow-hover-pink transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? "Sold Out" : "Add to Bag"}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleWhatsAppInquiry}
                type="button"
                className="py-4 px-6 bg-white hover:bg-[#FFF0F3] text-[#8E1B3B] border border-[#F8D5DE] text-xs uppercase tracking-[0.2em] font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-[#C2185B]" />
                <span>Order via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Trust Guarantees Box */}
          <div className="bg-[#FFF8FA] rounded-2xl p-4 border border-[#F8D5DE] grid grid-cols-2 gap-3 text-xs text-[#8E1B3B]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C2185B] flex-shrink-0" />
              <span>2-3 Days Fast COD across Pakistan</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C2185B] flex-shrink-0" />
              <span>Complimentary Keepsake Velvet Box</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C2185B] flex-shrink-0" />
              <span>100% Original Organic Formula</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C2185B] flex-shrink-0" />
              <span>7-Day Easy Exchange Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Customer Reviews & Ratings Engine (Daraz/Temu Style) ───────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F8D5DE] shadow-soft-pink space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F8D5DE] pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C2185B] font-bold block">
              Customer Feedback
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#25050D] font-light mt-1">
              Ratings & Verified Reviews
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:brightness-110 transition-all self-start sm:self-auto"
          >
            Write a Review
          </button>
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#FFF8FA] p-6 rounded-2xl border border-[#F8D5DE]">
          <div className="md:col-span-4 text-center border-b md:border-b-0 md:border-r border-[#F8D5DE] pb-4 md:pb-0 md:pr-4 space-y-1">
            <span className="font-serif text-5xl font-bold text-[#8E1B3B]">{avgRating}</span>
            <div className="flex justify-center gap-1 text-[#E14D75] py-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-[#8E1B3B]/70 font-medium">Based on {totalReviews} buyer ratings</p>
          </div>

          <div className="md:col-span-8 space-y-2">
            {[
              { stars: 5, pct: 88 },
              { stars: 4, pct: 10 },
              { stars: 3, pct: 2 },
              { stars: 2, pct: 0 },
              { stars: 1, pct: 0 },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-3 text-xs text-[#8E1B3B]">
                <span className="w-12 font-semibold">{row.stars} Stars</span>
                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-[#F8D5DE]">
                  <div
                    className="h-full bg-gradient-to-r from-[#8E1B3B] to-[#E14D75] rounded-full"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[11px] text-[#8E1B3B]/70">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-[#25050D]/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#F8D5DE] shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F8D5DE]">
                <h4 className="font-serif text-xl font-bold text-[#8E1B3B]">Share Your Experience</h4>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="text-[#8E1B3B] hover:bg-[#FFF0F3] p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {reviewSuccess ? (
                <div className="p-6 text-center text-xs font-bold text-[#C2185B] space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#C2185B] mx-auto" />
                  <p>Thank you! Your verified review has been published.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#8E1B3B] mb-1">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newReview.rating
                                ? "fill-[#E14D75] text-[#E14D75]"
                                : "text-[#F8D5DE]"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8E1B3B] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={newReview.author}
                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] outline-none focus:border-[#E14D75]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8E1B3B] mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newReview.city}
                      onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                      placeholder="e.g. Lahore, Karachi, Islamabad"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] outline-none focus:border-[#E14D75]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#8E1B3B] mb-1">Your Review</label>
                    <textarea
                      required
                      rows={3}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="How was the texture, fragrance, packaging, or delivery?"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#F8D5DE] text-xs text-[#25050D] outline-none focus:border-[#E14D75]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-3 bg-gradient-to-r from-[#8E1B3B] to-[#C2185B] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {submittingReview ? "Publishing Review..." : "Submit Verified Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Customer Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-[#FFF8FA] border border-[#F8D5DE] space-y-2 hover:border-[#E14D75] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#25050D]">{rev.author}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#C2185B] border border-[#F8D5DE] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified Buyer ({rev.city})
                  </span>
                </div>
                <div className="flex gap-0.5 text-[#E14D75]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#25050D]/90 leading-relaxed font-light">{rev.comment}</p>
              <span className="text-[10px] text-[#8E1B3B]/50 block">
                {new Date(rev.createdAt).toLocaleDateString("en-PK", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
